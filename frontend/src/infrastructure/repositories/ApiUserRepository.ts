import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, Candidate, Recruiter } from '../../domain/entities/User';
import { apiClient } from '../api/apiClient';

function getSessionUser(): any | null {
  try {
    const stored = localStorage.getItem('auth_session');
    if (!stored) return null;
    return JSON.parse(stored)?.user || null;
  } catch { return null; }
}

function mapBaseUser(raw: any): User {
  return {
    id: raw._id || raw.id || '',
    name: raw.name || '',
    email: raw.email || '',
    role: raw.role || 'candidate',
    profilePicture: raw.profilePicture,
    phone: raw.phone,
    location: raw.location,
    createdAt: new Date(raw.createdAt || Date.now()),
  };
}

function mapCandidateFromProfile(raw: any, base: any): Candidate {
  // raw = { about, skills, links, experience, yearsOfExperience, education, certifications }
  const expArr = (raw.experience || []).map((exp: any, i: number) => ({
    id: exp._id || String(i),
    title: exp.title || exp.role || '',
    company: exp.company || '',
    location: exp.location || '',
    startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
    endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    current: exp.current || !exp.endDate,
    description: exp.description || exp.timeline || '',
  }));

  const eduArr = (raw.education || []).map((edu: any, i: number) => ({
    id: edu._id || String(i),
    degree: edu.degree || '',
    institution: edu.institute || edu.institution || edu.school || '',
    field: edu.field || edu.major || '',
    startDate: edu.startDate ? new Date(edu.startDate) : new Date(),
    endDate: edu.endDate ? new Date(edu.endDate) : undefined,
    current: edu.current || false,
  }));

  const skills = raw.skills || [];
  const completeness = calculateCompleteness(raw, base);

  return {
    id: base._id || base.id || '',
    name: base.name || '',
    email: base.email || '',
    role: 'candidate',
    profilePicture: base.profilePicture,
    phone: base.phone,
    location: base.location,
    createdAt: new Date(base.createdAt || Date.now()),
    title: raw.about ? raw.about.split('.')[0] : '',
    skills,
    experience: expArr,
    education: eduArr,
    cvUrl: raw.cvUrl,
    profileCompleteness: completeness,
  };
}

function calculateCompleteness(profile: any, user: any): number {
  let score = 0;
  if (user?.name) score += 20;
  if (user?.email) score += 10;
  if (profile?.skills?.length > 0) score += 25;
  if (profile?.experience?.length > 0) score += 25;
  if (profile?.education?.length > 0) score += 10;
  if (profile?.about) score += 10;
  return Math.min(100, score);
}

function mapRecruiter(raw: any): Recruiter {
  const base = getSessionUser() || {};
  return {
    id: base._id || base.id || '',
    name: base.name || '',
    email: base.email || '',
    role: 'recruiter',
    profilePicture: base.profilePicture,
    phone: base.phone,
    location: base.location,
    createdAt: new Date(base.createdAt || Date.now()),
    company: raw.companyName || raw.company || '',
    companySize: raw.companySize,
    industry: raw.industry,
    website: raw.website,
  };
}

export class ApiUserRepository implements IUserRepository {
  async findById(_id: string): Promise<User | null> {
    const u = getSessionUser();
    return u ? mapBaseUser(u) : null;
  }

  async findByEmail(_email: string): Promise<User | null> { return null; }

  async create(_user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    throw new Error('Use AuthRepository to create users');
  }

  async update(_id: string, updates: Partial<User>): Promise<User> {
    const data = await apiClient.put<any>('/users/profile', updates);
    return mapBaseUser(data?.user || data);
  }

  async delete(_id: string): Promise<void> {
    await apiClient.delete('/users/profile');
  }

  async getCandidateProfile(_id: string): Promise<Candidate | null> {
    try {
      // GET /api/users/cv/profile → { success, data: { about, skills, experience... } }
      const res = await apiClient.get<any>('/users/cv/profile');
      const profileData = res?.data || res;
      if (!profileData) return null;
      const sessionUser = getSessionUser() || {};
      return mapCandidateFromProfile(profileData, sessionUser);
    } catch {
      return null;
    }
  }

  async getRecruiterProfile(_id: string): Promise<Recruiter | null> {
    try {
      // GET /api/users/company/profile → { success, data: { companyName, industry... } }
      const res = await apiClient.get<any>('/users/company/profile');
      const profileData = res?.data || res;
      if (!profileData) return null;
      return mapRecruiter(profileData);
    } catch {
      return null;
    }
  }

  async updateCandidateProfile(_id: string, profile: Partial<Candidate>): Promise<Candidate> {
    // POST /api/users/cv/save → { success, message }
    await apiClient.post<any>('/users/cv/save', { cvData: profile });
    const updated = await this.getCandidateProfile(_id);
    if (updated) return updated;
    const u = getSessionUser() || {};
    return mapCandidateFromProfile(profile, u);
  }

  async updateRecruiterProfile(_id: string, profile: Partial<Recruiter>): Promise<Recruiter> {
    // POST /api/users/company/profile → { success, message }
    await apiClient.post<any>('/users/company/profile', {
      companyName: profile.company,
      companySize: profile.companySize,
      industry: profile.industry,
      website: profile.website,
    });
    const updated = await this.getRecruiterProfile(_id);
    if (updated) return updated;
    return mapRecruiter(profile);
  }

  /** CV upload — POST /api/users/cv/upload multipart */
  async uploadCV(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('cv', file);
    // Returns { success: true, data: ParsedCvData }
    const res = await apiClient.upload<any>('/users/cv/upload', formData);
    return res?.data || res;
  }

  /** Analyze CV feedback — POST /api/users/cv/analyze */
  async analyzeCV(cvData: any): Promise<any> {
    const res = await apiClient.post<any>('/users/cv/analyze', { cvData });
    return res?.data || res;
  }
}
