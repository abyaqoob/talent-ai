import { motion } from 'motion/react';
import { Github, Linkedin, Globe, Briefcase, GraduationCap, Award, Edit2 } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Button } from '@/adapters/primary/ui/components/base/button';

const profileData = {
  name: 'Ali Johnson',
  title: 'Frontend Developer',
  location: 'San Francisco, CA',
  completion: 75,
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Figma', 'Git', 'MongoDB', 'REST APIs'],
  links: [
    { type: 'github', url: 'github.com/alijohnson', icon: Github },
    { type: 'linkedin', url: 'linkedin.com/in/alijohnson', icon: Linkedin },
    { type: 'portfolio', url: 'alijohnson.dev', icon: Globe },
  ],
  stats: [
    { label: 'Years Experience', value: '4+' },
    { label: 'Applications Sent', value: '12' },
    { label: 'Profile Views', value: '34' },
  ],
  about: 'Passionate frontend developer with 4+ years of experience building modern web applications. Specialized in React, TypeScript, and creating intuitive user experiences. Always eager to learn new technologies and tackle challenging problems.',
  experience: [
    {
      company: 'TechStart Inc.',
      role: 'Senior Frontend Developer',
      period: '2022 - Present',
      description: 'Lead frontend development for SaaS platform serving 50k+ users. Built reusable component library and improved performance by 40%.',
    },
    {
      company: 'Creative Digital',
      role: 'Frontend Developer',
      period: '2020 - 2022',
      description: 'Developed responsive web applications for clients in e-commerce and finance. Collaborated with designers to implement pixel-perfect UIs.',
    },
  ],
  education: [
    {
      institution: 'University of California',
      degree: 'B.S. Computer Science',
      period: '2016 - 2020',
    },
  ],
  certifications: [
    'AWS Certified Developer - Associate',
    'React Advanced Certification',
  ],
};

export default function Profile() {
  return (
    <AppLayout showBackButton>
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-start justify-between"
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl shrink-0"
              style={{
                background: 'linear-gradient(135deg, #047857, #059669)',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              }}
            >
              <span className="text-white font-semibold">AJ</span>
            </div>

            <div className="flex-1 pt-2">
              <h1
                className="text-4xl mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {profileData.name}
              </h1>
              <p className="text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>
                {profileData.title}
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                {profileData.location}
              </p>

              {/* Profile Completion */}
              <div className="max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Profile {profileData.completion}% Complete
                  </span>
                  <span
                    className="text-sm"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}
                  >
                    {profileData.completion}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${profileData.completion}%`,
                      background: 'linear-gradient(90deg, #059669, #10B981)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{ background: 'var(--gradient-radial-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-accent)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                Links
              </h3>
              <div className="space-y-3">
                {profileData.links.map((link, index) => (
                  <a
                    key={index}
                    href={`https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:opacity-80 transition-all"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="text-sm">{link.url}</span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                Quick Stats
              </h3>
              <div className="space-y-3">
                {profileData.stats.map((stat, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {stat.label}
                    </span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-6 rounded-2xl group relative"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <Edit2
                className="absolute top-6 right-6 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              />
              <h3 className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                About
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {profileData.about}
              </p>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-6 rounded-2xl group relative"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <Edit2
                className="absolute top-6 right-6 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              />
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>
                  Experience
                </h3>
              </div>
              <div className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6" style={{ borderLeft: '2px solid var(--border-subtle)' }}>
                    <div
                      className="absolute -left-1.5 top-1 w-3 h-3 rounded-full"
                      style={{ background: 'var(--accent-primary)' }}
                    />
                    <div>
                      <h4 className="text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {exp.role}
                      </h4>
                      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                        {exp.company}
                      </p>
                      <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                        {exp.period}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="p-6 rounded-2xl group relative"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <Edit2
                className="absolute top-6 right-6 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              />
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>
                  Education
                </h3>
              </div>
              <div className="space-y-4">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="relative pl-6" style={{ borderLeft: '2px solid var(--border-subtle)' }}>
                    <div
                      className="absolute -left-1.5 top-1 w-3 h-3 rounded-full"
                      style={{ background: 'var(--accent-primary)' }}
                    />
                    <div>
                      <h4 className="text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {edu.degree}
                      </h4>
                      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                        {edu.institution}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {edu.period}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="p-6 rounded-2xl group relative"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <Edit2
                className="absolute top-6 right-6 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              />
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="text-lg" style={{ color: 'var(--text-primary)' }}>
                  Certifications
                </h3>
              </div>
              <ul className="space-y-2">
                {profileData.certifications.map((cert, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: 'var(--accent-primary)' }}
                    />
                    {cert}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
