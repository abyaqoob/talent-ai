import { motion } from 'motion/react';
import { PlusCircle, Edit, Eye, XCircle, RefreshCw } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useJobs } from '@/presentation/hooks/useJobs';
import { Job } from '@/domain/entities/Job';

export default function ManageJobs() {
  const [filter, setFilter] = useState('all');
  const { jobs, loading, error, getRecruiterJobs, deleteJob } = useJobs();
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { getRecruiterJobs(); }, []);

  const filtered = filter === 'all' ? jobs : jobs.filter(j => (filter === 'active' ? j.isActive : !j.isActive));

  const handleClose = async (jobId: string) => {
    if (!confirm('Close this job posting?')) return;
    setDeleting(jobId);
    await deleteJob(jobId);
    setDeleting(null);
  };

  const postedDate = (job: Job) => new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <AppLayout showBackButton sidebarType="recruiter">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Your Job Postings</h1>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={getRecruiterJobs} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></Button>
            <Link to="/recruiter/post-job">
              <Button variant="gradient" size="lg" className="shadow-[var(--shadow-glow)]"><PlusCircle className="w-4 h-4" />Post New Job</Button>
            </Link>
          </div>
        </motion.div>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>{error}</div>}

        {/* Filter Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex gap-2 mb-8">
          {['all', 'active', 'closed'].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} className="px-4 py-2 rounded-full text-sm capitalize transition-all duration-200"
              style={{ background: filter === tab ? 'var(--gradient-radial-subtle)' : 'transparent', border: filter === tab ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)', color: filter === tab ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          {loading ? (
            <div className="p-8 space-y-4">{[1,2,3].map(i => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No jobs found. {filter !== 'all' ? 'Try a different filter.' : 'Post your first job!'}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Job Title','Posted Date','Status','Actions'].map(h => (
                    <th key={h} className="text-left p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, index) => (
                  <motion.tr key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="transition-all duration-150"
                    style={{ borderBottom: '1px solid var(--border-subtle)', opacity: !job.isActive ? 0.6 : 1 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="p-4">
                      <span className="block truncate max-w-xs" style={{ color: 'var(--text-primary)' }}>{job.title}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{job.location}</span>
                    </td>
                    <td className="p-4"><span className="text-sm whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{postedDate(job)}</span></td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs inline-block whitespace-nowrap"
                        style={{ background: job.isActive ? 'rgba(16,185,129,0.12)' : 'rgba(100,100,100,0.12)', color: job.isActive ? 'var(--success)' : 'var(--text-muted)' }}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/recruiter/jobs/${job.id}/pipeline`} className="text-sm hover:underline flex items-center gap-1 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                          <Eye className="w-3 h-3" />Pipeline
                        </Link>
                        {job.isActive && (
                          <button onClick={() => handleClose(job.id)} disabled={deleting === job.id}
                            className="text-sm hover:underline flex items-center gap-1 whitespace-nowrap disabled:opacity-50"
                            style={{ color: 'var(--danger)' }}>
                            <XCircle className="w-3 h-3" />{deleting === job.id ? 'Closing…' : 'Close'}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
