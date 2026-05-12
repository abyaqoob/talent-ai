import { User, Settings, LogOut, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/presentation/hooks/useAuth';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isRecruiter = location.pathname.startsWith('/recruiter') || user?.role === 'recruiter';
  const displayName = user?.name || (isRecruiter ? 'Recruiter' : 'Candidate');
  const displayEmail = user?.email || '';
  const displayRole = isRecruiter ? 'Recruiter' : 'Candidate';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate(isRecruiter ? '/recruiter/settings' : '/settings');
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:ring-2 hover:ring-offset-2 hover:ring-emerald-500 overflow-hidden text-white text-sm font-semibold border border-[var(--border-subtle)]"
        style={{ background: 'var(--bg-tertiary)' }}
        title={displayName}
      >
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          initials || <User className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden shadow-lg z-50"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-modal)' }}
          >
            {/* User Info */}
            <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden text-white font-semibold border border-[var(--border-subtle)]"
                  style={{ background: 'var(--bg-tertiary)' }}>
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    initials || <User className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm mb-0.5 truncate" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{displayName}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{displayEmail}</div>
                  <div className="text-xs mt-0.5 capitalize" style={{ color: 'var(--accent-primary)' }}>{displayRole}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {!isRecruiter && (
                <button onClick={handleProfile} className="w-full px-4 py-2.5 flex items-center gap-3 transition-all duration-150"
                  style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  <UserCircle className="w-5 h-5" /><span className="text-sm">My Profile</span>
                </button>
              )}
              <button onClick={handleSettings} className="w-full px-4 py-2.5 flex items-center gap-3 transition-all duration-150"
                style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                <Settings className="w-5 h-5" /><span className="text-sm">Settings</span>
              </button>
            </div>

            {/* Logout */}
            <div className="p-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <button onClick={handleLogout} className="w-full px-4 py-2.5 flex items-center gap-3 rounded-lg transition-all duration-150"
                style={{ color: 'var(--danger)', background: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <LogOut className="w-5 h-5" /><span className="text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
