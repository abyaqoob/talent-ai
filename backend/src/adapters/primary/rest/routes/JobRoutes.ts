import { Router } from 'express';
import { JobController } from '../controllers/IJobController';
import { authMiddleware } from '../auth/authMiddleware'; 

export const JobRoutes = (controller: JobController): Router => {
    const router = Router();

    // Public routes
    router.get('/jobs', (req, res) => controller.getAllJobs(req, res));
    router.get('/jobs/recommended', authMiddleware, (req, res) => controller.getRecommendedJobs(req as any, res));
    router.get('/jobs/:id', (req, res) => controller.getJobById(req, res));

    // Protected routes
    router.get('/jobs/recruiter/me', authMiddleware, (req, res) => controller.getJobsByRecruiter(req as any, res));
    router.post('/jobs', authMiddleware, (req, res) => controller.createJob(req, res));
    router.post('/jobs/:id/apply', authMiddleware, (req, res) => controller.applyForJob(req as any, res));
    router.patch('/jobs/:id', authMiddleware, (req, res) => controller.updateJob(req, res));
    router.patch('/jobs/:id/status', authMiddleware, (req, res) => controller.updateJobStatus(req as any, res));
    router.delete('/jobs/:id', authMiddleware, (req, res) => controller.deleteJob(req, res));

    return router;
};