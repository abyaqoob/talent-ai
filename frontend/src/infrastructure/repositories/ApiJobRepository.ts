import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { Job } from '../../domain/entities/Job';
import { apiClient } from '../api/apiClient';
import { Briefcase } from 'lucide-react';

function parseSalary(salary: string): { min: number; max: number; currency: string } {
  const match = salary.match(/\$?(\d+)k?\s*[-–]\s*\$?(\d+)k?/i);
  if (match) {
    let min = parseInt(match[1]);
    let max = parseInt(match[2]);
    if (min < 1000) min *= 1000;
    if (max < 1000) max *= 1000;
    return { min, max, currency: 'USD' };
  }
  return { min: 0, max: 0, currency: 'USD' };
}

export function mapBackendJobToFrontend(raw: any): Job {
  let salary = '';
  if (raw.salaryRange) {
    const min = raw.salaryRange.min ?? 0;
    const max = raw.salaryRange.max ?? 0;
    salary = `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
  } else if (raw.salary) {
    salary = String(raw.salary);
  }

  const typeMap: Record<string, Job['type']> = {
    'full-time': 'Full-Time',
    'fulltime': 'Full-Time',
    'part-time': 'Part-Time',
    'parttime': 'Part-Time',
    'contract': 'Contract',
    'internship': 'Internship',
  };

  const expMap: Record<string, Job['experience']> = {
    'junior': 'Entry',
    'entry': 'Entry',
    'mid': 'Mid',
    'middle': 'Mid',
    'senior': 'Senior',
    'lead': 'Lead',
  };

  const rawType = (raw.jobType || raw.type || '').toLowerCase().replace(/[\s-]/g, '');
  const rawExp = (raw.experienceLevel || raw.experience || '').toLowerCase();

  return {
    id: raw._id || raw.id || '',
    title: raw.title || '',
    company: raw.company || raw.companyName || '',
    icon: Briefcase,
    location: raw.location || '',
    type: typeMap[rawType] || 'Full-Time',
    experience: expMap[rawExp] || 'Mid',
    salary,
    skills: raw.skills || raw.requirements || [],
    description: raw.description || '',
    requirements: raw.requirements || [],
    responsibilities: raw.responsibilities || [],
    benefits: raw.benefits || [],
    postedDate: new Date(raw.createdAt || raw.postedDate || Date.now()),
    recruiterId: raw.recruiterId || raw.postedBy || '',
    isActive: raw.status === 'active' || raw.isActive === true,
    matchScore: raw.matchScore,
  };
}

export class ApiJobRepository implements IJobRepository {
  async findAll(): Promise<Job[]> {
    const data = await apiClient.get<any>('/jobs');
    const arr = Array.isArray(data) ? data : data?.jobs || [];
    return arr.map(mapBackendJobToFrontend);
  }

  async findById(id: string): Promise<Job | null> {
    try {
      const data = await apiClient.get<any>(`/jobs/${id}`);
      return mapBackendJobToFrontend(data);
    } catch {
      return null;
    }
  }

  async findByRecruiterId(_recruiterId: string): Promise<Job[]> {
    try {
      const data = await apiClient.get<any>('/jobs/recruiter/me');
      const arr = Array.isArray(data) ? data : data?.jobs || [];
      return arr.map(mapBackendJobToFrontend);
    } catch {
      return [];
    }
  }

  async findMatchingJobs(_candidateId: string): Promise<Job[]> {
    try {
      const data = await apiClient.get<any>('/jobs/recommended');
      const arr = Array.isArray(data) ? data : data?.jobs || [];
      return arr.map(mapBackendJobToFrontend);
    } catch {
      return this.findAll();
    }
  }

  async create(job: Omit<Job, 'id' | 'postedDate'>): Promise<Job> {
    const typeBackend = job.type?.toLowerCase().replace('-', '') || 'fulltime';
    const expBackend = job.experience?.toLowerCase() || 'mid';
    const payload = {
      title: job.title,
      location: job.location,
      workMode: 'remote',
      jobType: typeBackend,
      experienceLevel: expBackend,
      salaryRange: parseSalary(job.salary || '0-0'),
      description: job.description,
      requirements: job.requirements?.length ? job.requirements : job.skills || [],
      responsibilities: job.responsibilities || [],
      benefits: job.benefits || [],
    };
    const data = await apiClient.post<any>('/jobs', payload);
    return mapBackendJobToFrontend(data);
  }

  async update(id: string, updates: Partial<Job>): Promise<Job> {
    const payload: Record<string, any> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.requirements !== undefined) payload.requirements = updates.requirements;
    if (updates.type !== undefined) payload.jobType = updates.type.toLowerCase().replace('-', '');
    if (updates.experience !== undefined) payload.experienceLevel = updates.experience.toLowerCase();
    if (updates.salary !== undefined) payload.salaryRange = parseSalary(updates.salary);
    if (updates.isActive !== undefined) payload.status = updates.isActive ? 'active' : 'closed';
    const data = await apiClient.patch<any>(`/jobs/${id}`, payload);
    return mapBackendJobToFrontend(data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  }
}
