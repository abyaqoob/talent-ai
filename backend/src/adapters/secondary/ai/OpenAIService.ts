import OpenAI from 'openai';
import { IAIService } from '../../../domain/ports/secondary/IAIService';
import { ParsedCvData, CvFeedback } from '../../../domain/models/Profile';

const pdf = require('pdf-parse');

const MODEL = 'openrouter/free';
const FALLBACK_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

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
            apiKey: process.env.OPENROUTER_API_KEY, // Uses process.env.OPENROUTER_API_KEY for Authorization
            defaultHeaders: {
                'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:5173',
                'X-Title': 'TalentAI',
            },
        });
    }

    private async callAI(model: string, messages: any[], temperature: number = 0.7) {
        const modelsToTry = [
            model,
            'meta-llama/llama-3.3-70b-instruct:free',
            'google/gemini-3.5-flash',
            'google/gemini-2.5-flash'
        ];
        
        const uniqueModels = [...new Set(modelsToTry)];
        let lastError: any;

        for (let i = 0; i < uniqueModels.length; i++) {
            const currentModel = uniqueModels[i];
            try {
                return await this.client.chat.completions.create({
                    model: currentModel,
                    messages,
                    temperature,
                });
            } catch (error: any) {
                lastError = error;
                console.warn(`⚠️ Model ${currentModel} failed: ${error.status || error.code || ''} - ${error.message || error}`);
                if (i === uniqueModels.length - 1) {
                    throw error;
                }
                console.warn(`🔄 Trying next fallback model: ${uniqueModels[i + 1]}`);
            }
        }
        throw lastError || new Error('All AI models failed');
    }

    private cleanAndParseJson(content: string): any {
        // 1. Locate the first '{' or '[' and last '}' or ']'
        const firstBrace = content.indexOf('{');
        const firstBracket = content.indexOf('[');
        let startIdx = -1;
        let endIdx = -1;
        
        if (firstBrace !== -1 && firstBracket !== -1) {
            startIdx = Math.min(firstBrace, firstBracket);
        } else if (firstBrace !== -1) {
            startIdx = firstBrace;
        } else if (firstBracket !== -1) {
            startIdx = firstBracket;
        }
        
        if (startIdx === -1) {
            throw new Error('No JSON object or array found in the response.');
        }
        
        const lastBrace = content.lastIndexOf('}');
        const lastBracket = content.lastIndexOf(']');
        endIdx = Math.max(lastBrace, lastBracket);
        
        if (endIdx === -1 || endIdx < startIdx) {
            throw new Error('Invalid JSON structure: closing brace/bracket not found or appears before opening.');
        }
        
        let jsonStr = content.substring(startIdx, endIdx + 1);
        
        // Attempt standard JSON parse first
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            // Standard parse failed, try to repair it
        }
        
        // Repair step 1: Remove single line comments (//...) and multi-line comments (/*...*/)
        jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
        
        // Repair step 2: Replace single quotes around keys/values with double quotes
        jsonStr = jsonStr.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');
        
        // Repair step 3: Quote unquoted object keys
        jsonStr = jsonStr.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
        
        // Repair step 4: Remove trailing commas before closing braces/brackets
        jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
        
        // Final attempt
        return JSON.parse(jsonStr);
    }

    // ────────────────────────────────────────────────────────────────
    async parseCv(fileBuffer: Buffer, mimeType: string): Promise<ParsedCvData> {
        const systemPrompt = `Extract structured CV/resume data and return ONLY valid JSON matching this exact schema (no extra keys, no markdown):
{
  "about": "string",
  "skills": ["string"],
  "links": { "github": "string", "linkedin": "string", "portfolio": "string" },
  "experience": [{ "title": "string", "company": "string", "timeline": "string", "description": "string" }],
  "yearsOfExperience": number,
  "education": [{ "degree": "string", "institute": "string", "duration": "string" }],
  "certifications": ["string"]
}`;

        let textContent: string;

        if (mimeType === 'application/pdf') {
            try {
                const pdfData = await pdf(fileBuffer);
                console.log('📄 PDF parsed, text length:', pdfData.text.length);
                textContent = `${systemPrompt}\n\nAnalyze this CV text:\n${pdfData.text}`;
            } catch (err) {
                console.error('PDF parsing error:', err);
                throw new Error('Failed to parse PDF text content.');
            }
        } else if (mimeType.startsWith('image/')) {
            // Gemini free tier: convert image to base64 and embed in text prompt
            const base64 = fileBuffer.toString('base64');
            textContent = `${systemPrompt}\n\n[Image CV provided as base64 — please extract all visible text and structure]\ndata:${mimeType};base64,${base64.substring(0, 500)}...`;
        } else {
            throw new Error(`Unsupported file type: ${mimeType}`);
        }

        try {
            console.log('OpenRouter key present:', !!process.env.OPENROUTER_API_KEY);
            console.log(`🤖 Calling OpenRouter model: ${MODEL} (parseCv)`);
            const response = await this.callAI(MODEL, [{ role: 'user', content: textContent }]);

            if (!response || !response.choices || response.choices.length === 0) {
                throw new Error((response as any)?.error?.message || 'Invalid AI response structure');
            }

            console.log('✅ OpenRouter parseCv response received');
            const rawContent = response.choices[0].message.content;
            if (!rawContent) throw new Error('AI returned empty response');

            return this.cleanAndParseJson(rawContent) as ParsedCvData;

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

Return ONLY this JSON format (no markdown, no extra keys):
{
  "strengths": ["..."],
  "areasToImprove": ["..."],
  "recommendedActions": ["..."],
  "overallScore": <number 0-100>
}`;

        try {
            console.log('OpenRouter key present:', !!process.env.OPENROUTER_API_KEY);
            console.log(`🤖 Calling OpenRouter model: ${MODEL} (analyzeCv)`);
            const response = await this.callAI(MODEL, [
                {
                    role: 'system',
                    content: 'You are a professional CV reviewer. Provide honest, actionable feedback. Return only valid JSON.'
                },
                { role: 'user', content: prompt }
            ], 0.7);

            if (!response || !response.choices || response.choices.length === 0) {
                throw new Error((response as any)?.error?.message || 'Invalid AI response structure');
            }

            console.log('✅ OpenRouter analyzeCv response received');
            const content = response.choices[0].message.content;
            if (!content) throw new Error('AI returned empty feedback');
            return this.cleanAndParseJson(content) as CvFeedback;

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
        const prompt = `Extract required skills, experience level, and key requirements from this job description.

Job Description:
${description}

Return ONLY valid JSON (no markdown):
{
  "skills": ["skill1", "skill2"],
  "experienceLevel": "junior|mid|senior|lead",
  "requirements": ["requirement1", "requirement2"]
}`;

        try {
            console.log('OpenRouter key present:', !!process.env.OPENROUTER_API_KEY);
            console.log(`🤖 Calling OpenRouter model: ${MODEL} (extractSkillsFromJD)`);
            const response = await this.callAI(MODEL, [{ role: 'user', content: prompt }]);

            if (!response || !response.choices || response.choices.length === 0) {
                throw new Error((response as any)?.error?.message || 'Invalid AI response structure');
            }

            const content = response.choices[0].message.content;
            if (!content) throw new Error('AI returned empty response');
            
            const parsed = this.cleanAndParseJson(content);
            
            return {
                skills: parsed.skills || [],
                experienceLevel: parsed.experienceLevel || 'mid',
                requirements: parsed.requirements || []
            };
        } catch (error: any) {
            console.error('❌ OpenRouter extractSkillsFromJD Error:', error.status || 'NoStatus', error.message);
            console.log('🔄 Falling back to high-performance local extraction algorithm...');
            return this.extractSkillsAndRequirementsLocally(description);
        }
    }

    // ────────────────────────────────────────────────────────────────
    public calculateMatchScore(candidateSkills: string[], jobRequirements: string[]): number {
        if (!jobRequirements || jobRequirements.length === 0) return 0;
        
        const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase());
        const uniqueRequirements = [...new Set(jobRequirements.map(req => req.toLowerCase()))];
        
        // Define a comprehensive list of generic/soft keywords that should have a lower weight
        const genericKeywords = [
            'communication', 'leadership', 'management', 'problem solving', 'collaboration', 
            'teamwork', 'writing', 'editing', 'proofreading', 'organization', 'time management',
            'creativity', 'interpersonal', 'adaptability', 'flexibility', 'critical thinking',
            'responsibilities', 'responsibility', 'brand', 'voice', 'platforms', 'written'
        ];

        let totalWeight = 0;
        let earnedWeight = 0;

        uniqueRequirements.forEach(req => {
            const isGeneric = genericKeywords.some(gk => gk === req || req.includes(gk));
            // Technical/hard skills have 3x the weight of generic/soft skills
            const weight = isGeneric ? 1 : 3;

            totalWeight += weight;

            if (candidateSkillsLower.some(s => s.includes(req) || req.includes(s))) {
                earnedWeight += weight;
            }
        });

        if (totalWeight === 0) return 0;
        const score = (earnedWeight / totalWeight) * 100;
        return Math.round(score);
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

Return ONLY a JSON object (no markdown):
{ "matches": [{ "jobId": "string", "matchScore": number, "matchReason": "string" }] }

For matchScore: Use a scale of 0-100.
Sort by matchScore descending. Return max 20 matches.`;

        try {
            console.log('OpenRouter key present:', !!process.env.OPENROUTER_API_KEY);
            console.log(`🤖 Calling OpenRouter model: ${MODEL} (matchJobs)`);
            const response = await this.callAI(MODEL, [
                { role: 'system', content: 'You are a recruiting assistant specializing in job matching. Return only valid JSON.' },
                { role: 'user', content: prompt }
            ]);

            if (!response || !response.choices || response.choices.length === 0) {
                throw new Error((response as any)?.error?.message || 'Invalid AI response structure');
            }

            const content = response.choices[0].message.content;
            if (!content) return [];

            const parsed = this.cleanAndParseJson(content);
            
            let matches: any[] = [];
            if (Array.isArray(parsed)) matches = parsed;
            else if (Array.isArray(parsed.matches)) matches = parsed.matches;
            else if (typeof parsed === 'object') {
                const firstVal = Object.values(parsed)[0];
                if (Array.isArray(firstVal)) matches = firstVal;
            }

            // Refine scores based on the specific weighted formula: (Matched Skills / Total Required Skills) * 100
            const refinedMatches = matches.map(match => {
                const job = jobs.find(j => (j.id || (j as any)._id?.toString()) === match.jobId);
                if (job) {
                    // Use job.skills (AI-extracted) as the source of truth for intersection, fall back to requirements
                    const targetSkills = (job.skills && job.skills.length > 0) ? job.skills : (job.requirements || []);
                    const realScore = this.calculateMatchScore(profileData.skills || [], targetSkills);
                    
                    return {
                        ...match,
                        matchScore: realScore
                    };
                }
                return match;
            });

            // Filter out any jobs with matchScore < 40%, and sort descending
            return refinedMatches
                .filter(m => m.matchScore >= 40)
                .sort((a, b) => b.matchScore - a.matchScore);

        } catch (error: any) {
            console.error('❌ OpenRouter matchJobs Error:', error.status, error.message);
            console.log('🔄 Falling back to high-performance local matching algorithm...');
            
            const candidateSkills = profileData.skills || [];
            
            const fallbackMatches = jobs.map(j => {
                const targetSkills = (j.skills && j.skills.length > 0) ? j.skills : (j.requirements || []);
                const matchScore = this.calculateMatchScore(candidateSkills, targetSkills);
                
                const intersection = candidateSkills.filter((s: string) => 
                    targetSkills.some((ts: string) => ts.toLowerCase() === s.toLowerCase())
                );
                
                let matchReason = `Based on your skill overlap.`;
                if (intersection.length > 0) {
                    matchReason = `You match ${intersection.length} key skill${intersection.length > 1 ? 's' : ''} for this job: ${intersection.slice(0, 3).join(', ')}.`;
                } else {
                    matchReason = `We recommend this job based on its industry and requirements.`;
                }
                
                return {
                    jobId: j.id || j._id?.toString(),
                    matchScore,
                    matchReason
                };
            });
            
            // Filter out any jobs with matchScore < 40%, and sort descending
            return fallbackMatches
                .filter(m => m.matchScore >= 40)
                .sort((a, b) => b.matchScore - a.matchScore);
        }
    }

    private extractSkillsAndRequirementsLocally(description: string): { skills: string[], experienceLevel: string, requirements: string[] } {
        const text = description.toLowerCase();
        
        // 1. Expanded comprehensive Skill list matching (Technical & Creative)
        const skillLibrary = [
            'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Python', 'Django', 'Flask',
            'Java', 'Spring', 'C#', '.NET', 'C++', 'Go', 'Golang', 'Rust', 'Ruby', 'Rails', 'PHP', 'Laravel',
            'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'AWS', 'Azure', 'GCP',
            'Docker', 'Kubernetes', 'CI/CD', 'Git', 'HTML', 'CSS', 'Tailwind', 'Sass', 'Figma', 'UI/UX',
            'Machine Learning', 'AI', 'Data Science', 'PyTorch', 'TensorFlow', 'Scrum', 'Agile',
            'Next.js', 'Redux', 'Svelte', 'Webpack', 'Vite', 'Babel', 'ESLint', 'Jest', 'Cypress', 'Playwright',
            'Salesforce', 'SAP', 'Linux', 'Bash', 'Zsh', 'Vercel', 'Netlify', 'Firebase', 'Supabase',
            'Kafka', 'RabbitMQ', 'ActiveMQ', 'DynamoDB', 'Cassandra', 'Hive', 'Snowflake', 'BigQuery',
            'WebSockets', 'gRPC', 'JWT', 'OAuth', 'SAML', 'Nginx', 'Apache', 'Terraform', 'Ansible', 'Jenkins',
            // Creative & Content Writing Skills
            'Writing', 'Content Creation', 'Copywriting', 'Technical Writing', 'Content Writing', 'Research', 'Storytelling',
            'Marketing', 'Editing', 'Proofreading', 'SEO', 'Social Media', 'Creative Writing', 'Public Relations',
            'Communication', 'Leadership', 'Management', 'Problem Solving', 'Collaboration', 'Teamwork', 'Branding'
        ];
        
        const skills: string[] = [];
        skillLibrary.forEach(skill => {
            const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            // Custom regex matching that supports C++, C#, .NET, Node.js etc. perfectly without relying on standard \b word boundary
            const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])(${escaped})(?:$|[^a-zA-Z0-9_#+])`, 'i');
            if (regex.test(description)) {
                skills.push(skill);
            }
        });
        
        // 2. Experience level detection
        let experienceLevel = 'mid';
        if (/\b(junior|associate|entry|intern)\b/i.test(text)) {
            experienceLevel = 'junior';
        } else if (/\b(lead|principal|director|manager|architect)\b/i.test(text)) {
            experienceLevel = 'lead';
        } else if (/\b(senior|sr|staff)\b/i.test(text)) {
            experienceLevel = 'senior';
        }
        
        // 3. Extract requirements from text lines
        const requirements: string[] = [];
        const lines = description.split('\n').map(l => l.trim()).filter(l => l.length > 5);
        
        // Find lines starting with bullet points or containing keywords
        lines.forEach(line => {
            if (/^[-*•+]\s/.test(line)) {
                requirements.push(line.replace(/^[-*•+]\s+/, ''));
            } else if (/\b(experience with|proficiency in|strong knowledge of|familiarity with|must have)\b/i.test(line)) {
                requirements.push(line);
            }
        });
        
        // Default requirements if none found
        if (requirements.length === 0) {
            requirements.push('Experience in matching technologies');
            requirements.push('Strong communication and teamwork skills');
        }
        
        return {
            skills: skills.slice(0, 10),
            experienceLevel,
            requirements: requirements.slice(0, 5)
        };
    }
}