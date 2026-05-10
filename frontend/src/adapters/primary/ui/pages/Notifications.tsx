import { motion } from 'motion/react';
import { CheckCircle, Briefcase, Eye, MessageSquare, FileText, UserCheck } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useState } from 'react';

const notifications = [
  {
    id: 1,
    type: 'shortlist',
    icon: UserCheck,
    message: 'You were shortlisted for Senior Frontend Developer at TechCorp',
    time: '2 hours ago',
    unread: true,
    group: 'today',
  },
  {
    id: 2,
    type: 'view',
    icon: Eye,
    message: 'Design Studio viewed your profile',
    time: '5 hours ago',
    unread: true,
    group: 'today',
  },
  {
    id: 3,
    type: 'match',
    icon: Briefcase,
    message: 'New job match: UX Designer at Creative Labs',
    time: '1 day ago',
    unread: false,
    group: 'yesterday',
  },
  {
    id: 4,
    type: 'message',
    icon: MessageSquare,
    message: 'New message from StartupXYZ about Full Stack Engineer position',
    time: '1 day ago',
    unread: false,
    group: 'yesterday',
  },
  {
    id: 5,
    type: 'application',
    icon: CheckCircle,
    message: 'Your application to Product Designer was submitted successfully',
    time: '3 days ago',
    unread: false,
    group: 'week',
  },
  {
    id: 6,
    type: 'match',
    icon: Briefcase,
    message: 'Match score updated for Backend Developer position',
    time: '4 days ago',
    unread: false,
    group: 'week',
  },
  {
    id: 7,
    type: 'cv',
    icon: FileText,
    message: 'Your CV analysis is complete with a score of 78/100',
    time: '5 days ago',
    unread: false,
    group: 'week',
  },
];

const iconColors = {
  shortlist: 'var(--success)',
  view: 'var(--accent-secondary)',
  match: 'var(--accent-primary)',
  message: 'var(--warning)',
  application: 'var(--success)',
  cv: 'var(--accent-primary)',
};

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState('all');

  const groupedNotifications = {
    today: notifications.filter((n) => n.group === 'today'),
    yesterday: notifications.filter((n) => n.group === 'yesterday'),
    week: notifications.filter((n) => n.group === 'week'),
  };

  return (
    <AppLayout showBackButton>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-between"
        >
          <h1
            className="text-4xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Notifications
          </h1>
          <Button variant="ghost" size="sm">
            Mark all as read
          </Button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 mb-8"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          {[
            { id: 'all', label: 'All' },
            { id: 'matches', label: 'Job Matches' },
            { id: 'applications', label: 'Applications' },
            { id: 'messages', label: 'Messages' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className="pb-3 px-4 text-sm transition-all duration-150"
              style={{
                color: activeFilter === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeFilter === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-8">
          {/* Today */}
          {groupedNotifications.today.length > 0 && (
            <div>
              <h3
                className="text-sm mb-4"
                style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Today
              </h3>
              <div className="space-y-2">
                {groupedNotifications.today.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 rounded-xl flex items-start gap-4 relative"
                    style={{
                      background: notification.unread ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                      borderLeft: notification.unread ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    }}
                  >
                    {notification.unread && (
                      <div
                        className="absolute top-4 right-4 w-2 h-2 rounded-full"
                        style={{ background: 'var(--accent-primary)' }}
                      />
                    )}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${iconColors[notification.type as keyof typeof iconColors]}20` }}
                    >
                      <notification.icon
                        className="w-5 h-5"
                        style={{ color: iconColors[notification.type as keyof typeof iconColors] }}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm mb-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {notification.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Yesterday */}
          {groupedNotifications.yesterday.length > 0 && (
            <div>
              <h3
                className="text-sm mb-4"
                style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Yesterday
              </h3>
              <div className="space-y-2">
                {groupedNotifications.yesterday.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    className="p-4 rounded-xl flex items-start gap-4"
                    style={{
                      background: notification.unread ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                      borderLeft: notification.unread ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${iconColors[notification.type as keyof typeof iconColors]}20` }}
                    >
                      <notification.icon
                        className="w-5 h-5"
                        style={{ color: iconColors[notification.type as keyof typeof iconColors] }}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm mb-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {notification.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* This Week */}
          {groupedNotifications.week.length > 0 && (
            <div>
              <h3
                className="text-sm mb-4"
                style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                This Week
              </h3>
              <div className="space-y-2">
                {groupedNotifications.week.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="p-4 rounded-xl flex items-start gap-4"
                    style={{
                      background: notification.unread ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                      borderLeft: notification.unread ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${iconColors[notification.type as keyof typeof iconColors]}20` }}
                    >
                      <notification.icon
                        className="w-5 h-5"
                        style={{ color: iconColors[notification.type as keyof typeof iconColors] }}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm mb-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {notification.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
