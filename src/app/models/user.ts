export interface IUser {
  username: string;
  displayName: string;
  token: string;
  email: string;
}

export interface IUserFormValues {
  email: string;
  password: string;
  displayName?: string;
  username?: string;
}

export interface IUserLocal {
  username: string;
  displayName: string;
  image?: string;
}

export interface IUserFBLogin {
  accessToken: string;
  email: string;
  name: string;
  picture: {
    data: {
      url: string;
    };
  };
}
