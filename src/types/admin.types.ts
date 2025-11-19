import { UserRole } from '../core/constants/sidebar';
import { IUser } from './user.types';

export interface IAdmin {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  subscription?: 'free' | 'subscribed' | 'un-subscribed';
  subscriptionDuration?: number;
  subscriptionExpires?: Date;
  subscriptionId?: string;
  organization?: string;
  mobile?: string;
  school?: string;
  isBlocked?: boolean;
  role: 'user' | 'admin' | 'sub-admin' | UserRole | null | undefined;
  twoFactor?: boolean;
  twoFactorVerificationCode?: number;
  queryId?: string;
  massLogin?: boolean;
  noOfLoggedInDevices?: number;
  isVerified?: boolean;
  settings?: Object;
  category?: string;
  subCategory?: string;
  verificationCode?: number;
  lastLogin?: Date;
  photo?: string;
  passwordResetTokenExpires?: Date;
  passwordResetToken?: string;
  verificationToken?: string;
  createdAt: Date;
}

export interface AdminData {
  doc: IAdmin[];
}
