import mongoose from 'mongoose';
import { IJobRepository } from '../../../domain/ports/secondary/IJobRepository';
import { IJob } from '../../../domain/models/job';
import { JobModel } from './JobSchema';

export class JobRepository implements IJobRepository {
    
    async save(job: IJob): Promise<IJob> {
        const jobData = { ...job };
        const id = jobData.id;
        delete (jobData as any).id;
        
        const doc = new JobModel({
            ...jobData,
            _id: id && mongoose.Types.ObjectId.isValid(id) ? id : new mongoose.Types.ObjectId()
        });
        
        const saved = await doc.save();
        return this.toJob(saved);
    }

    async findById(id: string): Promise<IJob | null> {
        const doc = await JobModel.findById(id).populate('company');
        return doc ? this.toJob(doc) : null;
    }

    async findAll(filters?: { minSalary?: number; skills?: string[]; experienceLevel?: string; type?: string }): Promise<IJob[]> {
        const query: any = {};
        const andFilters: any[] = [];

        if (filters) {
            if (filters.minSalary !== undefined) {
                andFilters.push({ "salaryRange.min": { $gte: Number(filters.minSalary) } });
            }
            if (filters.skills && filters.skills.length > 0) {
                const skillsRegexes = filters.skills.map(s => new RegExp(`^${s}$`, 'i'));
                andFilters.push({ skills: { $in: skillsRegexes } });
            }
            if (filters.experienceLevel) {
                andFilters.push({ experienceLevel: new RegExp(`^${filters.experienceLevel}$`, 'i') });
            }
            if (filters.type) {
                andFilters.push({ jobType: new RegExp(`^${filters.type}$`, 'i') });
            }
        }

        if (andFilters.length > 0) {
            query.$and = andFilters;
        }

        const docs = await JobModel.find(query).populate('company').sort({ createdAt: -1 });
        return docs.map(doc => this.toJob(doc));
    }

    async findByRecruiterId(recruiterId: string): Promise<IJob[]> {
        const docs = await JobModel.find({ recruiterId }).populate('company').sort({ createdAt: -1 });
        return docs.map(doc => this.toJob(doc));
    }

    async update(id: string, data: Partial<IJob>): Promise<IJob | null> {
        const doc = await JobModel.findByIdAndUpdate(id, data, { new: true }).populate('company');
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
            .populate('company')
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
            requirements: doc.requirements || [],
            skills: doc.skills || [],   // ✅ Include skills
            status: doc.status,
            views: doc.views || 0,
            company: doc.company,       // ✅ Include populated company
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}