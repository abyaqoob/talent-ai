import OpenAI from 'openai';
import { IAIService } from '../../../domain/ports/secondary/IAIService';
import { ParsedCvData,CvFeedback } from '../../../domain/models/Profile';

const pdf = require('pdf-parse');

export class OpenRouterService implements IAIService {
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
                "X-Title": "CV Parser App",
            }
        });
    }

    async parseCv(fileBuffer: Buffer, mimeType: string): Promise<ParsedCvData> {
        let contentPayload: any[];
        
        const systemPrompt = `Extract structured CV data and return ONLY valid JSON matching this exact schema:
        {
          "about": "string",
          "skills": ["string"],
          "links": { "github": "string", "linkedin": "string", "portfolio": "string" },
          "experience": [{ "title": "string", "company": "string", "timeline": "string", "description": "string" }],
          "yearsOfExperience": number,
          "education": [{ "degree": "string", "institute": "string", "duration": "string" }],
          "certifications": ["string"]
        }`;

        // STRATEGY: Handle PDF as text, Images as Vision
        if (mimeType === 'application/pdf') {
            try {
                const pdfData = await pdf(fileBuffer);
                console.log('PDF parsed successfully. Text length:', pdfData.text.length);
                console.log('First 200 chars:', pdfData.text.substring(0, 200));
                
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
            console.log('Calling OpenRouter with model: openai/gpt-3.5-turbo');
            
            const response = await this.client.chat.completions.create({
                // GPT-3.5-turbo: $0.0005/1K tokens (very cheap, reliable)
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: contentPayload as any
                    }
                ],
                response_format: { type: 'json_object' }
            });

            console.log('OpenRouter response received');
            const rawContent = response.choices[0].message.content;
            console.log('Raw response:', rawContent?.substring(0, 300));
            
            if (!rawContent) throw new Error('AI returned empty response');

            const cleanJson = rawContent.replace(/```json|```/g, "").trim();
            const parsedData = JSON.parse(cleanJson) as ParsedCvData;
            console.log('Successfully parsed CV data');
            
            return parsedData;

        } catch (error: any) {
            console.error("OpenRouter Error Details:");
            console.error("Status:", error.status);
            console.error("Message:", error.message);
            console.error("Error object:", JSON.stringify(error, null, 2));
            
            if (error.status === 429) {
                throw new Error('Rate limit exceeded. Please try again in a few minutes.');
            }
            
            if (error.status === 400) {
                throw new Error(`Invalid request: ${error.message}`);
            }
            
            if (error.status === 401) {
                throw new Error('Invalid API key. Check your OPENROUTER_API_KEY in .env');
            }

            throw new Error(`CV Parsing failed: ${error.message}`);
        }
    }
    
     async analyzeCv(cvData: ParsedCvData): Promise<CvFeedback> {
        const prompt = `You are an expert CV reviewer. Analyze this resume data and provide detailed feedback.

Resume Data:
${JSON.stringify(cvData, null, 2)}

Provide feedback in the following JSON format:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areasToImprove": ["area 1", "area 2", "area 3"],
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "overallScore": <number between 0-100>
}

Scoring criteria:
- Skills relevance and diversity: 25 points
- Experience quality and detail: 25 points
- Education credentials: 15 points
- Profile completeness (links, certifications, about): 20 points
- Professional presentation and clarity: 15 points

Be specific, constructive, and actionable in your feedback.`;

        const response = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional CV reviewer with expertise in recruiting and career development. Provide honest, constructive feedback.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('AI returned empty feedback');
        }

        return JSON.parse(content) as CvFeedback;
    }

    async matchJobsToProfile(profileData: any, jobs: any[]): Promise<any[]> {
        const prompt = `You are an AI job matcher. Match this candidate to the best 5 jobs from the list.
        
        Candidate Profile:
        ${JSON.stringify(profileData, null, 2)}

        Available Jobs:
        ${JSON.stringify(jobs.map(j => ({ 
            id: j.id, 
            title: j.title, 
            requirements: j.requirements, 
            description: j.description.substring(0, 200) + '...',
            experienceLevel: j.experienceLevel
        })), null, 2)}

        Return ONLY a valid JSON array of objects with this structure:
        [
          { "jobId": "string", "matchScore": number (0-100), "matchReason": "string" }
        ]
        
        Sort them by matchScore descending.`;

        const response = await this.client.chat.completions.create({
            model: 'openai/gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a professional recruiting assistant that specializes in technical job matching.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (!content) return [];
        
        try {
            const parsed = JSON.parse(content);
            let matches = [];
            
            if (Array.isArray(parsed)) {
                matches = parsed;
            } else if (parsed && typeof parsed === 'object') {
                // If it returned an object like { "matches": [...] }
                const firstValue = Object.values(parsed)[0];
                if (Array.isArray(firstValue)) {
                    matches = firstValue;
                } else if (Array.isArray((parsed as any).matches)) {
                    matches = (parsed as any).matches;
                }
            }
            
            return matches;
        } catch (e) {
            console.error("Failed to parse AI job matching response:", e);
            return [];
        }
    }
}