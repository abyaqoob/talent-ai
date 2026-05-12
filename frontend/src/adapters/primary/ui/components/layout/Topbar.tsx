import { Search, Bell, PanelLeft } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useNavigate } from 'react-router';
import { ProfileDropdown } from './ProfileDropdown';
import { useAuth } from '@/presentation/hooks/useAuth';
import { apiClient } from '@/infrastructure/api/apiClient';
import { useState, useEffect, useRef } from 'react';
import { io as socketIO, Socket } from 'socket.io-client';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  // Fetch initial unread count
  useEffect(() => {
    if (!user?.id) return;

    apiClient.get<{ count: number }>('/notifications/unread-count')
      .then(data => setUnreadCount(data.count))
      .catch(() => {});
  }, [user?.id]);

  // Listen for real-time notifications via Socket.io
  useEffect(() => {
    if (!user?.id) return;

    const socket = socketIO('http://localhost:5001', { withCredentials: true });
    socketRef.current = socket;

    socket.emit('join', user.id);

    socket.on('new_notification', () => {
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

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
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
              style={{ background: 'var(--danger)' }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        <ProfileDropdown />
      </div>
    </header>
  );
}