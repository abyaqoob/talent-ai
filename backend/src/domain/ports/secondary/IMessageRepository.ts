import { IMessage } from '../../models/Message';

export interface IMessageRepository {
    save(message: IMessage): Promise<IMessage>;
    findById(id: string): Promise<IMessage | null>;
    findByUser(userId: string): Promise<IMessage[]>;
    markAsRead(id: string): Promise<void>;
}