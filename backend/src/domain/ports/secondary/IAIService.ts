import { ParsedCvData,CvFeedback } from '../../models/Profile';

export interface IAIService {
    parseCv(fileBuffer: Buffer, mimeType: string): Promise<ParsedCvData>;
    analyzeCv(cvData: ParsedCvData): Promise<CvFeedback>;
    matchJobsToProfile(profileData: any, jobs: any[]): Promise<any[]>;
    extractSkillsFromJD(description: string): Promise<{ skills: string[], experienceLevel: string, requirements: string[] }>;
    calculateMatchScore(candidateSkills: string[], jobRequirements: string[]): number;
}