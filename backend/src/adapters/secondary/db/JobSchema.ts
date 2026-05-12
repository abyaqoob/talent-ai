import mongoose, { Schema, Document } from 'mongoose';
import { IJob, WorkMode, JobType, ExperienceLevel } from "../../../domain/models/job";

export interface IJobDocument extends Omit<IJob, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const JobSchema = new Schema<IJobDocument>(
    {
        recruiterId: {
            type: String,
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        workMode: {
            type: String,
            // ✅ Fixed: accept both formats
            enum: ['remote', 'onsite', 'hybrid', 'Remote', 'Onsite', 'Hybrid'],
            required: true,
            lowercase: true,
        },
        jobType: {
            type: String,
            // ✅ Fixed: accept all variants frontend sends
            enum: ['full-time', 'part-time', 'contract', 'internship', 'fulltime', 'parttime'],
            required: true,
        },
        experienceLevel: {
            type: String,
            // ✅ Fixed: accept all variants frontend sends
            enum: ['junior', 'mid', 'senior', 'lead', 'entry', 'Entry', 'Mid', 'Senior', 'Lead'],
            required: true,
        },
        salaryRange: {
            min: { type: Number, required: true, default: 0 },
            max: { type: Number, required: true, default: 0 },
            currency: { type: String, required: true, default: 'USD' }
        },
        description: {
            type: String,
            required: true
        },
        requirements: {
            type: [String],
            default: []
        },
        skills: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: ['active', 'closed'],
            default: 'active'
        },
        views: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        collection: 'jobs',
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for company details
JobSchema.virtual('company', {
    ref: 'CompanyProfile',
    localField: 'recruiterId',
    foreignField: 'userId',
    justOne: true
});

JobSchema.index({ recruiterId: 1, createdAt: -1 });
JobSchema.index({ workMode: 1, jobType: 1 });
JobSchema.index({ experienceLevel: 1 });

export const JobModel = mongoose.model<IJobDocument>('Job', JobSchema);