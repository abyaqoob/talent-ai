import { motion } from 'motion/react';
import { Briefcase, MapPin, DollarSign, Clock, Calendar, CheckCircle, X, Share2, ExternalLink, Loader2 } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/adapters/primary/ui/components/base/breadcrumb';
import { apiClient } from '@/infrastructure/api/apiClient';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'description' | 'requirements' | 'company'>('description');
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const data = await apiClient.get<any>(`/jobs/${id}`);
        setJobData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!id || hasApplied) return;
    setApplying(true);
    setMessage(null);
    try {
      await apiClient.post(`/jobs/${id}/apply`);
      setHasApplied(true);
      setMessage({ type: 'success', text: 'Application submitted successfully' });
    } catch (err: any) {
      if (err.message.includes('already applied')) {
        setHasApplied(true);
        setMessage({ type: 'error', text: 'You have already applied to this job' });
      } else {
        setMessage({ type: 'error', text: err.message || 'Failed to apply' });
      }
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!id || hasSaved) return;
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.post(`/users/saved-jobs/${id}`);
      setHasSaved(true);
      setMessage({ type: 'success', text: 'Job saved successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save job' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout showBackButton>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      </AppLayout>
    );
  }

  if (error || !jobData) {
    return (
      <AppLayout showBackButton>
        <div className="p-6 text-center text-red-500">{error || 'Job not found'}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBackButton>
      <div className="max-w-7xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/jobs" style={{ color: 'var(--text-secondary)' }}>
                Find Jobs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator style={{ color: 'var(--text-muted)' }} />
            <BreadcrumbItem>
              <BreadcrumbPage style={{ color: 'var(--text-primary)' }}>
                {jobData.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {message && (
          <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                  <Briefcase className="w-8 h-8" style={{ color: '#047857' }} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{jobData.company || 'Company Name'}</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Technology · {jobData.location}</p>
                </div>
              </div>

              <h1 className="text-4xl mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{jobData.title}</h1>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Clock, label: jobData.jobType || jobData.type || 'Full-Time' },
                  { icon: MapPin, label: jobData.workMode || 'Remote' },
                  { icon: DollarSign, label: jobData.salaryRange ? `$${jobData.salaryRange.min/1000}k - $${jobData.salaryRange.max/1000}k` : 'Competitive' },
                  { icon: Briefcase, label: jobData.experienceLevel || 'Mid' },
                  { icon: Calendar, label: `Posted ${new Date(jobData.createdAt || Date.now()).toLocaleDateString()}` },
                ].map((badge, index) => (
                  <span key={index} className="px-3 py-1.5 rounded-full text-sm flex items-center gap-2" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    <badge.icon className="w-4 h-4" />
                    {badge.label}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'requirements', label: 'Requirements' },
                  { id: 'company', label: 'Company' },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className="pb-3 px-1 text-sm transition-all duration-150" style={{ color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)', borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent' }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {activeTab === 'description' && (
                  <div>
                    <p className="mb-6 leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{jobData.description}</p>
                    {jobData.responsibilities && jobData.responsibilities.length > 0 && (
                      <>
                        <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Key Responsibilities</h3>
                        <ul className="space-y-3">
                          {jobData.responsibilities.map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-3" style={{ color: 'var(--text-secondary)' }}>
                              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: 'var(--accent-primary)' }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
                {activeTab === 'requirements' && (
                  <div>
                    <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Required Skills & Experience</h3>
                    <div className="space-y-3">
                      {(jobData.requirements || jobData.skills || []).map((skill: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                          <span style={{ color: 'var(--text-primary)' }}>{typeof skill === 'string' ? skill : skill.name}</span>
                          <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--success)' }}><CheckCircle className="w-4 h-4" /> Requirement</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'company' && (
                  <div>
                    <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>About {jobData.company || 'the Company'}</h3>
                    <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>A great place to work with an amazing culture and competitive benefits.</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:sticky lg:top-8 h-fit">
            <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-36 h-36 flex items-center justify-center mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(5, 150, 105, 0.15)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-secondary)" strokeWidth="6" strokeDasharray="230 21" strokeLinecap="round" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="relative text-center">
                    <div className="text-5xl mb-1" style={{ color: 'var(--accent-secondary)' }}>{jobData.matchScore || 85}%</div>
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Match Score</p>
              </div>

              <div className="space-y-3 mb-6">
                <Button variant="gradient" className="w-full h-13 shadow-[var(--shadow-glow)]" onClick={handleApply} disabled={applying || hasApplied}>
                  {applying ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {hasApplied ? 'Applied' : 'Apply Now'}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleSave} disabled={saving || hasSaved}>
                  {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {hasSaved ? 'Saved' : 'Save Job'}
                </Button>
                <Button variant="ghost" size="sm" className="w-full"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
