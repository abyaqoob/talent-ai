import { motion } from 'motion/react';
import { Users, ArrowLeft, User, Mail, MapPin, Briefcase, Calendar, ChevronDown } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { apiClient } from '@/infrastructure/api/apiClient';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';

const STATUS_OPTIONS = ['applied', 'screening', 'under_review', 'interviewing', 'shortlisted', 'offered', 'hired', 'rejected'];
const STATUS_COLORS: Record<string, string> = {
  applied: '#3B82F6', screening: '#8B5CF6', under_review: '#F59E0B',
  interviewing: '#10B981', shortlisted: '#059669', offered: '#047857',
  hired: '#15803D', rejected: '#EF4444',
};

export default function CandidatePipeline() {
  const { jobId } = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) loadPipeline(jobId);
  }, [jobId]);

  const loadPipeline = async (id: string) => {
    setLoading(true);
    try {
      // GET /api/jobs/:id → get job title
      const job = await apiClient.get<any>(`/jobs/${id}`);
      setJobTitle(job?.title || 'Job');

      // GET /api/jobs/:id/applications → get all applicants
      const apps = await apiClient.get<any[]>(`/jobs/${id}/applications`);
      setApplications(Array.isArray(apps) ? apps : []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId: string, newStatus: string) => {
    setUpdatingId(applicationId);
    try {
      await apiClient.patch(`/applications/${applicationId}/status`, { status: newStatus });
      setApplications(prev =>
        prev.map(a => (a._id || a.id) === applicationId ? { ...a, status: newStatus } : a)
      );
    } catch (e: any) {
      alert(e?.message || 'Failed to update');
    } finally {
      setUpdatingId(null);
    }
  };

  const COLUMNS = [
    { id: 'applied', label: 'Applied' },
    { id: 'screening', label: 'Screening' },
    { id: 'interviewing', label: 'Interviewing' },
    { id: 'offered', label: 'Offered' },
    { id: 'hired', label: 'Hired' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const getForStatus = (status: string) =>
    applications.filter(a => a.status === status);

  return (
    <AppLayout sidebarType="recruiter">
      <div className="max-w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-4">
          <Link to="/recruiter/jobs" className="p-2 rounded-lg transition-all" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {loading ? 'Loading…' : jobTitle}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Candidate Pipeline · {applications.length} total applicant{applications.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(c => (
              <div key={c.id} className="flex-1 min-w-[240px] animate-pulse">
                <div className="h-3 rounded mb-4" style={{ background: 'var(--bg-tertiary)', width: '60%' }} />
                <div className="h-24 rounded-xl" style={{ background: 'var(--bg-secondary)' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-6" style={{ minHeight: '400px' }}>
            {COLUMNS.map(column => {
              const colApps = getForStatus(column.id);
              const color = STATUS_COLORS[column.id] || '#999';
              return (
                <div key={column.id} className="flex-1 min-w-[240px]">
                  <div className="mb-3">
                    <div className="h-1 rounded-full mb-2" style={{ background: color }} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{column.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
                        {colApps.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {colApps.map(app => {
                      const c = app.candidate;
                      const initials = c?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '?';
                      const appId = app._id || app.id;
                      return (
                        <motion.div key={appId} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }} className="p-4 rounded-xl"
                          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden text-white text-sm font-semibold border border-[var(--border-subtle)]"
                              style={{ background: 'var(--bg-secondary)' }}>
                              {c?.profilePicture ? (
                                <img src={c.profilePicture} alt={c.name} className="w-full h-full object-cover" />
                              ) : (
                                initials
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c?.name || 'Unknown'}</p>
                              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{c?.email || ''}</p>
                            </div>
                          </div>
                          {c?.profile?.skills?.slice(0, 3).map((s: string) => (
                            <span key={s} className="inline-block mr-1 mb-1 px-2 py-0.5 rounded-full text-xs"
                              style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--accent-primary)' }}>{s}</span>
                          ))}
                          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                            <select value={app.status} onChange={e => updateStatus(appId, e.target.value)}
                              disabled={updatingId === appId}
                              className="w-full px-2 py-1.5 rounded-lg text-xs focus:outline-none capitalize"
                              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                          </div>
                        </motion.div>
                      );
                    })}
                    {colApps.length === 0 && (
                      <div className="p-6 rounded-xl text-center text-xs" style={{ border: '2px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
