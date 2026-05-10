import { useState, useEffect } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { Job } from '../../domain/entities/Job';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const getAllJobsUseCase = Container.getGetAllJobsUseCase();
      const allJobs = await getAllJobsUseCase.execute();
      setJobs(allJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const getJobById = async (jobId: string): Promise<Job | null> => {
    try {
      const getJobByIdUseCase = Container.getGetJobByIdUseCase();
      return await getJobByIdUseCase.execute(jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
      return null;
    }
  };

  const getMatchingJobs = async (candidateId: string): Promise<Job[]> => {
    try {
      setLoading(true);
      setError(null);
      const getMatchingJobsUseCase = Container.getGetMatchingJobsUseCase();
      const matchedJobs = await getMatchingJobsUseCase.execute(candidateId);
      setJobs(matchedJobs);
      return matchedJobs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matching jobs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'postedDate'>): Promise<Job | null> => {
    try {
      const createJobUseCase = Container.getCreateJobUseCase();
      const newJob = await createJobUseCase.execute(jobData);
      setJobs(prevJobs => [newJob, ...prevJobs]);
      return newJob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      return null;
    }
  };

  return {
    jobs,
    loading,
    error,
    loadJobs,
    getJobById,
    getMatchingJobs,
    createJob,
  };
}
