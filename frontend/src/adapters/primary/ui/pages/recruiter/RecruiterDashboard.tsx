import { motion } from 'motion/react';
import { Briefcase, Users, UserCheck, TrendingUp, Eye, PlusCircle } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Link } from 'react-router';

const stats = [
  { value: '8', label: 'Active Jobs', icon: Briefcase, trend: '+2 this month' },
  { value: '142', label: 'Total Applicants', icon: Users, trend: '+24 this week' },
  { value: '37', label: 'Shortlisted', icon: UserCheck, trend: '8 new' },
  { value: '84%', label: 'Avg Match Score', icon: TrendingUp, trend: '+3% this month' },
];

const recentApplications = [
  {
    id: 1,
    candidateId: '#041',
    jobTitle: 'Senior Frontend Developer',
    match: 92,
    appliedDate: '2 hours ago',
    status: 'new',
  },
  {
    id: 2,
    candidateId: '#038',
    jobTitle: 'Product Designer',
    match: 88,
    appliedDate: '5 hours ago',
    status: 'new',
  },
  {
    id: 3,
    candidateId: '#035',
    jobTitle: 'Full Stack Engineer',
    match: 85,
    appliedDate: '1 day ago',
    status: 'reviewed',
  },
];

const activeJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    applicants: 14,
    shortlisted: 5,
    posted: '2 days ago',
  },
  {
    id: 2,
    title: 'Product Designer',
    applicants: 8,
    shortlisted: 2,
    posted: '1 week ago',
  },
  {
    id: 3,
    title: 'Full Stack Engineer',
    applicants: 21,
    shortlisted: 7,
    posted: '3 days ago',
  },
];

export default function RecruiterDashboard() {
  return (
    <AppLayout sidebarType="recruiter" userName="Sarah Johnson" userType="Recruiter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1
            className="text-3xl mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Welcome back, Sarah 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tuesday, April 14, 2026
          </p>
        </div>
        <Link to="/recruiter/post-job">
          <Button variant="gradient" size="lg" className="shadow-[var(--shadow-glow)]">
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="p-6 rounded-2xl"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div
                  className="text-3xl mb-1"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
                >
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
              <div
                className="p-2 rounded-lg"
                style={{ background: 'var(--gradient-radial-subtle)', border: '1px solid var(--border-accent)' }}
              >
                <stat.icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <TrendingUp className="w-3 h-3" />
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2
              className="text-2xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Recent Applications
            </h2>
            <Link to="/recruiter/jobs" className="text-sm hover:underline" style={{ color: 'var(--accent-primary)' }}>
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 rounded-2xl transition-all duration-200 group"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>
                        Candidate {application.candidateId}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{
                          background: application.status === 'new' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                          color: application.status === 'new' ? 'var(--success)' : 'var(--accent-primary)',
                        }}
                      >
                        {application.status === 'new' ? 'New' : 'Reviewed'}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {application.jobTitle}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-sm shrink-0"
                    style={{
                      background: 'var(--gradient-radial-subtle)',
                      color: 'var(--accent-secondary)',
                      fontFamily: 'var(--font-mono)',
                      border: '1px solid var(--border-accent)',
                    }}
                  >
                    {application.match}% Match
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Applied {application.appliedDate}
                  </span>
                  <Button variant="gradient-subtle" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4" />
                    View Profile
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Jobs Sidebar */}
        <div>
          <div className="mb-6">
            <h2
              className="text-2xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Active Jobs
            </h2>
          </div>

          <div className="space-y-4">
            {activeJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="p-5 rounded-2xl"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h4 className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  {job.title}
                </h4>
                <div className="space-y-2 mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex justify-between">
                    <span>Applicants</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{job.applicants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shortlisted</span>
                    <span style={{ color: 'var(--success)' }}>{job.shortlisted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posted</span>
                    <span>{job.posted}</span>
                  </div>
                </div>
                <Link to={`/recruiter/jobs/${job.id}/pipeline`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Pipeline
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
