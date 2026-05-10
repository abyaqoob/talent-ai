import { IApplicationRepository } from '../../../domain/ports/secondary/IApplicationRepository';
import { IApplication, ApplicationStatus } from '../../../domain/models/Application';
import { ApplicationModel } from './ApplicationSchema';
import { JobModel } from './JobSchema';
import mongoose from 'mongoose';

export class ApplicationRepository implements IApplicationRepository {
    async save(application: IApplication): Promise<IApplication> {
        const doc = new ApplicationModel(application);
        const saved = await doc.save();
        return this.toApplication(saved);
    }

    async findById(id: string): Promise<IApplication | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const doc = await ApplicationModel.findById(id);
        return doc ? this.toApplication(doc) : null;
    }

    async findByJobAndCandidate(jobId: string, candidateId: string): Promise<IApplication | null> {
        const doc = await ApplicationModel.findOne({ jobId, candidateId });
        return doc ? this.toApplication(doc) : null;
    }

    async findByJobId(jobId: string): Promise<IApplication[]> {
        const docs = await ApplicationModel.find({ jobId }).sort({ appliedAt: -1 });
        return docs.map(doc => this.toApplication(doc));
    }

    async findByCandidateId(candidateId: string): Promise<IApplication[]> {
        const docs = await ApplicationModel.find({ candidateId }).sort({ appliedAt: -1 });
        return docs.map(doc => this.toApplication(doc));
    }

    async findApplicationsByJobIds(jobIds: string[]): Promise<IApplication[]> {
        const docs = await ApplicationModel.find({ jobId: { $in: jobIds } }).sort({ appliedAt: -1 });
        return docs.map(doc => this.toApplication(doc));
    }

    async updateStatus(id: string, status: ApplicationStatus): Promise<IApplication | null> {
        const doc = await ApplicationModel.findByIdAndUpdate(id, { status }, { new: true });
        return doc ? this.toApplication(doc) : null;
    }

    async findCandidateApplicationsWithJobs(candidateId: string): Promise<any[]> {
        // Simple populate using aggregation or manual lookup if needed, 
        // but let's use a straightforward approach for now.
        const apps = await ApplicationModel.find({ candidateId }).sort({ appliedAt: -1 }).lean();
        
        const results = await Promise.all(apps.map(async (app) => {
            const job = await JobModel.findById(app.jobId).lean();
            return {
                ...app,
                id: app._id.toString(),
                job: job ? { ...job, id: job._id.toString() } : null
            };
        }));

        return results;
    }

    async findJobApplicationsWithCandidates(jobId: string): Promise<any[]> {
        const apps = await ApplicationModel.find({ jobId }).sort({ appliedAt: -1 }).lean();
        
        // This normally would join with Users and CandidateProfiles
        return apps.map(app => ({
            ...app,
            id: app._id.toString()
        }));
    }

    private toApplication(doc: any): IApplication {
        return {
            id: doc._id.toString(),
            jobId: doc.jobId,
            candidateId: doc.candidateId,
            status: doc.status,
            appliedAt: doc.appliedAt,
            updatedAt: doc.updatedAt
        };
    }
}