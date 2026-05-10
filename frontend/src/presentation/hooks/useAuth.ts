import { useState, useEffect } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { AuthSession, LoginCredentials, RegisterData } from '../../domain/repositories/IAuthRepository';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const getCurrentUserUseCase = Container.getCurrentUserUseCase();
        const currentSession = await getCurrentUserUseCase.execute();
        setSession(currentSession);
      } catch (error) {
        console.error('Failed to load session:', error);
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
    return newSession;
  };

  const register = async (data: RegisterData) => {
    const registerUseCase = Container.getRegisterUseCase();
    const newSession = await registerUseCase.execute(data);
    setSession(newSession);
    return newSession;
  };

  const logout = async () => {
    const logoutUseCase = Container.getLogoutUseCase();
    await logoutUseCase.execute();
    setSession(null);
  };

  return {
    session,
    user: session?.user,
    isAuthenticated: !!session,
    loading,
    login,
    register,
    logout,
  };
}
