import { IAIService } from '../ports/secondary/IAIService';
import { ParsedCvData } from '../models/Profile';

export class ParseCvUseCase {
    constructor(private aiService: IAIService) {}

    async execute(fileBuffer: Buffer, mimeType: string): Promise<ParsedCvData> {
        return this.aiService.parseCv(fileBuffer, mimeType);
    }
}