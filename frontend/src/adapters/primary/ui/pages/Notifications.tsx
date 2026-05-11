import { motion } from 'motion/react';
import { Bell, CheckCheck, Briefcase, MessageSquare, User, Zap } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { apiClient } from '@/infrastructure/api/apiClient';

interface NotificationItem {
  _id?: string;
  id?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt?: string;
  actionUrl?: string;
}

function timeAgo(date?: string): string {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getIcon(type: string) {
  const map: Record<string, typeof Briefcase> = {
    application_update: Briefcase,
    message: MessageSquare,
    profile_view: User,
    job_match: Zap,
    interview_proposal: Briefcase,
  };
  return map[type] || Bell;
}

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadNotifications();
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppLayout showBackButton>
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
              const id = notif._id || notif.id || '';
              const Icon = getIcon(notif.type);
              return (
                <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => !notif.read && markAsRead(id)}
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
                      style={{ background: notif.read ? 'var(--bg-tertiary)' : 'rgba(5,150,105,0.12)', border: '1px solid var(--border-subtle)' }}>
                      <Icon className="w-5 h-5" style={{ color: notif.read ? 'var(--text-muted)' : 'var(--accent-primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{notif.title}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notif.read && <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }} />}
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
