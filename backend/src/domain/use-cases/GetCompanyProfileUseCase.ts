import { IUserRepository } from '../ports/secondary/IUserRepository';
import { ICompanyProfile } from '../models/Profile';
import { AppError } from '../../shared/errors/AppError';

export class GetCompanyProfileUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(userId: string): Promise<ICompanyProfile | null> {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new AppError('User not found', 'NOT_FOUND', 404);
        }
        if (user.role !== 'recruiter') {
            throw new AppError('Only recruiters can have a company profile', 'FORBIDDEN', 403);
        }

        return this.userRepo.getCompanyProfile(userId);
    }
}