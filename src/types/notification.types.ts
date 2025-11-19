import { IUser } from './user.types';

export interface NotificationTypes {
  id: string;
  title: string;
  subject: string;
  content: string;
  description: string;
  userType: 'users' | 'admins';
  status: 'draft' | 'sent';
  userCategory: string;
  subCategory: string;
  organization: string;
  sentBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDataTypes {
  doc: NotificationTypes[];
}

export interface SingleNotificationDataTypes {
  doc: NotificationTypes;
}

export interface UserNotificationTypes {
  id: string;
  user: string;
  notification: NotificationTypes;
  organization: string;
  isRead: boolean;
  createdAt: Date;
}

export interface UserNotificationDataTypes {
  doc: UserNotificationTypes[];
}

export interface CreateNotificationRequest {
  title: string;
  subject: string;
  content: string;
  description: string;
  userType: 'users' | 'admins';
  status: 'draft' | 'sent';
  userCategory: string;
  subCategory: string;
  organization: string;
}

export interface UpdateNotificationRequest {
  title?: string;
  subject?: string;
  content?: string;
  description?: string;
  userType?: 'users' | 'admins';
  status?: 'draft' | 'sent';
  userCategory?: string;
  subCategory?: string;
  organization?: string;
}

export interface NotificationFilters {
  organization?: string;
  userType?: 'users' | 'admins';
  status?: 'draft' | 'sent';
  userCategory?: string;
  subCategory?: string;
}
