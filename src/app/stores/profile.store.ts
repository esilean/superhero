import { RootStore } from './root.store';
import { observable, action, runInAction, computed, reaction } from 'mobx';
import { IProfile, IPhoto, IUserActivity } from '../models/profile';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers' : 'followings';
          this.loadFollowings(predicate);
          this.activeTab = -1;
        } else {
          this.followings = [];
        }
      }
    );
  }

  //profile observable
  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  //photo observable
  @observable uploadingPhoto = false;
  @observable loadingMain = false;
  @observable deletingPhoto = false;
  //followers observable
  @observable loadingFollow = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;
  @observable userActivities: IUserActivity[] = [];
  @observable loadingUserActivities = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };

  @action loadUserActivities = async (username: string, predicate?: string) => {
    this.loadingUserActivities = true;
    try {
      const activities = await agent.Profiles.listActivities(username, predicate);
      runInAction(() => {
        this.userActivities = activities;
      });
    } catch (error) {
      toast.error('Problem loading user activities');
    } finally {
      runInAction(() => {
        this.loadingUserActivities = false;
      });
    }
  };

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
      });
    } catch (error) {
      toast.error('Problem loading profile');
    } finally {
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  @action editProfile = async (profile: Partial<IProfile>) => {
    try {
      await agent.Profiles.edit(profile);
      runInAction(() => {
        if (profile.displayName !== this.rootStore.userStore.user!.displayName) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };
      });
    } catch (error) {
      toast.error('Problems editing profile');
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
      });
    } catch (error) {
      toast.error('Problem uploading photo');
    } finally {
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loadingMain = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find((a) => a.isMain)!.isMain = false;
        this.profile!.photos.find((a) => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
      });
    } catch (error) {
      toast.error('Problem setting photo as main');
    } finally {
      runInAction(() => {
        this.loadingMain = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.deletingPhoto = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter((a) => a.id !== photo.id);
      });
    } catch (error) {
      toast.error('Problem deleting photo');
    } finally {
      runInAction(() => {
        this.deletingPhoto = false;
      });
    }
  };

  @action follow = async (username: string) => {
    this.loadingFollow = true;
    try {
      await agent.Profiles.follow(username);
      runInAction('follow', () => {
        this.profile!.following = true;
        this.profile!.followersCount++;
      });
    } catch (error) {
      toast.error('Problema following user');
    } finally {
      runInAction(() => {
        this.loadingFollow = false;
      });
    }
  };

  @action unfollow = async (username: string) => {
    this.loadingFollow = true;
    try {
      await agent.Profiles.unfollow(username);
      runInAction('follow', () => {
        this.profile!.following = false;
        this.profile!.followersCount--;
      });
    } catch (error) {
      toast.error('Problema unfollowing user');
    } finally {
      runInAction(() => {
        this.loadingFollow = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loadingFollow = true;
    try {
      const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate);
      runInAction(() => {
        this.followings = profiles;
      });
    } catch (error) {
      toast.error('Problem loading followings');
    } finally {
      runInAction(() => {
        this.loadingFollow = false;
      });
    }
  };
}
