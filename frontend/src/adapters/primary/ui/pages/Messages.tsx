import { motion } from 'motion/react';
import { CheckCircle, X, Code, Palette, Rocket, Zap, type LucideIcon } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useState } from 'react';

const messages: Array<{
  id: number;
  company: string;
  icon: LucideIcon;
  jobTitle: string;
  appliedDate: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  hasProposal: boolean;
}> = [
  {
    id: 1,
    company: 'TechCorp',
    icon: Code,
    jobTitle: 'Senior Frontend Developer',
    appliedDate: 'Mar 5',
    preview: 'We\'d like to invite you for an interview...',
    timestamp: '2h ago',
    unread: true,
    hasProposal: true,
  },
  {
    id: 2,
    company: 'Design Studio',
    icon: Palette,
    jobTitle: 'Product Designer',
    appliedDate: 'Mar 3',
    preview: 'Thank you for your application. We\'re reviewing...',
    timestamp: '1d ago',
    unread: true,
    hasProposal: false,
  },
  {
    id: 3,
    company: 'StartupXYZ',
    icon: Rocket,
    jobTitle: 'Full Stack Engineer',
    appliedDate: 'Feb 28',
    preview: 'Your profile looks great! Let\'s schedule a chat...',
    timestamp: '3d ago',
    unread: false,
    hasProposal: false,
  },
  {
    id: 4,
    company: 'DataCore',
    icon: Zap,
    jobTitle: 'Backend Developer',
    appliedDate: 'Feb 25',
    preview: 'We appreciate your interest in this position...',
    timestamp: '1w ago',
    unread: false,
    hasProposal: false,
  },
];

const proposalSlots = [
  { day: 'Mon Mar 18', time: '10:00 AM' },
  { day: 'Wed Mar 20', time: '2:00 PM' },
];

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);

  return (
    <AppLayout showBackButton>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <h1
              className="text-4xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Messages
            </h1>
            <span
              className="px-3 py-1 rounded-full text-sm"
              style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--success)', border: '1px solid var(--border-accent)' }}
            >
              Unread (2)
            </span>
          </div>
        </motion.div>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', minHeight: '600px' }}
        >
          {/* Left Panel - Message List */}
          <div
            className="lg:col-span-1"
            style={{ borderRight: '1px solid var(--border-subtle)' }}
          >
            <div className="p-4">
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <motion.button
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => setSelectedMessage(message)}
                    className="w-full p-4 rounded-xl text-left transition-all duration-150 relative overflow-hidden"
                    style={{
                      background: selectedMessage.id === message.id ? 'var(--bg-tertiary)' : 'transparent',
                      borderLeft: message.unread ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
                      >
                        <message.icon className="w-5 h-5" style={{ color: '#047857' }} />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className="text-sm truncate flex-1"
                            style={{
                              color: 'var(--text-primary)',
                              fontWeight: message.unread ? 600 : 400,
                            }}
                          >
                            {message.jobTitle}
                          </h4>
                          <span
                            className="text-xs shrink-0 whitespace-nowrap"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {message.timestamp}
                          </span>
                        </div>
                        <p
                          className="text-xs mb-1 truncate"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {message.company}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{
                            color: 'var(--text-muted)',
                            fontWeight: message.unread ? 500 : 400,
                          }}
                        >
                          {message.preview}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Message Detail */}
          <motion.div
            key={selectedMessage.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2 p-6"
          >
            {/* Message Header */}
            <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
                >
                  <selectedMessage.icon className="w-6 h-6" style={{ color: '#047857' }} />
                </div>
                <div>
                  <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>
                    {selectedMessage.company}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Re: {selectedMessage.jobTitle}
                  </p>
                </div>
              </div>
              <span
                className="inline-block px-2 py-1 rounded text-xs"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
              >
                Applied {selectedMessage.appliedDate}
              </span>
            </div>

            {/* Proposal Banner */}
            {selectedMessage.hasProposal && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl"
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  borderLeft: '3px solid var(--success)',
                }}
              >
                <h4
                  className="text-sm mb-1"
                  style={{ color: 'var(--success)' }}
                >
                  You've received an interview proposal!
                </h4>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  The recruiter has sent you available interview slots
                </p>
              </motion.div>
            )}

            {/* Message Content */}
            <div className="mb-6">
              <div
                className="p-4 rounded-xl rounded-tl-none mb-4"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Hi Ali,
                  <br />
                  <br />
                  Thank you for applying to the Senior Frontend Developer position at TechCorp. We're impressed with your background and would love to move forward with an interview.
                  <br />
                  <br />
                  Please see the available time slots below and let us know what works best for you.
                  <br />
                  <br />
                  Looking forward to speaking with you!
                  <br />
                  <br />
                  Best regards,
                  <br />
                  Sarah Johnson
                  <br />
                  Talent Acquisition Manager
                </p>
              </div>
            </div>

            {/* Proposal Slots */}
            {selectedMessage.hasProposal && (
              <div
                className="mb-6 p-6 rounded-xl"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-accent)' }}
              >
                <h4
                  className="text-sm mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Available Interview Slots
                </h4>
                <div className="space-y-3 mb-4">
                  {proposalSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg flex items-center justify-between"
                      style={{ background: 'var(--bg-secondary)' }}
                    >
                      <div>
                        <p
                          className="text-sm mb-0.5"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Slot {index + 1}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {slot.day} — {slot.time}
                        </p>
                      </div>
                      <CheckCircle
                        className="w-5 h-5"
                        style={{ color: 'var(--text-muted)' }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  Notes: Virtual interview via Google Meet. Expected duration: 45 minutes.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="gradient"
                    className="flex-1 h-13 shadow-[var(--shadow-glow)]"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept & Share Contact Info
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <X className="w-4 h-4" />
                    Decline
                  </Button>
                </div>

                <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
                  By accepting, you agree to share your email and phone number with the recruiter
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
