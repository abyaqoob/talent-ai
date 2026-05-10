import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { Notification } from '../../../domain/entities/Notification';

export class GetUserNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.findByUserId(userId);
  }
}
