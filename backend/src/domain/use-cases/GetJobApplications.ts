import { IApplicationRepository } from '../ports/secondary/IApplicationRepository';
import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IUserRepository } from '../ports/secondary/IUserRepository';
import { AppError } from '../../shared/errors/AppError';

export class GetJobApplications {
    constructor(
        private applicationRepo: IApplicationRepository,
        private jobRepo: IJobRepository,
        private userRepo: IUserRepository
    ) {}

    async execute(jobId: string, recruiterId: string): Promise<any[]> {
        const job = await this.jobRepo.findById(jobId);
        
        if (!job) {
            throw new AppError('Job not found', 'NOT_FOUND', 404);
        }

        if (job.recruiterId !== recruiterId) {
            throw new AppError('You do not have permission to view applications for this job', 'UNAUTHORIZED', 401);
        }

        const applications = await this.applicationRepo.findByJobId(jobId);
        
        // Populate basic candidate info
        const result = await Promise.all(applications.map(async (app) => {
            const user = await this.userRepo.findById(app.candidateId);
            const profile = await (this.userRepo as any).getProfile(app.candidateId); // Assuming MongooseUserRepository has getProfile
            
            return {
                ...app,
                candidate: user ? {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    location: user.location,
                    profile: profile
                } : null
            };
        }));

        return result;
    }
}