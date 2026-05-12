import { LucideIcon } from 'lucide-react';

export interface Job {
  id: string;
  title: string;
  company: string;
  icon: LucideIcon;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  experience: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  salary: string;
  skills: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: Date;
  recruiterId: string;
  isActive: boolean;
  matchScore?: number;
}

export interface JobApplication {
  id: string;
  jobId: string | any; // Can be ID string or populated Job object
  candidateId: string;
  status: 'applied' | 'screening' | 'interviewing' | 'offered' | 'rejected' | 'under_review' | 'shortlisted' | 'hired';
  appliedDate: Date;
  updatedDate: Date;
  coverLetter?: string;
  notes?: string;
}

export type ApplicationStatus = JobApplication['status'];

