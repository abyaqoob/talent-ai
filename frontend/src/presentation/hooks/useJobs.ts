import { useState, useEffect } from 'react';
import { Container } from '../../infrastructure/di/Container';
import { Job } from '../../domain/entities/Job';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const allJobs = await Container.getGetAllJobsUseCase().execute();
      // BUG 5 fix: deduplicate by id/_id to guard against test data duplicates
      const unique = Array.from(
        new Map(allJobs.map((j: any) => [j._id || j.id, j])).values()
      ) as Job[];
      setJobs(unique);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const getJobById = async (jobId: string): Promise<Job | null> => {
    try {
      return await Container.getGetJobByIdUseCase().execute(jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
      return null;
    }
  };

  const getMatchingJobs = async (candidateId: string): Promise<Job[]> => {
    try {
      setLoading(true);
      setError(null);
      const matched = await Container.getGetMatchingJobsUseCase().execute(candidateId);
      setJobs(matched);
      return matched;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matching jobs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getRecruiterJobs = async (): Promise<Job[]> => {
    try {
      setLoading(true);
      setError(null);
      const recruiterJobs = await Container.getJobRepository().findByRecruiterId('me');
      setJobs(recruiterJobs);
      return recruiterJobs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your jobs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'postedDate'>): Promise<Job | null> => {
    try {
      setError(null);
      const newJob = await Container.getCreateJobUseCase().execute(jobData);
      setJobs(prev => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      return null;
    }
  };

  const deleteJob = async (jobId: string): Promise<boolean> => {
    try {
      setError(null);
      await Container.getJobRepository().delete(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
      return false;
    }
  };

  return {
    jobs,
    loading,
    error,
    setError,
    loadJobs,
    getJobById,
    getMatchingJobs,
    getRecruiterJobs,
    createJob,
    deleteJob,
  };
}
