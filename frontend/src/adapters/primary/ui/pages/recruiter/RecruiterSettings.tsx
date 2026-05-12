import { motion, AnimatePresence } from 'motion/react';
import { User, Globe, MapPin, Save, Eye, EyeOff, Loader2, AlertTriangle, Upload } from 'lucide-react';
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

export default function RecruiterSettings() {
  const { user, logout, updateUserFields } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [notifications, setNotifications] = useState({
    applicationUpdates: true,
    messages: true,
  });
  const [prefsLoaded, setPrefsLoaded] = useState(false);

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

  // Account fields — use useEffect so they populate after auth loads
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user?.name, user?.email]);

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [website, setWebsite] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) loadCompanyProfile();
  }, [user?.id]);

  // Load notification preferences
  useEffect(() => {
    if (!user?.id) return;
    apiClient.get<any>('/users/notification-prefs')
      .then(prefs => {
        setNotifications({
          applicationUpdates: prefs.applicationUpdates !== false,
          messages: prefs.messages !== false,
        });
        setPrefsLoaded(true);
      })
      .catch(() => setPrefsLoaded(true));
  }, [user?.id]);

  const loadCompanyProfile = async () => {
    setLoading(true);
    try {
      const profile = await Container.getUserRepository().getRecruiterProfile(user!.id);
      if (profile) {
        setCompanyName(profile.company || '');
        setIndustry(profile.industry || '');
        setCompanySize(profile.companySize || '');
        setWebsite(profile.website || '');
        setCompanyLocation(profile.location || '');
      }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const handleSaveCompany = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await Container.getUserRepository().updateRecruiterProfile(user.id, {
        company: companyName,
        industry,
        companySize,
        website,
        location: companyLocation,
      } as any);
      setToast('Company profile saved!');
    } catch (e: any) {
      setToast(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const sections = [
    { id: 'account', label: 'Account', danger: false },
    { id: 'company', label: 'Company Profile', danger: false },
    { id: 'password', label: 'Password & Security', danger: false },
    { id: 'notifications', label: 'Notifications', danger: false },
    { id: 'danger', label: 'Danger Zone', danger: true },
  ];

  return (
    <AppLayout sidebarType="recruiter" showBackButton>
      <div className="max-w-7xl mx-auto">
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 right-6 z-50 px-6 py-3 rounded-xl text-sm"
            style={{ background: 'var(--accent-primary)', color: 'white', boxShadow: 'var(--shadow-modal)' }}>
            {toast}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-4xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Settings</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {sections.map(section => (
                <button key={section.id} onClick={() => setActiveSection(section.id)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all duration-150 text-sm"
                  style={{
                    background: activeSection === section.id ? 'var(--bg-tertiary)' : 'transparent',
                    color: section.danger ? 'var(--danger)' : (activeSection === section.id ? 'var(--text-primary)' : 'var(--text-secondary)'),
                    borderLeft: activeSection === section.id ? (section.danger ? '3px solid var(--danger)' : '3px solid var(--accent-primary)') : '3px solid transparent',
                  }}>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Account */}
            {activeSection === 'account' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl space-y-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <h2 className="text-2xl" style={{ color: 'var(--text-primary)' }}>Account Information</h2>
                <div className="flex items-center gap-6 pb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden border border-[var(--border-subtle)]"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[var(--text-primary)] text-2xl font-bold">
                        {name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || <User />}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="file"
                        id="recruiter-profile-upload"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={uploadingPhoto}
                        onClick={() => document.getElementById('recruiter-profile-upload')?.click()}
                      >
                        {uploadingPhoto ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        ) : (
                          <Upload className="w-3 h-3 mr-1" />
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
                    <Label style={{ color: 'var(--text-secondary)' }}>Full Name</Label>
                    <Input value={name} readOnly className="mt-1.5 opacity-70" />
                  </div>
                  <div>
                    <Label style={{ color: 'var(--text-secondary)' }}>Email Address</Label>
                    <Input value={email} readOnly className="mt-1.5 opacity-70" />
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  To change your name or email, contact support.
                </p>
              </motion.div>
            )}

            {/* Company Profile */}
            {activeSection === 'company' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl space-y-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl" style={{ color: 'var(--text-primary)' }}>Company Profile</h2>
                  <Button variant="gradient" size="sm" onClick={handleSaveCompany} disabled={saving || loading}>
                    <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save Changes'}
                  </Button>
                </div>

                {loading ? (
                  <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />)}</div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="companyName" style={{ color: 'var(--text-secondary)' }}>Company Name *</Label>
                      <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your Company Inc." className="mt-1.5" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label style={{ color: 'var(--text-secondary)' }}>Industry</Label>
                        <Input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Software Development" className="mt-1.5" />
                      </div>
                      <div>
                        <Label style={{ color: 'var(--text-secondary)' }}>Company Size</Label>
                        <select value={companySize} onChange={e => setCompanySize(e.target.value)}
                          className="w-full mt-1.5 px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                          <option value="">Select size</option>
                          {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map(s => (
                            <option key={s} value={s}>{s} employees</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-secondary)' }}>Website</Label>
                      <div className="relative mt-1.5">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourcompany.com" className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <Label style={{ color: 'var(--text-secondary)' }}>Location</Label>
                      <div className="relative mt-1.5">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        <Input value={companyLocation} onChange={e => setCompanyLocation(e.target.value)} placeholder="e.g. San Francisco, CA" className="pl-10" />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <h2 className="text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h2>
                {[
                  { id: 'applicationUpdates', label: 'New Applications', desc: 'Get notified when candidates apply to your jobs' },
                  { id: 'messages', label: 'Candidate Messages', desc: 'Receive messages from candidates' },
                ].map(pref => (
                  <div key={pref.id} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{pref.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{pref.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[pref.id as keyof typeof notifications]}
                      onCheckedChange={(checked) => {
                        const updated = { ...notifications, [pref.id]: checked };
                        setNotifications(updated);
                        apiClient.put('/users/notification-prefs', {
                          jobMatches: true,
                          ...updated
                        }).catch(() => {});
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Password & Security */}
            {activeSection === 'password' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <h2 className="text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>Change Password</h2>

                <div className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword" style={{ color: 'var(--text-secondary)' }}>Current Password</Label>
                    <div className="relative mt-1.5">
                      <Input id="currentPassword" type={showCurrentPwd ? 'text' : 'password'} value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
                      <button onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-muted)' }} type="button">
                        {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword" style={{ color: 'var(--text-secondary)' }}>New Password</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" className="mt-1.5" />
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="gradient" className="shadow-[var(--shadow-glow)]" onClick={handleChangePassword} disabled={savingPwd}>
                    {savingPwd ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                    {savingPwd ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Danger Zone */}
            {activeSection === 'danger' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '2px solid var(--danger)' }}>
                <h2 className="text-2xl mb-2" style={{ color: 'var(--danger)' }}>Delete Account</h2>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Once you delete your account, there is no going back. This will permanently remove your profile, job postings, and active applications.
                </p>
                <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                  Delete My Account
                </Button>
              </motion.div>
            )}
          </div>
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
                This will permanently remove your profile, job postings, and active applications linked to those jobs. This action cannot be undone.
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
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                  {deleting ? 'Deleting...' : 'Delete Everything'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
