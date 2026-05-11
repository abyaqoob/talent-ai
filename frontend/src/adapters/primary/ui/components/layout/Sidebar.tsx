import { Home, User, FileText, Search, ClipboardList, MessageSquare, Bell, Settings, LogOut, Briefcase, Users, TrendingUp, PlusCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '@/presentation/hooks/useAuth';

interface SidebarProps {
  type?: 'candidate' | 'recruiter';
  isOpen?: boolean;
}

export function Sidebar({ type = 'candidate', isOpen = true }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Compute display name and role from real auth state
  const displayName = user?.name || (type === 'recruiter' ? 'Recruiter' : 'Candidate');
  const displayRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : (type === 'recruiter' ? 'Recruiter' : 'Candidate');
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const candidateNav = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', to: '/dashboard' },
    { id: 'profile', icon: User, label: 'My Profile', to: '/profile' },
    { id: 'cv', icon: FileText, label: 'My CV', to: '/cv-upload' },
    { id: 'jobs', icon: Search, label: 'Find Jobs', to: '/jobs' },
    { id: 'applications', icon: ClipboardList, label: 'Applications', to: '/applications' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', to: '/messages' },
    { id: 'notifications', icon: Bell, label: 'Notifications', to: '/notifications' },
    { id: 'settings', icon: Settings, label: 'Settings', to: '/settings' },
  ];

  const recruiterNav = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', to: '/recruiter/dashboard' },
    { id: 'post-job', icon: PlusCircle, label: 'Post a Job', to: '/recruiter/post-job' },
    { id: 'manage-jobs', icon: Briefcase, label: 'Manage Jobs', to: '/recruiter/jobs' },
    { id: 'candidates', icon: Users, label: 'Candidates', to: '/recruiter/candidates' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', to: '/recruiter/analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', to: '/recruiter/settings' },
  ];

  const navItems = type === 'recruiter' ? recruiterNav : candidateNav;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className="flex flex-col flex-shrink-0 hidden md:flex overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: isOpen ? '16rem' : '0px',
        background: 'var(--bg-secondary)',
        borderRight: isOpen ? '1px solid var(--border-subtle)' : 'none',
      }}
    >
      {/* Logo */}
      <div className="p-6">
        <motion.div className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <motion.span
            className="font-bold text-xl bg-clip-text"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            whileHover={{ filter: 'brightness(1.2)' }}
            transition={{ duration: 0.3 }}
          >
            TalentAI
          </motion.span>
        </motion.div>
      </div>

      {/* User Info — Real data from useAuth */}
      <div className="px-6 pb-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #047857, #059669)' }}>
            {initials || <User className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {displayName}
            </div>
            <div className="text-xs px-2 py-0.5 rounded-full inline-block mt-0.5"
              style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}>
              {displayRole}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.id === 'jobs' && location.pathname.startsWith('/jobs')) ||
            (item.id === 'manage-jobs' && location.pathname.startsWith('/recruiter/jobs'));

          return (
            <Link key={item.id} to={item.to}>
              <motion.div
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 text-left"
                style={{
                  background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  boxShadow: isActive ? 'var(--shadow-green-sm)' : 'none',
                }}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left"
          style={{
            background: 'rgba(5, 150, 105, 0.1)',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            color: 'var(--accent-primary)',
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </div>
    </aside>
  );
}
