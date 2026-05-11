import { motion } from 'motion/react';
import { CloudUpload, FileText, CheckCircle, Trash2, Sparkles, Star, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useState, useRef } from 'react';
import { Container } from '@/infrastructure/di/Container';
import { useAuth } from '@/presentation/hooks/useAuth';

interface ParsedCV {
  skills?: string[];
  about?: string;
  experience?: any[];
  education?: any[];
  yearsOfExperience?: number;
  certifications?: string[];
  links?: { github?: string; linkedin?: string; portfolio?: string };
}

interface CVFeedback {
  strengths?: string[];
  areasToImprove?: string[];
  recommendedActions?: string[];
  overallScore?: number;
}

export default function CVUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [feedback, setFeedback] = useState<CVFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (f: File) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(f.type)) { setError('Only PDF, PNG, or JPG files are allowed'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5MB'); return; }
    setFile(f); setError(null); setUploaded(false); setParsedData(null); setFeedback(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setProgress(10); setError(null);
    try {
      setProgress(35);
      // Step 1: Upload & parse CV
      const parsed = await Container.getUserRepository().uploadCV(file);
      setProgress(70);
      setParsedData(parsed);
      setUploaded(true);

      // Step 2: Save profile with parsed data (if user logged in)
      if (user?.id && parsed) {
        try {
          await Container.getUserRepository().updateCandidateProfile(user.id, {
            skills: parsed.skills,
            experience: parsed.experience,
            education: parsed.education,
          } as any);
        } catch { /* non-critical */ }
      }
      setProgress(85);

      // Step 3: Get AI feedback
      if (parsed) {
        setAnalyzing(true);
        try {
          const fb = await Container.getUserRepository().analyzeCV(parsed);
          setFeedback(fb);
        } catch { /* feedback is optional */ }
        setAnalyzing(false);
      }
      setProgress(100);
    } catch (e: any) {
      setError(e?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  };

  const score = feedback?.overallScore ?? 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDash = (score / 100) * circumference;

  return (
    <AppLayout showBackButton>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>CV Upload & AI Analysis</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Upload your resume and get instant AI-powered feedback. Your profile is updated automatically.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            {/* Drop Zone */}
            <div
              onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-3xl p-12 text-center cursor-pointer transition-all duration-200"
              style={{ border: `3px dashed ${file ? 'var(--accent-primary)' : 'var(--border-medium)'}`, background: 'var(--bg-secondary)', minHeight: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <CloudUpload className="w-16 h-16 mb-4" style={{ color: file ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
              <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Drag & drop your CV here</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>or</p>
              <button className="text-sm hover:underline" style={{ color: 'var(--accent-primary)' }}>Browse Files</button>
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
            </div>
            <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>PDF, PNG, JPG — Max 5MB</p>

            {error && (
              <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            {/* Selected file */}
            {file && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl flex items-center justify-between"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-radial-subtle)' }}>
                    <FileText className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                      {uploaded && <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <button className="p-2 hover:opacity-80" onClick={() => { setFile(null); setUploaded(false); setParsedData(null); setFeedback(null); }}>
                  <Trash2 className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                </button>
              </motion.div>
            )}

            {/* Progress */}
            {(uploading || analyzing) && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <span>{analyzing ? 'Generating AI feedback…' : 'Uploading & parsing CV…'}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                  <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
                    style={{ background: 'var(--gradient-primary)' }} />
                </div>
              </div>
            )}

            {/* Upload Button */}
            {file && !uploaded && (
              <Button variant="gradient" size="lg" className="w-full mt-6 shadow-[var(--shadow-glow)]"
                onClick={handleUpload} disabled={uploading}>
                <Sparkles className="w-5 h-5" />{uploading ? 'Analyzing…' : 'Upload & Analyze CV'}
              </Button>
            )}

            {/* Extracted Skills */}
            {parsedData?.skills && parsedData.skills.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
                <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>✅ Extracted Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill, i) => (
                    <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.04 }} className="px-3 py-1.5 rounded-full text-sm"
                      style={{ background: 'rgba(5,150,105,0.12)', color: '#047857', border: '1px solid rgba(5,150,105,0.3)' }}>
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Profile Update Notice */}
            {uploaded && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl flex items-center gap-3"
                style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.3)' }}>
                <CheckCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--success)' }} />
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Your profile has been updated with the extracted CV data. Visit <strong>My Profile</strong> to see changes.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right — AI Feedback */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="p-8 rounded-3xl"
            style={{ background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-secondary)' }}>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>AI Resume Feedback</h2>
            </div>

            {!feedback && !analyzing && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Upload your CV to receive AI-powered strengths analysis, improvement suggestions, and an overall score.
              </p>
            )}

            {analyzing && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 rounded animate-pulse" style={{ background: 'var(--bg-tertiary)', width: `${60 + i * 10}%` }} />
                ))}
              </div>
            )}

            {feedback && (
              <>
                {/* Score circle */}
                {feedback.overallScore !== undefined && (
                  <div className="flex flex-col items-center mb-8 pb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="relative w-36 h-36 flex items-center justify-center mb-3">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(5,150,105,0.15)" strokeWidth="6" />
                        <motion.circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-secondary)" strokeWidth="6"
                          strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
                          strokeLinecap="round" transform="rotate(-90 50 50)"
                          initial={{ strokeDasharray: `0 ${circumference}` }}
                          animate={{ strokeDasharray: `${strokeDash} ${circumference - strokeDash}` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }} />
                      </svg>
                      <div className="relative text-center">
                        <div className="text-4xl font-bold" style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>{score}</div>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>/100</div>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Overall CV Score</p>
                  </div>
                )}

                {/* Strengths */}
                {feedback.strengths && feedback.strengths.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
                      <h4 className="text-sm font-semibold" style={{ color: 'var(--success)' }}>Strengths</h4>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {feedback.strengths.map((s, i) => <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {s}</li>)}
                    </ul>
                  </div>
                )}

                {/* Areas to improve */}
                {feedback.areasToImprove && feedback.areasToImprove.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                      <h4 className="text-sm font-semibold" style={{ color: 'var(--warning)' }}>Areas to Improve</h4>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {feedback.areasToImprove.map((s, i) => <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {s}</li>)}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {feedback.recommendedActions && feedback.recommendedActions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                      <h4 className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>Recommendations</h4>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {feedback.recommendedActions.map((s, i) => <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {s}</li>)}
                    </ul>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
