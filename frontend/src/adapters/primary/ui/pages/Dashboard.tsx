import { motion } from 'motion/react';
import { Home, User, FileText, Search, ClipboardList, MessageSquare, Bell, Settings, Upload, TrendingUp, Briefcase, MapPin, Clock, ArrowUpRight, Code, Palette, Rocket } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/adapters/primary/ui/components/ThemeToggle';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { ProfileDropdown } from '@/adapters/primary/ui/components/layout/ProfileDropdown';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside 
        className="w-60 flex flex-col"
        style={{ 
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
        }}
      >
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              TalentAI
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 pb-6 mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: '#047857' }}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>Ali Johnson</div>
              <div 
                className="text-xs px-2 py-0.5 rounded-full inline-block"
                style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}
              >
                Candidate
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard', to: '/dashboard' },
            { id: 'profile', icon: User, label: 'My Profile', to: '/profile' },
            { id: 'cv', icon: FileText, label: 'My CV', to: '/cv-upload' },
            { id: 'jobs', icon: Search, label: 'Find Jobs', to: '/jobs' },
            { id: 'applications', icon: ClipboardList, label: 'Applications', to: '/applications' },
            { id: 'messages', icon: MessageSquare, label: 'Messages', to: '/messages' },
            { id: 'notifications', icon: Bell, label: 'Notifications', to: '/notifications' },
            { id: 'settings', icon: Settings, label: 'Settings', to: '/settings' },
          ].map((item) => {
            const isActive = activeNav === item.id;
            const Component = item.to ? Link : 'button';
            return (
              <Component
                key={item.id}
                to={item.to || '#'}
                onClick={() => setActiveNav(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 text-left"
                style={{
                  background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                }}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Component>
            );
          })}
        </nav>

      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header 
          className="h-16 px-8 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search jobs, skills, companies..."
                className="w-full pl-10 pr-20 py-2.5 rounded-lg text-sm focus:outline-none"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
              <kbd 
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-xs"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
              >
                ⌘K
              </kbd>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/notifications" className="relative p-2 rounded-lg hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: 'var(--danger)' }}
              />
            </Link>
            <ProfileDropdown />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Greeting */}
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
                Good morning, Ali 👋
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Saturday, March 7, 2026
              </p>
            </div>
            <Link to="/cv-upload">
              <Button variant="gradient" size="lg" className="shadow-[var(--shadow-glow)]">
                <Upload className="w-4 h-4" />
                Upload New CV
              </Button>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { value: '3', label: 'Active Applications', icon: ClipboardList, trend: '+2 this week' },
              { value: '12', label: 'Job Matches', icon: Briefcase, trend: '5 new today' },
              { value: '1', label: 'New Proposals', icon: MessageSquare, trend: 'View now' },
              { value: '87%', label: 'Profile Completeness', icon: TrendingUp, trend: 'Almost there!' },
            ].map((stat, index) => (
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
                      <AnimatedNumber value={stat.value} />
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
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.trend}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recommended Jobs */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 
                  className="text-2xl"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  Recommended Jobs
                </h2>
                <Link to="/jobs" className="text-sm hover:underline" style={{ color: 'var(--accent-primary)' }}>
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Senior Frontend Developer',
                    company: 'TechCorp',
                    location: 'Remote',
                    type: 'Full-Time',
                    match: 92,
                    skills: ['React', 'TypeScript', 'Tailwind'],
                    salary: '$120k - $180k',
                    icon: Code,
                  },
                  {
                    title: 'Product Designer',
                    company: 'Design Studio',
                    location: 'New York, NY',
                    type: 'Full-Time',
                    match: 88,
                    skills: ['Figma', 'UI/UX', 'Prototyping'],
                    salary: '$100k - $140k',
                    icon: Palette,
                  },
                  {
                    title: 'Full Stack Engineer',
                    company: 'StartupXYZ',
                    location: 'San Francisco, CA',
                    type: 'Full-Time',
                    match: 85,
                    skills: ['Node.js', 'React', 'MongoDB'],
                    salary: '$130k - $170k',
                    icon: Rocket,
                  },
                ].map((job, index) => (
                  <Link key={index} to={`/jobs/${index + 1}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="p-6 rounded-2xl transition-all duration-200 cursor-pointer group"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
                      >
                        <job.icon className="w-6 h-6" style={{ color: '#047857' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base mb-1 truncate" title={job.title} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                              {job.title}
                            </h3>
                            <p className="text-sm truncate" title={job.company} style={{ color: 'var(--text-secondary)' }}>
                              {job.company}
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
                            {job.match}% Match
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {job.type}
                          </span>
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-full text-xs"
                              style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <Button variant="gradient-subtle" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Apply Now →
                      </Button>
                    </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div 
                className="p-6 rounded-2xl"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[
                    { action: 'Applied to Frontend Developer at TechCorp', time: '2 hours ago' },
                    { action: 'Profile viewed by Design Studio', time: '5 hours ago' },
                    { action: 'New match: Product Designer', time: '1 day ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 shrink-0"
                        style={{ background: 'var(--accent-secondary)' }}
                      />
                      <div>
                        <p className="text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                          {activity.action}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Completion */}
              <div 
                className="p-6 rounded-2xl"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-accent)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>
                    Complete Your Profile
                  </h3>
                  <span 
                    className="text-2xl"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}
                  >
                    87%
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full mb-4 overflow-hidden"
                  style={{ background: 'var(--gradient-radial-subtle)' }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: '87%', background: 'var(--gradient-primary)' }}
                  />
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-4 h-4 rounded-full" style={{ background: 'var(--success)' }} />
                    Add work experience
                  </li>
                  <li className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-4 h-4 rounded-full" style={{ background: 'var(--success)' }} />
                    Upload CV
                  </li>
                  <li className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: 'var(--text-muted)' }} />
                    Add portfolio links
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Animated Number Component
function AnimatedNumber({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  
  useEffect(() => {
    // Check if value contains a number
    const numMatch = value.match(/\d+/);
    if (numMatch) {
      const targetNum = parseInt(numMatch[0]);
      const duration = 800;
      const steps = 30;
      const increment = targetNum / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(value.replace(/\d+/, Math.floor(current).toString()));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);
  
  return <>{displayValue}</>;
}