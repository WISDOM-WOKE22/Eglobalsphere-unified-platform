import { NotificationTypes } from './notification.types';

export interface userNotification {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  isRead: boolean;
  notification: NotificationTypes;
}

export interface userNotificationResponse {
  doc: userNotification[];
}
