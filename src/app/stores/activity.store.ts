import { observable, action, computed, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import { history } from '../../index';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { RootStore } from './root.store';
import { setActivityProps, createAttendee } from '../common/util/util';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry: Map<string, IActivity> = new Map();
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable loadingInitial = false;
  @observable target = '';
  @observable loading = false;
  //signalr
  @observable.ref hubConnection: HubConnection | null = null;

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/chat', {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.None)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        if (this.hubConnection!.state === HubConnectionState.Connected)
          this.hubConnection!.invoke('AddToGroup', activityId);
      })
      .catch((error) => console.log('Error establishing connection', error));

    this.hubConnection.on('ReceiveComment', (comment) => {
      runInAction(() => {
        this.activity!.comments.push(comment);
      });
    });
  };

  @action stopHubConnection = () => {
    try {
      if (this.hubConnection!.state === HubConnectionState.Connected) {
        this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id).then(() =>
          this.hubConnection!.stop()
        );
      }
    } catch (error) {
      console.log(`StopHubConnection: ${error}`);
    }
  };

  @action addComent = async (values: any) => {
    values.activityId = this.activity!.id;
    try {
      await this.hubConnection!.invoke('SendComment', values);
    } catch (error) {
      console.log(error);
    }
  };

  @computed
  get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate = (activities: IActivity[]) => {
    const sortedActivities = activities.sort((a, b) => a.date.getTime() - b.date.getTime());
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
    } finally {
      runInAction('load activities finally', () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.activityRegistry.get(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        const activity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
        });

        return activity;
      } catch (error) {
      } finally {
        runInAction('get activity error', () => {
          this.loadingInitial = false;
        });
      }
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      const attend = createAttendee(this.rootStore.userStore.user!);
      attend.isHost = true;
      let attendees = [];
      attendees.push(attend);
      activity.attendees = attendees;
      activity.comments = [];
      activity.isHost = true;
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
      });

      history.push(`/activities/${activity.id}`);
    } catch (error) {
      toast.error('Problem submitting data...');
    } finally {
      runInAction('create activity finally', () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('editing activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
    } finally {
      runInAction('edit activity finally', () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('deleting activity', () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
    } finally {
      runInAction('delete activity finally', () => {
        this.submitting = false;
      });
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
      });
    } catch (error) {
      toast.error('Problem signing up to activity');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user?.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
      });
    } catch (error) {
      toast.error('Problem canceling attendance');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
