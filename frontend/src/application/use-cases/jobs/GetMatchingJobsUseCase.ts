import { IJobRepository } from '../../../domain/repositories/IJobRepository';
import { Job } from '../../../domain/entities/Job';

export class GetMatchingJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(candidateId: string): Promise<Job[]> {
    return await this.jobRepository.findMatchingJobs(candidateId);
  }
}
