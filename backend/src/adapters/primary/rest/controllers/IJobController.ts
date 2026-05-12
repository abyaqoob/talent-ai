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
import { NotificationService } from '../../../../domain/services/NotificationService';
import { CandidateProfileModel } from '../../../secondary/db/CandidateProfile';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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
    private notificationService?: NotificationService;

    constructor(
        jobRepo: JobRepository, 
        userRepo: MongooseUserRepository, 
        applicationRepo: ApplicationRepository,
        aiService: IAIService,
        notificationService?: NotificationService
    ) {
        this.jobRepo = jobRepo;
        this.userRepo = userRepo;
        this.applicationRepo = applicationRepo;
        this.aiService = aiService;
        this.notificationService = notificationService;
    }

    // POST /api/jobs
    async createJob(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            
            if (!recruiterId) {
                console.error('❌ createJob: No recruiterId in request');
                return res.status(401).json({ error: 'Unauthorized' });
            }

            console.log(`📝 Recruiter ${recruiterId} is posting a new job: ${req.body.title}`);

            const useCase = new PostJob(this.jobRepo, this.userRepo, this.aiService);
            const created = await useCase.execute({
                recruiterId,
                ...req.body
            });
            
            console.log(`✅ Job created successfully: ${created.id}`);
            res.status(201).json(created);

            // 🔔 Fire-and-forget: notify candidates with matching skills
            if (this.notificationService) {
                const jobSkills = (created.skills && created.skills.length > 0) ? created.skills : (created.requirements || []);
                if (jobSkills.length > 0) {
                    const skillsLower = jobSkills.map((s: string) => s.toLowerCase());
                    try {
                        const matchingProfiles = await CandidateProfileModel.find({
                            skills: { $elemMatch: { $regex: skillsLower.join('|'), $options: 'i' } }
                        }).select('userId').lean();

                        const recipientIds = matchingProfiles.map(p => p.userId);
                        if (recipientIds.length > 0) {
                            this.notificationService.notifyMany(recipientIds, {
                                type: 'JOB_POSTED',
                                title: 'New Job Matches Your Skills',
                                message: `A new position "${created.title}" has been posted that matches your skill set.`,
                                link: `/jobs/${created.id}`,
                            });
                            console.log(`🔔 Notified ${recipientIds.length} candidates about new job`);
                        }
                    } catch (notifErr) {
                        console.error('⚠️ Non-critical: failed to send job notifications', notifErr);
                    }
                }
            }
        } catch (error: any) {
            console.error('❌ createJob Error:', error.message);
            res.status(error.statusCode || 500).json({ 
                error: error.message,
                code: error.code || 'INTERNAL_ERROR'
            });
        }
    }

    // GET /api/jobs
    async getAllJobs(req: Request, res: Response) {
        try {
            const { minSalary, skills, experienceLevel, type } = req.query;
            const filters: any = {};

            if (minSalary) {
                filters.minSalary = Number(minSalary);
            }
            if (skills) {
                if (typeof skills === 'string') {
                    filters.skills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
                } else if (Array.isArray(skills)) {
                    filters.skills = skills;
                }
            }
            if (experienceLevel) {
                filters.experienceLevel = String(experienceLevel);
            }
            if (type) {
                filters.type = String(type);
            }

            const useCase = new GetJobs(this.jobRepo);
            const jobs = await useCase.execute(filters);
            res.json(jobs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/jobs/:id
    async getJobById(req: AuthRequest, res: Response) {
        try {
            const useCase = new GetJobById(this.jobRepo);
            const job = await useCase.execute(req.params.id);
            if (!job) return res.status(404).json({ error: 'Job not found' });
            
            // Fetch company profile for this job's recruiter
            let company = null;
            let recruiterProfilePicture = '';
            try {
                company = await this.userRepo.getCompanyProfile(job.recruiterId);
                const recruiterUser = await this.userRepo.findById(job.recruiterId);
                if (recruiterUser) {
                    recruiterProfilePicture = recruiterUser.profilePicture || '';
                }
            } catch { /* non-critical */ }

            // Calculate match score if candidate is logged in
            let matchScore = undefined;
            let userId = req.user?.id;
            let userRole = req.user?.role;

            if (!userId) {
                const authHeader = req.headers.authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.split(' ')[1];
                    try {
                        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
                        userId = decoded.id;
                        userRole = decoded.role;
                    } catch (e) {
                        // ignore invalid/expired tokens
                    }
                }
            }

            if (userId && userRole === 'candidate') {
                try {
                    const profile = await this.userRepo.getProfile(userId);
                    if (profile) {
                        // We calculate the score deterministically here to guarantee accuracy and avoid LLM hallucination/skipping.
                        const targetSkills = (job.skills && job.skills.length > 0) ? job.skills : (job.requirements || []);
                        matchScore = this.aiService.calculateMatchScore(profile.skills || [], targetSkills);
                    }
                } catch (e) {
                    console.error('Error calculating match score for detail page:', e);
                }
            }

            res.json({ ...job, company: company || null, recruiterProfilePicture, matchScore });
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

            // 🔔 Notify the recruiter who posted the job
            if (this.notificationService) {
                try {
                    const job = await this.jobRepo.findById(jobId);
                    if (job && job.recruiterId) {
                        const candidate = await this.userRepo.findById(candidateId);
                        const candidateName = candidate?.name || 'A candidate';
                        this.notificationService.notify({
                            recipientId: job.recruiterId,
                            type: 'NEW_APPLICATION',
                            title: 'New Application Received',
                            message: `${candidateName} has applied for your "${job.title}" position.`,
                            link: `/recruiter/jobs/${jobId}/pipeline`,
                        }).catch(err => console.error('⚠️ Non-critical: application notification failed', err));
                    }
                } catch (notifErr) {
                    console.error('⚠️ Non-critical: failed to send application notification', notifErr);
                }
            }
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

    // POST /api/jobs/extract-skills
    async extractSkills(req: AuthRequest, res: Response) {
        try {
            const recruiterId = req.user?.id;
            if (!recruiterId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { description } = req.body;
            if (!description) {
                return res.status(400).json({ error: 'Description is required' });
            }

            const result = await this.aiService.extractSkillsFromJD(description);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}