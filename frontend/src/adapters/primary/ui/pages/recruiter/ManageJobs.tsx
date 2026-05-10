import { motion } from 'motion/react';
import { PlusCircle, Edit, Eye, XCircle } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Link } from 'react-router';
import { useState } from 'react';

const jobsData = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    posted: 'Mar 1, 2026',
    applicants: 14,
    status: 'active',
  },
  {
    id: 2,
    title: 'Product Designer',
    posted: 'Feb 28, 2026',
    applicants: 8,
    status: 'active',
  },
  {
    id: 3,
    title: 'Full Stack Engineer',
    posted: 'Mar 5, 2026',
    applicants: 21,
    status: 'active',
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    posted: 'Feb 15, 2026',
    applicants: 6,
    status: 'active',
  },
  {
    id: 5,
    title: 'Backend Developer',
    posted: 'Feb 10, 2026',
    applicants: 12,
    status: 'closed',
  },
];

export default function ManageJobs() {
  const [filter, setFilter] = useState('all');

  const filteredJobs = filter === 'all'
    ? jobsData
    : jobsData.filter(job => job.status === filter);

  return (
    <AppLayout showBackButton sidebarType="recruiter" userName="Sarah Johnson" userType="Recruiter">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <h1
            className="text-4xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Your Job Postings
          </h1>
          <Link to="/recruiter/post-job">
            <Button variant="gradient" size="lg" className="shadow-[var(--shadow-glow)]">
              <PlusCircle className="w-4 h-4" />
              Post New Job
            </Button>
          </Link>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'closed', label: 'Closed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="px-4 py-2 rounded-full text-sm transition-all duration-200"
              style={{
                background: filter === tab.id ? 'var(--gradient-radial-subtle)' : 'transparent',
                border: filter === tab.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                color: filter === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th className="text-left p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Job Title
                </th>
                <th className="text-left p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Posted Date
                </th>
                <th className="text-left p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Applicants
                </th>
                <th className="text-left p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </th>
                <th className="text-left p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, index) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="transition-all duration-150"
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    opacity: job.status === 'closed' ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td className="p-4">
                    <span className="block truncate max-w-xs" style={{ color: 'var(--text-primary)' }}>
                      {job.title}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                      {job.posted}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/recruiter/jobs/${job.id}/pipeline`}
                      className="text-sm hover:underline whitespace-nowrap"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {job.applicants} Applicants
                    </Link>
                  </td>
                  <td className="p-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs inline-block whitespace-nowrap"
                      style={{
                        background: job.status === 'active'
                          ? 'rgba(16, 185, 129, 0.12)'
                          : 'rgba(100, 100, 100, 0.12)',
                        color: job.status === 'active' ? 'var(--success)' : 'var(--text-muted)',
                      }}
                    >
                      {job.status === 'active' ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        className="text-sm hover:underline flex items-center gap-1 whitespace-nowrap"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <span style={{ color: 'var(--text-muted)' }}>·</span>
                      <Link
                        to={`/recruiter/jobs/${job.id}/pipeline`}
                        className="text-sm hover:underline flex items-center gap-1 whitespace-nowrap"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Eye className="w-3 h-3" />
                        Pipeline
                      </Link>
                      {job.status === 'active' && (
                        <>
                          <span style={{ color: 'var(--text-muted)' }}>·</span>
                          <button
                            className="text-sm hover:underline flex items-center gap-1 whitespace-nowrap"
                            style={{ color: 'var(--danger)' }}
                          >
                            <XCircle className="w-3 h-3" />
                            Close
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </AppLayout>
  );
}
