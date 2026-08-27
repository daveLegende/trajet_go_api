import { Notification } from '../entities/notification.entity';
import { TypeNotification } from '../entities/notification.entity';

export const NOTIFICATION_REPOSITORY = 'NotificationRepositoryPort';
export const PUSH_NOTIFICATION_PROVIDER = 'PushNotificationPort';

export interface CreateNotificationInput {
  userId: string;
  titre: string;
  message: string;
  type: TypeNotification;
  donneesLiees?: Record<string, any>;
}

export interface NotificationRepositoryPort {
  create(input: CreateNotificationInput): Promise<Notification>;
  findByUserId(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}

export interface PushNotificationPayload {
  userId: string;
  titre: string;
  message: string;
  data?: Record<string, string>;
}

export interface PushNotificationPort {
  send(payload: PushNotificationPayload): Promise<void>;
}
