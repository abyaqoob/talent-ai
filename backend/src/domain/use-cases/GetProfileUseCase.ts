import { IUserRepository } from '../ports/secondary/IUserRepository';
import { ICandidateProfile } from '../models/Profile';

export class GetProfileUseCase {
    constructor(private userRepository: IUserRepository) {}
    async execute(userId: string): Promise<ICandidateProfile | null> {
        return this.userRepository.getProfile(userId);
    }
}