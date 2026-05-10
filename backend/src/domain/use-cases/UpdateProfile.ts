import { IUserRepository } from '../ports/secondary/IUserRepository';
import { AppError } from '../../shared/errors/AppError';

export class UpdateProfile {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, data: { name?: string; phone?: string; location?: string }) {
    const updatedUser = await this.userRepo.update(userId, data);
    if (!updatedUser) {
      throw new AppError('User not found', 'USER_NOT_FOUND', 404);
    }
    return updatedUser;
  }
}