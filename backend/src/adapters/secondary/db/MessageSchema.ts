import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageDocument extends Document {
    senderId: string;
    recipientId: string;
    content: string;
    subject?: string;
    jobId?: string;
    read: boolean;
    createdAt: Date;
}

const MessageSchema = new Schema({
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true },
    content: { type: String, required: true },
    subject: { type: String },
    jobId: { type: String },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);