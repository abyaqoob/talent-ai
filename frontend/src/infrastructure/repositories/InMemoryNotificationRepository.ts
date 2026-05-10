import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';
import { mockNotifications } from '../data/mockData';

export class InMemoryNotificationRepository implements INotificationRepository {
  private notifications: Notification[] = [...mockNotifications];

  async findByUserId(userId: string): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.notifications
      .filter(notification => notification.userId === userId && !notification.read)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async create(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };

    this.notifications.push(newNotification);
    return newNotification;
  }

  async markAsRead(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const notification = this.notifications.find(notif => notif.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.notifications
      .filter(notif => notif.userId === userId && !notif.read)
      .forEach(notif => {
        notif.read = true;
      });
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.notifications = this.notifications.filter(notif => notif.id !== id);
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.notifications = this.notifications.filter(notif => notif.userId !== userId);
  }
}
