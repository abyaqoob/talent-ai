import { IAIService } from '../ports/secondary/IAIService';
import { ParsedCvData, CvFeedback } from '../models/Profile';

export class AnalyzeCvUseCase {
    constructor(private aiService: IAIService) {}

    async execute(cvData: ParsedCvData): Promise<CvFeedback> {
        return this.aiService.analyzeCv(cvData);
    }
}