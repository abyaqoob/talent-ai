import { Message } from '../entities/Message';

export interface IMessageRepository {
  findById(id: string): Promise<Message | null>;
  findByUserId(userId: string): Promise<Message[]>;
  findConversation(userId1: string, userId2: string): Promise<Message[]>;
  create(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message>;
  markAsRead(id: string): Promise<Message>;
  delete(id: string): Promise<void>;
}
