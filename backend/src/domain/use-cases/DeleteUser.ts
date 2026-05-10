import { IUserRepository } from '../ports/secondary/IUserRepository';
import { AppError } from '../../shared/errors/AppError';

export class DeleteUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string) {
    const success = await this.userRepo.delete(userId);
    if (!success) {
      throw new AppError('User not found', 'USER_NOT_FOUND', 404);
    }
    return { message: "Account deleted successfully" };
  }
}