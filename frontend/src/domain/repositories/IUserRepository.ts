import { User, Candidate, Recruiter } from '../entities/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  getCandidateProfile(id: string): Promise<Candidate | null>;
  getRecruiterProfile(id: string): Promise<Recruiter | null>;
  updateCandidateProfile(id: string, profile: Partial<Candidate>): Promise<Candidate>;
  updateRecruiterProfile(id: string, profile: Partial<Recruiter>): Promise<Recruiter>;
}
