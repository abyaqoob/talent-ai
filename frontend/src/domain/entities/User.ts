export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter';
  profilePicture?: string;
  phone?: string;
  location?: string;
  createdAt: Date;
}

export interface Candidate extends User {
  role: 'candidate';
  title?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  cvUrl?: string;
  profileCompleteness: number;
}

export interface Recruiter extends User {
  role: 'recruiter';
  company: string;
  companySize?: string;
  industry?: string;
  website?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}
