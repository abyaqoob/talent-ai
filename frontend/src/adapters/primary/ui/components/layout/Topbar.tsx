import { Search, Bell, PanelLeft } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useNavigate } from 'react-router';
import { ProfileDropdown } from './ProfileDropdown';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const navigate = useNavigate();

  return (
    <header
      className="h-16 px-8 flex items-center justify-between"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-4 flex-1 max-w-md">
        {/* Toggle button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
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
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-lg hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
        </button>
        <ProfileDropdown />
      </div>
    </header>
  );
}