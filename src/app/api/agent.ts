import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';
import { history } from '../../index';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues, IUserLocal } from '../models/user';
import { IProfile, IPhoto } from '../models/profile';

axios.defaults.baseURL = 'http://localhost:5000';

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error - API is running?');
  }

  const { status, data, config } = error.response;

  if (status === 404) {
    history.push('/notfound');
  }

  if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
    history.push('/notfound');
  }

  if (status === 500) {
    toast.error('Server error - check the terminal for more info!');
  }

  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) => setTimeout(() => resolve(response), ms));

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),

  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios
      .post(url, formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody);
  },
};

const activitypath = '/api/activities';

const Activities = {
  list: (): Promise<IActivity[]> => requests.get(`${activitypath}`),
  details: (id: string): Promise<IActivity> => requests.get(`${activitypath}/${id}`),
  create: (activity: IActivity) => requests.post(`${activitypath}`, activity),
  update: (activity: IActivity) => requests.put(`${activitypath}/${activity.id}`, activity),
  delete: (id: string) => requests.del(`${activitypath}/${id}`),

  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.del(`/activities/${id}/attend`),
};

const userpath = '/appuser';
const localuserpath = '/api/user';

const User = {
  current: (): Promise<IUserLocal> => requests.get(`${localuserpath}/local`),
  login: (user: IUserFormValues): Promise<IUser> => requests.post(`${userpath}/login`, user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post(`${userpath}/register`, user),
};

const profilepath = '/api/profiles';
const profilephotopath = '/api/photos';

const Profiles = {
  get: (username: string): Promise<IProfile> => requests.get(`${profilepath}/${username}`),
  edit: (profile: Partial<IProfile>): Promise<void> => requests.put(`${profilepath}`, profile),
  uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm(profilephotopath, photo),
  setMainPhoto: (id: string) => requests.post(`${profilephotopath}/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del(`${profilephotopath}/${id}`),
};

export default {
  User,
  Activities,
  Profiles,
};
