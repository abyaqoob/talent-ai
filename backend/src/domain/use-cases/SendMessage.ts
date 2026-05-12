import { IMessageRepository } from '../ports/secondary/IMessageRepository';
import { IMessage } from '../models/Message';

export class SendMessage {
    constructor(private messageRepo: IMessageRepository) {}

    async execute(input: Omit<IMessage, 'id' | 'createdAt' | 'read'>): Promise<IMessage> {
        const message: IMessage = {
            ...input,
            read: false,
            createdAt: new Date()
        };
        return this.messageRepo.save(message);
    }
}