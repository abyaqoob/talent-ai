import { IJob } from '../../models/job';

export interface IJobRepository {
    save(job: IJob): Promise<IJob>;
    findById(id: string): Promise<IJob | null>;
    findAll(filters?: { minSalary?: number; skills?: string[]; experienceLevel?: string; type?: string }): Promise<IJob[]>;
    findByRecruiterId(recruiterId: string): Promise<IJob[]>;
    update(id: string, data: Partial<IJob>): Promise<IJob | null>;
    delete(id: string): Promise<boolean>;
    incrementViews(id: string): Promise<void>;
    findActiveJobsForMatching(limit: number): Promise<IJob[]>;
}