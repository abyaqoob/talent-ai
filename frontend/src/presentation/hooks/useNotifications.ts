import { useState, useEffect } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { Notification } from '../../domain/entities/Notification';

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadNotifications(userId);
    }
  }, [userId]);

  const loadNotifications = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);
      const getUserNotificationsUseCase = Container.getGetUserNotificationsUseCase();
      const userNotifications = await getUserNotificationsUseCase.execute(uid);
      setNotifications(userNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    loading,
    error,
    loadNotifications,
  };
}
