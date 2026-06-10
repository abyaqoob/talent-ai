import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Upload, Brain, Briefcase, CheckCircle, Users, TrendingUp, Shield, ArrowRight, X, Lock } from 'lucide-react';
import { ThemeToggle } from '@/adapters/primary/ui/components/ThemeToggle';
import { Button } from '@/adapters/primary/ui/components/base/button';

export default function Landing() {
  const [activeModalTab, setActiveModalTab] = useState<'candidates' | 'recruiters' | 'how-it-works' | null>(null);

  return (
    <div className="min-h-screen mesh-gradient" style={{ background: 'var(--bg-primary)' }}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
        <div 
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--gradient-radial)' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] opacity-15"
          style={{ background: 'var(--gradient-secondary)' }}
        />
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="font-bold text-xl md:text-2xl bg-clip-text"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              whileHover={{
                filter: 'brightness(1.2)',
              }}
              transition={{ duration: 0.3 }}
            >
              TalentAI
            </motion.span>
            <motion.span
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--accent-secondary)' }}
              whileHover={{ scale: 1.5, rotate: 180 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          <div className="hidden lg:flex items-center gap-6 xl:gap-8" style={{ color: 'var(--text-primary)' }}>
            <motion.button
              onClick={() => setActiveModalTab('candidates')}
              whileHover={{ scale: 1.05, y: -1, color: 'var(--accent-primary)' }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 outline-none py-1.5"
            >
              For Candidates
            </motion.button>
            <motion.button
              onClick={() => setActiveModalTab('recruiters')}
              whileHover={{ scale: 1.05, y: -1, color: 'var(--accent-primary)' }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 outline-none py-1.5"
            >
              For Recruiters
            </motion.button>
            <motion.button
              onClick={() => setActiveModalTab('how-it-works')}
              whileHover={{ scale: 1.05, y: -1, color: 'var(--accent-primary)' }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 outline-none py-1.5"
            >
              How it Works
            </motion.button>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <Button asChild variant="ghost" size="default" className="hidden sm:flex">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="gradient" size="default">
              <Link to="/register" className="text-xs md:text-sm">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20 lg:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full mb-6 md:mb-8 text-xs uppercase tracking-wider"
              style={{
                background: 'var(--gradient-radial-subtle)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-accent)',
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">AI-Powered Hiring</span>
              <span className="sm:hidden">AI Hiring</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-6 px-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: '1.1',
            }}
          >
            Find Work That Fits,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Not Just Pays.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-8 md:mb-12 px-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            Upload your CV. Our AI matches you to jobs that align with your actual skills — not just keywords.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button asChild variant="gradient" size="xl" className="cursor-pointer w-full">
                <Link to="/register?role=candidate">I'm Looking for a Job</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button asChild variant="gradient-outline" size="xl" className="cursor-pointer w-full">
                <Link to="/register?role=recruiter">I'm Hiring</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2"
                  style={{ 
                    background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))`,
                    borderColor: 'var(--bg-primary)',
                  }}
                />
              ))}
            </div>
            <span>Trusted by 2,400+ candidates and 180+ companies</span>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div
            className="text-xs uppercase tracking-widest mb-8 md:mb-12 text-center text-gradient-secondary"
          >
            How It Works
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                number: '01',
                icon: Upload,
                title: 'Upload Your Resume',
                description: 'Drop your CV and let our AI analyze your experience, skills, and achievements.',
              },
              {
                number: '02',
                icon: Brain,
                title: 'AI Analyzes Your Skills',
                description: 'Advanced algorithms extract and match your capabilities with job requirements.',
              },
              {
                number: '03',
                icon: Briefcase,
                title: 'Get Matched to Real Jobs',
                description: 'Receive personalized job recommendations with match scores and apply instantly.',
              },
            ].map((step, index) => {
              const tabToOpen = step.number === '02' ? 'how-it-works' : 'candidates';
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.03, boxShadow: 'var(--shadow-glow)', borderColor: 'var(--accent-primary)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModalTab(tabToOpen)}
                  className="card-gradient-hover relative p-8 rounded-2xl glow-green-sm cursor-pointer"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    className="absolute top-8 right-8 text-6xl opacity-10"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-primary)' }}
                  >
                    {step.number}
                  </div>
                  <div className="relative z-10">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ background: 'var(--gradient-radial-subtle)' }}
                    >
                      <step.icon className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <h3
                      className="text-xl mb-3"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2
                className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Smart Features for Modern Job Hunting
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Brain, title: 'AI Skill Extraction', description: 'Automatically parse and understand your experience' },
                  { icon: TrendingUp, title: 'Smart Job Matching', description: 'Get matched based on skills, not just keywords' },
                  { icon: CheckCircle, title: 'Real-Time Application Tracker', description: 'Track every application in one place' },
                  { icon: Shield, title: 'Blind Hiring Mode', description: 'Fair recruitment process for everyone' },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 6, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setActiveModalTab(feature.title.includes('Blind') ? 'recruiters' : 'how-it-works')}
                    className="flex gap-4 cursor-pointer p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'var(--gradient-radial-subtle)', border: '1px solid var(--border-accent)' }}
                    >
                      <feature.icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <h4 className="mb-1 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {feature.title}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.04, rotate: 0.5, boxShadow: 'var(--shadow-glow)', borderColor: 'var(--accent-primary)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModalTab('how-it-works')}
              className="rounded-3xl p-8 aspect-square flex items-center justify-center card-gradient-border glow-green-md cursor-pointer transition-all duration-300"
              style={{ 
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="text-center">
                <div 
                  className="text-8xl mb-4 text-gradient-primary"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  92%
                </div>
                <p style={{ color: 'var(--text-secondary)' }} className="font-semibold text-lg">Average Match Score</p>
                <span className="text-xs text-emerald-400 mt-2 block hover:underline">How matches are calculated →</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div 
            className="rounded-3xl p-12 text-center gradient-overlay-radial"
            style={{ 
              background: 'var(--gradient-tertiary)',
              border: '1px solid var(--border-accent)',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <h2 
              className="text-4xl mb-6"
              style={{ fontFamily: 'var(--font-display)', color: 'white' }}
            >
              Ready to Find Your Next Role?
            </h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Join thousands of candidates who've already found their perfect match.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Button asChild variant="secondary" size="xl" className="bg-white text-[var(--accent-primary)] hover:bg-white/90 shadow-lg hover:shadow-xl cursor-pointer">
                <Link to="/register?role=candidate" className="inline-flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  TalentAI
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                AI-powered job matching for the modern workforce.
              </p>
            </div>
            <div>
              <h4 className="mb-4" style={{ color: 'var(--text-primary)' }}>Product</h4>
              <div className="space-y-2 text-sm flex flex-col items-start" style={{ color: 'var(--text-secondary)' }}>
                <button 
                  onClick={() => setActiveModalTab('how-it-works')} 
                  className="hover:text-[var(--accent-primary)] hover:opacity-100 opacity-85 transition-all cursor-pointer bg-transparent border-none p-0 text-left text-sm"
                >
                  Features
                </button>
                <button 
                  onClick={() => setActiveModalTab('how-it-works')} 
                  className="hover:text-[var(--accent-primary)] hover:opacity-100 opacity-85 transition-all cursor-pointer bg-transparent border-none p-0 text-left text-sm"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => setActiveModalTab('recruiters')} 
                  className="hover:text-[var(--accent-primary)] hover:opacity-100 opacity-85 transition-all cursor-pointer bg-transparent border-none p-0 text-left text-sm"
                >
                  For Teams
                </button>
              </div>
            </div>
            <div>
              <h4 className="mb-4" style={{ color: 'var(--text-primary)' }}>Company</h4>
              <div className="space-y-2 text-sm flex flex-col items-start" style={{ color: 'var(--text-secondary)' }}>
                <button 
                  onClick={() => setActiveModalTab('how-it-works')} 
                  className="hover:text-[var(--accent-primary)] hover:opacity-100 opacity-85 transition-all cursor-pointer bg-transparent border-none p-0 text-left text-sm"
                >
                  About
                </button>
                <button 
                  onClick={() => setActiveModalTab('how-it-works')} 
                  className="hover:text-[var(--accent-primary)] hover:opacity-100 opacity-85 transition-all cursor-pointer bg-transparent border-none p-0 text-left text-sm"
                >
                  Blog
                </button>
                <button 
                  onClick={() => setActiveModalTab('how-it-works')} 
                  className="hover:text-[var(--accent-primary)] hover:opacity-100 opacity-85 transition-all cursor-pointer bg-transparent border-none p-0 text-left text-sm"
                >
                  Careers
                </button>
              </div>
            </div>
            <div>
              <h4 className="mb-4" style={{ color: 'var(--text-primary)' }}>Legal</h4>
              <div className="space-y-2 text-sm flex flex-col items-start" style={{ color: 'var(--text-secondary)' }}>
                <a href="#" className="hover:text-[var(--accent-primary)] transition-colors text-sm opacity-85 hover:opacity-100">Privacy</a>
                <a href="#" className="hover:text-[var(--accent-primary)] transition-colors text-sm opacity-85 hover:opacity-100">Terms</a>
                <a href="#" className="hover:text-[var(--accent-primary)] transition-colors text-sm opacity-85 hover:opacity-100">Security</a>
              </div>
            </div>
          </div>
          <div 
            className="pt-8 text-sm text-center"
            style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            © 2026 TalentAI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Walkthrough Modal */}
      <AnimatePresence>
        {activeModalTab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalTab(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
              className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl"
              style={{
                background: 'rgba(17, 24, 39, 0.75)',
                backdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), var(--shadow-glow)',
                color: 'var(--text-primary)',
              }}
            >
              {/* Decorative top bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

              {/* Close Button */}
              <motion.button
                onClick={() => setActiveModalTab(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 p-2 rounded-full cursor-pointer transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-primary)',
                }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto">
                {/* Modal Title */}
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                  <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                  <span>How TalentAI Works</span>
                </h2>

                {/* Tab selectors inside modal */}
                <div className="flex border-b border-white/10 mb-8 gap-4">
                  {[
                    { id: 'candidates', label: 'For Candidates', icon: Users },
                    { id: 'recruiters', label: 'For Recruiters', icon: Briefcase },
                    { id: 'how-it-works', label: 'How it Works', icon: Brain },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeModalTab === tab.id;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveModalTab(tab.id as any)}
                        className="flex items-center gap-2 pb-4 text-sm font-medium relative cursor-pointer bg-transparent border-0 outline-none"
                        style={{
                          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                        {isActive && (
                          <motion.div
                            layoutId="modalTabBorder"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Content switching */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModalTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {activeModalTab === 'candidates' && (
                      <div className="space-y-6">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <Upload className="w-5 h-5" /> 1. Upload Your Resume
                          </h3>
                          <p className="text-sm text-gray-300">
                            Simply drag & drop your CV in PDF format. Our advanced neural parser processes your work history, projects, and education in seconds. No tedious form filling required!
                          </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <Brain className="w-5 h-5" /> 2. Deep Skill Extraction
                          </h3>
                          <p className="text-sm text-gray-300">
                            Our AI extracts semantic skills and contextual experience, recognizing equivalent technologies and projects. This translates your experiences into a standardized talent profile.
                          </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" /> 3. High-Quality Job Match & Score
                          </h3>
                          <p className="text-sm text-gray-300">
                            Get ranked matches for relevant roles. Each recommendation includes a detailed match percentage breakdown showing where your profile aligns and what skills are highly valued.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
                          <button
                            onClick={() => setActiveModalTab('how-it-works')}
                            className="px-6 py-3 rounded-xl border border-white/20 text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            Learn AI details
                          </button>
                          <Link
                            to="/register?role=candidate"
                            onClick={() => setActiveModalTab(null)}
                            className="px-6 py-3 rounded-xl text-sm font-medium text-white shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 transition-all text-center"
                            style={{ background: 'var(--accent-primary)' }}
                          >
                            Register as Candidate
                          </Link>
                        </div>
                      </div>
                    )}

                    {activeModalTab === 'recruiters' && (
                      <div className="space-y-6">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <Briefcase className="w-5 h-5" /> 1. Define & Post a Role
                          </h3>
                          <p className="text-sm text-gray-300">
                            Fill in basic parameters and details about the job. Our AI automatically maps your requirements, target skills, and ideal background to construct a robust scoring model.
                          </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <Users className="w-5 h-5" /> 2. Instant Scoring & Pipeline
                          </h3>
                          <p className="text-sm text-gray-300">
                            Say goodbye to manual resume screening. When a candidate applies or uploads their CV, they are instantly scored against your active job specs, ranking the most qualified profiles to the top.
                          </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <Shield className="w-5 h-5" /> 3. Unbiased "Blind Hiring" Screening
                          </h3>
                          <p className="text-sm text-gray-300">
                            Ensure fair hiring practices. Enable Blind Mode to hide candidates' personal identifying information, focusing strictly on skill alignment, experience, and potential.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
                          <button
                            onClick={() => setActiveModalTab('how-it-works')}
                            className="px-6 py-3 rounded-xl border border-white/20 text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            Learn AI details
                          </button>
                          <Link
                            to="/register?role=recruiter"
                            onClick={() => setActiveModalTab(null)}
                            className="px-6 py-3 rounded-xl text-sm font-medium text-white shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 transition-all text-center"
                            style={{ background: 'var(--accent-primary)' }}
                          >
                            Register as Recruiter
                          </Link>
                        </div>
                      </div>
                    )}

                    {activeModalTab === 'how-it-works' && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                              <Brain className="w-5 h-5" /> Semantic NLP Extraction
                            </h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                              We leverage state-of-the-art LLMs via OpenRouter to analyze resumes and jobs semantically. Instead of basic keyword-matching (e.g. searching "React"), the AI understands the context, project complexity, and seniority of the skills.
                            </p>
                          </div>
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                              <Lock className="w-5 h-5" /> Encrypted & Secure
                            </h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                              Candidate documents are parsed securely, and personal data is encrypted. We support full data privacy options, ensuring your CV is only shared with recruiters and jobs you explicitly apply to.
                            </p>
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" /> The TalentAI Match Scoring System
                          </h4>
                          <p className="text-xs text-gray-300 leading-relaxed">
                            The matching score (0-100%) represents the cosine similarity of skills and contextual alignment.
                            A match of <strong className="text-emerald-400">&gt;80%</strong> indicates high suitability, aligning with key functional duties and required core technical requirements.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-end">
                          <Link
                            to="/register?role=candidate"
                            onClick={() => setActiveModalTab(null)}
                            className="px-5 py-2.5 rounded-xl text-xs font-medium border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/5 transition-all text-center cursor-pointer"
                          >
                            Get Started as Candidate
                          </Link>
                          <Link
                            to="/register?role=recruiter"
                            onClick={() => setActiveModalTab(null)}
                            className="px-5 py-2.5 rounded-xl text-xs font-medium text-white shadow-lg hover:brightness-110 transition-all text-center cursor-pointer"
                            style={{ background: 'var(--accent-primary)' }}
                          >
                            Get Started as Recruiter
                          </Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}