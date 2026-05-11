import { motion } from 'motion/react';
import { Sparkles, CheckCircle, X, Send, User, MapPin, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Switch } from '@/adapters/primary/ui/components/base/switch';
import { Label } from '@/adapters/primary/ui/components/base/label';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { apiClient } from '@/infrastructure/api/apiClient';

interface CandidateDetailData {
  applicationId: string;
  status: string;
  candidateId: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  about?: string;
  skills: string[];
  experience: Array<{ title: string; company: string; timeline: string; description: string }>;
  education: Array<{ degree: string; institute: string; duration: string }>;
  yearsOfExperience?: number;
}

export default function CandidateDetail() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [blindHiring, setBlindHiring] = useState(false);
  const [data, setData] = useState<CandidateDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (candidateId) loadCandidateData();
  }, [candidateId]);

  const loadCandidateData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all recruiter applications and find the one matching candidateId
      const applications = await apiClient.get<any[]>('/applications/recruiter/all');
      const appArr = Array.isArray(applications) ? applications : [];

      // Find the most recent application from this candidate
      const app = appArr.find(
        (a: any) => a.candidate?.id === candidateId || a.candidateId === candidateId
      );

      if (!app) {
        setError('Candidate not found or has not applied to your jobs');
        return;
      }

      const candidate = app.candidate || {};
      const profile = candidate.profile || {};

      setData({
        applicationId: app.id || app._id,
        status: app.status || 'applied',
        candidateId: candidate.id || candidateId!,
        name: candidate.name || 'Unknown Candidate',
        email: candidate.email || '',
        phone: candidate.phone,
        location: candidate.location,
        about: profile.about,
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        yearsOfExperience: profile.yearsOfExperience,
      });

      // Track profile view (BUG 8)
      try {
        await apiClient.post(`/users/profile-view/${candidateId}`);
      } catch { /* non-critical */ }

    } catch (err: any) {
      setError(err?.message || 'Failed to load candidate data');
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async () => {
    if (!data?.applicationId) return;
    setActionLoading('shortlist');
    try {
      await apiClient.patch(`/applications/${data.applicationId}/status`, { status: 'shortlisted' });
      setData(prev => prev ? { ...prev, status: 'shortlisted' } : prev);
      showToast('success', 'Candidate shortlisted!');
    } catch (e: any) {
      showToast('error', e?.message || 'Failed to shortlist');
    } finally {
      setActionLoading(null); }
  };

  const handleReject = async () => {
    if (!data?.applicationId) return;
    setActionLoading('reject');
    try {
      await apiClient.patch(`/applications/${data.applicationId}/status`, { status: 'rejected' });
      setData(prev => prev ? { ...prev, status: 'rejected' } : prev);
      showToast('success', 'Candidate rejected.');
    } catch (e: any) {
      showToast('error', e?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendProposal = async () => {
    if (!data?.candidateId) return;
    setActionLoading('proposal');
    try {
      await apiClient.post('/messages', {
        recipientId: data.candidateId,
        content: 'We would like to move forward with your application. Please let us know your availability for the next steps.',
      });
      showToast('success', 'Proposal sent to candidate!');
    } catch (e: any) {
      showToast('error', e?.message || 'Failed to send proposal');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      shortlisted: '#059669', hired: '#15803D', offered: '#047857',
      rejected: '#EF4444', applied: '#3B82F6', interviewing: '#10B981',
    };
    return colors[status] || '#6B7280';
  };

  if (loading) {
    return (
      <AppLayout showBackButton sidebarType="recruiter">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout showBackButton sidebarType="recruiter">
        <div className="p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>{error || 'Candidate not found'}</p>
        </div>
      </AppLayout>
    );
  }

  const initials = data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AppLayout showBackButton sidebarType="recruiter">
      <div className="max-w-7xl mx-auto">
        {/* Toast */}
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 right-6 z-50 px-6 py-3 rounded-xl text-sm font-medium"
            style={{
              background: toast.type === 'success' ? 'var(--accent-primary)' : '#EF4444',
              color: 'white', boxShadow: 'var(--shadow-modal)'
            }}>
            {toast.text}
          </motion.div>
        )}

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-sm capitalize font-medium"
              style={{ background: `${getStatusColor(data.status)}20`, color: getStatusColor(data.status) }}>
              {data.status.replace('_', ' ')}
            </span>
            <Label htmlFor="blindHiring" className="text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              Blind Hiring
            </Label>
            <Switch id="blindHiring" checked={blindHiring} onCheckedChange={setBlindHiring} />
          </div>
          <Button variant="gradient" size="lg" onClick={handleSendProposal}
            disabled={actionLoading === 'proposal'} className="shadow-[var(--shadow-glow)]">
            {actionLoading === 'proposal' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Proposal
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column — Candidate Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }} className="lg:col-span-3">
            <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-3 text-white text-2xl font-bold"
                  style={{ background: blindHiring ? 'rgba(100,100,100,0.3)' : 'linear-gradient(135deg,#047857,#059669)' }}>
                  {blindHiring ? '?' : initials}
                </div>
                <h2 className="text-xl mb-1 text-center" style={{ color: 'var(--text-primary)' }}>
                  {blindHiring ? 'Anonymous Candidate' : data.name}
                </h2>
                {data.yearsOfExperience !== undefined && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {data.yearsOfExperience} yrs experience
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 mb-6">
                {!blindHiring && data.email && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                    <span className="truncate">{data.email}</span>
                  </div>
                )}
                {data.location && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin className="w-3 h-3 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    {blindHiring ? '[Location Hidden]' : data.location}
                  </div>
                )}
              </div>

              {/* Skills */}
              {data.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm mb-3 font-medium" style={{ color: 'var(--text-primary)' }}>Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-full text-xs"
                        style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="gradient" className="w-full shadow-[var(--shadow-glow)]"
                  onClick={handleShortlist} disabled={actionLoading === 'shortlist' || data.status === 'shortlisted'}>
                  {actionLoading === 'shortlist'
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CheckCircle className="w-4 h-4" />}
                  {data.status === 'shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
                </Button>
                <Button variant="destructive" className="w-full"
                  onClick={handleReject} disabled={actionLoading === 'reject' || data.status === 'rejected'}>
                  {actionLoading === 'reject'
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <X className="w-4 h-4" />}
                  {data.status === 'rejected' ? 'Rejected' : 'Reject'}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Center Column — Summary & Experience */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }} className="lg:col-span-5 space-y-6">

            {/* AI Summary / About */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-secondary)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                <h3 className="text-lg" style={{ color: 'var(--accent-secondary)' }}>Candidate Summary</h3>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {data.about || 'No summary provided. The candidate has not uploaded a CV yet.'}
              </p>
            </div>

            {/* Experience */}
            {data.experience.length > 0 && (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>Experience</h3>
                </div>
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="pb-4" style={{ borderBottom: i < data.experience.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{exp.title}</p>
                      <p className="text-sm" style={{ color: 'var(--accent-primary)' }}>{exp.company}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{exp.timeline}</p>
                      {exp.description && <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>Education</h3>
                </div>
                <div className="space-y-3">
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{edu.degree}</p>
                      <p className="text-sm" style={{ color: 'var(--accent-primary)' }}>{edu.institute}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{edu.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column — Skill match placeholder */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }} className="lg:col-span-4">
            <div className="p-6 rounded-2xl sticky top-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="text-sm mb-4 font-medium" style={{ color: 'var(--text-primary)' }}>Skill Overview</h3>
              {data.skills.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No skills data available — candidate hasn't uploaded a CV.</p>
              ) : (
                <div className="space-y-3">
                  {data.skills.slice(0, 8).map(skill => (
                    <div key={skill}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                        <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full" style={{ width: '80%', background: 'var(--accent-primary)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
