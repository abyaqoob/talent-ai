import React, { createContext, useContext, useState, useEffect } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { AuthSession, LoginCredentials, RegisterData } from '../../domain/repositories/IAuthRepository';

interface AuthContextType {
  session: AuthSession | null;
  user: AuthSession['user'] | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthSession | null>;
  register: (data: RegisterData) => Promise<AuthSession | null>;
  logout: () => Promise<void>;
  updateUserFields: (fields: any) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const cachedUser = localStorage.getItem('user');
        const getCurrentUserUseCase = Container.getCurrentUserUseCase();
        const currentSession = await getCurrentUserUseCase.execute();
        
        if (currentSession) {
          if (cachedUser && !currentSession.user) {
            currentSession.user = JSON.parse(cachedUser);
          }
          setSession(currentSession);
          localStorage.setItem('user', JSON.stringify(currentSession.user));
        } else if (cachedUser) {
          setSession({ user: JSON.parse(cachedUser), token: '' });
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          setSession({ user: JSON.parse(cachedUser), token: '' });
        }
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const loginUseCase = Container.getLoginUseCase();
    const newSession = await loginUseCase.execute(credentials);
    setSession(newSession);
    if (newSession?.user) {
      localStorage.setItem('user', JSON.stringify(newSession.user));
    }
    return newSession;
  };

  const register = async (data: RegisterData) => {
    const registerUseCase = Container.getRegisterUseCase();
    const newSession = await registerUseCase.execute(data);
    setSession(newSession);
    if (newSession?.user) {
      localStorage.setItem('user', JSON.stringify(newSession.user));
    }
    return newSession;
  };

  const logout = async () => {
    const logoutUseCase = Container.getLogoutUseCase();
    await logoutUseCase.execute();
    setSession(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_session');
  };

  const updateUserFields = (fields: any) => {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      const userObj = JSON.parse(cachedUser);
      const updated = { ...userObj, ...fields };
      localStorage.setItem('user', JSON.stringify(updated));
      
      const storedSession = localStorage.getItem('auth_session');
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          parsed.user = { ...parsed.user, ...fields };
          localStorage.setItem('auth_session', JSON.stringify(parsed));
        } catch (e) {
          console.error('Failed to update auth_session:', e);
        }
      }

      setSession(prev => prev ? { ...prev, user: updated } : { user: updated, token: '' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user,
        isAuthenticated: !!session,
        loading,
        login,
        register,
        logout,
        updateUserFields,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
