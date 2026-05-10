import { motion } from 'motion/react';
import { CloudUpload, FileText, CheckCircle, Trash2, Sparkles, Star, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useState } from 'react';

const extractedSkills = [
  { name: 'React', category: 'technical', color: 'rgba(5, 150, 105, 0.12)', textColor: '#047857' },
  { name: 'TypeScript', category: 'technical', color: 'rgba(5, 150, 105, 0.12)', textColor: '#047857' },
  { name: 'Node.js', category: 'technical', color: 'rgba(5, 150, 105, 0.12)', textColor: '#047857' },
  { name: 'Figma', category: 'tool', color: 'rgba(4, 120, 87, 0.12)', textColor: '#065f46' },
  { name: 'MongoDB', category: 'technical', color: 'rgba(5, 150, 105, 0.12)', textColor: '#047857' },
  { name: 'Problem Solving', category: 'soft', color: 'rgba(5, 150, 105, 0.12)', textColor: '#059669' },
];

const feedbackData = {
  strengths: [
    'Strong technical skills in modern web development frameworks',
    'Clear and well-structured work experience section'
  ],
  improvements: [
    'Consider adding quantifiable achievements and metrics',
    'Profile summary could be more impactful and concise'
  ],
  recommendations: [
    'Add links to GitHub projects and portfolio',
    'Include certifications or recent training completed'
  ],
};

export default function CVUpload() {
  const [hasFile, setHasFile] = useState(true);

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
            className="text-4xl mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            CV Upload & AI Analysis
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Upload your resume and get instant AI-powered feedback
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Upload Zone */}
            <div
              className="rounded-3xl p-12 text-center cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{
                border: '3px dashed var(--border-medium)',
                background: 'var(--bg-secondary)',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloudUpload
                className="w-16 h-16 mb-4"
                style={{ color: 'var(--accent-primary)' }}
              />
              <p
                className="text-lg mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Drag & drop your CV here
              </p>
              <p
                className="text-sm mb-4"
                style={{ color: 'var(--text-muted)' }}
              >
                or
              </p>
              <button
                className="text-sm hover:underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                Browse Files
              </button>
            </div>

            <p
              className="text-xs text-center mt-3"
              style={{ color: 'var(--text-muted)' }}
            >
              PDF, DOC, DOCX — Max 5MB
            </p>

            {/* Uploaded File */}
            {hasFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl flex items-center justify-between"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--gradient-radial-subtle)' }}
                  >
                    <FileText
                      className="w-5 h-5"
                      style={{ color: 'var(--accent-primary)' }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-sm"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Resume_AliJohnson.pdf
                      </p>
                      <CheckCircle
                        className="w-4 h-4"
                        style={{ color: 'var(--success)' }}
                      />
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      245 KB
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:opacity-80">
                  <Trash2
                    className="w-4 h-4"
                    style={{ color: 'var(--danger)' }}
                  />
                </button>
              </motion.div>
            )}

            {/* Extracted Skills */}
            {hasFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                <h3
                  className="text-lg mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill, index) => (
                    <motion.span
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="px-3 py-1.5 rounded-full text-sm"
                      style={{
                        background: skill.color,
                        color: skill.textColor,
                        border: `1px solid ${skill.textColor}40`,
                      }}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - AI Feedback */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-8 rounded-3xl"
            style={{
              background: 'var(--bg-secondary)',
              borderLeft: '3px solid var(--accent-secondary)',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles
                className="w-5 h-5"
                style={{ color: 'var(--accent-secondary)' }}
              />
              <h2
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                AI Resume Feedback
              </h2>
            </div>

            {/* Strengths */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle
                  className="w-5 h-5"
                  style={{ color: 'var(--success)' }}
                />
                <h4 className="text-sm" style={{ color: 'var(--success)' }}>
                  Strengths
                </h4>
              </div>
              <ul className="space-y-2 ml-7">
                {feedbackData.strengths.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle
                  className="w-5 h-5"
                  style={{ color: 'var(--warning)' }}
                />
                <h4 className="text-sm" style={{ color: 'var(--warning)' }}>
                  Areas to Improve
                </h4>
              </div>
              <ul className="space-y-2 ml-7">
                {feedbackData.improvements.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Star
                  className="w-5 h-5"
                  style={{ color: 'var(--accent-primary)' }}
                />
                <h4 className="text-sm" style={{ color: 'var(--accent-primary)' }}>
                  Recommended Actions
                </h4>
              </div>
              <ul className="space-y-2 ml-7">
                {feedbackData.recommendations.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Overall Score */}
            <div className="flex flex-col items-center pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div
                className="relative w-32 h-32 flex items-center justify-center mb-3"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(5, 150, 105, 0.15)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="var(--accent-secondary)"
                    strokeWidth="6"
                    strokeDasharray="196 55"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                </svg>
                <div className="relative text-center">
                  <div
                    className="text-4xl mb-1"
                    style={{ color: 'var(--accent-secondary)' }}
                  >
                    78
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    /100
                  </div>
                </div>
              </div>
              <p
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Overall CV Score
              </p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Button variant="outline" size="lg">
            Analyze Another CV
          </Button>
          <Button variant="gradient" size="lg" className="shadow-[var(--shadow-glow)]">
            View Matched Jobs
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
