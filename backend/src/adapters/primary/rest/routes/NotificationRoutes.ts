import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../auth/authMiddleware';

export const NotificationRoutes = (controller: NotificationController): Router => {
    const router = Router();

    // Order matters: put /read-all before /:id/read so Express doesn't treat "read-all" as an :id
    router.get('/notifications', authMiddleware, (req, res) => controller.getNotifications(req as any, res));
    router.get('/notifications/unread-count', authMiddleware, (req, res) => controller.getUnreadCount(req as any, res));
    router.patch('/notifications/read-all', authMiddleware, (req, res) => controller.markAllAsRead(req as any, res));
    router.patch('/notifications/:id/read', authMiddleware, (req, res) => controller.markAsRead(req as any, res));

    return router;
};
