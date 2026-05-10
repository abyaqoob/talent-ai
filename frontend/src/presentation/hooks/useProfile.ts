import { useState, useEffect } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { User, Candidate, Recruiter } from '../../domain/entities/User';

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<User | Candidate | Recruiter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadProfile(userId);
    }
  }, [userId]);

  const loadProfile = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);
      const getUserProfileUseCase = Container.getGetUserProfileUseCase();
      const userProfile = await getUserProfileUseCase.execute(uid);
      setProfile(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    loadProfile,
  };
}
