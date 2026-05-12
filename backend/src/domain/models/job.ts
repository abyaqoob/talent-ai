export type WorkMode = 'remote' | 'onsite' | 'hybrid';
// ✅ FIXED: added 'internship' and 'lead' variants that frontend sends
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';

export interface ISalaryRange {
    min: number;
    max: number;
    currency: string;
}

export interface IJob {
    id: string;
    recruiterId: string;
    title: string;
    location: string;
    workMode: WorkMode;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    salaryRange: ISalaryRange;
    description: string;
    requirements: string[];
    skills?: string[];      // ✅ Added: AI-extracted skills field
    status: 'active' | 'closed';
    views: number;
    company?: any;          // ✅ Added: Populated company details
    createdAt: Date;
    updatedAt: Date;
}