import { IApplicationRepository } from '../ports/secondary/IApplicationRepository';
import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IUserRepository } from '../ports/secondary/IUserRepository';
import { IApplication } from '../models/Application';
import { AppError } from '../../shared/errors/AppError';
import { v4 as uuidv4 } from 'uuid';

export class ApplyForJob {
    constructor(
        private applicationRepo: IApplicationRepository,
        private jobRepo: IJobRepository,
        private userRepo: IUserRepository
    ) {}

    async execute(jobId: string, candidateId: string): Promise<IApplication> {
        // 1. Verify user exists and is a candidate
        const user = await this.userRepo.findById(candidateId);
        if (!user) {
            throw new AppError('User not found', 'NOT_FOUND', 404);
        }
        if (user.role !== 'candidate') {
            throw new AppError('Only candidates can apply for jobs', 'FORBIDDEN', 403);
        }

        // 2. Verify job exists
        const job = await this.jobRepo.findById(jobId);
        if (!job) {
            throw new AppError('Job not found', 'NOT_FOUND', 404);
        }

        // 3. Check if already applied
        const existingApp = await this.applicationRepo.findByJobAndCandidate(jobId, candidateId);
        if (existingApp) {
            throw new AppError('You have already applied for this job', 'CONFLICT', 409);
        }

        // 4. Create application
        const application: IApplication = {
            id: uuidv4(),
            jobId,
            candidateId,
            status: 'applied',
            appliedAt: new Date(),
            updatedAt: new Date()
        };

        return this.applicationRepo.save(application);
    }
}