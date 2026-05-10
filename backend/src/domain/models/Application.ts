export type ApplicationStatus = 'applied' | 'under_review' | 'shortlisted' | 'interviewing' | 'hired' | 'rejected';

export interface IApplication {
    id: string;
    jobId: string;
    candidateId: string;
    status: ApplicationStatus;
    appliedAt: Date;
    updatedAt: Date;
}