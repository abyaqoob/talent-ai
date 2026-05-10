import { IJobRepository, IJobApplicationRepository } from '../../domain/repositories/IJobRepository';
import { Job, JobApplication, ApplicationStatus } from '../../domain/entities/Job';
import { mockJobs, mockApplications } from '../data/mockData';

export class InMemoryJobRepository implements IJobRepository, IJobApplicationRepository {
  private jobs: Job[] = [...mockJobs];
  private applications: JobApplication[] = [...mockApplications];

  // Job Repository Methods
  async findAll(): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.jobs.filter(job => job.isActive);
  }

  async findById(id: string): Promise<Job | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.jobs.find(job => job.id === id) || null;
  }

  async findByRecruiterId(recruiterId: string): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.jobs.filter(job => job.recruiterId === recruiterId);
  }

  async findMatchingJobs(candidateId: string): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // In a real implementation, this would use ML/AI matching algorithm
    // For now, return all active jobs with mock match scores
    return this.jobs
      .filter(job => job.isActive)
      .map(job => ({
        ...job,
        matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      }))
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  async create(job: Omit<Job, 'id' | 'postedDate'>): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}`,
      postedDate: new Date(),
      isActive: true,
    };

    this.jobs.push(newJob);
    return newJob;
  }

  async update(id: string, updates: Partial<Job>): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = this.jobs.findIndex(job => job.id === id);
    if (index === -1) {
      throw new Error('Job not found');
    }

    this.jobs[index] = { ...this.jobs[index], ...updates };
    return this.jobs[index];
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.jobs = this.jobs.filter(job => job.id !== id);
  }

  // Job Application Repository Methods
  async findApplicationsByCandidate(candidateId: string): Promise<JobApplication[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.applications.filter(app => app.candidateId === candidateId);
  }

  async findApplicationsByJob(jobId: string): Promise<JobApplication[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.applications.filter(app => app.jobId === jobId);
  }

  async findApplicationById(id: string): Promise<JobApplication | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.applications.find(app => app.id === id) || null;
  }

  async applyToJob(candidateId: string, jobId: string, coverLetter?: string): Promise<JobApplication> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if already applied
    const existing = this.applications.find(
      app => app.candidateId === candidateId && app.jobId === jobId
    );
    if (existing) {
      throw new Error('Already applied to this job');
    }

    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      candidateId,
      jobId,
      status: 'applied',
      appliedDate: new Date(),
      coverLetter,
    };

    this.applications.push(newApplication);
    return newApplication;
  }

  async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    notes?: string
  ): Promise<JobApplication> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) {
      throw new Error('Application not found');
    }

    this.applications[index] = {
      ...this.applications[index],
      status,
      notes,
      ...(status === 'interviewing' && { interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }),
    };

    return this.applications[index];
  }

  async withdrawApplication(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.applications = this.applications.filter(app => app.id !== id);
  }
}
