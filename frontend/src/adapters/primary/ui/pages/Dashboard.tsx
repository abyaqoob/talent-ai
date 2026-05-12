import { motion } from 'motion/react';
import {
  Upload, TrendingUp, Briefcase, MapPin, Clock,
  ArrowUpRight, ClipboardList, MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { useApplications } from '@/presentation/hooks/useApplications';
import { useAuth } from '@/presentation/hooks/useAuth';
import { apiClient } from '@/infrastructure/api/apiClient';
import { mapBackendJobToFrontend } from '@/infrastructure/repositories/ApiJobRepository';
import { Job } from '@/domain/entities/Job';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const { applications, loading: appsLoading, loadApplications } = useApplications();
  const [recJobs, setRecJobs] = useState<(Job & { matchScore?: number; matchReason?: string })[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [todayDate] = useState(
    new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  );

  useEffect(() => {
    if (user?.id) {
      loadApplications(user.id);
      loadRecommendedJobs();
    }
  }, [user?.id]);

  const loadRecommendedJobs = async () => {
    setJobsLoading(true);
    try {
      // GET /api/jobs/recommended → [{ job: {...}, matchScore, matchReason }]
      const data = await apiClient.get<any>('/jobs/recommended');
      const arr = Array.isArray(data) ? data : [];
      const mapped = arr.map((item: any) => {
        const jobRaw = item.job || item;
        const j = mapBackendJobToFrontend(jobRaw);
        return { ...j, matchScore: item.matchScore ?? j.matchScore, matchReason: item.matchReason };
      });
      setRecJobs(mapped);
    } catch {
      // If no CV uploaded yet, fall back to all jobs
      try {
        const all = await apiClient.get<any[]>('/jobs');
        const arr = Array.isArray(all) ? all : [];
        setRecJobs(arr.slice(0, 4).map(mapBackendJobToFrontend));
      } catch { setRecJobs([]); }
    } finally {
      setJobsLoading(false);
    }
  };

  const activeApps = applications.filter(a => !['rejected'].includes(a.status)).length;
  const firstName = user?.name?.split(' ')[0] || 'there';

  const stats = [
    { value: String(activeApps), label: 'Active Applications', icon: ClipboardList, trend: 'From your applications' },
    { value: String(recJobs.length), label: 'AI-Matched Jobs', icon: Briefcase, trend: 'Based on your CV' },
    { value: String(applications.filter(a => a.status === 'interviewing').length), label: 'Interviews', icon: MessageSquare, trend: 'Scheduled' },
    { value: String(applications.length), label: 'Total Applied', icon: TrendingUp, trend: 'All time' },
  ];

  return (
    <AppLayout sidebarType="candidate">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{todayDate}</p>
        </div>
        <Link to="/cv-upload">
          <Button variant="gradient" size="lg" className="shadow-[var(--shadow-glow)]">
            <Upload className="w-4 h-4" />Upload New CV
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }} className="p-6 rounded-2xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-3xl mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {(appsLoading || jobsLoading) ? '…' : stat.value}
                </div>
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

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              AI-Recommended Jobs
            </h2>
            <Link to="/jobs" className="text-sm hover:underline" style={{ color: 'var(--accent-primary)' }}>View all</Link>
          </div>

          {jobsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-6 rounded-2xl animate-pulse" style={{ background: 'var(--bg-secondary)', height: '120px' }}>
                  <div className="h-4 rounded mb-3" style={{ background: 'var(--bg-tertiary)', width: '60%' }} />
                  <div className="h-3 rounded" style={{ background: 'var(--bg-tertiary)', width: '80%' }} />
                </div>
              ))}
            </div>
          ) : recJobs.length === 0 ? (
            <div className="p-12 rounded-2xl text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <Briefcase className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Upload your CV to get AI-matched job recommendations</p>
              <Link to="/cv-upload" className="inline-block mt-4">
                <Button variant="gradient">Upload CV</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recJobs.map((job, index) => (
                <Link key={job.id} to={`/jobs/${job.id}`}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }} whileHover={{ y: -2 }}
                    className="p-6 rounded-2xl cursor-pointer group"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}>
                        <job.icon className="w-6 h-6" style={{ color: '#047857' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base mb-0.5 truncate font-semibold" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                            <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{job.company}</p>
                          </div>
                          {job.matchScore !== undefined && (
                            <div className="px-3 py-1 rounded-full text-sm shrink-0"
                              style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-accent)' }}>
                              {job.matchScore <= 1 ? Math.round(job.matchScore * 100) : job.matchScore}% Match
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="px-3 py-1 rounded-full text-xs"
                              style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <Button variant="gradient-subtle" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View & Apply →
                      </Button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Applications */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>Recent Applications</h3>
              <Link to="/applications" className="text-xs hover:underline" style={{ color: 'var(--accent-primary)' }}>View all</Link>
            </div>
            {appsLoading ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
            ) : applications.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No applications yet. Start applying!</p>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 3).map(app => (
                  <div key={app.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm truncate max-w-[160px]" style={{ color: 'var(--text-primary)' }}>
                        {typeof app.jobId === 'object' ? (app.jobId.title || 'Unknown Position') : (app.jobId.slice(0, 16) + '…')}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs capitalize"
                      style={{ background: app.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(5,150,105,0.1)', color: app.status === 'rejected' ? 'var(--danger)' : 'var(--accent-primary)' }}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Tip */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-accent)' }}>
            <h3 className="text-lg mb-3" style={{ color: 'var(--text-primary)' }}>Get Better Matches</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Upload your CV and let AI match you to the best jobs instantly.
            </p>
            <Link to="/cv-upload">
              <Button variant="gradient" size="sm" className="w-full shadow-[var(--shadow-glow)]">Upload CV</Button>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}