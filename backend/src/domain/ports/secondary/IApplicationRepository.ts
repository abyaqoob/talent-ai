import { IApplication, ApplicationStatus } from '../../models/Application';

export interface IApplicationRepository {
    save(application: IApplication): Promise<IApplication>;
    findById(id: string): Promise<IApplication | null>;
    findByJobAndCandidate(jobId: string, candidateId: string): Promise<IApplication | null>;
    findByJobId(jobId: string): Promise<IApplication[]>;
    findByCandidateId(candidateId: string): Promise<IApplication[]>;
    findApplicationsByJobIds(jobIds: string[]): Promise<IApplication[]>;
    updateStatus(id: string, status: ApplicationStatus): Promise<IApplication | null>;
    // Populated versions for UI
    findCandidateApplicationsWithJobs(candidateId: string): Promise<any[]>;
    findJobApplicationsWithCandidates(jobId: string): Promise<any[]>;
}