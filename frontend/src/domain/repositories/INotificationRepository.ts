import { Notification } from '../entities/Notification';

export interface INotificationRepository {
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string): Promise<Notification[]>;
  findUnreadByUserId(userId: string): Promise<Notification[]>;
  create(notification: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(userId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
