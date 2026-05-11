import { motion } from 'motion/react';
import { Sparkles, X, Plus, CheckCircle } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Input } from '@/adapters/primary/ui/components/base/input';
import { Label } from '@/adapters/primary/ui/components/base/label';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { apiClient } from '@/infrastructure/api/apiClient';

export default function PostJob() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(true);
  const [jobType, setJobType] = useState<'full-time' | 'part-time' | 'contract' | 'internship'>('full-time');
  const [experience, setExperience] = useState<'junior' | 'mid' | 'senior' | 'lead'>('mid');
  const [salaryMin, setSalaryMin] = useState(80000);
  const [salaryMax, setSalaryMax] = useState(120000);
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExtractSkillsWithAI = async () => {
    if (!description.trim()) { setError('Please enter a job description first'); return; }
    setExtracting(true); setError(null);
    try {
      const res = await apiClient.post<any>('/jobs/extract-skills', {
        description: description.trim()
      });
      const aiData = res?.data || res;
      if (aiData?.skills?.length) {
        setSkills(prev => {
          const merged = [...new Set([...prev, ...aiData.skills])];
          return merged;
        });
        if (aiData.experienceLevel) {
          setExperience(aiData.experienceLevel as any);
        }
      } else {
        setError('AI could not extract skills. Add them manually.');
      }
    } catch (e: any) {
      setError('AI extraction failed: ' + (e?.message || 'Check your OpenRouter key'));
    } finally { setExtracting(false); }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills(prev => [...prev, s]); setNewSkill(''); }
  };

  const handlePost = async () => {
    if (!jobTitle.trim()) { setError('Job title is required'); return; }
    if (!description.trim()) { setError('Job description is required'); return; }
    setPosting(true); setError(null);
    try {
      // POST /api/jobs with exact backend schema fields
      await apiClient.post<any>('/jobs', {
        title: jobTitle.trim(),
        location: isRemote ? 'Remote' : (location.trim() || 'Remote'),
        workMode: isRemote ? 'remote' : 'onsite',
        jobType: jobType,         // 'full-time' | 'part-time' | 'contract' | 'internship'
        experienceLevel: experience, // 'junior' | 'mid' | 'senior' | 'lead'
        salaryRange: {
          min: salaryMin,
          max: salaryMax,
          currency: 'USD',
        },
        description: description.trim(),
        requirements: skills,
        skills: skills,
      });
      setSuccess(true);
      // ✅ BUG FIX: Redirect to /recruiter/jobs (not a non-existent route)
      setTimeout(() => navigate('/recruiter/jobs'), 1500);
    } catch (e: any) {
      setError(e?.message || 'Failed to post job. Check your connection.');
    } finally { setPosting(false); }
  };

  return (
    <AppLayout showBackButton sidebarType="recruiter">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-4xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Post a New Job</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Fill in the details below. AI will help extract required skills.</p>
        </motion.div>

        {success && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)' }}>
            <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
            <span style={{ color: 'var(--success)' }}>Job posted successfully! Redirecting to Manage Jobs…</span>
          </motion.div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="p-8 rounded-3xl space-y-6"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>

              <div>
                <Label htmlFor="jobTitle" style={{ color: 'var(--text-secondary)' }}>Job Title *</Label>
                <Input id="jobTitle" value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer" className="mt-1.5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" style={{ color: 'var(--text-secondary)' }}>Location</Label>
                  <Input id="location" value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. New York, NY" className="mt-1.5" disabled={isRemote} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={isRemote} onChange={e => setIsRemote(e.target.checked)} className="rounded" />
                    Remote
                  </label>
                </div>
              </div>

              {/* Job Type */}
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Job Type</Label>
                <div className="flex gap-2 mt-1.5 p-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  {[
                    { id: 'full-time', label: 'Full-Time' },
                    { id: 'part-time', label: 'Part-Time' },
                    { id: 'contract', label: 'Contract' },
                    { id: 'internship', label: 'Internship' },
                  ].map(t => (
                    <button key={t.id} type="button" onClick={() => setJobType(t.id as any)}
                      className="flex-1 px-3 py-2 rounded-md text-sm transition-all duration-150"
                      style={{ background: jobType === t.id ? 'var(--accent-primary)' : 'transparent', color: jobType === t.id ? 'white' : 'var(--text-secondary)' }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Experience Level</Label>
                <div className="flex gap-2 mt-1.5 p-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  {[
                    { id: 'junior', label: 'Junior' },
                    { id: 'mid', label: 'Mid' },
                    { id: 'senior', label: 'Senior' },
                    { id: 'lead', label: 'Lead' },
                  ].map(e => (
                    <button key={e.id} type="button" onClick={() => setExperience(e.id as any)}
                      className="flex-1 px-3 py-2 rounded-md text-sm transition-all duration-150"
                      style={{ background: experience === e.id ? 'var(--accent-primary)' : 'transparent', color: experience === e.id ? 'white' : 'var(--text-secondary)' }}>
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary */}
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Salary Range (USD/year)</Label>
                <div className="grid grid-cols-2 gap-4 mt-1.5">
                  <div>
                    <Input type="number" value={salaryMin} onChange={e => setSalaryMin(parseInt(e.target.value) || 0)} placeholder="Min (e.g. 80000)" />
                  </div>
                  <div>
                    <Input type="number" value={salaryMax} onChange={e => setSalaryMax(parseInt(e.target.value) || 0)} placeholder="Max (e.g. 120000)" />
                  </div>
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                  ${salaryMin.toLocaleString()} — ${salaryMax.toLocaleString()} per year
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" style={{ color: 'var(--text-secondary)' }}>Job Description *</Label>
                <textarea id="description" rows={8} value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full mt-1.5 p-3 rounded-lg text-sm focus:outline-none"
                  placeholder="Describe the role, responsibilities, qualifications, and what makes this position unique..."
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', resize: 'vertical' }} />
              </div>

              {/* AI Extract Button */}
              <Button type="button" variant="gradient" size="lg" className="w-full shadow-[var(--shadow-glow)]"
                onClick={handleExtractSkillsWithAI} disabled={extracting || !description.trim()}>
                <Sparkles className="w-5 h-5" />
                {extracting ? 'AI is extracting skills…' : 'Extract Required Skills with AI'}
              </Button>

              {/* Skills */}
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Required Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                      style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}>
                      {skill}
                      <button type="button" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
                        className="hover:opacity-70 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Click "Extract with AI" or add manually below</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    placeholder="Add skill manually…"
                    className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ border: '1px dashed var(--border-medium)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
                  <button type="button" onClick={addSkill}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: 'var(--accent-primary)', color: 'white' }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button type="button" variant="gradient" size="lg" className="w-full shadow-[var(--shadow-glow)]"
                  onClick={handlePost} disabled={posting || success}>
                  {posting ? 'Posting Job…' : 'Post Job Now'}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="lg:col-span-1">
            <div className="sticky top-8">
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Live Preview</p>
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-lg mb-0.5 truncate font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {jobTitle || 'Job Title'}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {isRemote ? '📍 Remote' : location || '📍 Location'}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-full text-xs"
                      style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)' }}>{skill}</span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Skills appear here</span>
                  )}
                </div>
                <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      ${Math.round(salaryMin / 1000)}k — ${Math.round(salaryMax / 1000)}k/yr
                    </span>
                    <span className="px-2 py-1 rounded text-xs capitalize" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                      {jobType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
