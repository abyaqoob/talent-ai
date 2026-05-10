import { User } from '../entities/User';

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'candidate' | 'recruiter';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'candidate' | 'recruiter';
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(data: RegisterData): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<AuthSession | null>;
  refreshSession(): Promise<AuthSession>;
}
