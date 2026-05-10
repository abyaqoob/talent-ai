import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IJob } from '../models/job';
import { AppError } from '../../shared/errors/AppError';

export class GetJobById {
    constructor(private jobRepo: IJobRepository) {}

    async execute(jobId: string): Promise<IJob> {
        await this.jobRepo.incrementViews(jobId);
        const job = await this.jobRepo.findById(jobId);
        
        if (!job) {
            throw new AppError('Job not found', 'NOT_FOUND', 404);
        }
        
        return job;
    }
}