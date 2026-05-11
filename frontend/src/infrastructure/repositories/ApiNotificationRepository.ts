import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';
import { apiClient } from '../api/apiClient';

function mapNotification(raw: any): Notification {
  const typeMap: Record<string, Notification['type']> = {
    'application_update': 'application_update',
    'message': 'message',
    'profile_view': 'profile_view',
    'job_match': 'job_match',
    'interview_proposal': 'interview_proposal',
  };
  return {
    id: raw._id || raw.id || '',
    userId: raw.userId || raw.user || '',
    type: typeMap[raw.type] || 'job_match',
    title: raw.title || 'Notification',
    message: raw.message || raw.content || '',
    timestamp: new Date(raw.createdAt || raw.timestamp || Date.now()),
    read: raw.read || raw.isRead || false,
    actionUrl: raw.actionUrl,
  };
}

export class ApiNotificationRepository implements INotificationRepository {
  async findById(id: string): Promise<Notification | null> {
    try {
      const data = await apiClient.get<any>(`/notifications/${id}`);
      return mapNotification(data);
    } catch {
      return null;
    }
  }

  async findByUserId(_userId: string): Promise<Notification[]> {
    try {
      const data = await apiClient.get<any>('/notifications');
      const arr = Array.isArray(data) ? data : data?.notifications || [];
      return arr.map(mapNotification);
    } catch {
      return [];
    }
  }

  async findUnreadByUserId(_userId: string): Promise<Notification[]> {
    try {
      const data = await apiClient.get<any>('/notifications?unread=true');
      const arr = Array.isArray(data) ? data : data?.notifications || [];
      return arr.filter((n: any) => !n.read).map(mapNotification);
    } catch {
      return [];
    }
  }

  async create(_notification: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification> {
    // Frontend typically doesn't create notifications — server does
    throw new Error('Notifications are created server-side');
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      const data = await apiClient.patch<any>(`/notifications/${id}/read`, {});
      return mapNotification(data);
    } catch {
      return {
        id, userId: '', type: 'job_match', title: '', message: '',
        timestamp: new Date(), read: true,
      };
    }
  }

  async markAllAsRead(_userId: string): Promise<void> {
    try {
      await apiClient.patch('/notifications/read-all', {});
    } catch {
      // no-op
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch {
      // no-op
    }
  }
}
