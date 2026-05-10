import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { Message } from '../../../domain/entities/Message';

export class GetUserMessagesUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(userId: string): Promise<Message[]> {
    return await this.messageRepository.findByUserId(userId);
  }
}
