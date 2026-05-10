import { motion } from 'motion/react';
import { Sparkles, X, Plus } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { Input } from '@/adapters/primary/ui/components/base/input';
import { Label } from '@/adapters/primary/ui/components/base/label';
import { useState } from 'react';

const extractedSkills = ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Git'];

export default function PostJob() {
  const [jobType, setJobType] = useState('fulltime');
  const [experience, setExperience] = useState('mid');
  const [skills, setSkills] = useState(extractedSkills);
  const [aiExtracted, setAiExtracted] = useState(false);
  const [salary, setSalary] = useState({ min: 120000, max: 180000 });

  return (
    <AppLayout showBackButton sidebarType="recruiter" userName="Sarah Johnson" userType="Recruiter">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1
            className="text-4xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Post a New Job
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-8 rounded-3xl space-y-6"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <div>
                <Label htmlFor="jobTitle" style={{ color: 'var(--text-secondary)' }}>
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Senior Frontend Developer"
                  className="mt-1.5"
                  defaultValue="Senior Frontend Developer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" style={{ color: 'var(--text-secondary)' }}>
                    Location
                  </Label>
                  <Input id="location" placeholder="e.g. San Francisco, CA" className="mt-1.5" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    <input type="checkbox" className="rounded" defaultChecked />
                    Remote
                  </label>
                </div>
              </div>

              {/* Job Type Segmented Control */}
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Job Type</Label>
                <div className="flex gap-2 mt-1.5 p-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  {[
                    { id: 'fulltime', label: 'Full-Time' },
                    { id: 'parttime', label: 'Part-Time' },
                    { id: 'contract', label: 'Contract' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setJobType(type.id)}
                      className="flex-1 px-4 py-2 rounded-md text-sm transition-all duration-150"
                      style={{
                        background: jobType === type.id ? 'var(--accent-primary)' : 'transparent',
                        color: jobType === type.id ? 'white' : 'var(--text-secondary)',
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Segmented Control */}
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Experience Level</Label>
                <div className="flex gap-2 mt-1.5 p-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  {[
                    { id: 'junior', label: 'Junior' },
                    { id: 'mid', label: 'Mid' },
                    { id: 'senior', label: 'Senior' },
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setExperience(exp.id)}
                      className="flex-1 px-4 py-2 rounded-md text-sm transition-all duration-150"
                      style={{
                        background: experience === exp.id ? 'var(--accent-primary)' : 'transparent',
                        color: experience === exp.id ? 'white' : 'var(--text-secondary)',
                      }}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Salary Range</Label>
                <div className="grid grid-cols-2 gap-4 mt-1.5">
                  <Input
                    type="number"
                    value={salary.min}
                    onChange={(e) => setSalary({ ...salary, min: parseInt(e.target.value) })}
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    value={salary.max}
                    onChange={(e) => setSalary({ ...salary, max: parseInt(e.target.value) })}
                    placeholder="Max"
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}
                </p>
              </div>

              {/* Job Description */}
              <div>
                <Label htmlFor="description" style={{ color: 'var(--text-secondary)' }}>
                  Job Description
                </Label>
                <textarea
                  id="description"
                  rows={8}
                  className="w-full mt-1.5 p-3 rounded-lg text-sm focus:outline-none"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  defaultValue="We are looking for a Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining high-quality web applications using modern frameworks and technologies."
                />
              </div>

              {/* AI Extract Button */}
              <Button
                variant="gradient"
                size="lg"
                className="w-full h-13 shadow-[var(--shadow-glow)]"
                onClick={() => setAiExtracted(true)}
              >
                <Sparkles className="w-5 h-5" />
                Extract Requirements with AI
              </Button>

              {/* AI Results */}
              {aiExtracted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-xl"
                  style={{ background: 'var(--bg-tertiary)', borderLeft: '3px solid var(--accent-secondary)' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                    <h4 className="text-sm" style={{ color: 'var(--accent-secondary)' }}>
                      AI Extracted Requirements
                    </h4>
                  </div>

                  <div className="mb-4">
                    <Label className="mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                      Required Skills
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                          style={{
                            background: 'var(--gradient-radial-subtle)',
                            color: 'var(--accent-primary)',
                            border: '1px solid var(--border-accent)',
                          }}
                        >
                          {skill}
                          <button
                            onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                            className="hover:opacity-70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <button
                        className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                        style={{ border: '1px dashed var(--border-medium)', color: 'var(--text-muted)' }}
                      >
                        <Plus className="w-3 h-3" />
                        Add Skill
                      </button>
                    </div>
                  </div>

                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Extracted Experience:</strong> 3-5 years of professional frontend development
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <Button variant="gradient" size="lg" className="w-full shadow-[var(--shadow-glow)]">
                  Confirm & Post Job
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Live Preview
              </p>
              <div
                className="p-6 rounded-2xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                    style={{ background: 'var(--bg-tertiary)' }}
                  >
                    💼
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>
                      Senior Frontend Developer
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Your Company
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full text-xs"
                      style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}
                    </span>
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
                    >
                      {jobType === 'fulltime' ? 'Full-Time' : jobType === 'parttime' ? 'Part-Time' : 'Contract'}
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
