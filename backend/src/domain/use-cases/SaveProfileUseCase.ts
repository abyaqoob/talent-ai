import { IUserRepository } from '../ports/secondary/IUserRepository';
import { ParsedCvData } from '../models/Profile';

export class SaveProfileUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(userId: string, cvData: ParsedCvData): Promise<void> {
        await this.userRepository.saveCvData(userId, cvData);
    }
}