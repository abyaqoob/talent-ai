import OpenAI from 'openai';
import { IAIService } from '../../../domain/ports/secondary/IAIService';
import { ParsedCvData, CvFeedback } from '../../../domain/models/Profile';

const pdf = require('pdf-parse');

export class OpenRouterService implements IAIService {
    private client: OpenAI;

    constructor() {
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('❌ OPENROUTER_API_KEY is not set in .env');
        } else {
            console.log('✅ OpenRouter API key loaded:', process.env.OPENROUTER_API_KEY.slice(0, 12) + '...');
        }
        this.client = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:5173',
                'X-Title': 'TalentAI',
            },
        });
    }

    // ────────────────────────────────────────────────────────────────
    async parseCv(fileBuffer: Buffer, mimeType: string): Promise<ParsedCvData> {
        let contentPayload: any[];

        const systemPrompt = `Extract structured CV/resume data and return ONLY valid JSON matching this exact schema (no extra keys):
{
  "about": "string",
  "skills": ["string"],
  "links": { "github": "string", "linkedin": "string", "portfolio": "string" },
  "experience": [{ "title": "string", "company": "string", "timeline": "string", "description": "string" }],
  "yearsOfExperience": number,
  "education": [{ "degree": "string", "institute": "string", "duration": "string" }],
  "certifications": ["string"]
}`;

        if (mimeType === 'application/pdf') {
            try {
                const pdfData = await pdf(fileBuffer);
                console.log('📄 PDF parsed, text length:', pdfData.text.length);
                contentPayload = [
                    { type: 'text', text: `${systemPrompt}\n\nAnalyze this CV text:\n${pdfData.text}` }
                ];
            } catch (err) {
                console.error('PDF parsing error:', err);
                throw new Error('Failed to parse PDF text content.');
            }
        } else if (mimeType.startsWith('image/')) {
            const base64 = fileBuffer.toString('base64');
            contentPayload = [
                { type: 'text', text: systemPrompt },
                {
                    type: 'image_url',
                    image_url: { url: `data:${mimeType};base64,${base64}` }
                }
            ];
        } else {
            throw new Error(`Unsupported file type: ${mimeType}`);
        }

        try {
            console.log('🤖 Calling OpenRouter model: openai/gpt-3.5-turbo');
            const response = await this.client.chat.completions.create({
                model: 'openai/gpt-3.5-turbo',   // ✅ must include provider prefix for OpenRouter
                messages: [{ role: 'user', content: contentPayload as any }],
                response_format: { type: 'json_object' },
            });

            console.log('✅ OpenRouter parseCv response received');
            const rawContent = response.choices[0].message.content;
            if (!rawContent) throw new Error('AI returned empty response');

            const cleanJson = rawContent.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanJson) as ParsedCvData;

        } catch (error: any) {
            console.error('❌ OpenRouter parseCv Error:', error.status, error.message);
            if (error.status === 401) throw new Error('Invalid OpenRouter API key. Check OPENROUTER_API_KEY in .env');
            if (error.status === 429) throw new Error('Rate limit exceeded. Try again in a few minutes.');
            if (error.status === 402) throw new Error('OpenRouter credits exhausted. Add credits at openrouter.ai');
            throw new Error(`CV Parsing failed: ${error.message}`);
        }
    }

    // ────────────────────────────────────────────────────────────────
    async analyzeCv(cvData: ParsedCvData): Promise<CvFeedback> {
        const prompt = `You are an expert CV reviewer. Analyze this resume data and give structured feedback.

Resume Data:
${JSON.stringify(cvData, null, 2)}

Return ONLY this JSON format:
{
  "strengths": ["..."],
  "areasToImprove": ["..."],
  "recommendedActions": ["..."],
  "overallScore": <number 0-100>
}`;

        try {
            console.log('🤖 Calling OpenRouter model: openai/gpt-3.5-turbo (analyzeCv)');
            const response = await this.client.chat.completions.create({
                model: 'openai/gpt-3.5-turbo',   // ✅ FIXED: was 'gpt-4o' which is wrong for OpenRouter
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional CV reviewer. Provide honest, actionable feedback.'
                    },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            });

            console.log('✅ OpenRouter analyzeCv response received');
            const content = response.choices[0].message.content;
            if (!content) throw new Error('AI returned empty feedback');
            return JSON.parse(content) as CvFeedback;

        } catch (error: any) {
            console.error('❌ OpenRouter analyzeCv Error:', error.status, error.message);
            if (error.status === 401) throw new Error('Invalid OpenRouter API key.');
            if (error.status === 402) throw new Error('OpenRouter credits exhausted.');
            // Return graceful fallback so CV upload doesn't break
            return {
                strengths: ['CV uploaded successfully'],
                areasToImprove: ['Add more detailed work experience', 'Include quantifiable achievements'],
                recommendedActions: ['Fill out all profile sections', 'Add links to portfolio/GitHub'],
                overallScore: 50,
            };
        }
    }

    // ────────────────────────────────────────────────────────────────
    async extractSkillsFromJD(description: string): Promise<{ skills: string[], experienceLevel: string, requirements: string[] }> {
        const prompt = `Extract required skills, experience level, and key requirements from this job description. Return as JSON with fields: skills (array), experienceLevel (string), requirements (array).

Job Description:
${description}

Return ONLY valid JSON format.`;

        try {
            console.log('🤖 Calling OpenRouter model: openai/gpt-3.5-turbo (extractSkillsFromJD)');
            const response = await this.client.chat.completions.create({
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0].message.content;
            if (!content) throw new Error('AI returned empty response');
            
            const cleanJson = content.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            
            return {
                skills: parsed.skills || [],
                experienceLevel: parsed.experienceLevel || 'mid',
                requirements: parsed.requirements || []
            };
        } catch (error: any) {
            console.error('❌ OpenRouter extractSkillsFromJD Error:', error.status, error.message);
            return { skills: [], experienceLevel: 'mid', requirements: [] }; // fallback
        }
    }

    // ────────────────────────────────────────────────────────────────
    async matchJobsToProfile(profileData: any, jobs: any[]): Promise<any[]> {
        if (!jobs || jobs.length === 0) return [];

        const prompt = `You are an AI job matcher. Match this candidate profile to the best jobs from the list.

Candidate Profile:
${JSON.stringify(profileData, null, 2)}

Available Jobs (${jobs.length} total):
${JSON.stringify(jobs.slice(0, 20).map(j => ({
    id: j.id || j._id,
    title: j.title,
    requirements: j.requirements,
    description: (j.description || '').substring(0, 200),
    experienceLevel: j.experienceLevel,
})), null, 2)}

Return ONLY a JSON object with this structure:
{ "matches": [{ "jobId": "string", "matchScore": number (0-100), "matchReason": "string" }] }

Sort by matchScore descending. Return max 5 matches.`;

        try {
            console.log('🤖 Calling OpenRouter model: openai/gpt-3.5-turbo (matchJobs)');
            const response = await this.client.chat.completions.create({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a recruiting assistant specializing in job matching.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0].message.content;
            if (!content) return [];

            const parsed = JSON.parse(content);
            // Handle both { matches: [] } and direct array
            if (Array.isArray(parsed)) return parsed;
            if (Array.isArray(parsed.matches)) return parsed.matches;
            const firstVal = Object.values(parsed)[0];
            if (Array.isArray(firstVal)) return firstVal as any[];
            return [];

        } catch (error: any) {
            console.error('❌ OpenRouter matchJobs Error:', error.status, error.message);
            return [];
        }
    }
}