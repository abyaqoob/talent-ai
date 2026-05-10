import { IApplicationRepository } from '../ports/secondary/IApplicationRepository';
import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IApplication, ApplicationStatus } from '../models/Application';
import { AppError } from '../../shared/errors/AppError';

export class UpdateApplicationStatus {
    constructor(
        private applicationRepo: IApplicationRepository,
        private jobRepo: IJobRepository
    ) {}

    async execute(applicationId: string, recruiterId: string, status: ApplicationStatus): Promise<IApplication> {
        const application = await this.applicationRepo.findById(applicationId);
        if (!application) {
            throw new AppError('Application not found', 'NOT_FOUND', 404);
        }

        const job = await this.jobRepo.findById(application.jobId);
        if (!job || job.recruiterId !== recruiterId) {
            throw new AppError('Unauthorized to update this application', 'UNAUTHORIZED', 401);
        }

        const updated = await this.applicationRepo.updateStatus(applicationId, status);
        if (!updated) {
            throw new AppError('Failed to update status', 'INTERNAL_ERROR', 500);
        }

        return updated;
    }
}