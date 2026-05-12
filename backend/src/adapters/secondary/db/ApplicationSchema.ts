import mongoose, { Schema, Document } from 'mongoose';
import { IApplication } from '../../../domain/models/Application';

export interface IApplicationDocument extends Omit<IApplication, 'id' | 'jobId' | 'candidateId'>, Document {
    _id: mongoose.Types.ObjectId;
    jobId: any;
    candidateId: any;
}

const ApplicationSchema = new Schema<IApplicationDocument>({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    candidateId: { type: String, required: true, index: true },
    status: { type: String, enum: ['applied', 'under_review', 'shortlisted', 'interviewing', 'hired', 'rejected'], default: 'applied' }
}, {
    timestamps: { createdAt: 'appliedAt', updatedAt: 'updatedAt' },
    collection: 'applications',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for job details
ApplicationSchema.virtual('job', {
    ref: 'Job',
    localField: 'jobId',
    foreignField: '_id',
    justOne: true
});

// A candidate can only apply once per job
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export const ApplicationModel = mongoose.model<IApplicationDocument>('Application', ApplicationSchema);