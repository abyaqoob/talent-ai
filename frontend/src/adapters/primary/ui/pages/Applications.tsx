import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, Eye, LayoutGrid, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { useApplications } from '@/presentation/hooks/useApplications';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useJobs } from '@/presentation/hooks/useJobs';
import { JobApplication } from '@/domain/entities/Job';

const STATUS_COLUMNS = [
  { id: 'applied', title: 'Applied', color: '#059669' },
  { id: 'screening', title: 'Screening', color: '#3B82F6' },
  { id: 'under_review', title: 'Under Review', color: '#F59E0B' },
  { id: 'interviewing', title: 'Interviewing', color: '#8B5CF6' },
  { id: 'shortlisted', title: 'Shortlisted', color: '#10B981' },
  { id: 'offered', title: 'Offered', color: '#059669' },
  { id: 'rejected', title: 'Rejected', color: '#EF4444' },
];

export default function Applications() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const { user } = useAuth();
  const { applications, loading, error, loadApplications } = useApplications();
  const { getJobById } = useJobs();
  const [jobTitles, setJobTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.id) loadApplications(user.id);
  }, [user?.id]);

  // Load job titles for each application
  useEffect(() => {
    const fetchTitles = async () => {
      const titles: Record<string, string> = {};
      const pendingJobIds: string[] = [];

      applications.forEach(app => {
        const jobId = typeof app.jobId === 'object' ? (app.jobId.id || app.jobId._id) : app.jobId;
        
        if (typeof app.jobId === 'object' && app.jobId !== null) {
          const job = app.jobId;
          const companyName = typeof job.company === 'object' ? (job.company.companyName || job.company.name) : job.company;
          titles[jobId] = `${job.title} @ ${companyName}`;
        } else if (jobId) {
          pendingJobIds.push(jobId);
        }
      });

      const uniquePendingIds = [...new Set(pendingJobIds)];
      await Promise.all(
        uniquePendingIds.map(async jobId => {
          try {
            const job = await getJobById(jobId);
            if (job) {
              const companyName = typeof job.company === 'object' ? (job.company.companyName || job.company.name) : job.company;
              titles[jobId] = `${job.title} @ ${companyName}`;
            }
          } catch { /* skip */ }
        })
      );
      setJobTitles(titles);
    };
    if (applications.length > 0) fetchTitles();
  }, [applications]);

  const getAppsForStatus = (status: string) =>
    applications.filter(a => a.status === status);

  const activeCount = applications.filter(a => a.status !== 'rejected').length;

  return (
    <AppLayout showBackButton>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start justify-between gap-4"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
              <h1 className="text-2xl md:text-4xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                My Applications
              </h1>
              <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm" style={{ background: 'rgba(5, 150, 105, 0.12)', color: 'var(--accent-primary)' }}>
                {activeCount} Active
              </span>
            </div>
            <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
              Track and manage all your job applications
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
            <button
              onClick={() => setView('kanban')}
              className="px-3 py-1.5 rounded-md text-sm transition-all duration-150"
              style={{ background: view === 'kanban' ? 'var(--accent-primary)' : 'transparent', color: view === 'kanban' ? 'white' : 'var(--text-secondary)' }}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className="px-3 py-1.5 rounded-md text-sm transition-all duration-150"
              style={{ background: view === 'list' ? 'var(--accent-primary)' : 'transparent', color: view === 'list' ? 'white' : 'var(--text-secondary)' }}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '300px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 min-w-[260px] animate-pulse">
                <div className="h-3 rounded mb-4" style={{ background: 'var(--bg-tertiary)', width: '60%' }} />
                <div className="h-24 rounded-xl" style={{ background: 'var(--bg-secondary)' }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No applications yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Browse jobs and start applying to see your applications here</p>
          </div>
        )}

        {/* Kanban Board */}
        {!loading && applications.length > 0 && view === 'kanban' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0"
            style={{ minHeight: '400px' }}
          >
            {STATUS_COLUMNS.filter(col => getAppsForStatus(col.id).length > 0 || ['applied', 'under_review', 'shortlisted'].includes(col.id)).map(column => (
              <div key={column.id} className="flex-1 min-w-[260px] md:min-w-[280px]">
                <div className="mb-4">
                  <div className="h-1 rounded-full mb-3" style={{ background: column.color }} />
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm" style={{ color: 'var(--text-primary)' }}>{column.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                      {getAppsForStatus(column.id).length}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {getAppsForStatus(column.id).map(app => {
                    const jobId = typeof app.jobId === 'object' ? (app.jobId.id || app.jobId._id) : app.jobId;
                    return (
                      <AppCard key={app.id} app={app} jobTitle={jobTitles[jobId]} columnId={column.id} />
                    );
                  })}
                  {getAppsForStatus(column.id).length === 0 && (
                    <div className="p-8 rounded-xl text-center text-sm" style={{ border: '2px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
                      No applications
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* List View */}
        {!loading && applications.length > 0 && view === 'list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            {applications.map(app => {
              const col = STATUS_COLUMNS.find(c => c.id === app.status);
              const jobId = typeof app.jobId === 'object' ? (app.jobId.id || app.jobId._id) : app.jobId;
              return (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl flex items-center justify-between"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}>
                      <Briefcase className="w-6 h-6" style={{ color: '#047857' }} />
                    </div>
                    <div>
                      <h3 className="text-lg mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {jobTitles[jobId] || `Job ${jobId.slice(0, 8)}…`}
                      </h3>
                      <p className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <Calendar className="w-3 h-3" />
                        Applied {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1.5 rounded-full text-xs capitalize"
                      style={{ background: col ? `${col.color}20` : 'transparent', color: col?.color || 'var(--text-muted)' }}>
                      {app.status.replace('_', ' ')}
                    </span>
                    <Link 
                      to={`/dashboard/job/${jobId}`}
                      className="p-2 rounded-lg transition-colors hover:bg-[rgba(5,150,105,0.1)]"
                      style={{ color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)' }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}

function AppCard({ app, jobTitle, columnId }: { app: JobApplication; jobTitle?: string; columnId: string }) {
  const navigate = useNavigate();
  const jobId = typeof app.jobId === 'object' ? (app.jobId.id || app.jobId._id) : app.jobId;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 rounded-xl group cursor-pointer"
      onClick={() => navigate(`/dashboard/job/${jobId}`)}
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        opacity: columnId === 'rejected' ? 0.6 : 1,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}>
          <Briefcase className="w-5 h-5" style={{ color: '#047857' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>
            {jobTitle || `Job ${jobId.slice(0, 8)}…`}
          </h4>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <Calendar className="w-3 h-3" />
        {new Date(app.appliedDate).toLocaleDateString()}
      </div>
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
          <Eye className="w-3 h-3" />
          View Details
        </div>
      </div>
    </motion.div>
  );
}