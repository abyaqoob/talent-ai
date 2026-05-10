import { motion } from 'motion/react';
import { useState } from 'react';
import { Briefcase, Calendar, MapPin, Eye, LayoutGrid, List, Code, Palette, Rocket, FlaskConical, Zap, LucideIcon } from 'lucide-react';
// Drag and drop removed to avoid conflicts
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';

const initialApplications = {
  applied: [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      icon: Code,
      date: 'Mar 5, 2026',
      location: 'Remote',
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'Design Studio',
      icon: Palette,
      date: 'Mar 3, 2026',
      location: 'New York, NY',
    },
  ],
  reviewing: [
    {
      id: 3,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      icon: Rocket,
      date: 'Feb 28, 2026',
      location: 'San Francisco, CA',
    },
  ],
  shortlisted: [
    {
      id: 4,
      title: 'UX Researcher',
      company: 'Research Lab',
      icon: FlaskConical,
      date: 'Feb 25, 2026',
      location: 'Remote',
    },
  ],
  rejected: [
    {
      id: 5,
      title: 'Backend Developer',
      company: 'DataCore',
      icon: Zap,
      date: 'Feb 20, 2026',
      location: 'Austin, TX',
    },
  ],
};

const columns = [
  { id: 'applied', title: 'Applied', count: 2, color: '#059669' },
  { id: 'reviewing', title: 'Under Review', count: 1, color: '#F59E0B' },
  { id: 'shortlisted', title: 'Shortlisted', count: 1, color: '#059669' },
  { id: 'rejected', title: 'Rejected', count: 1, color: '#EF4444' },
];

interface Application {
  id: number;
  title: string;
  company: string;
  icon: LucideIcon;
  date: string;
  location: string;
}

interface ApplicationCardProps {
  application: Application;
  columnId: string;
}

const ApplicationCard = ({ application, columnId }: ApplicationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 rounded-xl group"
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 200ms, box-shadow 200ms',
        opacity: columnId === 'rejected' ? 0.6 : 1,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
        >
          <application.icon className="w-5 h-5" style={{ color: '#047857' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>
            {application.title}
          </h4>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {application.company}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {application.date}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <MapPin className="w-3 h-3" />
        {application.location}
      </div>

      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button 
          className="text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          style={{ color: 'var(--accent-primary)' }}
        >
          <Eye className="w-3 h-3" />
          View Details
        </button>
      </div>
    </motion.div>
  );
};

interface ColumnProps {
  column: typeof columns[0];
  applications: Application[];
  onDrop: (item: any, columnId: string) => void;
}

const Column = ({ column, applications, onDrop }: ColumnProps) => {
  return (
    <div
      className="flex-1 min-w-[260px] md:min-w-[280px]"
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
            style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}
          >
            {applications.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} columnId={column.id} />
        ))}
        {applications.length === 0 && (
          <div 
            className="p-8 rounded-xl text-center text-sm"
            style={{ 
              border: '2px dashed var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            Drop applications here
          </div>
        )}
      </div>
    </div>
  );
};

export default function Applications() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [applications, setApplications] = useState(initialApplications);

  const handleDrop = (item: any, toColumn: string) => {
    const fromColumn = item.fromColumn;
    if (fromColumn === toColumn) return;

    setApplications((prev) => {
      const newState = { ...prev };
      const appIndex = newState[fromColumn as keyof typeof prev].findIndex(
        (app: Application) => app.id === item.id
      );
      
      if (appIndex !== -1) {
        const [movedApp] = newState[fromColumn as keyof typeof prev].splice(appIndex, 1);
        newState[toColumn as keyof typeof prev].push(movedApp as any);
      }
      
      return newState;
    });
  };

  return (
    <AppLayout showBackButton>
      <div className="max-w-7xl mx-auto">
          {/* Page Title with Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                <h1
                  className="text-2xl md:text-3xl lg:text-4xl"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  My Applications
                </h1>
                <span
                  className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm"
                  style={{ background: 'rgba(5, 150, 105, 0.12)', color: 'var(--accent-primary)' }}
                >
                  5 Active
                </span>
              </div>
              <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                Track and manage all your job applications
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 p-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
              <button
                onClick={() => setView('kanban')}
                className="px-3 py-1.5 rounded-md text-sm transition-all duration-150"
                style={{
                  background: view === 'kanban' ? 'var(--accent-primary)' : 'transparent',
                  color: view === 'kanban' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className="px-3 py-1.5 rounded-md text-sm transition-all duration-150"
                style={{
                  background: view === 'list' ? 'var(--accent-primary)' : 'transparent',
                  color: view === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Kanban Board */}
          {view === 'kanban' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0"
              style={{ minHeight: '400px' }}
            >
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  applications={applications[column.id as keyof typeof applications]}
                  onDrop={handleDrop}
                />
              ))}
            </motion.div>
          )}

          {/* List View */}
          {view === 'list' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-4"
            >
              {Object.entries(applications).flatMap(([status, apps]) =>
                apps.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 rounded-2xl flex items-center justify-between"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
                      >
                        <app.icon className="w-6 h-6" style={{ color: '#047857' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg mb-0.5 truncate" title={app.title} style={{ color: 'var(--text-primary)' }}>
                          {app.title}
                        </h3>
                        <p className="text-sm truncate" title={`${app.company} • ${app.location}`} style={{ color: 'var(--text-secondary)' }}>
                          {app.company} • {app.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                          Applied on
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          {app.date}
                        </div>
                      </div>
                      <div 
                        className="px-3 py-1.5 rounded-full text-xs"
                        style={{
                          background: columns.find(c => c.id === status)?.color 
                            ? `${columns.find(c => c.id === status)?.color}20`
                            : 'transparent',
                          color: columns.find(c => c.id === status)?.color,
                        }}
                      >
                        {columns.find(c => c.id === status)?.title}
                      </div>
                      <button 
                        className="px-4 py-2 rounded-lg text-sm transition-all duration-150 active:scale-[0.97]"
                        style={{
                          background: 'var(--accent-primary)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
      </div>
    </AppLayout>
  );
}