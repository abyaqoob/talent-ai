import { Request, Response } from 'express';
import { JobRepository } from '../../../secondary/db/JobRepository';
import { MongooseUserRepository } from '../../../secondary/db/MongooseUserRepository';
import { ApplicationRepository } from '../../../secondary/db/ApplicationRepository';
import { PostJob } from '../../../../domain/use-cases/PostJob';
import { GetJobs } from '../../../../domain/use-cases/GetJobs';
import { GetJobById } from '../../../../domain/use-cases/GetJobsById';
import { UpdateJob } from '../../../../domain/use-cases/UpdateJobs';
import { DeleteJob } from '../../../../domain/use-cases/DeleteJob';
import { GetRecruiterJobs } from '../../../../domain/use-cases/GetRecruiterJobs';
import { ApplyForJob } from '../../../../domain/use-cases/ApplyForJob';
import { GetRecommendedJobs } from '../../../../domain/use-cases/GetRecommendedJobs';
import { IAIService } from '../../../../domain/ports/secondary/IAIService';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
        role?: string;
    };
}

export class JobController {
    private jobRepo: JobRepository;
    private userRepo: MongooseUserRepository;
    private applicationRepo: ApplicationRepository;
    private aiService: IAIService;

    // ✅ Constructor accepts both repositories
    constructor(
        jobRepo: JobRepository, 
        userRepo: MongooseUserRepository, 
        applicationRepo: ApplicationRepository,
        aiService: IAIService
    ) {
        this.jobRepo = jobRepo;
        this.userRepo = userRepo;
        this.applicationRepo = applicationRepo;
        this.aiService = aiService;
    }

    // POST /api/jobs
    async createJob(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            
            if (!recruiterId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const useCase = new PostJob(this.jobRepo, this.userRepo);
            const created = await useCase.execute({
                recruiterId,
                ...req.body
            });
            
            res.status(201).json(created);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    // GET /api/jobs
    async getAllJobs(req: Request, res: Response) {
        try {
            const useCase = new GetJobs(this.jobRepo);
            const jobs = await useCase.execute();
            res.json(jobs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/jobs/:id
    async getJobById(req: Request, res: Response) {
        try {
            const useCase = new GetJobById(this.jobRepo);
            const job = await useCase.execute(req.params.id);
            res.json(job);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    // PATCH /api/jobs/:id
    async updateJob(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            
            if (!recruiterId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const useCase = new UpdateJob(this.jobRepo);
            const job = await useCase.execute(req.params.id, recruiterId, req.body);
            res.json(job);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    // DELETE /api/jobs/:id
    async deleteJob(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            
            if (!recruiterId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const useCase = new DeleteJob(this.jobRepo);
            await useCase.execute(req.params.id, recruiterId);
            res.status(204).send();
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    // GET /api/jobs/recruiter/me
    async getJobsByRecruiter(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;

            if (!recruiterId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const useCase = new GetRecruiterJobs(this.jobRepo);
            const jobs = await useCase.execute(recruiterId);
            res.json(jobs);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    // POST /api/jobs/:id/apply
    async applyForJob(req: AuthRequest, res: Response) {
        try {
            const candidateId = req.user?.id;
            const jobId = req.params.id;

            if (!candidateId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const useCase = new ApplyForJob(this.applicationRepo, this.jobRepo, this.userRepo);
            const application = await useCase.execute(jobId, candidateId);

            res.status(201).json(application);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    // PATCH /api/jobs/:id/status
    async updateJobStatus(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            const jobId = req.params.id;
            const { status } = req.body;

            if (!recruiterId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (!['active', 'closed'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const job = await this.jobRepo.findById(jobId);
            if (!job || job.recruiterId !== recruiterId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const updatedJob = await this.jobRepo.update(jobId, { status, updatedAt: new Date() });
            res.json(updatedJob);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    // GET /api/jobs/recommended
    async getRecommendedJobs(req: AuthRequest, res: Response) {
        try {
            const candidateId = req.user?.id;
            if (!candidateId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const useCase = new GetRecommendedJobs(this.jobRepo, this.userRepo, this.aiService);
            const recommendations = await useCase.execute(candidateId);
            res.json(recommendations);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}