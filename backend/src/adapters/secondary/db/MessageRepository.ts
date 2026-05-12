import { IMessageRepository } from '../../../domain/ports/secondary/IMessageRepository';
import { IMessage } from '../../../domain/models/Message';
import { MessageModel } from './MessageSchema';
import { UserModel } from './UserSchema';
import { JobModel } from './JobSchema';

export class MessageRepository implements IMessageRepository {
    async save(message: IMessage): Promise<IMessage> {
        const doc = new MessageModel(message);
        const saved = await doc.save();
        return this.toEntity(saved);
    }

    async findById(id: string): Promise<IMessage | null> {
        const doc = await MessageModel.findById(id);
        return doc ? this.toEntity(doc) : null;
    }

    async findByUser(userId: string): Promise<IMessage[]> {
        const docs = await MessageModel.find({
            $or: [{ senderId: userId }, { recipientId: userId }]
        }).sort({ createdAt: -1 }).lean();

        // Manual Enrichment
        const enriched = await Promise.all(docs.map(async (doc) => {
            const sender = await UserModel.findOne({ id: doc.senderId }).select('name profilePicture').lean();
            const recipient = await UserModel.findOne({ id: doc.recipientId }).select('name profilePicture').lean();
            let jobTitle = '';
            if (doc.jobId) {
                const job = await JobModel.findById(doc.jobId).select('title').lean();
                jobTitle = job?.title || '';
            }
            
            return {
                ...doc,
                id: doc._id.toString(),
                senderName: sender?.name,
                senderProfilePicture: sender?.profilePicture || '',
                recipientName: recipient?.name,
                recipientProfilePicture: recipient?.profilePicture || '',
                jobTitle
            };
        }));

        return enriched as any;
    }

    async markAsRead(id: string): Promise<void> {
        await MessageModel.findByIdAndUpdate(id, { read: true });
    }

    private toEntity(doc: any): IMessage {
        return {
            id: doc._id.toString(),
            senderId: doc.senderId,
            recipientId: doc.recipientId,
            content: doc.content,
            subject: doc.subject,
            jobId: doc.jobId,
            read: doc.read,
            createdAt: doc.createdAt
        };
    }
}