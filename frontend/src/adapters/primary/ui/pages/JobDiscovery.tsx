import { motion } from 'motion/react';
import { Search, MapPin, Clock, SlidersHorizontal, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { useJobs } from '@/presentation/hooks/useJobs';
import { useAuth } from '@/presentation/hooks/useAuth';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Jobs' },
  { id: 'remote', label: 'Remote' },
  { id: 'Full-Time', label: 'Full-Time' },
  { id: 'Contract', label: 'Contract' },
  { id: 'Part-Time', label: 'Part-Time' },
];

export default function JobDiscovery() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { jobs, loading, error, loadJobs } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const filtered = jobs.filter(job => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'remote' && job.location.toLowerCase().includes('remote')) ||
      job.type === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout sidebarType="candidate">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-4xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Find Your Next Role
          </h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
            Showing <span style={{ color: 'var(--accent-secondary)' }}>{filtered.length} jobs</span> matched to your skills
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6 flex flex-col gap-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Filter Chips + Sort */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {FILTER_OPTIONS.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all duration-200 whitespace-nowrap"
                  style={{
                    background: selectedFilter === filter.id ? 'rgba(5, 150, 105, 0.12)' : 'transparent',
                    border: selectedFilter === filter.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    color: selectedFilter === filter.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden md:inline text-sm">More Filters</span>
              </button>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-6 rounded-2xl animate-pulse" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', height: '220px' }}>
                <div className="h-4 rounded mb-3" style={{ background: 'var(--bg-tertiary)', width: '70%' }} />
                <div className="h-3 rounded mb-2" style={{ background: 'var(--bg-tertiary)', width: '45%' }} />
                <div className="h-3 rounded" style={{ background: 'var(--bg-tertiary)', width: '90%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No jobs found</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Job Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((job, index) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl transition-all duration-200 cursor-pointer group relative"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {/* Company Logo */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
                    >
                      <job.icon className="w-6 h-6" style={{ color: '#047857' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base mb-0.5 truncate" title={job.title} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {job.title}
                      </h3>
                      <p className="text-sm truncate" title={job.company} style={{ color: 'var(--text-secondary)' }}>
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-full text-xs" style={{ background: 'rgba(5, 150, 105, 0.12)', color: 'var(--accent-primary)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{job.salary}</span>
                    {job.matchScore !== undefined && (
                      <span className="text-sm" style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {job.matchScore}% match
                      </span>
                    )}
                    <button
                      className="px-4 py-2 rounded-lg text-sm transition-all duration-150 active:scale-[0.97]"
                      style={{ background: 'var(--accent-primary)', color: 'white' }}
                      onClick={e => { e.preventDefault(); navigate(`/jobs/${job.id}`); }}
                    >
                      View & Apply
                    </button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}