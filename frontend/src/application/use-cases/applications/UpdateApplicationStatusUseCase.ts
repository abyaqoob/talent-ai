import { IJobApplicationRepository } from '../../../domain/repositories/IJobRepository';
import { JobApplication } from '../../../domain/entities/Job';

export class UpdateApplicationStatusUseCase {
  constructor(private applicationRepository: IJobApplicationRepository) {}

  async execute(applicationId: string, status: JobApplication['status']): Promise<JobApplication> {
    return await this.applicationRepository.updateStatus(applicationId, status);
  }
}
