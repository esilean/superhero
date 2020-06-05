import { RootStore } from './root.store';
import { observable, action, reaction } from 'mobx';

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );

    reaction(
      () => this.refreshToken,
      (refreshToken) => {
        if (refreshToken) {
          window.localStorage.setItem('refToken', refreshToken);
        } else {
          window.localStorage.removeItem('refToken');
        }
      }
    );
  }

  @observable token: string | null = window.localStorage.getItem('jwt');
  @observable refreshToken: string | null = window.localStorage.getItem('refToken');
  @observable appLoaded = false;

  @action setToken = (token: string | null) => {
    this.token = token;
  };

  @action setRefreshToken = (refToken: string | null) => {
    this.refreshToken = refToken;
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
}
