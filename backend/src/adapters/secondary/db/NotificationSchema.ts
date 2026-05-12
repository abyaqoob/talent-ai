import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
    recipientId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
    {
        recipientId: { type: String, required: true, index: true },
        type: {
            type: String,
            enum: ['JOB_POSTED', 'APPLICATION_STATUS', 'NEW_MESSAGE', 'NEW_APPLICATION', 'JOB_EXPIRING'],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String },
        read: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        collection: 'notifications',
    }
);

// Compound index for fast "unread for user" queries
NotificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotificationDocument>(
    'Notification',
    NotificationSchema
);
