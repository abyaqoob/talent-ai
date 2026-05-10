import { motion } from 'motion/react';
import { GripVertical, Download } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Switch } from '@/adapters/primary/ui/components/base/switch';
import { Label } from '@/adapters/primary/ui/components/base/label';
// Drag and drop removed to avoid conflicts
import { Link, useParams } from 'react-router';
import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/adapters/primary/ui/components/base/breadcrumb';

interface Candidate {
  id: string;
  candidateNumber: string;
  match: number;
  skills: string[];
}

const initialCandidates = {
  new: [
    { id: '1', candidateNumber: '#041', match: 92, skills: ['React', 'TypeScript'] },
    { id: '2', candidateNumber: '#038', match: 88, skills: ['React', 'Node.js'] },
    { id: '3', candidateNumber: '#035', match: 85, skills: ['TypeScript', 'AWS'] },
    { id: '4', candidateNumber: '#032', match: 82, skills: ['React', 'MongoDB'] },
    { id: '5', candidateNumber: '#029', match: 79, skills: ['JavaScript', 'Vue'] },
  ],
  reviewing: [
    { id: '6', candidateNumber: '#027', match: 90, skills: ['React', 'TypeScript'] },
    { id: '7', candidateNumber: '#024', match: 87, skills: ['Node.js', 'Express'] },
    { id: '8', candidateNumber: '#021', match: 84, skills: ['React', 'GraphQL'] },
    { id: '9', candidateNumber: '#018', match: 81, skills: ['Vue', 'TypeScript'] },
  ],
  shortlisted: [
    { id: '10', candidateNumber: '#015', match: 94, skills: ['React', 'TypeScript', 'AWS'] },
    { id: '11', candidateNumber: '#012', match: 91, skills: ['React', 'Node.js'] },
    { id: '12', candidateNumber: '#009', match: 89, skills: ['TypeScript', 'GraphQL'] },
  ],
  rejected: [
    { id: '13', candidateNumber: '#006', match: 65, skills: ['jQuery', 'PHP'] },
    { id: '14', candidateNumber: '#003', match: 58, skills: ['HTML', 'CSS'] },
  ],
};

const columns = [
  { id: 'new', title: 'New', color: 'var(--accent-primary)' },
  { id: 'reviewing', title: 'Under Review', color: 'var(--warning)' },
  { id: 'shortlisted', title: 'Shortlisted', color: 'var(--success)' },
  { id: 'rejected', title: 'Rejected', color: 'var(--danger)' },
];

interface CandidateCardProps {
  candidate: Candidate;
  columnId: string;
}

const CandidateCard = ({ candidate, columnId }: CandidateCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: columnId === 'rejected' ? 0.6 : 1, scale: 1 }}
      whileHover={{ scale: columnId !== 'rejected' ? 1.02 : 1 }}
      className="p-4 rounded-xl group relative"
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 200ms, box-shadow 200ms',
      }}
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      </div>

      <div className="pl-4 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3 gap-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(100, 100, 100, 0.3)', backdropFilter: 'blur(10px)' }}
          >
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>?</span>
          </div>
          <span
            className="px-2 py-1 rounded-full text-xs shrink-0"
            style={{
              background: 'var(--gradient-radial-subtle)',
              color: 'var(--accent-secondary)',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border-accent)',
            }}
          >
            {candidate.match}%
          </span>
        </div>

        <h4 className="text-sm mb-3 truncate" style={{ color: 'var(--text-primary)' }}>
          Candidate {candidate.candidateNumber}
        </h4>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {candidate.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-xs truncate"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            >
              {skill}
            </span>
          ))}
        </div>

        <Link
          to={`/recruiter/candidates/${candidate.id}`}
          className="text-xs hover:underline block truncate"
          style={{ color: 'var(--accent-primary)' }}
        >
          View Profile →
        </Link>
      </div>
    </motion.div>
  );
};

interface ColumnProps {
  column: typeof columns[0];
  candidates: Candidate[];
  onDrop: (item: any, columnId: string) => void;
}

const Column = ({ column, candidates, onDrop }: ColumnProps) => {
  return (
    <div
      className="flex-1 min-w-[280px]"
      style={{
        background: 'transparent',
        transition: 'background 200ms',
      }}
    >
      <div className="mb-4">
        <div
          className="h-1 rounded-full mb-3"
          style={{ background: column.color }}
        />
        <div className="flex items-center justify-between">
          <h3 className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {column.title}
          </h3>
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            {candidates.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            columnId={column.id}
          />
        ))}
      </div>
    </div>
  );
};

export default function CandidatePipeline() {
  const { jobId } = useParams();
  const [blindHiring, setBlindHiring] = useState(true);
  const [candidates, setCandidates] = useState(initialCandidates);

  const handleDrop = (item: any, toColumn: string) => {
    const fromColumn = item.fromColumn;
    if (fromColumn === toColumn) return;

    setCandidates((prev) => {
      const newState = { ...prev };
      const candidateIndex = newState[fromColumn as keyof typeof prev].findIndex(
        (c: Candidate) => c.id === item.id
      );

      if (candidateIndex !== -1) {
        const [movedCandidate] = newState[fromColumn as keyof typeof prev].splice(candidateIndex, 1);
        newState[toColumn as keyof typeof prev].push(movedCandidate as any);
      }

      return newState;
    });
  };

  return (
    <AppLayout showBackButton sidebarType="recruiter" userName="Sarah Johnson" userType="Recruiter">
      <div className="max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/recruiter/jobs" style={{ color: 'var(--text-secondary)' }}>
                  Manage Jobs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator style={{ color: 'var(--text-muted)' }} />
              <BreadcrumbItem>
                <BreadcrumbLink style={{ color: 'var(--text-secondary)' }}>
                  Senior Frontend Developer
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator style={{ color: 'var(--text-muted)' }} />
              <BreadcrumbItem>
                <BreadcrumbPage style={{ color: 'var(--text-primary)' }}>
                  Pipeline
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1
                  className="text-2xl"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  Senior Frontend Developer
                </h1>
                <span
                  className="px-2 py-1 rounded text-xs"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
                >
                  Full-Time
                </span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Posted Mar 1, 2026
                </span>
                <span
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}
                >
                  14 Applicants
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="blindHiring" className="text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    Blind Hiring
                  </Label>
                  <Switch
                    id="blindHiring"
                    checked={blindHiring}
                    onCheckedChange={setBlindHiring}
                  />
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Kanban Board */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex gap-6 overflow-x-auto pb-4"
            style={{ minHeight: '600px' }}
          >
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                candidates={candidates[column.id as keyof typeof candidates]}
                onDrop={handleDrop}
              />
            ))}
          </motion.div>
      </div>
    </AppLayout>
  );
}
