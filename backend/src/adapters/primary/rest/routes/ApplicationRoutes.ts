import { Router } from 'express';
import { ApplicationController } from '../controllers/ApplicationController';
import { authMiddleware } from '../auth/authMiddleware';

export const ApplicationRoutes = (controller: ApplicationController): Router => {
    const router = Router();

    // Candidate routes
    router.get('/applications/me', authMiddleware, (req, res) => controller.getMyApplications(req as any, res));

    // Recruiter routes
    router.get('/applications/recruiter/all', authMiddleware, (req, res) => controller.getAllRecruiterApplications(req as any, res));
    router.get('/recruiter/analytics', authMiddleware, (req, res) => controller.getAnalytics(req as any, res));
    router.get('/jobs/:id/applications', authMiddleware, (req, res) => controller.getJobApplications(req as any, res));
    router.patch('/applications/:id/status', authMiddleware, (req, res) => controller.updateApplicationStatus(req as any, res));

    return router;
};