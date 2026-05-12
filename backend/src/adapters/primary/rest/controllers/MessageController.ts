import { Request, Response } from 'express';
import { SendMessage } from '../../../../domain/use-cases/SendMessage';
import { IMessageRepository } from '../../../../domain/ports/secondary/IMessageRepository';
import { Server as SocketIOServer } from 'socket.io';
import { NotificationService } from '../../../../domain/services/NotificationService';

export class MessageController {
    constructor(
        private messageRepo: IMessageRepository,
        private io: SocketIOServer,
        private notificationService?: NotificationService
    ) {}

    async sendMessage(req: Request, res: Response) {
        try {
            const senderId = (req as any).user?.id;
            const { recipientId, content, subject, jobId } = req.body;

            if (!senderId) return res.status(401).json({ error: 'Unauthorized' });

            const useCase = new SendMessage(this.messageRepo);
            const message = await useCase.execute({
                senderId,
                recipientId,
                content,
                subject,
                jobId
            });

            this.io.to(recipientId).emit('receive_message', message);
            this.io.to(senderId).emit('receive_message', message);

            res.status(201).json(message);

            // 🔔 Fire-and-forget: notify the recipient
            if (this.notificationService) {
                this.notificationService.notify({
                    recipientId,
                    type: 'NEW_MESSAGE',
                    title: 'New Message',
                    message: content.length > 80 ? content.substring(0, 80) + '...' : content,
                    link: '/messages',
                }).catch(err => console.error('⚠️ Non-critical: message notification failed', err));
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMyMessages(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const messages = await this.messageRepo.findByUser(userId);
            res.json(messages);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}