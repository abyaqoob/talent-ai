import { motion } from 'motion/react';
import { TrendingUp, Users, Briefcase, Eye, FileText, CheckCircle, Clock, UserCheck } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';

const stats = [
  {
    label: 'Total Candidates',
    value: '1,247',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
  },
  {
    label: 'Active Jobs',
    value: '23',
    change: '+3',
    trend: 'up',
    icon: Briefcase,
  },
  {
    label: 'Applications',
    value: '856',
    change: '+18.2%',
    trend: 'up',
    icon: FileText,
  },
  {
    label: 'Hired This Month',
    value: '12',
    change: '+4',
    trend: 'up',
    icon: CheckCircle,
  },
];

const recentActivity = [
  { action: 'New application received', job: 'Senior Frontend Developer', time: '2 min ago', icon: FileText },
  { action: 'Candidate moved to Interview', job: 'Product Designer', time: '1 hour ago', icon: UserCheck },
  { action: 'Job posting published', job: 'DevOps Engineer', time: '3 hours ago', icon: Briefcase },
  { action: 'Profile viewed', job: 'Backend Developer', time: '5 hours ago', icon: Eye },
];

const topJobs = [
  { title: 'Senior Frontend Developer', applications: 142, views: 1250, hired: 3 },
  { title: 'Product Designer', applications: 98, views: 876, hired: 2 },
  { title: 'Full Stack Engineer', applications: 156, views: 1432, hired: 4 },
  { title: 'DevOps Engineer', applications: 67, views: 543, hired: 1 },
];

export default function Analytics() {
  return (
    <AppLayout sidebarType="recruiter" showBackButton>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1
            className="text-4xl mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track your hiring performance and insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="p-6 rounded-2xl"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: '#047857' }} />
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10B981',
                  }}
                >
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl mb-1" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-6 rounded-2xl"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h2 className="text-xl" style={{ color: 'var(--text-primary)' }}>
                Recent Activity
              </h2>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(5, 150, 105, 0.1)' }}
                  >
                    <activity.icon className="w-4 h-4" style={{ color: '#047857' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                      {activity.action}
                    </p>
                    <p className="text-xs truncate" title={activity.job} style={{ color: 'var(--text-secondary)' }}>
                      {activity.job}
                    </p>
                  </div>
                  <span className="text-xs shrink-0 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Performing Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="p-6 rounded-2xl"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h2 className="text-xl" style={{ color: 'var(--text-primary)' }}>
                Top Performing Jobs
              </h2>
            </div>
            <div className="space-y-4">
              {topJobs.map((job, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <h3 className="text-sm mb-3 truncate" title={job.title} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {job.title}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                        Applications
                      </div>
                      <div className="text-lg" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {job.applications}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                        Views
                      </div>
                      <div className="text-lg" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {job.views}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                        Hired
                      </div>
                      <div className="text-lg" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {job.hired}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
