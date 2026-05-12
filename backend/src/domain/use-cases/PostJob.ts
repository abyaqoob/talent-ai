import { IJobRepository } from '../ports/secondary/IJobRepository';
import { IUserRepository } from '../ports/secondary/IUserRepository';
import { IAIService } from '../ports/secondary/IAIService';
import { IJob, WorkMode, JobType, ExperienceLevel, ISalaryRange } from '../models/job';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../shared/errors/AppError';

interface PostJobInput {
    recruiterId: string;
    title: string;
    location: string;
    workMode: WorkMode;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    salaryRange: ISalaryRange;
    description: string;
    requirements: string[];
}

export class PostJob {
    constructor(
        private jobRepo: IJobRepository,
        private userRepo: IUserRepository, // Needed to check roles
        private aiService: IAIService // Needed for JD parsing
    ) {}

    async execute(input: PostJobInput): Promise<IJob> {
        // 1. Verify User exists and is a Recruiter
        const user = await this.userRepo.findById(input.recruiterId);
        if (!user || (user.role !== 'recruiter' && user.role !== 'admin')) {
            throw new AppError('Only recruiters can post jobs', 'FORBIDDEN', 403);
        }

        // 2. AI Skill Extraction
        let extractedSkills: string[] = (input as any).skills || [];
        let finalRequirements = input.requirements || [];
        let finalExperienceLevel = input.experienceLevel;

        // Only call AI if we are missing skills or requirements
        if (extractedSkills.length === 0 || finalRequirements.length === 0) {
            try {
                const aiData = await this.aiService.extractSkillsFromJD(input.description);
                
                if (extractedSkills.length === 0 && aiData.skills && aiData.skills.length > 0) {
                    extractedSkills = aiData.skills;
                }
                if (finalRequirements.length === 0 && aiData.requirements && aiData.requirements.length > 0) {
                    finalRequirements = aiData.requirements;
                }
                if (!finalExperienceLevel && aiData.experienceLevel) {
                    finalExperienceLevel = aiData.experienceLevel as ExperienceLevel;
                }
            } catch (err) {
                console.error('AI Extraction failed during job post:', err);
            }
        }

        // 3. Create the Job entity
        const newJob: IJob = {
            id: uuidv4(),
            ...input,
            experienceLevel: finalExperienceLevel || 'mid',
            requirements: finalRequirements,
            skills: extractedSkills,
            status: 'active',
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return this.jobRepo.save(newJob);
    }
}