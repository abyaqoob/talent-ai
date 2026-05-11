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
          // Fallback to cached user if session is missing but user is cached (though token is needed usually)
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
    localStorage.removeItem('auth_session'); // also clear this just in case
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
