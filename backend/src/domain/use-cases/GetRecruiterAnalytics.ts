import { IApplicationRepository } from '../ports/secondary/IApplicationRepository';
import { IJobRepository } from '../ports/secondary/IJobRepository';

export class GetRecruiterAnalytics {
    constructor(
        private applicationRepo: IApplicationRepository,
        private jobRepo: IJobRepository
    ) {}

    async execute(recruiterId: string) {
        // 1. Fetch all jobs and their IDs
        const allJobs = await this.jobRepo.findByRecruiterId(recruiterId);
        const jobIds = allJobs.map(job => job.id);
        const activeJobsCount = allJobs.filter(job => job.status === 'active').length;

        // 2. Fetch all applications for these jobs
        const allApplications = jobIds.length > 0 
            ? await this.applicationRepo.findApplicationsByJobIds(jobIds)
            : [];

        // 3. Calculate Stats
        const totalApplications = allApplications.length;
        
        // Unique candidates
        const uniqueCandidateIds = new Set(allApplications.map(app => app.candidateId));
        const totalCandidates = uniqueCandidateIds.size;

        // Hired this month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const hiredThisMonthCount = allApplications.filter(app => 
            app.status === 'hired' && new Date(app.updatedAt) >= firstDayOfMonth
        ).length;

        // 4. Top Performing Jobs (by application count)
        const jobStats = allJobs.map(job => {
            const jobApps = allApplications.filter(app => app.jobId === job.id);
            return {
                id: job.id,
                title: job.title,
                applications: jobApps.length,
                hired: jobApps.filter(app => app.status === 'hired').length,
                views: job.views
            };
        }).sort((a, b) => b.applications - a.applications).slice(0, 5);

        // 5. Recent Activity
        const recentActivity = allApplications
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .slice(0, 4)
            .map(app => {
                const job = allJobs.find(j => j.id === app.jobId);
                return {
                    type: app.status === 'applied' ? 'New application received' : 'Candidate moved to ' + app.status.replace('_', ' '),
                    jobTitle: job?.title || 'Unknown Job',
                    time: app.updatedAt
                };
            });

        return {
            totalCandidates,
            activeJobs: activeJobsCount,
            totalApplications,
            hiredThisMonth: hiredThisMonthCount,
            topJobs: jobStats,
            recentActivity
        };
    }
}