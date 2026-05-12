import { IApplicationRepository } from '../ports/secondary/IApplicationRepository';
import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IUserRepository } from '../ports/secondary/IUserRepository';

export class GetAllRecruiterApplications {
    constructor(
        private applicationRepo: IApplicationRepository,
        private jobRepo: IJobRepository,
        private userRepo: IUserRepository
    ) {}

    async execute(recruiterId: string): Promise<any[]> {
        // 1. Get all jobs for this recruiter
        const jobs = await this.jobRepo.findByRecruiterId(recruiterId);
        if (jobs.length === 0) return [];

        const jobIds = jobs.map(job => job.id);

        // 2. Get all applications for those jobs
        const applications = await this.applicationRepo.findApplicationsByJobIds(jobIds);

        // 3. Populate Job and Candidate details
        const result = await Promise.all(applications.map(async (app) => {
            const job = jobs.find(j => j.id === app.jobId);
            
            let user = null;
            let profile = null;
            try {
                user = await this.userRepo.findById(app.candidateId);
                // getProfile is defined on IUserRepository — call it directly (no cast needed)
                profile = await this.userRepo.getProfile(app.candidateId);
            } catch (e) {
                console.warn('Could not load candidate data for application', app.id, e);
            }

            return {
                ...app,
                job: job ? { ...job } : null,
                candidate: user ? {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    location: user.location,
                    profilePicture: user.profilePicture,
                    profile: profile
                } : null
            };
        }));

        return result;
    }
}