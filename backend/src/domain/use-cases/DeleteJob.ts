import { IJobRepository } from '../ports/secondary/IJobRepository';
import { AppError } from '../../shared/errors/AppError';

export class DeleteJob {
    constructor(private jobRepo: IJobRepository) {}

    async execute(jobId: string, recruiterId: string): Promise<void> {
        const job = await this.jobRepo.findById(jobId);
        
        if (!job) {
            throw new AppError('Job not found', 'NOT_FOUND', 404);
        }

        // Security Check: Does this job belong to the person trying to delete it?
        if (job.recruiterId !== recruiterId) {
            throw new AppError('You do not have permission to delete this job', 'UNAUTHORIZED', 401);
        }

        await this.jobRepo.delete(jobId);
    }
}