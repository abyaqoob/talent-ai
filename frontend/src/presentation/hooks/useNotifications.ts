import { useState, useEffect, useCallback } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { Notification } from '../../domain/entities/Notification';

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadNotifications(userId);
    }
  }, [userId]);

  const loadNotifications = useCallback(async (uid: string) => {
    try {
      setLoading(true);
      setError(null);
      const useCase = Container.getGetUserNotificationsUseCase();
      const notifs = await useCase.execute(uid);
      setNotifications(notifs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await Container.getNotificationRepository().markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // fail silently
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!userId) return;
      await Container.getNotificationRepository().markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {
      // fail silently
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  };
}
