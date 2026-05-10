import { motion } from 'motion/react';
import { Upload, Eye, EyeOff, User } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Input } from '@/adapters/primary/ui/components/base/input';
import { Label } from '@/adapters/primary/ui/components/base/label';
import { Switch } from '@/adapters/primary/ui/components/base/switch';
import { useState } from 'react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    jobMatches: true,
    applicationUpdates: true,
    messages: true,
    profileViews: false,
    weeklyDigest: false,
  });

  const sections = [
    { id: 'account', label: 'Account', danger: false },
    { id: 'password', label: 'Password & Security', danger: false },
    { id: 'notifications', label: 'Notifications', danger: false },
    { id: 'privacy', label: 'Privacy', danger: false },
    { id: 'danger', label: 'Danger Zone', danger: true },
  ];

  return (
    <AppLayout showBackButton>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1
            className="text-4xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Settings
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Nav */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div
              className="p-4 rounded-2xl sticky top-8"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <h3
                className="text-sm mb-4 px-3"
                style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Settings
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150"
                    style={{
                      background: activeSection === section.id ? 'var(--bg-tertiary)' : 'transparent',
                      color: section.danger ? 'var(--danger)' : (activeSection === section.id ? 'var(--text-primary)' : 'var(--text-secondary)'),
                    }}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            {activeSection === 'account' && (
              <>
                <div
                  className="p-6 rounded-2xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                >
                  <h3 className="text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                    Account Information
                  </h3>

                  <div className="mb-6">
                    <Label className="mb-3 block" style={{ color: 'var(--text-secondary)' }}>
                      Profile Photo
                    </Label>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-18 h-18 rounded-full flex items-center justify-center"
                        style={{ background: '#047857' }}
                      >
                        <User className="w-9 h-9 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4" />
                          Upload Photo
                        </Button>
                        <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" style={{ color: 'var(--text-secondary)' }}>
                        Full Name
                      </Label>
                      <Input id="fullName" defaultValue="Ali Johnson" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="email" style={{ color: 'var(--text-secondary)' }}>
                        Email
                      </Label>
                      <Input id="email" type="email" defaultValue="ali.johnson@example.com" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="phone" style={{ color: 'var(--text-secondary)' }}>
                        Phone
                      </Label>
                      <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="location" style={{ color: 'var(--text-secondary)' }}>
                        Location
                      </Label>
                      <Input id="location" defaultValue="San Francisco, CA" className="mt-1.5" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button variant="gradient" className="shadow-[var(--shadow-glow)]">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'password' && (
              <div
                className="p-6 rounded-2xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
              >
                <h3 className="text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                  Change Password
                </h3>

                <div className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword" style={{ color: 'var(--text-secondary)' }}>
                      Current Password
                    </Label>
                    <div className="relative mt-1.5">
                      <Input id="currentPassword" type={showPassword ? 'text' : 'password'} />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword" style={{ color: 'var(--text-secondary)' }}>
                      New Password
                    </Label>
                    <Input id="newPassword" type="password" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" style={{ color: 'var(--text-secondary)' }}>
                      Confirm New Password
                    </Label>
                    <Input id="confirmPassword" type="password" className="mt-1.5" />
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="gradient" className="shadow-[var(--shadow-glow)]">
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div
                className="p-6 rounded-2xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
              >
                <h3 className="text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {[
                    { id: 'jobMatches', label: 'New job matches', description: 'Get notified when new jobs match your profile' },
                    { id: 'applicationUpdates', label: 'Application updates', description: 'Updates about your job applications' },
                    { id: 'messages', label: 'Messages', description: 'New messages from recruiters' },
                    { id: 'profileViews', label: 'Profile views', description: 'When recruiters view your profile' },
                    { id: 'weeklyDigest', label: 'Weekly digest', description: 'Weekly summary of activity' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ background: 'var(--bg-tertiary)' }}
                    >
                      <div className="flex-1">
                        <p className="text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                          {item.label}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        checked={notifications[item.id as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, [item.id]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div
                className="p-6 rounded-2xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
              >
                <h3 className="text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                  Privacy Settings
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Privacy settings coming soon. Control who can see your profile and activity.
                </p>
              </div>
            )}

            {activeSection === 'danger' && (
              <div
                className="p-6 rounded-2xl"
                style={{ background: 'var(--bg-secondary)', border: '2px solid var(--danger)' }}
              >
                <h3 className="text-lg mb-2" style={{ color: 'var(--danger)' }}>
                  Delete Account
                </h3>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive">
                  Delete My Account
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
