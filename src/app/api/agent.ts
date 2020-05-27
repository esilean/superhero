import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) => setTimeout(() => resolve(response), ms));

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
};

const activitypath = '/activities';

const Activities = {
  list: (): Promise<IActivity[]> => requests.get(`${activitypath}`),
  details: (id: string) => requests.get(`${activitypath}/${id}`),
  create: (activity: IActivity) => requests.post(`${activitypath}`, activity),
  update: (activity: IActivity) => requests.put(`${activitypath}/${activity.id}`, activity),
  delete: (id: string) => requests.del(`${activitypath}/${id}`),
};

export default {
  Activities,
};
