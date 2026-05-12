import { Request, Response } from 'express';
import { INotificationRepository } from '../../../../domain/ports/secondary/INotificationRepository';

interface AuthRequest extends Request {
    user?: { id: string; email?: string; role?: string };
}

export class NotificationController {
    constructor(private notificationRepo: INotificationRepository) {}

    // GET /api/notifications
    async getNotifications(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const notifications = await this.notificationRepo.findByRecipient(userId);
            res.json(notifications);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/notifications/unread-count
    async getUnreadCount(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const count = await this.notificationRepo.countUnread(userId);
            res.json({ count });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // PATCH /api/notifications/:id/read
    async markAsRead(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            await this.notificationRepo.markAsRead(req.params.id);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // PATCH /api/notifications/read-all
    async markAllAsRead(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            await this.notificationRepo.markAllAsRead(userId);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
