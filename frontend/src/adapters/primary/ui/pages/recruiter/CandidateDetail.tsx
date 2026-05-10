import { motion } from 'motion/react';
import { Sparkles, CheckCircle, X, Download, Send } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Switch } from '@/adapters/primary/ui/components/base/switch';
import { Label } from '@/adapters/primary/ui/components/base/label';
import { useParams } from 'react-router';
import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/adapters/primary/ui/components/base/breadcrumb';

const candidateData = {
  candidateNumber: '#041',
  match: 92,
  skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'MongoDB'],
  experience: '4 years',
  education: 'Bachelor\'s Degree',
  location: 'San Francisco, CA',
  summary: 'Highly skilled frontend developer with extensive experience in React and TypeScript. Demonstrated ability to build scalable web applications and lead technical initiatives. Strong problem-solving skills and collaborative team player.',
  skillMatches: [
    { name: 'React', match: true, level: 100 },
    { name: 'TypeScript', match: true, level: 100 },
    { name: 'Node.js', match: true, level: 85 },
    { name: 'AWS', match: false, level: 40 },
    { name: 'GraphQL', match: true, level: 70 },
  ],
  extractedExperience: [
    'Led frontend development for SaaS platform with 50k+ users',
    'Built reusable component library improving development speed by 40%',
    'Mentored junior developers and conducted code reviews',
  ],
  extractedEducation: [
    'B.S. Computer Science, University of California (2016-2020)',
    'Relevant coursework: Web Development, Algorithms, Data Structures',
  ],
};

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const [blindHiring, setBlindHiring] = useState(true);

  return (
    <AppLayout showBackButton sidebarType="recruiter" userName="Sarah Johnson" userType="Recruiter">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/recruiter/jobs/1/pipeline" style={{ color: 'var(--text-secondary)' }}>
                Senior Frontend Developer Pipeline
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator style={{ color: 'var(--text-muted)' }} />
            <BreadcrumbItem>
              <BreadcrumbPage style={{ color: 'var(--text-primary)' }}>
                Candidate {candidateData.candidateNumber}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Label htmlFor="blindHiring" className="text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              Blind Hiring
            </Label>
            <Switch
              id="blindHiring"
              checked={blindHiring}
              onCheckedChange={setBlindHiring}
            />
          </div>
          <Button variant="gradient" size="lg" className="shadow-[var(--shadow-glow)]">
            <Send className="w-4 h-4" />
            Send Proposal
          </Button>
        </motion.div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Candidate Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              {/* Masked Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: blindHiring ? 'rgba(100, 100, 100, 0.3)' : 'var(--gradient-primary)',
                    backdropFilter: blindHiring ? 'blur(10px)' : 'none',
                  }}
                >
                  <span className="text-2xl" style={{ color: blindHiring ? 'var(--text-muted)' : 'white' }}>
                    {blindHiring ? '?' : 'AJ'}
                  </span>
                </div>
                <h2 className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  Candidate {candidateData.candidateNumber}
                </h2>
                <div
                  className="text-4xl mb-1"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}
                >
                  {candidateData.match}%
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Match Score
                </p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidateData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full text-xs"
                      style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Experience</span>
                  <span style={{ color: 'var(--text-primary)' }}>{candidateData.experience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Education</span>
                  <span style={{ color: 'var(--text-primary)' }}>{candidateData.education}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Location</span>
                  <span style={{ color: 'var(--text-primary)' }}>{candidateData.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="gradient" className="w-full shadow-[var(--shadow-glow)]">
                  <CheckCircle className="w-4 h-4" />
                  Shortlist
                </Button>
                <Button variant="destructive" className="w-full">
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Center Column - AI Summary & Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* AI Summary */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-secondary)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                <h3 className="text-lg" style={{ color: 'var(--accent-secondary)' }}>
                  AI Candidate Summary
                </h3>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {candidateData.summary}
              </p>
            </div>

            {/* Skill Match Breakdown */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                Skill Match Breakdown
              </h3>
              <div className="space-y-4">
                {candidateData.skillMatches.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          {skill.name}
                        </span>
                        {skill.match ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                        ) : (
                          <X className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                        )}
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'var(--bg-tertiary)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${skill.level}%`,
                          background: skill.match ? 'var(--success)' : 'var(--danger)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Experience */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                Experience Highlights
              </h3>
              <ul className="space-y-2">
                {candidateData.extractedExperience.map((exp, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: 'var(--accent-primary)' }}
                    />
                    {exp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Extracted Education */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                Education
              </h3>
              <ul className="space-y-2">
                {candidateData.extractedEducation.map((edu, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: 'var(--accent-primary)' }}
                    />
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Column - CV Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-4"
          >
            <div
              className="p-6 rounded-2xl sticky top-8"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Original CV
                </h3>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>

              {/* CV Preview */}
              <div
                className="rounded-xl overflow-hidden aspect-[8.5/11]"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="p-8 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <div className="text-center mb-6">
                    <div className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                      {blindHiring ? 'Candidate ' + candidateData.candidateNumber : 'Ali Johnson'}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {blindHiring ? '[Contact Hidden]' : 'ali.johnson@example.com'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Summary</div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      Frontend developer with 4+ years experience...
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Experience</div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      Senior Frontend Developer<br />
                      TechStart Inc. (2022 - Present)
                    </div>
                  </div>

                  <div>
                    <div className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Skills</div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      React, TypeScript, Node.js, AWS...
                    </div>
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
