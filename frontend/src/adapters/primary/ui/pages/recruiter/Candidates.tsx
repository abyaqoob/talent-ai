import { motion } from 'motion/react';
import { Search, Filter, User, MapPin, Briefcase, Mail, Phone, Star, Code, Palette, Rocket, Zap, Cloud, FlaskConical } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  title: string;
  location: string;
  experience: string;
  skills: string[];
  match: number;
  icon: LucideIcon;
  email: string;
  phone: string;
  status: 'active' | 'interviewing' | 'hired' | 'rejected';
}

const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    experience: '5 years',
    skills: ['React', 'TypeScript', 'Tailwind'],
    match: 95,
    icon: Code,
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Product Designer',
    location: 'New York, NY',
    experience: '4 years',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    match: 92,
    icon: Palette,
    email: 'michael.c@example.com',
    phone: '+1 (555) 234-5678',
    status: 'interviewing',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Full Stack Engineer',
    location: 'Austin, TX',
    experience: '6 years',
    skills: ['Node.js', 'React', 'PostgreSQL'],
    match: 88,
    icon: Rocket,
    email: 'emily.r@example.com',
    phone: '+1 (555) 345-6789',
    status: 'active',
  },
  {
    id: 4,
    name: 'David Kim',
    title: 'Backend Developer',
    location: 'Seattle, WA',
    experience: '3 years',
    skills: ['Python', 'Django', 'AWS'],
    match: 85,
    icon: Zap,
    email: 'david.k@example.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    title: 'DevOps Engineer',
    location: 'Boston, MA',
    experience: '7 years',
    skills: ['Kubernetes', 'Docker', 'CI/CD'],
    match: 90,
    icon: Cloud,
    email: 'lisa.a@example.com',
    phone: '+1 (555) 567-8901',
    status: 'hired',
  },
  {
    id: 6,
    name: 'James Wilson',
    title: 'Data Scientist',
    location: 'Chicago, IL',
    experience: '4 years',
    skills: ['Python', 'TensorFlow', 'SQL'],
    match: 87,
    icon: FlaskConical,
    email: 'james.w@example.com',
    phone: '+1 (555) 678-9012',
    status: 'active',
  },
];

const statusColors = {
  active: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981', border: '#10B981' },
  interviewing: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6', border: '#3B82F6' },
  hired: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8B5CF6', border: '#8B5CF6' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', border: '#EF4444' },
};

export default function Candidates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || candidate.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

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
            Candidates
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Browse and manage candidate profiles
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search candidates by name, role, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'interviewing', 'hired'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className="px-4 py-3 rounded-xl text-sm capitalize transition-all duration-150"
                style={{
                  background: selectedStatus === status ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  border: selectedStatus === status ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  color: selectedStatus === status ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="p-6 rounded-2xl transition-all duration-150 hover:-translate-y-1"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
                >
                  <candidate.icon className="w-7 h-7" style={{ color: '#047857' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg mb-0.5 truncate" title={candidate.name} style={{ color: 'var(--text-primary)' }}>
                    {candidate.name}
                  </h3>
                  <p className="text-sm truncate" title={candidate.title} style={{ color: 'var(--text-secondary)' }}>
                    {candidate.title}
                  </p>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs shrink-0"
                  style={{
                    background: statusColors[candidate.status].bg,
                    color: statusColors[candidate.status].text,
                    border: `1px solid ${statusColors[candidate.status].border}`,
                  }}
                >
                  {candidate.status}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-xs truncate" title={candidate.location} style={{ color: 'var(--text-secondary)' }}>
                    {candidate.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {candidate.experience}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-xs truncate" title={candidate.email} style={{ color: 'var(--text-secondary)' }}>
                    {candidate.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {candidate.phone}
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Match Score
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" style={{ color: 'var(--accent-primary)', fill: 'var(--accent-primary)' }} />
                    <span className="text-sm" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {candidate.match}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${candidate.match}%`,
                      background: 'var(--gradient-primary)',
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="gradient" className="flex-1 shadow-[var(--shadow-glow)]">
                  View Profile
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4" />
                  Message
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <User className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>
              No candidates found matching your filters
            </p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
