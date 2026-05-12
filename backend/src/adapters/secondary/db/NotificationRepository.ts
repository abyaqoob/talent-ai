import { INotificationRepository } from '../../../domain/ports/secondary/INotificationRepository';
import { INotification } from '../../../domain/models/Notification';
import { NotificationModel } from './NotificationSchema';

export class NotificationRepository implements INotificationRepository {
    async save(notification: INotification): Promise<INotification> {
        const doc = await NotificationModel.create(notification);
        return this.toEntity(doc);
    }

    async findByRecipient(recipientId: string): Promise<INotification[]> {
        const docs = await NotificationModel.find({ recipientId })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
        return docs.map(d => this.toEntity(d));
    }

    async markAsRead(id: string): Promise<void> {
        await NotificationModel.findByIdAndUpdate(id, { read: true });
    }

    async markAllAsRead(recipientId: string): Promise<void> {
        await NotificationModel.updateMany(
            { recipientId, read: false },
            { $set: { read: true } }
        );
    }

    async countUnread(recipientId: string): Promise<number> {
        return NotificationModel.countDocuments({ recipientId, read: false });
    }

    private toEntity(doc: any): INotification {
        return {
            id: doc._id.toString(),
            recipientId: doc.recipientId,
            type: doc.type,
            title: doc.title,
            message: doc.message,
            link: doc.link,
            read: doc.read,
            createdAt: doc.createdAt,
        };
    }
}
