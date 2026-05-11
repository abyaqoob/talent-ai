import { IJobApplicationRepository } from '../../domain/repositories/IJobRepository';
import { JobApplication } from '../../domain/entities/Job';
import { apiClient } from '../api/apiClient';

function mapBackendApplication(raw: any): JobApplication {
  return {
    id: raw._id || raw.id || '',
    jobId: raw.jobId || raw.job?._id || raw.job || '',
    candidateId: raw.candidateId || raw.candidate?._id || raw.candidate || '',
    status: raw.status || 'applied',
    appliedDate: new Date(raw.appliedAt || raw.appliedDate || raw.createdAt || Date.now()),
    updatedDate: new Date(raw.updatedAt || raw.updatedDate || Date.now()),
    coverLetter: raw.coverLetter,
    notes: raw.notes,
  };
}

export class ApiJobApplicationRepository implements IJobApplicationRepository {
  async findById(id: string): Promise<JobApplication | null> {
    try {
      const data = await apiClient.get<any>(`/applications/${id}`);
      return mapBackendApplication(data);
    } catch {
      return null;
    }
  }

  async findByJobId(jobId: string): Promise<JobApplication[]> {
    try {
      const data = await apiClient.get<any>(`/jobs/${jobId}/applications`);
      const arr = Array.isArray(data) ? data : data?.applications || [];
      return arr.map(mapBackendApplication);
    } catch {
      return [];
    }
  }

  async findByCandidateId(_candidateId: string): Promise<JobApplication[]> {
    try {
      const data = await apiClient.get<any>('/applications/me');
      const arr = Array.isArray(data) ? data : data?.applications || [];
      return arr.map(mapBackendApplication);
    } catch {
      return [];
    }
  }

  async create(application: Omit<JobApplication, 'id' | 'appliedDate' | 'updatedDate'>): Promise<JobApplication> {
    const data = await apiClient.post<any>(`/jobs/${application.jobId}/apply`, {
      coverLetter: application.coverLetter || '',
    });
    return mapBackendApplication(data);
  }

  async updateStatus(id: string, status: JobApplication['status']): Promise<JobApplication> {
    const data = await apiClient.patch<any>(`/applications/${id}/status`, { status });
    return mapBackendApplication(data);
  }

  async delete(_id: string): Promise<void> {
    // No delete endpoint available
  }
}
