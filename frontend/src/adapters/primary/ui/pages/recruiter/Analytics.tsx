import { motion } from 'motion/react';
import { TrendingUp, Users, Briefcase, FileText, CheckCircle, Clock, UserCheck } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { apiClient } from '@/infrastructure/api/apiClient';
import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalCandidates: number;
  activeJobs: number;
  totalApplications: number;
  hiredThisMonth: number;
  topJobs: { id: string; title: string; applications: number; views: number; hired: number }[];
  recentActivity: { type: string; jobTitle: string; time: string | Date }[];
}

function timeAgo(date: string | Date): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // GET /api/recruiter/analytics
      const res = await apiClient.get<any>('/recruiter/analytics');
      setData(res);
    } catch {
      setData({
        totalCandidates: 0,
        activeJobs: 0,
        totalApplications: 0,
        hiredThisMonth: 0,
        topJobs: [],
        recentActivity: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Candidates', value: data?.totalCandidates ?? 0, icon: Users },
    { label: 'Active Jobs', value: data?.activeJobs ?? 0, icon: Briefcase },
    { label: 'Applications', value: data?.totalApplications ?? 0, icon: FileText },
    { label: 'Hired This Month', value: data?.hiredThisMonth ?? 0, icon: CheckCircle },
  ];

  return (
    <AppLayout sidebarType="recruiter" showBackButton>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
          <h1 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your hiring performance and insights</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                  <stat.icon className="w-6 h-6" style={{ color: '#047857' }} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                  <TrendingUp className="w-3 h-3" />Live
                </div>
              </div>
              <div className="text-3xl mb-1" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {loading ? '…' : stat.value}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
            className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h2 className="text-xl" style={{ color: 'var(--text-primary)' }}>Recent Activity</h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />)}
              </div>
            ) : data?.recentActivity?.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No activity yet. Post jobs to start receiving applications.</p>
            ) : (
              <div className="space-y-4">
                {(data?.recentActivity || []).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(5,150,105,0.1)' }}>
                      <UserCheck className="w-4 h-4" style={{ color: '#047857' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{activity.type}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{activity.jobTitle}</p>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {timeAgo(activity.time)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Top Performing Jobs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
            className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h2 className="text-xl" style={{ color: 'var(--text-primary)' }}>Top Performing Jobs</h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />)}
              </div>
            ) : data?.topJobs?.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No job data yet.</p>
            ) : (
              <div className="space-y-4">
                {(data?.topJobs || []).map((job, index) => (
                  <div key={index} className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                    <h3 className="text-sm mb-3 truncate" title={job.title} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{job.title}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[['Applications', job.applications, 'var(--text-primary)'], ['Views', job.views, 'var(--text-primary)'], ['Hired', job.hired, 'var(--accent-primary)']].map(([label, val, color]) => (
                        <div key={label as string}>
                          <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label as string}</div>
                          <div className="text-lg font-semibold" style={{ color: color as string }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
