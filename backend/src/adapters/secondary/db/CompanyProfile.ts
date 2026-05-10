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
            required: true 
        },
        industry: { 
            type: String, 
            required: true 
        },
        companySize: { 
            type: String, 
            required: true 
        },
        website: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String, 
            required: true 
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