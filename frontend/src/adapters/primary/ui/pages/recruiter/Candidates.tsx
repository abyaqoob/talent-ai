import { motion } from 'motion/react';
import { Search, User, MapPin, Briefcase, Mail, Star } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { useState, useEffect } from 'react';
import { apiClient } from '@/infrastructure/api/apiClient';
import { Link } from 'react-router';

interface CandidateApplication {
  id: string;
  status: string;
  appliedAt?: string;
  job?: { title?: string; _id?: string };
  candidate?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    profile?: {
      skills?: string[];
      about?: string;
      yearsOfExperience?: number;
      experience?: any[];
    };
  };
}

const STATUS_OPTIONS = ['applied', 'screening', 'under_review', 'interviewing', 'shortlisted', 'offered', 'hired', 'rejected'];

const STATUS_COLORS: Record<string, string> = {
  applied: '#3B82F6',
  screening: '#8B5CF6',
  under_review: '#F59E0B',
  interviewing: '#10B981',
  shortlisted: '#059669',
  offered: '#047857',
  hired: '#15803D',
  rejected: '#EF4444',
};

export default function Candidates() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { loadApplications(); }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      // GET /api/applications/recruiter/all → all applications with candidate populated
      const data = await apiClient.get<any[]>('/applications/recruiter/all');
      setApplications(Array.isArray(data) ? data : []);
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
        prev.map(a => a.id === applicationId ? { ...a, status: newStatus } : a)
      );
    } catch (e: any) {
      alert(e?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter(app => {
    const name = app.candidate?.name?.toLowerCase() || '';
    const email = app.candidate?.email?.toLowerCase() || '';
    const skills = (app.candidate?.profile?.skills || []).join(' ').toLowerCase();
    const matchesSearch = !search || name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) || skills.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout sidebarType="recruiter" showBackButton>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Candidates</h1>
            <span className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(5,150,105,0.12)', color: 'var(--accent-primary)' }}>
              {filtered.length} total
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and review all candidate applications</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or skill..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm focus:outline-none capitalize"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-6 rounded-2xl animate-pulse" style={{ background: 'var(--bg-secondary)', height: '100px' }}>
                <div className="h-4 rounded mb-3" style={{ background: 'var(--bg-tertiary)', width: '40%' }} />
                <div className="h-3 rounded" style={{ background: 'var(--bg-tertiary)', width: '60%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <User className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No candidates yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Post jobs and wait for candidates to apply</p>
          </div>
        )}

        {/* Candidate Cards */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((app, index) => {
              const candidate = app.candidate;
              if (!candidate) return null;
              const skills = candidate.profile?.skills || [];
              const initials = candidate.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
              const statusColor = STATUS_COLORS[app.status] || '#999';

              return (
                <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="p-6 rounded-2xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white font-semibold"
                        style={{ background: 'linear-gradient(135deg,#047857,#059669)' }}>
                        {initials || <User className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{candidate.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-xs capitalize"
                            style={{ background: `${statusColor}20`, color: statusColor }}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{candidate.email}</span>
                          {candidate.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{candidate.location}</span>}
                          {candidate.profile?.yearsOfExperience && (
                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{candidate.profile.yearsOfExperience} yrs exp</span>
                          )}
                        </div>
                        {app.job?.title && (
                          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Applied for: <strong style={{ color: 'var(--accent-primary)' }}>{app.job.title}</strong></p>
                        )}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {skills.slice(0, 5).map(skill => (
                              <span key={skill} className="px-2 py-0.5 rounded-full text-xs"
                                style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--accent-primary)' }}>{skill}</span>
                            ))}
                            {skills.length > 5 && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>+{skills.length - 5} more</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <select
                        value={app.status}
                        onChange={e => updateStatus(app.id, e.target.value)}
                        disabled={updatingId === app.id}
                        className="px-3 py-2 rounded-lg text-sm focus:outline-none capitalize disabled:opacity-50"
                        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', minWidth: '160px' }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                      {candidate.id && (
                        <Link to={`/recruiter/candidates/${candidate.id}`}
                          className="px-3 py-2 rounded-lg text-sm text-center transition-all"
                          style={{ background: 'var(--accent-primary)', color: 'white' }}>
                          View Profile
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
