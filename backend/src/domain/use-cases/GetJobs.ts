import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IJob } from '../models/job';

export class GetJobs {
    constructor(private jobRepo: IJobRepository) {}

    async execute(): Promise<IJob[]> {
        // In the future, you can add filters here (e.g., by skill or location)
        return this.jobRepo.findAll();
    }
}