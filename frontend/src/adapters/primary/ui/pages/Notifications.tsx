import { motion } from 'motion/react';
import { Bell, CheckCheck, Briefcase, MessageSquare, User, Zap, FileCheck, ClipboardList, Clock } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { apiClient } from '@/infrastructure/api/apiClient';
import { useNavigate } from 'react-router';
import { io as socketIO, Socket } from 'socket.io-client';

interface NotificationItem {
  _id?: string;
  id?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt?: string;
  link?: string;
}

function timeAgo(date?: string): string {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getIcon(type: string) {
  const map: Record<string, typeof Briefcase> = {
    JOB_POSTED: Briefcase,
    APPLICATION_STATUS: FileCheck,
    NEW_MESSAGE: MessageSquare,
    NEW_APPLICATION: ClipboardList,
    JOB_EXPIRING: Clock,
    // Legacy types from previous code
    application_update: Briefcase,
    message: MessageSquare,
    profile_view: User,
    job_match: Zap,
    interview_proposal: Briefcase,
  };
  return map[type] || Bell;
}

function getIconColor(type: string, read: boolean): string {
  if (read) return 'var(--text-muted)';
  const colors: Record<string, string> = {
    JOB_POSTED: '#059669',
    APPLICATION_STATUS: '#f59e0b',
    NEW_MESSAGE: '#3b82f6',
    NEW_APPLICATION: '#8b5cf6',
    JOB_EXPIRING: '#ef4444',
  };
  return colors[type] || 'var(--accent-primary)';
}

function getIconBg(type: string, read: boolean): string {
  if (read) return 'var(--bg-tertiary)';
  const bgs: Record<string, string> = {
    JOB_POSTED: 'rgba(5,150,105,0.12)',
    APPLICATION_STATUS: 'rgba(245,158,11,0.12)',
    NEW_MESSAGE: 'rgba(59,130,246,0.12)',
    NEW_APPLICATION: 'rgba(139,92,246,0.12)',
    JOB_EXPIRING: 'rgba(239,68,68,0.12)',
  };
  return bgs[type] || 'rgba(5,150,105,0.12)';
}

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (user?.id) loadNotifications();
  }, [user?.id]);

  // Real-time: listen for new_notification events
  useEffect(() => {
    if (!user?.id) return;

    const socket = socketIO('http://localhost:5001', { withCredentials: true });
    socketRef.current = socket;

    socket.emit('join', user.id);

    socket.on('new_notification', (notif: NotificationItem) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>('/notifications');
      setNotifications(Array.isArray(data) ? data : data?.notifications || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`, {});
      setNotifications(prev => prev.map(n => (n._id || n.id) === id ? { ...n, read: true } : n));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all', {});
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { /* silent */ }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    const id = notif._id || notif.id || '';
    if (!notif.read && id) markAsRead(id);
    if (notif.link) navigate(notif.link);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppLayout showBackButton sidebarType={user?.role as 'candidate' | 'recruiter'}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <CheckCheck className="w-4 h-4" />Mark all read
            </button>
          )}
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-5 rounded-2xl animate-pulse" style={{ background: 'var(--bg-secondary)', height: '80px' }}>
                <div className="h-3 rounded mb-2" style={{ background: 'var(--bg-tertiary)', width: '50%' }} />
                <div className="h-2 rounded" style={{ background: 'var(--bg-tertiary)', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No notifications yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>We'll notify you when something important happens</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, index) => {
              const id = notif._id || notif.id || `notif-${index}`;
              const Icon = getIcon(notif.type);
              const iconColor = getIconColor(notif.type, notif.read);
              const iconBg = getIconBg(notif.type, notif.read);
              return (
                <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => handleNotificationClick(notif)}
                  className="p-5 rounded-2xl cursor-pointer transition-all duration-150"
                  style={{
                    background: notif.read ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                    border: notif.read ? '1px solid var(--border-subtle)' : '1px solid var(--border-accent)',
                    opacity: notif.read ? 0.8 : 1,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: iconBg, border: '1px solid var(--border-subtle)' }}>
                      <Icon className="w-5 h-5" style={{ color: iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{notif.title}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notif.read && <div className="w-2 h-2 rounded-full" style={{ background: iconColor }} />}
                          <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{timeAgo(notif.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{notif.message}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
