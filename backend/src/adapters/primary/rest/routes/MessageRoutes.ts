import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authMiddleware } from '../auth/authMiddleware';

export const MessageRoutes = (controller: MessageController): Router => {
    const router = Router();

    router.post('/messages', authMiddleware, (req, res) => controller.sendMessage(req, res));
    router.get('/messages', authMiddleware, (req, res) => controller.getMyMessages(req, res));

    return router;
};