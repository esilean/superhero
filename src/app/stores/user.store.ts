import agent from '../api/agent';
import { observable, computed, action, runInAction } from 'mobx';
import { IUserLocal, IUserFormValues, IUserFBLogin } from '../models/user';
import { RootStore } from './root.store';

import { history } from '../../index';
import { toast } from 'react-toastify';

export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUserLocal | null = null;
  @observable loadingSocial = false;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action loginFB = async (userLoginResp: IUserFBLogin) => {
    this.loadingSocial = true;
    try {
      const user = await agent.User.fbLogin(userLoginResp.accessToken);
      runInAction(() => {
        this.user = user;
        this.rootStore.modalStore.closeModal();
        this.rootStore.commonStore.setToken(user.token);
      });
      history.push('/activities');
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loadingSocial = false;
      });
    }
  };

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
        this.rootStore.modalStore.closeModal();
        this.rootStore.commonStore.setToken(user.token);
      });
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.register(values);
      runInAction(() => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token);
        this.rootStore.modalStore.closeModal();
      });
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      toast.error('Problem getting user');
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push('/');
  };
}
