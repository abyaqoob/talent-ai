export type WorkMode = 'remote' | 'onsite' | 'hybrid';
export type JobType = 'full-time' | 'part-time' | 'contract';
export type ExperienceLevel = 'junior' | 'mid' | 'senior';

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
    status: 'active' | 'closed';
    views: number;
    createdAt: Date;
    updatedAt: Date;
}