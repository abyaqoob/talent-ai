import { Job, JobApplication } from '../entities/Job';

export interface IJobRepository {
  findAll(filters?: { minSalary?: number; skills?: string[]; experienceLevel?: string; type?: string }): Promise<Job[]>;
  findById(id: string): Promise<Job | null>;
  findByRecruiterId(recruiterId: string): Promise<Job[]>;
  findMatchingJobs(candidateId: string): Promise<Job[]>;
  create(job: Omit<Job, 'id' | 'postedDate'>): Promise<Job>;
  update(id: string, job: Partial<Job>): Promise<Job>;
  delete(id: string): Promise<void>;
}

export interface IJobApplicationRepository {
  findById(id: string): Promise<JobApplication | null>;
  findByJobId(jobId: string): Promise<JobApplication[]>;
  findByCandidateId(candidateId: string): Promise<JobApplication[]>;
  create(application: Omit<JobApplication, 'id' | 'appliedDate' | 'updatedDate'>): Promise<JobApplication>;
  updateStatus(id: string, status: JobApplication['status']): Promise<JobApplication>;
  delete(id: string): Promise<void>;
}
