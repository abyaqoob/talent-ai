import { useState, useEffect } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { JobApplication, ApplicationStatus } from '../../domain/entities/Job';

export function useApplications(candidateId?: string) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (candidateId) {
      loadApplications(candidateId);
    }
  }, [candidateId]);

  const loadApplications = async (candId: string) => {
    try {
      setLoading(true);
      setError(null);
      const useCase = Container.getGetCandidateApplicationsUseCase();
      const apps = await useCase.execute(candId);
      setApplications(apps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Fix: ApplyToJobUseCase.execute() takes a DTO object
  const applyToJob = async (
    candidateId: string,
    jobId: string,
    coverLetter?: string
  ): Promise<JobApplication | null> => {
    try {
      setError(null);
      const useCase = Container.getApplyToJobUseCase();
      const newApp = await useCase.execute({ candidateId, jobId, coverLetter });
      setApplications(prev => [newApp, ...prev]);
      return newApp;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply to job');
      return null;
    }
  };

  // Fix: UpdateApplicationStatusUseCase.execute() takes (id, status) — no notes param
  const updateApplicationStatus = async (
    applicationId: string,
    status: ApplicationStatus
  ): Promise<JobApplication | null> => {
    try {
      setError(null);
      const useCase = Container.getUpdateApplicationStatusUseCase();
      const updated = await useCase.execute(applicationId, status);
      setApplications(prev =>
        prev.map(app => (app.id === applicationId ? updated : app))
      );
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      return null;
    }
  };

  return {
    applications,
    loading,
    error,
    setError,
    loadApplications,
    applyToJob,
    updateApplicationStatus,
  };
}
