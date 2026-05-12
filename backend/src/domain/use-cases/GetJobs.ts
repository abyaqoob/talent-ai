import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IJob } from '../models/job';

export class GetJobs {
    constructor(private jobRepo: IJobRepository) {}

    async execute(filters?: { minSalary?: number; skills?: string[]; experienceLevel?: string; type?: string }): Promise<IJob[]> {
        return this.jobRepo.findAll(filters);
    }
}