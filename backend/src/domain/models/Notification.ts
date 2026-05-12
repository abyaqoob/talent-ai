export type NotificationType = 'JOB_POSTED' | 'APPLICATION_STATUS' | 'NEW_MESSAGE' | 'NEW_APPLICATION' | 'JOB_EXPIRING';

export interface INotification {
    id?: string;
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}
