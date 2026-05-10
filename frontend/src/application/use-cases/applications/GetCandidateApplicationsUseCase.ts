import { IJobApplicationRepository } from '../../../domain/repositories/IJobRepository';
import { JobApplication } from '../../../domain/entities/Job';

export class GetCandidateApplicationsUseCase {
  constructor(private applicationRepository: IJobApplicationRepository) {}

  async execute(candidateId: string): Promise<JobApplication[]> {
    return await this.applicationRepository.findByCandidateId(candidateId);
  }
}
