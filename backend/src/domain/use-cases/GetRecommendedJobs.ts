import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IUserRepository } from '../ports/secondary/IUserRepository';
import { IAIService } from '../ports/secondary/IAIService';
import { AppError } from '../../shared/errors/AppError';

export class GetRecommendedJobs {
    constructor(
        private jobRepo: IJobRepository,
        private userRepo: IUserRepository,
        private aiService: IAIService
    ) {}

    async execute(candidateId: string) {
        // 1. Get Candidate Profile
        const profile = await this.userRepo.getProfile(candidateId);
        if (!profile) {
            throw new AppError('Please complete your profile/upload a CV first to get recommendations', 'PROFILE_INCOMPLETE', 400);
        }

        // 2. Fetch Active Jobs (Pre-filter: latest 50 active jobs)
        // Optimization: In a real app, we could filter by profile.skills or location here
        const jobs = await this.jobRepo.findActiveJobsForMatching(50);
        if (jobs.length === 0) return [];

        // 3. AI Matching
        const aiMatches = await this.aiService.matchJobsToProfile(profile, jobs);

        // 4. Map AI results back to full job data
        const recommendedJobs = aiMatches.map(match => {
            const fullJob = jobs.find(j => j.id === match.jobId);
            if (!fullJob) return null;

            return {
                job: fullJob,
                matchScore: match.matchScore,
                matchReason: match.matchReason
            };
        }).filter(item => item !== null);

        return recommendedJobs;
    }
}