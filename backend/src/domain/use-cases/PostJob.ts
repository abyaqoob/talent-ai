import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IUserRepository } from '../ports/secondary/IUserRepository';
import { IJob, WorkMode, JobType, ExperienceLevel, ISalaryRange } from '../models/job';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../shared/errors/AppError';

interface PostJobInput {
    recruiterId: string;
    title: string;
    location: string;
    workMode: WorkMode;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    salaryRange: ISalaryRange;
    description: string;
    requirements: string[];
}

export class PostJob {
    constructor(
        private jobRepo: IJobRepository,
        private userRepo: IUserRepository // Needed to check roles
    ) {}

    async execute(input: PostJobInput): Promise<IJob> {
        // 1. Verify User exists and is a Recruiter[cite: 1]
        const user = await this.userRepo.findById(input.recruiterId);
        if (!user || user.role !== 'recruiter') {
            throw new AppError('Only recruiters can post jobs', 'FORBIDDEN', 403);
        }

        // 2. Create the Job entity
        const newJob: IJob = {
            id: uuidv4(), // Generate UUID consistent with User setup[cite: 1]
            ...input,
            status: 'active',
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return this.jobRepo.save(newJob);
    }
}