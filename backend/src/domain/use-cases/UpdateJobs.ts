import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IJob, WorkMode, JobType, ExperienceLevel, ISalaryRange } from '../models/job';
import { AppError } from '../../shared/errors/AppError';

export interface UpdateJobDTO {
    title?: string;
    location?: string;
    workMode?: WorkMode;
    jobType?: JobType;
    experienceLevel?: ExperienceLevel;
    salaryRange?: ISalaryRange;
    description?: string;
    requirements?: string[];
}

export class UpdateJob {
    constructor(private jobRepo: IJobRepository) {}

    async execute(jobId: string, recruiterId: string, data: UpdateJobDTO): Promise<IJob> {
        const job = await this.jobRepo.findById(jobId);
        
        if (!job) {
            throw new AppError('Job not found', 'NOT_FOUND', 404);
        }

        if (job.recruiterId !== recruiterId) {
            throw new AppError('You do not have permission to update this job', 'UNAUTHORIZED', 401);
        }

        const updatedJob = await this.jobRepo.update(jobId, {
            ...data,
            updatedAt: new Date()
        });

        if (!updatedJob) {
            throw new AppError('Failed to update job', 'INTERNAL_ERROR', 500);
        }

        return updatedJob;
    }
}