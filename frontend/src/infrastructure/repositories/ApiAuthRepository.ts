import {
  IAuthRepository,
  LoginCredentials,
  RegisterData,
  AuthSession,
} from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { apiClient } from '../api/apiClient';

const SESSION_KEY = 'auth_session';

function mapBackendUser(raw: any): User {
  return {
    id: raw._id || raw.id,
    name: raw.name || '',
    email: raw.email || '',
    role: raw.role || 'candidate',
    profilePicture: raw.profilePicture,
    phone: raw.phone,
    location: raw.location,
    createdAt: new Date(raw.createdAt || Date.now()),
  };
}

function buildSession(data: any): AuthSession {
  const session: AuthSession = {
    user: mapBackendUser(data.user || data),
    token: data.token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export class ApiAuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    // POST /api/users/login → { token, user: { id, name, email, role } }
    // Send role so backend can validate cross-role login attempts
    const data = await apiClient.post<any>('/users/login', {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role, // role comes from the login form selection
    });
    return buildSession(data);
  }

  async register(data: RegisterData): Promise<AuthSession> {
    // POST /api/users/register → { message, user: { id, name, email, role } }
    // Backend does NOT return a token on register — auto-login after
    await apiClient.post<any>('/users/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      // Company fields for recruiter (passed as extra fields)
      ...(data as any).companyName ? { companyName: (data as any).companyName } : {},
      ...(data as any).industry ? { industry: (data as any).industry } : {},
      ...(data as any).companySize ? { companySize: (data as any).companySize } : {},
      ...(data as any).website ? { website: (data as any).website } : {},
    });
    // Now login to get the token
    const loginResponse = await apiClient.post<any>('/users/login', {
      email: data.email,
      password: data.password,
      role: data.role,
    });
    return buildSession(loginResponse);
  }

  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      const expiresAt = new Date(parsed.expiresAt);
      if (expiresAt < new Date()) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return {
        ...parsed,
        expiresAt,
        user: {
          ...parsed.user,
          createdAt: new Date(parsed.user.createdAt),
        },
      } as AuthSession;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  async refreshSession(): Promise<AuthSession> {
    const session = await this.getCurrentSession();
    if (!session) throw new Error('No active session to refresh');
    return session;
  }
}
