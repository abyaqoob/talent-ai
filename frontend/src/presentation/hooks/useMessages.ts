import { useState, useEffect } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { Message } from '../../domain/entities/Message';

export function useMessages(userId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadMessages(userId);
    }
  }, [userId]);

  const loadMessages = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);
      const getUserMessagesUseCase = Container.getGetUserMessagesUseCase();
      const userMessages = await getUserMessagesUseCase.execute(uid);
      setMessages(userMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    loadMessages,
  };
}
