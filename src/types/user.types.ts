/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from '../core/constants/sidebar';
import {
  SubCategoryTypes,
  CategoryTypes,
} from '@/types';

export interface IUser {
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
  category?: CategoryTypes;
  subCategory?: SubCategoryTypes;
  verificationCode?: number;
  lastLogin?: Date;
  photo?: string;
  passwordResetTokenExpires?: Date;
  passwordResetToken?: string;
  verificationToken?: string;
  cbtTrials?: number;
  theme?: 'light' | 'dark' | 'system';
  signUpMode?: 'normal' | 'google';
  loginTokens?: string[];
  loginDetails?: any[];
  cbt?: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AltStore {

}
