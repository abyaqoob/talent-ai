import { IJob } from '../../models/job';

export interface IJobRepository {
    save(job: IJob): Promise<IJob>;
    findById(id: string): Promise<IJob | null>;
    findAll(): Promise<IJob[]>;
    findByRecruiterId(recruiterId: string): Promise<IJob[]>;
    update(id: string, data: Partial<IJob>): Promise<IJob | null>;
    delete(id: string): Promise<boolean>;
    incrementViews(id: string): Promise<void>;
    findActiveJobsForMatching(limit: number): Promise<IJob[]>;
}