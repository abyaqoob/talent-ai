import mongoose, { Schema, Document } from 'mongoose';
import { ICompanyProfile } from '@/domain/models/Profile';

type CompanyProfileDocument = ICompanyProfile & Document;

const CompanyProfileSchema = new Schema<CompanyProfileDocument>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        companyName: {
            type: String,
            default: ''
        },
        industry: {
            type: String,
            default: ''
        },
        companySize: {
            type: String,
            default: '1-10'
        },
        website: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        location: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

export const CompanyProfileModel = mongoose.model<CompanyProfileDocument>(
    'CompanyProfile',
    CompanyProfileSchema
);