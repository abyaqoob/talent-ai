import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IJob } from '../models/job';

export class GetRecruiterJobs {
    constructor(private jobRepo: IJobRepository) {}

    async execute(recruiterId: string): Promise<IJob[]> {
        return this.jobRepo.findByRecruiterId(recruiterId);
    }
}