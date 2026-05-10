import { IApplicationRepository } from '../ports/secondary/IApplicationRepository';

export class GetMyApplications {
    constructor(private applicationRepo: IApplicationRepository) {}

    async execute(candidateId: string): Promise<any[]> {
        return this.applicationRepo.findCandidateApplicationsWithJobs(candidateId);
    }
}