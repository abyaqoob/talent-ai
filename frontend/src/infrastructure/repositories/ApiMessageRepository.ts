import { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { Message } from '../../domain/entities/Message';
import { apiClient } from '../api/apiClient';

function mapMessage(raw: any): Message {
  return {
    id: raw._id || raw.id || '',
    senderId: raw.senderId || raw.sender?._id || raw.sender || '',
    receiverId: raw.receiverId || raw.recipient?._id || raw.recipient || '',
    jobId: raw.jobId,
    subject: raw.subject || '',
    content: raw.content || raw.body || raw.text || '',
    timestamp: new Date(raw.createdAt || raw.timestamp || Date.now()),
    read: raw.read || raw.isRead || false,
    hasProposal: raw.hasProposal || false,
    proposalSlots: raw.proposalSlots,
  };
}

export class ApiMessageRepository implements IMessageRepository {
  async findById(id: string): Promise<Message | null> {
    try {
      const data = await apiClient.get<any>(`/messages/${id}`);
      return mapMessage(data);
    } catch {
      return null;
    }
  }

  async findByUserId(_userId: string): Promise<Message[]> {
    try {
      const data = await apiClient.get<any>('/messages');
      const arr = Array.isArray(data) ? data : data?.messages || [];
      return arr.map(mapMessage);
    } catch {
      return [];
    }
  }

  async findConversation(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const data = await apiClient.get<any>(`/messages/conversation/${userId2}`);
      const arr = Array.isArray(data) ? data : data?.messages || [];
      return arr.map(mapMessage);
    } catch {
      return [];
    }
  }

  async create(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const data = await apiClient.post<any>('/messages', {
      recipientId: message.receiverId,
      content: message.content,
      subject: message.subject,
      jobId: message.jobId,
    });
    return mapMessage(data?.message || data);
  }

  async markAsRead(id: string): Promise<Message> {
    try {
      const data = await apiClient.patch<any>(`/messages/${id}/read`, {});
      return mapMessage(data);
    } catch {
      return { id, senderId: '', receiverId: '', subject: '', content: '', timestamp: new Date(), read: true, hasProposal: false };
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/messages/${id}`);
    } catch {
      // no-op if endpoint missing
    }
  }
}
