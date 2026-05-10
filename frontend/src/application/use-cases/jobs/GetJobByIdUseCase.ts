import { IJobRepository } from '../../../domain/repositories/IJobRepository';
import { Job } from '../../../domain/entities/Job';

export class GetJobByIdUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(jobId: string): Promise<Job> {
    const job = await this.jobRepository.findById(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }
}
