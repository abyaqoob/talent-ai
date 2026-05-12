export interface IMessage {
    id?: string;
    senderId: string;
    recipientId: string;
    content: string;
    subject?: string;
    jobId?: string;
    read: boolean;
    createdAt: Date;
}