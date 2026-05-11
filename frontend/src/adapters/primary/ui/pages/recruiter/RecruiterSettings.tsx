import { motion } from 'motion/react';
import { Upload, User, Building2, Globe, Phone, Mail, MapPin, Save } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Input } from '@/adapters/primary/ui/components/base/input';
import { Label } from '@/adapters/primary/ui/components/base/label';
import { useState, useEffect } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Container } from '@/infrastructure/di/Container';

export default function RecruiterSettings() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Account fields (from auth session)
  const [name] = useState(user?.name || '');
  const [email] = useState(user?.email || '');

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
    { id: 'account', label: 'Account' },
    { id: 'company', label: 'Company Profile' },
    { id: 'notifications', label: 'Notifications' },
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
                    color: activeSection === section.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderLeft: activeSection === section.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
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
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                    style={{ background: 'linear-gradient(135deg,#047857,#059669)' }}>
                    {name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || <User />}
                  </div>
                  <div>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{email}</p>
                    <p className="text-xs mt-1 capitalize px-2 py-0.5 rounded-full inline-block"
                      style={{ background: 'rgba(5,150,105,0.12)', color: 'var(--accent-primary)' }}>Recruiter</p>
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
                  { label: 'New Applications', desc: 'Get notified when candidates apply to your jobs' },
                  { label: 'Candidate Messages', desc: 'Receive messages from candidates' },
                  { label: 'Job Expiring', desc: 'Alert when job postings are about to expire' },
                  { label: 'Weekly Report', desc: 'Receive weekly performance summary' },
                ].map(pref => (
                  <div key={pref.label} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{pref.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{pref.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ background: 'var(--accent-primary)' }} />
                    </label>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
