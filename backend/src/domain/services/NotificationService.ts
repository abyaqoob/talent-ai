import { Server as SocketIOServer } from 'socket.io';
import { INotificationRepository } from '../ports/secondary/INotificationRepository';
import { INotification, NotificationType } from '../models/Notification';
import { UserModel } from '../../adapters/secondary/db/UserSchema';

/** Maps notification types → the matching user-preference key (if any) */
const TYPE_TO_PREF: Record<NotificationType, string | null> = {
    JOB_POSTED: 'jobMatches',
    APPLICATION_STATUS: 'applicationUpdates',
    NEW_MESSAGE: 'messages',
    NEW_APPLICATION: null,   // always send to recruiters
    JOB_EXPIRING: null,      // always send to recruiters
};

/**
 * Centralized service that persists a notification and emits it
 * over Socket.io in a single call, so every trigger site stays lean.
 * Respects the recipient's notification preferences.
 */
export class NotificationService {
    constructor(
        private notificationRepo: INotificationRepository,
        private io: SocketIOServer
    ) {}

    async notify(params: {
        recipientId: string;
        type: NotificationType;
        title: string;
        message: string;
        link?: string;
    }): Promise<INotification | null> {
        // Check user preferences before sending
        const prefKey = TYPE_TO_PREF[params.type];
        if (prefKey) {
            try {
                const userDoc = await UserModel.findOne({ id: params.recipientId })
                    .select('notificationPrefs')
                    .lean();
                const prefs = userDoc?.notificationPrefs as Record<string, boolean> | undefined;
                if (prefs && prefs[prefKey] === false) {
                    // User has opted out of this notification type
                    return null;
                }
            } catch {
                // If preference check fails, still send the notification
            }
        }

        const notification: INotification = {
            recipientId: params.recipientId,
            type: params.type,
            title: params.title,
            message: params.message,
            link: params.link,
            read: false,
            createdAt: new Date(),
        };

        const saved = await this.notificationRepo.save(notification);

        // Push to the user's private Socket.io room
        this.io.to(params.recipientId).emit('new_notification', saved);

        return saved;
    }

    /**
     * Convenience: send the same notification to many recipients.
     * Runs in parallel for speed; failures are logged but do not
     * block the caller.
     */
    async notifyMany(
        recipientIds: string[],
        params: {
            type: NotificationType;
            title: string;
            message: string;
            link?: string;
        }
    ): Promise<void> {
        await Promise.allSettled(
            recipientIds.map(recipientId =>
                this.notify({ ...params, recipientId })
            )
        );
    }
}
