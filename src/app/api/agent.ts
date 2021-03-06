import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivityEnvelope } from '../models/activity';
import { history } from '../../index';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues, IUserLocal } from '../models/user';
import { IProfile, IPhoto } from '../models/profile';

const URL_APP_API = '/api';
const URL_AUTH_API = '/appuser';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

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
  const originalRequest = error.config;

  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error - API is running?');
  }

  const { status, data, config } = error.response;

  if (status === 502) {
    toast.error('Bad gateway - API is running?');
  }

  if (status === 404) {
    history.push('/notfound');
  }

  if (status === 401 && originalRequest.url.endsWith('refresh')) {
    window.localStorage.removeItem('jwt');
    window.localStorage.removeItem('refToken');
    history.push('/');
    toast.info('You session has expired!');
    return Promise.reject(error);
  }

  if (status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    return axios
      .post(`${URL_AUTH_API}/refresh`, {
        token: window.localStorage.getItem('jwt'),
        refreshToken: window.localStorage.getItem('refToken'),
      })
      .then((res) => {
        window.localStorage.setItem('jwt', res.data.token);
        window.localStorage.setItem('refToken', res.data.refreshToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return axios(originalRequest);
      })
      .catch((error) => console.log(error));
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

// const sleep = (ms: number) => (response: AxiosResponse) =>
//   new Promise<AxiosResponse>((resolve) => setTimeout(() => resolve(response), ms));

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),

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

const activitypath = `${URL_APP_API}/activities`;

const Activities = {
  list: (params: URLSearchParams): Promise<IActivityEnvelope> =>
    axios.get(`${activitypath}`, { params: params }).then(responseBody),
  details: (id: string): Promise<IActivity> => requests.get(`${activitypath}/${id}`),
  create: (activity: IActivity) => requests.post(`${activitypath}`, activity),
  update: (activity: IActivity) => requests.put(`${activitypath}/${activity.id}`, activity),
  delete: (id: string) => requests.del(`${activitypath}/${id}`),

  attend: (id: string) => requests.post(`${activitypath}/${id}/attend`, {}),
  unattend: (id: string) => requests.del(`${activitypath}/${id}/attend`),
};

const userpath = `${URL_APP_API}/user`;

const User = {
  current: (): Promise<IUserLocal> => requests.get(`${userpath}/local`),
  login: (user: IUserFormValues): Promise<IUser> => requests.post(`${URL_AUTH_API}/login`, user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post(`${URL_AUTH_API}/register`, user),
  fbLogin: (accessToken: string) => requests.post(`${URL_AUTH_API}/facebook`, { accessToken }),

  //refresh token for signalR
  refreshToken: (token: string, refreshToken: string) => {
    return axios.post(`${URL_AUTH_API}/refresh`, { token, refreshToken }).then((res) => {
      window.localStorage.setItem('jwt', res.data.token);
      window.localStorage.setItem('refToken', res.data.refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return res.data.token;
    });
  },
};

const profilepath = `${URL_APP_API}/profiles`;
const profilephotopath = `${URL_APP_API}/photos`;

const Profiles = {
  get: (username: string): Promise<IProfile> => requests.get(`${profilepath}/${username}`),
  edit: (profile: Partial<IProfile>): Promise<void> => requests.put(`${profilepath}`, profile),
  follow: (username: string) => requests.post(`${profilepath}/${username}/follow`, {}),
  unfollow: (username: string) => requests.del(`${profilepath}/${username}/follow`),
  listFollowings: (username: string, predicate: string) =>
    requests.get(`${profilepath}/${username}/follow?predicate=${predicate}`),
  listActivities: (username: string, predicate?: string) =>
    requests.get(`${profilepath}/${username}/activities?predicate=${predicate}`),
  //photo
  uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm(profilephotopath, photo),
  setMainPhoto: (id: string) => requests.post(`${profilephotopath}/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del(`${profilephotopath}/${id}`),
};

export default {
  User,
  Activities,
  Profiles,
};
