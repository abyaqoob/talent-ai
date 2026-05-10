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
            enum: ['remote', 'onsite', 'hybrid'],
            required: true
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract'],
            required: true
        },
        experienceLevel: {
            type: String,
            enum: ['junior', 'mid', 'senior'],
            required: true
        },
        salaryRange: {
            min: {
                type: Number,
                required: true
            },
            max: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                required: true,
                default: 'USD'
            }
        },
        description: {
            type: String,
            required: true
        },
        requirements: {
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
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'jobs'
    }
);

// Indexes for better query performance
JobSchema.index({ recruiterId: 1, createdAt: -1 });
JobSchema.index({ workMode: 1, jobType: 1 });
JobSchema.index({ experienceLevel: 1 });

export const JobModel = mongoose.model<IJobDocument>('Job', JobSchema);