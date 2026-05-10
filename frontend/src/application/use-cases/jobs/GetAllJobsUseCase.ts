import { IJobRepository } from '../../../domain/repositories/IJobRepository';
import { Job } from '../../../domain/entities/Job';

export class GetAllJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(): Promise<Job[]> {
    return await this.jobRepository.findAll();
  }
}
