import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable loadingInitial = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      runInAction('load activities error', () => {
        console.log(error.message);
      });
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
    } else {
      this.loadingInitial = true;
      try {
        const activity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          activity.date = activity.date.split('.')[0];
          this.activity = activity;
        });
      } catch (error) {
        runInAction('get activity error', () => {
          console.log(error.message);
        });
      } finally {
        runInAction('get activity finally', () => {
          this.loadingInitial = false;
        });
      }
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
      });
    } catch (error) {
      runInAction('create activity error', () => {
        console.log(error.message);
      });
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
    } catch (error) {
      runInAction('edit activity error', () => {
        console.log(error.message);
      });
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
      runInAction('delete activity error', () => {
        console.log(error.message);
      });
    } finally {
      runInAction('delete activity finally', () => {
        this.submitting = false;
      });
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };
}

export default createContext(new ActivityStore());
