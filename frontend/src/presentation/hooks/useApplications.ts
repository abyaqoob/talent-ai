import { useState, useEffect } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { JobApplication, ApplicationStatus } from '../../domain/entities/Job';

export function useApplications(candidateId?: string) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
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
      const getCandidateApplicationsUseCase = Container.getGetCandidateApplicationsUseCase();
      const apps = await getCandidateApplicationsUseCase.execute(candId);
      setApplications(apps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (
    candidateId: string,
    jobId: string,
    coverLetter?: string
  ): Promise<JobApplication | null> => {
    try {
      const applyToJobUseCase = Container.getApplyToJobUseCase();
      const newApplication = await applyToJobUseCase.execute(candidateId, jobId, coverLetter);
      setApplications(prevApps => [newApplication, ...prevApps]);
      return newApplication;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply to job');
      return null;
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: ApplicationStatus,
    notes?: string
  ): Promise<JobApplication | null> => {
    try {
      const updateApplicationStatusUseCase = Container.getUpdateApplicationStatusUseCase();
      const updatedApp = await updateApplicationStatusUseCase.execute(applicationId, status, notes);
      setApplications(prevApps =>
        prevApps.map(app => (app.id === applicationId ? updatedApp : app))
      );
      return updatedApp;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status');
      return null;
    }
  };

  return {
    applications,
    loading,
    error,
    loadApplications,
    applyToJob,
    updateApplicationStatus,
  };
}
