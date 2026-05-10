import { IJobRepository } from '../../../domain/repositories/IJobRepository';
import { Job } from '../../../domain/entities/Job';

export type CreateJobDTO = Omit<Job, 'id' | 'postedDate'>;

export class CreateJobUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(jobData: CreateJobDTO): Promise<Job> {
    // Validate job data
    if (!jobData.title || !jobData.company || !jobData.recruiterId) {
      throw new Error('Title, company, and recruiter ID are required');
    }

    return await this.jobRepository.create(jobData);
  }
}
