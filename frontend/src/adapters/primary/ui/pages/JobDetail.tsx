import { motion } from 'motion/react';
import { Briefcase, MapPin, DollarSign, Clock, Calendar, CheckCircle, X, Share2, ExternalLink, Code } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/adapters/primary/ui/components/base/breadcrumb';

const jobData = {
  id: '1',
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
  icon: Code,
  location: 'San Francisco, CA',
  type: 'Full-Time',
  salary: '$120k – $180k',
  experience: '3–5 Years',
  posted: '2 days ago',
  match: 92,
  description: `We are looking for a Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining high-quality web applications using modern frameworks and technologies.

In this role, you will collaborate with designers, product managers, and backend engineers to create exceptional user experiences. You'll have the opportunity to work on challenging projects and mentor junior developers.`,
  responsibilities: [
    'Build responsive, performant web applications using React and TypeScript',
    'Collaborate with cross-functional teams to define and implement new features',
    'Write clean, maintainable, and well-tested code',
    'Mentor junior developers and conduct code reviews',
    'Optimize applications for maximum speed and scalability',
  ],
  skills: [
    { name: 'React', match: true },
    { name: 'TypeScript', match: true },
    { name: 'AWS', match: false },
    { name: 'Tailwind CSS', match: true },
    { name: 'Node.js', match: true },
  ],
  companyInfo: {
    employees: '500+',
    founded: '2015',
    website: 'techcorp.com',
    industry: 'Technology',
  },
};

export default function JobDetail() {
  const [activeTab, setActiveTab] = useState<'description' | 'requirements' | 'company'>('description');

  return (
    <AppLayout showBackButton>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Company Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
                >
                  <jobData.icon className="w-8 h-8" style={{ color: '#047857' }} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                    {jobData.company}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {jobData.companyInfo.industry} · {jobData.location}
                  </p>
                </div>
              </div>

              {/* Job Title */}
              <h1
                className="text-4xl mb-6"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {jobData.title}
              </h1>

              {/* Meta Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Clock, label: jobData.type },
                  { icon: MapPin, label: 'Remote' },
                  { icon: DollarSign, label: jobData.salary },
                  { icon: Briefcase, label: jobData.experience },
                  { icon: Calendar, label: `Posted ${jobData.posted}` },
                ].map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                  >
                    <badge.icon className="w-4 h-4" />
                    {badge.label}
                  </span>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'requirements', label: 'Requirements' },
                  { id: 'company', label: 'Company' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className="pb-3 px-1 text-sm transition-all duration-150"
                    style={{
                      color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'description' && (
                  <div>
                    <p
                      className="mb-6 leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {jobData.description}
                    </p>
                    <h3
                      className="text-lg mb-4"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Key Responsibilities
                    </h3>
                    <ul className="space-y-3">
                      {jobData.responsibilities.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                            style={{ background: 'var(--accent-primary)' }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div>
                    <h3
                      className="text-lg mb-4"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Required Skills & Experience
                    </h3>
                    <div className="space-y-3">
                      {jobData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ background: 'var(--bg-secondary)' }}
                        >
                          <span style={{ color: 'var(--text-primary)' }}>{skill.name}</span>
                          {skill.match ? (
                            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--success)' }}>
                              <CheckCircle className="w-4 h-4" />
                              You have this
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--danger)' }}>
                              <X className="w-4 h-4" />
                              Missing
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'company' && (
                  <div>
                    <h3
                      className="text-lg mb-4"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      About {jobData.company}
                    </h3>
                    <p
                      className="mb-6 leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      TechCorp is a leading technology company focused on building innovative solutions for the modern web. We're passionate about creating tools that empower developers and businesses worldwide.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Employees</p>
                        <p style={{ color: 'var(--text-primary)' }}>{jobData.companyInfo.employees}</p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Founded</p>
                        <p style={{ color: 'var(--text-primary)' }}>{jobData.companyInfo.founded}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Sticky Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              {/* Match Score */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="relative w-36 h-36 flex items-center justify-center mb-3"
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
                      strokeDasharray="230 21"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="relative text-center">
                    <div
                      className="text-5xl mb-1"
                      style={{ color: 'var(--accent-secondary)' }}
                    >
                      {jobData.match}%
                    </div>
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Match Score
                </p>
              </div>

              {/* Skill Match */}
              <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <h4 className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  Skill Match
                </h4>
                <div className="space-y-2">
                  {jobData.skills.slice(0, 3).map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {skill.match ? (
                        <>
                          <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                          <span style={{ color: 'var(--success)' }}>{skill.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>✓ You have this</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                          <span style={{ color: 'var(--danger)' }}>{skill.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>✗ Missing</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-6">
                <Button variant="gradient" className="w-full h-13 shadow-[var(--shadow-glow)]">
                  Apply Now
                </Button>
                <Button variant="outline" className="w-full">
                  Save Job
                </Button>
                <Button variant="ghost" size="sm" className="w-full">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Company Info */}
              <div className="pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <h4 className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  Company Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Employees</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{jobData.companyInfo.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Founded</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{jobData.companyInfo.founded}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-muted)' }}>Website</span>
                    <a
                      href={`https://${jobData.companyInfo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {jobData.companyInfo.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
