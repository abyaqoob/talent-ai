import { User } from '../../models/User';
import { ICandidateProfile, ParsedCvData, ICompanyProfile } from '../../models/Profile';
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  exists(email: string): Promise<boolean>;
  update(id: string, data: Partial<User>): Promise<User | null>; 
  delete(id: string): Promise<boolean>;
  saveCvData(userId: string, cvData: ParsedCvData): Promise<void>;
  getProfile(userId: string): Promise<ICandidateProfile | null>;
  saveCompanyProfile(userId: string, data: ICompanyProfile): Promise<void>;
  getCompanyProfile(userId: string): Promise<ICompanyProfile | null>;
}