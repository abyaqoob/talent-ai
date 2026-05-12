import { INotification } from '../../models/Notification';

export interface INotificationRepository {
    save(notification: INotification): Promise<INotification>;
    findByRecipient(recipientId: string): Promise<INotification[]>;
    markAsRead(id: string): Promise<void>;
    markAllAsRead(recipientId: string): Promise<void>;
    countUnread(recipientId: string): Promise<number>;
}
