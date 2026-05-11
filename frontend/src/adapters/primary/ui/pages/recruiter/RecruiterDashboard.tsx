import { motion } from 'motion/react';
import { Briefcase, Users, TrendingUp, Eye, PlusCircle, ArrowUpRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect } from 'react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useJobs } from '@/presentation/hooks/useJobs';
import { useAuth } from '@/presentation/hooks/useAuth';
import { apiClient } from '@/infrastructure/api/apiClient';
import { useState } from 'react';

interface Analytics {
  totalJobs?: number;
  totalApplications?: number;
  totalViews?: number;
  acceptanceRate?: number;
  recentApplications?: Array<{ candidate?: string; job?: string; status?: string; date?: string }>;
}

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { jobs, loading: jobsLoading, getRecruiterJobs } = useJobs();
  const [analytics, setAnalytics] = useState<Analytics>({});
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    getRecruiterJobs();
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await apiClient.get<any>('/recruiter/analytics');
      setAnalytics(data || {});
    } catch {
      setAnalytics({});
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'Recruiter';
  const activeJobs = jobs.filter(j => j.isActive).length;

  const stats = [
    { label: 'Active Jobs', value: analyticsLoading ? '…' : String(analytics.totalJobs ?? activeJobs), icon: Briefcase, trend: 'Across all postings' },
    { label: 'Total Applications', value: analyticsLoading ? '…' : String(analytics.totalApplications ?? 0), icon: Users, trend: 'All time' },
    { label: 'Profile Views', value: analyticsLoading ? '…' : String(analytics.totalViews ?? 0), icon: Eye, trend: 'This month' },
    { label: 'Accept Rate', value: analyticsLoading ? '…' : `${analytics.acceptanceRate ?? 0}%`, icon: TrendingUp, trend: 'Of reviewed candidates' },
  ];

  return (
    <AppLayout sidebarType="recruiter">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Welcome, {firstName} 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/recruiter/post-job">
          <Button variant="gradient" size="lg" className="shadow-[var(--shadow-glow)]">
            <PlusCircle className="w-4 h-4" />Post a Job
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-3xl mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'var(--gradient-radial-subtle)', border: '1px solid var(--border-accent)' }}>
                <stat.icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <ArrowUpRight className="w-3 h-3" />{stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Your Job Postings</h2>
            <Link to="/recruiter/manage-jobs" className="text-sm hover:underline" style={{ color: 'var(--accent-primary)' }}>View all</Link>
          </div>
          {jobsLoading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--bg-secondary)' }} />)}</div>
          ) : jobs.length === 0 ? (
            <div className="p-12 rounded-2xl text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <Briefcase className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>No jobs posted yet</p>
              <Link to="/recruiter/post-job"><Button variant="gradient">Post Your First Job</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 4).map((job, i) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                  className="p-6 rounded-2xl flex items-center justify-between"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}>
                      <Briefcase className="w-6 h-6" style={{ color: '#047857' }} />
                    </div>
                    <div>
                      <h3 className="text-base mb-0.5" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{job.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{job.location} • {job.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs" style={{ background: job.isActive ? 'rgba(16,185,129,0.12)' : 'rgba(100,100,100,0.12)', color: job.isActive ? 'var(--success)' : 'var(--text-muted)' }}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                    <Link to={`/recruiter/jobs/${job.id}/pipeline`} className="text-sm hover:underline" style={{ color: 'var(--accent-primary)' }}>View Pipeline</Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div>
          <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Recent Activity</h2>
          <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            {analytics.recentApplications?.length ? (
              <div className="space-y-4">
                {analytics.recentApplications.slice(0, 5).map((app, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(5,150,105,0.1)' }}>
                      <CheckCircle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{app.candidate || 'New applicant'}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{app.job || ''} • {app.status || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recent activity. Post jobs to start receiving applications.</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
