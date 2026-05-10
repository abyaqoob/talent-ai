import { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { Message, InterviewSlot } from '../../domain/entities/Message';
import { mockMessages } from '../data/mockData';

export class InMemoryMessageRepository implements IMessageRepository {
  private messages: Message[] = [...mockMessages];
  private interviewSlots: InterviewSlot[] = [];

  async findByUserId(userId: string): Promise<Message[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.messages.filter(
      message => message.senderId === userId || message.receiverId === userId
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async findConversation(userId1: string, userId2: string): Promise<Message[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.messages
      .filter(
        message =>
          (message.senderId === userId1 && message.receiverId === userId2) ||
          (message.senderId === userId2 && message.receiverId === userId1)
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async send(message: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  async markAsRead(messageId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const message = this.messages.find(msg => msg.id === messageId);
    if (message) {
      message.read = true;
    }
  }

  async markConversationAsRead(userId1: string, userId2: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.messages
      .filter(
        msg =>
          msg.senderId === userId2 &&
          msg.receiverId === userId1 &&
          !msg.read
      )
      .forEach(msg => {
        msg.read = true;
      });
  }

  async delete(messageId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.messages = this.messages.filter(msg => msg.id !== messageId);
  }

  async findInterviewSlots(recruiterId: string, candidateId: string): Promise<InterviewSlot[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.interviewSlots.filter(
      slot => slot.recruiterId === recruiterId && slot.candidateId === candidateId
    );
  }

  async createInterviewSlot(slot: Omit<InterviewSlot, 'id'>): Promise<InterviewSlot> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newSlot: InterviewSlot = {
      ...slot,
      id: `slot-${Date.now()}`,
    };

    this.interviewSlots.push(newSlot);
    return newSlot;
  }

  async updateInterviewSlot(id: string, updates: Partial<InterviewSlot>): Promise<InterviewSlot> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = this.interviewSlots.findIndex(slot => slot.id === id);
    if (index === -1) {
      throw new Error('Interview slot not found');
    }

    this.interviewSlots[index] = { ...this.interviewSlots[index], ...updates };
    return this.interviewSlots[index];
  }
}
