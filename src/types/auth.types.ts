import { IUser } from './user.types';

export type AuthResponse = {
  doc: {
    token: string;
    refreshToken: string;
    user: IUser;
  };
};
