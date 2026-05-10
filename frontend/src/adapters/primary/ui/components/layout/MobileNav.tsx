import { Home, User, FileText, Search, ClipboardList, MessageSquare, Bell, Settings, Briefcase, Users, TrendingUp, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';

interface MobileNavProps {
  type?: 'candidate' | 'recruiter';
}

export function MobileNav({ type = 'candidate' }: MobileNavProps) {
  const location = useLocation();

  const candidateNav = [
    { id: 'dashboard', icon: Home, label: 'Home', to: '/dashboard' },
    { id: 'jobs', icon: Search, label: 'Jobs', to: '/jobs' },
    { id: 'applications', icon: ClipboardList, label: 'Apps', to: '/applications' },
    { id: 'messages', icon: MessageSquare, label: 'Chat', to: '/messages' },
    { id: 'profile', icon: User, label: 'Profile', to: '/profile' },
  ];

  const recruiterNav = [
    { id: 'dashboard', icon: Home, label: 'Home', to: '/recruiter/dashboard' },
    { id: 'post-job', icon: PlusCircle, label: 'Post', to: '/recruiter/post-job' },
    { id: 'candidates', icon: Users, label: 'People', to: '/recruiter/candidates' },
    { id: 'analytics', icon: TrendingUp, label: 'Stats', to: '/recruiter/analytics' },
    { id: 'settings', icon: Settings, label: 'More', to: '/recruiter/settings' },
  ];

  const navItems = type === 'recruiter' ? recruiterNav : candidateNav;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.id === 'jobs' && location.pathname.startsWith('/jobs')) ||
            (item.id === 'manage-jobs' && location.pathname.startsWith('/recruiter/jobs'));

          return (
            <Link key={item.id} to={item.to} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-150"
                style={{
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full"
                    style={{ background: 'var(--accent-primary)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
