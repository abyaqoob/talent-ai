import { useState, useEffect, useCallback } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { Message } from '../../domain/entities/Message';

export function useMessages(userId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadMessages(userId);
    }
  }, [userId]);

  const loadMessages = useCallback(async (uid: string) => {
    try {
      setLoading(true);
      setError(null);
      const useCase = Container.getGetUserMessagesUseCase();
      const msgs = await useCase.execute(uid);
      setMessages(msgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = async (
    recipientId: string,
    content: string,
    subject?: string
  ): Promise<Message | null> => {
    try {
      setError(null);
      const repo = (Container as any).messageRepository;
      const stored = localStorage.getItem('auth_session');
      const senderId = stored ? JSON.parse(stored)?.user?.id || '' : '';
      const msg = await repo?.create({
        senderId,
        receiverId: recipientId,
        subject: subject || 'Message',
        content,
        read: false,
        hasProposal: false,
      });
      if (msg) setMessages(prev => [...prev, msg]);
      return msg || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return null;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const repo = (Container as any).messageRepository;
      await repo?.markAsRead(messageId);
      setMessages(prev =>
        prev.map(m => (m.id === messageId ? { ...m, read: true } : m))
      );
    } catch {
      // fail silently
    }
  };

  return {
    messages,
    loading,
    error,
    loadMessages,
    sendMessage,
    markAsRead,
  };
}
