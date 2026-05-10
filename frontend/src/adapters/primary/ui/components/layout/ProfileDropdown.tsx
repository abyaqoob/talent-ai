import { User, Settings, LogOut, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

export function ProfileDropdown() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're in recruiter or candidate area
  const isRecruiter = location.pathname.startsWith('/recruiter');
  const userName = isRecruiter ? 'John Smith' : 'Ali Johnson';
  const userEmail = isRecruiter ? 'john.smith@company.com' : 'ali.johnson@example.com';
  const userRole = isRecruiter ? 'Senior Recruiter' : 'Software Engineer';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  const handleSettings = () => {
    setIsProfileMenuOpen(false);
    navigate(isRecruiter ? '/recruiter/settings' : '/settings');
  };

  const handleProfile = () => {
    setIsProfileMenuOpen(false);
    navigate('/profile');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:ring-2 ring-offset-2"
        style={{
          background: '#047857',
          ringColor: 'var(--accent-primary)',
        }}
      >
        <User className="w-5 h-5 text-white" />
      </button>

      <AnimatePresence>
        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden shadow-lg z-50"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-modal)',
            }}
          >
            {/* User Info */}
            <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: '#047857' }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm mb-0.5 truncate" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {userName}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {userEmail}
                  </div>
                  <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                    {userRole}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {!isRecruiter && (
                <button
                  onClick={handleProfile}
                  className="w-full px-4 py-2.5 flex items-center gap-3 transition-all duration-150 hover:bg-opacity-50"
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm">My Profile</span>
                </button>
              )}
              <button
                onClick={handleSettings}
                className="w-full px-4 py-2.5 flex items-center gap-3 transition-all duration-150 hover:bg-opacity-50"
                style={{
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm">Settings</span>
              </button>
            </div>

            {/* Logout */}
            <div className="p-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 flex items-center gap-3 rounded-lg transition-all duration-150"
                style={{
                  color: 'var(--danger)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
