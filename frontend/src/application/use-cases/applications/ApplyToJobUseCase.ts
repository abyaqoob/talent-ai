import { IJobApplicationRepository } from '../../../domain/repositories/IJobRepository';
import { JobApplication } from '../../../domain/entities/Job';

export interface ApplyToJobDTO {
  jobId: string;
  candidateId: string;
  coverLetter?: string;
}

export class ApplyToJobUseCase {
  constructor(private applicationRepository: IJobApplicationRepository) {}

  async execute(data: ApplyToJobDTO): Promise<JobApplication> {
    // Validate
    if (!data.jobId || !data.candidateId) {
      throw new Error('Job ID and Candidate ID are required');
    }

    // Create application
    return await this.applicationRepository.create({
      jobId: data.jobId,
      candidateId: data.candidateId,
      status: 'applied',
      coverLetter: data.coverLetter,
    });
  }
}
