import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, Candidate, Recruiter } from '../../domain/entities/User';
import { mockUsers, mockCandidates, mockRecruiters } from '../data/mockData';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [...mockUsers];
  private candidates: Candidate[] = [...mockCandidates];
  private recruiters: Recruiter[] = [...mockRecruiters];

  async findById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.users.find(user => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.users.find(user => user.email === email) || null;
  }

  async findCandidateById(id: string): Promise<Candidate | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.candidates.find(candidate => candidate.id === id) || null;
  }

  async findRecruiterById(id: string): Promise<Recruiter | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.recruiters.find(recruiter => recruiter.id === id) || null;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    const updatedUser = this.users[userIndex];

    // Update in candidates/recruiters array as well
    if (updatedUser.role === 'candidate') {
      const candidateIndex = this.candidates.findIndex(c => c.id === id);
      if (candidateIndex !== -1) {
        this.candidates[candidateIndex] = { ...this.candidates[candidateIndex], ...updates };
      }
    } else if (updatedUser.role === 'recruiter') {
      const recruiterIndex = this.recruiters.findIndex(r => r.id === id);
      if (recruiterIndex !== -1) {
        this.recruiters[recruiterIndex] = { ...this.recruiters[recruiterIndex], ...updates };
      }
    }

    return updatedUser;
  }

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = this.candidates.findIndex(candidate => candidate.id === id);
    if (index === -1) {
      throw new Error('Candidate not found');
    }

    this.candidates[index] = { ...this.candidates[index], ...updates };

    // Also update in users array
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
    }

    return this.candidates[index];
  }

  async updateRecruiter(id: string, updates: Partial<Recruiter>): Promise<Recruiter> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = this.recruiters.findIndex(recruiter => recruiter.id === id);
    if (index === -1) {
      throw new Error('Recruiter not found');
    }

    this.recruiters[index] = { ...this.recruiters[index], ...updates };

    // Also update in users array
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
    }

    return this.recruiters[index];
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.users = this.users.filter(user => user.id !== id);
    this.candidates = this.candidates.filter(candidate => candidate.id !== id);
    this.recruiters = this.recruiters.filter(recruiter => recruiter.id !== id);
  }
}
