import { motion, AnimatePresence } from 'motion/react';
import { Upload, Eye, EyeOff, User, Loader2, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Input } from '@/adapters/primary/ui/components/base/input';
import { Label } from '@/adapters/primary/ui/components/base/label';
import { Switch } from '@/adapters/primary/ui/components/base/switch';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Container } from '@/infrastructure/di/Container';
import { apiClient } from '@/infrastructure/api/apiClient';

export default function Settings() {
  const { user, logout, updateUserFields } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    jobMatches: true,
    applicationUpdates: true,
    messages: true,
  });
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    setUploadingPhoto(true);
    try {
      const res = await apiClient.upload<any>('/users/profile-picture', formData);
      if (res?.profilePicture) {
        updateUserFields({ profilePicture: res.profilePicture });
        setToast('Profile picture updated successfully!');
      }
    } catch (err: any) {
      setToast(err.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await apiClient.put('/users/profile', { profilePicture: '' });
      updateUserFields({ profilePicture: '' });
      setToast('Profile picture removed');
    } catch (err: any) {
      setToast(err.message || 'Failed to remove photo');
    }
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await apiClient.delete('/users/profile');
      setToast('Account deleted. Redirecting...');
      setTimeout(async () => {
        await logout();
        navigate('/');
      }, 2000);
    } catch (e: any) {
      setToast(e?.message || 'Failed to delete account');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !currentPassword) { setToast('All password fields are required'); return; }
    if (newPassword !== confirmPassword) { setToast('New passwords do not match'); return; }
    if (newPassword.length < 6) { setToast('Password must be at least 6 characters'); return; }
    setSavingPwd(true);
    try {
      await apiClient.post('/users/change-password', { currentPassword, newPassword });
      setToast('Password changed successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) {
      setToast(e?.message || 'Failed to change password');
    } finally {
      setSavingPwd(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    // Set basic info from session immediately
    setName(user.name || '');
    setEmail(user.email || '');
    setPhone((user as any).phone || '');
    setLocation((user as any).location || '');
    
    // Also fetch full candidate profile from API for phone/location/bio
    const fetchProfile = async () => {
      try {
        const profile = await Container.getUserRepository().getCandidateProfile(user.id);
        if (profile) {
          // profile.phone and profile.location come from the User base (not candidate profile)
          // but name/email are always available from session
          if ((profile as any).phone) setPhone((profile as any).phone);
          if ((profile as any).location) setLocation((profile as any).location);
        }
      } catch { /* silent — session data is enough */ }
      setLoading(false);
    };
    fetchProfile();
  }, [user?.id]);

  // Load notification preferences
  useEffect(() => {
    if (!user?.id) return;
    apiClient.get<any>('/users/notification-prefs')
      .then(prefs => {
        setNotifications({
          jobMatches: prefs.jobMatches !== false,
          applicationUpdates: prefs.applicationUpdates !== false,
          messages: prefs.messages !== false,
        });
        setPrefsLoaded(true);
      })
      .catch(() => setPrefsLoaded(true));
  }, [user?.id]);

  const handleSaveAccount = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      // Update base user fields (name, phone, location) via PUT /api/users/profile
      await Container.getUserRepository().update(user.id, { name, phone, location } as any);
      setToast('Account details saved!');
    } catch (e: any) {
      setToast(e?.message || 'Failed to save account');
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const sections = [
    { id: 'account', label: 'Account', danger: false },
    { id: 'password', label: 'Password & Security', danger: false },
    { id: 'notifications', label: 'Notifications', danger: false },
    { id: 'danger', label: 'Danger Zone', danger: true },
  ];

  return (
    <AppLayout showBackButton>
      <div className="max-w-7xl mx-auto">
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 right-6 z-50 px-6 py-3 rounded-xl text-sm"
            style={{ background: 'var(--accent-primary)', color: 'white', boxShadow: 'var(--shadow-modal)' }}>
            {toast}
          </motion.div>
        )}

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

                  {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} /></div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <Label className="mb-3 block" style={{ color: 'var(--text-secondary)' }}>
                          Profile Photo
                        </Label>
                        <div className="flex items-center gap-4">
                          <div
                            className="w-18 h-18 rounded-full flex items-center justify-center overflow-hidden border border-[var(--border-subtle)]"
                            style={{ background: 'var(--bg-tertiary)' }}
                          >
                            {user?.profilePicture ? (
                              <img src={user.profilePicture} alt={name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[var(--text-primary)] text-2xl font-bold">
                                {name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || <User className="w-9 h-9 text-white" />}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="file"
                              id="profile-upload"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              style={{ display: 'none' }}
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={uploadingPhoto}
                              onClick={() => document.getElementById('profile-upload')?.click()}
                            >
                              {uploadingPhoto ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                              ) : (
                                <Upload className="w-4 h-4 mr-1" />
                              )}
                              Upload Photo
                            </Button>
                            <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }} onClick={handleRemovePhoto}>
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
                          <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="email" style={{ color: 'var(--text-secondary)' }}>
                            Email
                          </Label>
                          <Input id="email" type="email" value={email} readOnly className="mt-1.5 opacity-70 cursor-not-allowed" title="Email cannot be changed" />
                        </div>
                        <div>
                          <Label htmlFor="phone" style={{ color: 'var(--text-secondary)' }}>
                            Phone
                          </Label>
                          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="location" style={{ color: 'var(--text-secondary)' }}>
                            Location
                          </Label>
                          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" className="mt-1.5" />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button variant="gradient" className="shadow-[var(--shadow-glow)]" onClick={handleSaveAccount} disabled={saving}>
                          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </>
                  )}
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
                      <Input
                        id="currentPassword"
                        type={showCurrentPwd ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                      <button
                        onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-muted)' }}
                        type="button"
                      >
                        {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword" style={{ color: 'var(--text-secondary)' }}>
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" style={{ color: 'var(--text-secondary)' }}>
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="gradient" className="shadow-[var(--shadow-glow)]" onClick={handleChangePassword} disabled={savingPwd}>
                    {savingPwd ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                    {savingPwd ? 'Updating...' : 'Update Password'}
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
                        onCheckedChange={(checked) => {
                          const updated = { ...notifications, [item.id]: checked };
                          setNotifications(updated);
                          apiClient.put('/users/notification-prefs', updated).catch(() => {});
                        }}
                      />
                    </div>
                  ))}
                </div>
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
                <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                  Delete My Account
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md p-8 rounded-3xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-modal)' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h2 className="text-2xl mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Delete Account?
              </h2>
              <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                This will permanently remove your profile, applications, and all data. This action cannot be undone.
              </p>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1" 
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Everything'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
