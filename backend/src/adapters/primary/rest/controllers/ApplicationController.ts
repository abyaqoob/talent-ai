import { Request, Response } from 'express';
import { GetMyApplications } from '../../../../domain/use-cases/GetMyApplications';
import { GetJobApplications } from '../../../../domain/use-cases/GetJobApplications';
import { GetAllRecruiterApplications } from '../../../../domain/use-cases/GetAllRecruiterApplications';
import { GetRecruiterAnalytics } from '../../../../domain/use-cases/GetRecruiterAnalytics';
import { UpdateApplicationStatus } from '../../../../domain/use-cases/UpdateApplicationStatus';
import { ApplicationRepository } from '../../../secondary/db/ApplicationRepository';
import { JobRepository } from '../../../secondary/db/JobRepository';
import { MongooseUserRepository } from '../../../secondary/db/MongooseUserRepository';
import { NotificationService } from '../../../../domain/services/NotificationService';

interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
        role?: string;
    };
}

export class ApplicationController {
    constructor(
        private applicationRepo: ApplicationRepository,
        private jobRepo: JobRepository,
        private userRepo: MongooseUserRepository,
        private notificationService?: NotificationService
    ) {}

    // GET /api/applications/me
    async getMyApplications(req: AuthRequest, res: Response) {
        try {
            const candidateId = req.user?.id;
            if (!candidateId) return res.status(401).json({ error: 'Unauthorized' });

            const useCase = new GetMyApplications(this.applicationRepo);
            const applications = await useCase.execute(candidateId);
            res.json(applications);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/jobs/:id/applications
    async getJobApplications(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            const jobId = req.params.id;
            if (!recruiterId) return res.status(401).json({ error: 'Unauthorized' });

            const useCase = new GetJobApplications(this.applicationRepo, this.jobRepo, this.userRepo);
            const applications = await useCase.execute(jobId, recruiterId);
            res.json(applications);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    // PATCH /api/applications/:id/status
    async updateApplicationStatus(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            const applicationId = req.params.id;
            const { status } = req.body;

            if (!recruiterId) return res.status(401).json({ error: 'Unauthorized' });

            const useCase = new UpdateApplicationStatus(this.applicationRepo, this.jobRepo);
            const updated = await useCase.execute(applicationId, recruiterId, status);
            res.json(updated);

            // 🔔 Notify candidate about status change
            if (this.notificationService && updated.candidateId) {
                const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
                try {
                    await this.notificationService.notify({
                        recipientId: updated.candidateId,
                        type: 'APPLICATION_STATUS',
                        title: `Application ${statusLabel}`,
                        message: `Your application has been ${status.toLowerCase()}. Check your applications for details.`,
                        link: '/applications',
                    });
                } catch (notifErr) {
                    console.error('⚠️ Non-critical: failed to send status notification', notifErr);
                }
            }
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    // GET /api/applications/recruiter/all
    async getAllRecruiterApplications(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            if (!recruiterId) return res.status(401).json({ error: 'Unauthorized' });

            const useCase = new GetAllRecruiterApplications(this.applicationRepo, this.jobRepo, this.userRepo);
            const applications = await useCase.execute(recruiterId);
            res.json(applications);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/applications/recruiter/analytics
    async getAnalytics(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            if (!recruiterId) return res.status(401).json({ error: 'Unauthorized' });

            const useCase = new GetRecruiterAnalytics(this.applicationRepo, this.jobRepo);
            const stats = await useCase.execute(recruiterId);
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}