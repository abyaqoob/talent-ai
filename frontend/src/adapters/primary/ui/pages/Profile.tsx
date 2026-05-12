import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Edit2, Save, X } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Container } from '@/infrastructure/di/Container';
import { Candidate } from '@/domain/entities/User';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => { if (user?.id) loadProfile(); }, [user?.id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const p = await Container.getUserRepository().getCandidateProfile(user!.id);
      if (p) { setProfile(p); setTitle(p.title || ''); setLocation(p.location || ''); }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await Container.getUserRepository().updateCandidateProfile(user.id, { title, location });
      setToast('Profile saved!');
      setEditMode(false);
    } catch (e: any) { setToast(e?.message || 'Failed to save'); }
    finally { setSaving(false); setTimeout(() => setToast(null), 3000); }
  };

  const displayName = profile?.name || user?.name || '—';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  const completion = profile?.profileCompleteness || 0;

  return (
    <AppLayout showBackButton>
      <div className="max-w-6xl mx-auto">
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 right-6 z-50 px-6 py-3 rounded-xl text-sm"
            style={{ background: 'var(--accent-primary)', color: 'white', boxShadow: 'var(--shadow-modal)' }}>
            {toast}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} className="mb-8 flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl shrink-0 overflow-hidden border border-[var(--border-subtle)]"
              style={{ background: 'var(--bg-tertiary)', boxShadow: '0 4px 12px rgba(5,150,105,0.15)' }}>
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[var(--text-primary)] font-semibold">{initials}</span>
              )}
            </div>
            <div className="flex-1 pt-2">
              <h1 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{displayName}</h1>
              {editMode ? (
                <div className="space-y-2 mb-4">
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Your title"
                    className="block w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-primary)', color: 'var(--text-primary)' }} />
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Your location"
                    className="block w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
              ) : (
                <>
                  <p className="text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>{title || profile?.title || 'Add your title'}</p>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{location || user?.location || 'Add location'}</p>
                </>
              )}
              {!loading && (
                <div className="max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Profile {completion}% Complete</span>
                    <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>{completion}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${completion}%`, background: 'linear-gradient(90deg,#059669,#10B981)' }} />
                  </div>
                </div>
              )}
              {/* BUG 8: Profile views count */}
              {!loading && profile && (profile as any).profileViews !== undefined && (
                <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
                  👁 <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
                    {(profile as any).profileViews || 0}
                  </span> profile views this month
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setEditMode(false)}><X className="w-4 h-4" />Cancel</Button>
                <Button variant="gradient" size="sm" onClick={handleSave} disabled={saving}><Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save'}</Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}><Edit2 className="w-4 h-4" />Edit Profile</Button>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'var(--bg-secondary)' }} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Skills</h3>
                {profile?.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full text-sm"
                        style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}>{s}</span>
                    ))}
                  </div>
                ) : <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Upload your CV to extract skills automatically</p>}
              </div>
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Account</h3>
                <div className="space-y-3 text-sm">
                  {[['Email', user?.email],['Role', user?.role],['Member since', user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—']].map(([l,v]) => (
                    <div key={l} className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                      <span className="capitalize" style={{ color: 'var(--text-primary)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>Experience</h3>
                </div>
                {profile?.experience?.length ? (
                  <div className="space-y-6">
                    {profile.experience.map((exp, i) => (
                      <div key={i} className="relative pl-6" style={{ borderLeft: '2px solid var(--border-subtle)' }}>
                        <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                        <h4 className="text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{exp.title}</h4>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{exp.company}</p>
                        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                          {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                        </p>
                        {exp.description && <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Upload your CV to extract experience automatically.</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>Education</h3>
                </div>
                {profile?.education?.length ? (
                  <div className="space-y-4">
                    {profile.education.map((edu, i) => (
                      <div key={i} className="relative pl-6" style={{ borderLeft: '2px solid var(--border-subtle)' }}>
                        <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                        <h4 className="text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{edu.degree} in {edu.field}</h4>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{edu.institution}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {new Date(edu.startDate).getFullYear()} — {edu.current ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No education added yet.</p>}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
