// adapters/secondary/db/models/CandidateProfile.ts
import mongoose, { Schema, Document } from 'mongoose';
import { ICandidateProfile } from '@/domain/models/Profile';

type CandidateProfileDocument = ICandidateProfile & Document;

const candidateProfileSchema = new Schema<CandidateProfileDocument>(
    {
        userId: { 
            type: String, 
            required: true, 
            unique: true,
            index: true 
        },
        about: { 
            type: String, 
            default: '' 
        },
        skills: { 
            type: [String], 
            default: [] 
        },
        links: {
            github: String,
            linkedin: String,
            portfolio: String
        },
        experience: [
            {
                title: { type: String, required: true },
                company: { type: String, required: true },
                timeline: { type: String, required: true },
                description: { type: String, default: '' }
            }
        ],
        yearsOfExperience: { 
            type: Number, 
            default: 0 
        },
        education: [
            {
                degree: { type: String, required: true },
                institute: { type: String, required: true },
                duration: { type: String, required: true }
            }
        ],
        certifications: { 
            type: [String], 
            default: [] 
        },
        applicationsSent: { 
            type: Number, 
            default: 0 
        },
        profileViews: { 
            type: Number, 
            default: 0 
        }
    },
    {
        timestamps: true // auto-manages createdAt and updatedAt
    }
);

export const CandidateProfileModel = mongoose.model<CandidateProfileDocument>(
    'CandidateProfile',
    candidateProfileSchema
);