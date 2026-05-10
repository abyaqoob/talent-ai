import { IJobRepository } from '../../../domain/ports/secondary/IJobRepository';
import { IJob } from '../../../domain/models/job';
import { JobModel } from './JobSchema';

export class JobRepository implements IJobRepository {
    
    async save(job: IJob): Promise<IJob> {
        const doc = new JobModel(job);
        const saved = await doc.save();
        return this.toJob(saved);
    }

    async findById(id: string): Promise<IJob | null> {
        const doc = await JobModel.findById(id);
        return doc ? this.toJob(doc) : null;
    }

    async findAll(): Promise<IJob[]> {
        const docs = await JobModel.find().sort({ createdAt: -1 });
        return docs.map(doc => this.toJob(doc));
    }

    async findByRecruiterId(recruiterId: string): Promise<IJob[]> {
        const docs = await JobModel.find({ recruiterId }).sort({ createdAt: -1 });
        return docs.map(doc => this.toJob(doc));
    }

    async update(id: string, data: Partial<IJob>): Promise<IJob | null> {
        const doc = await JobModel.findByIdAndUpdate(id, data, { new: true });
        return doc ? this.toJob(doc) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await JobModel.findByIdAndDelete(id);
        return result !== null;
    }

    async incrementViews(id: string): Promise<void> {
        await JobModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }

    async findActiveJobsForMatching(limit: number): Promise<IJob[]> {
        const docs = await JobModel.find({ status: 'active' })
            .sort({ createdAt: -1 })
            .limit(limit);
        return docs.map(doc => this.toJob(doc));
    }

    // Convert MongoDB document to domain model
    private toJob(doc: any): IJob {
        return {
            id: doc._id.toString(),
            recruiterId: doc.recruiterId,
            title: doc.title,
            location: doc.location,
            workMode: doc.workMode,
            jobType: doc.jobType,
            experienceLevel: doc.experienceLevel,
            salaryRange: doc.salaryRange,
            description: doc.description,
            requirements: doc.requirements,
            status: doc.status,
            views: doc.views || 0,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}