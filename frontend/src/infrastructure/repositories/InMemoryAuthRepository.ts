import { IAuthRepository, LoginCredentials, RegisterData, AuthSession } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { mockUsers } from '../data/mockData';

export class InMemoryAuthRepository implements IAuthRepository {
  private users: User[] = [...mockUsers];
  private currentSession: AuthSession | null = null;

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Find user by email and role
    const user = this.users.find(
      u => u.email === credentials.email && u.role === credentials.role
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Create session
    const session: AuthSession = {
      user,
      token: `mock-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    this.currentSession = session;

    // Store in localStorage
    localStorage.setItem('auth_session', JSON.stringify(session));

    return session;
  }

  async register(data: RegisterData): Promise<AuthSession> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if user already exists
    const existingUser = this.users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: new Date(),
    };

    this.users.push(newUser);

    // Create session
    const session: AuthSession = {
      user: newUser,
      token: `mock-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    this.currentSession = session;

    // Store in localStorage
    localStorage.setItem('auth_session', JSON.stringify(session));

    return session;
  }

  async logout(): Promise<void> {
    this.currentSession = null;
    localStorage.removeItem('auth_session');
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    if (this.currentSession) {
      return this.currentSession;
    }

    // Try to restore from localStorage
    const stored = localStorage.getItem('auth_session');
    if (stored) {
      try {
        const session = JSON.parse(stored) as AuthSession;
        // Check if not expired
        if (new Date(session.expiresAt) > new Date()) {
          this.currentSession = session;
          return session;
        }
      } catch (e) {
        // Invalid session data
        localStorage.removeItem('auth_session');
      }
    }

    return null;
  }

  async refreshSession(): Promise<AuthSession> {
    const current = await this.getCurrentSession();
    if (!current) {
      throw new Error('No active session');
    }

    // Create new session with extended expiration
    const session: AuthSession = {
      ...current,
      token: `mock-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    this.currentSession = session;
    localStorage.setItem('auth_session', JSON.stringify(session));

    return session;
  }
}
