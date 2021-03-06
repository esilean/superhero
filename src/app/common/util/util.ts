import { IActivity, IAttendee } from '../../models/activity';
import { IUserLocal } from '../../models/user';

export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ':' + time.getMinutes() + ':00.000';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const dateString = `${year}-${month}-${day}`;

  return new Date(dateString + ' ' + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUserLocal): IActivity => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some((a) => a.username === user.username);
  activity.isHost = activity.attendees.some((a) => a.username === user.username && a.isHost);

  return activity;
};

export const createAttendee = (user: IUserLocal): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!,
  };
};
