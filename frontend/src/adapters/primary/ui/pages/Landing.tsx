import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, Upload, Brain, Briefcase, CheckCircle, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/adapters/primary/ui/components/ThemeToggle';
import { Button } from '@/adapters/primary/ui/components/base/button';

export default function Landing() {
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
            <a href="#" className="text-sm hover:opacity-80 transition-opacity">For Candidates</a>
            <a href="#" className="text-sm hover:opacity-80 transition-opacity">For Recruiters</a>
            <a href="#" className="text-sm hover:opacity-80 transition-opacity">How it Works</a>
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
            <Button asChild variant="gradient" size="xl">
              <Link to="/register">I'm Looking for a Job</Link>
            </Button>
            <Button asChild variant="gradient-outline" size="xl">
              <Link to="/register">I'm Hiring</Link>
            </Button>
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
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-gradient-hover relative p-8 rounded-2xl glow-green-sm"
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
            ))}
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
                    className="flex gap-4"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'var(--gradient-radial-subtle)', border: '1px solid var(--border-accent)' }}
                    >
                      <feature.icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <h4 className="mb-1" style={{ color: 'var(--text-primary)' }}>
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
            <div 
              className="rounded-3xl p-8 aspect-square flex items-center justify-center card-gradient-border glow-green-md"
              style={{ 
                background: 'var(--bg-secondary)',
              }}
            >
              <div className="text-center">
                <div 
                  className="text-8xl mb-4 text-gradient-primary"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  92%
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Average Match Score</p>
              </div>
            </div>
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
            <Button asChild variant="secondary" size="xl" className="bg-white text-[var(--accent-primary)] hover:bg-white/90 shadow-lg hover:shadow-xl">
              <Link to="/register" className="inline-flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
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
              <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div><a href="#" className="hover:opacity-80">Features</a></div>
                <div><a href="#" className="hover:opacity-80">Pricing</a></div>
                <div><a href="#" className="hover:opacity-80">For Teams</a></div>
              </div>
            </div>
            <div>
              <h4 className="mb-4" style={{ color: 'var(--text-primary)' }}>Company</h4>
              <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div><a href="#" className="hover:opacity-80">About</a></div>
                <div><a href="#" className="hover:opacity-80">Blog</a></div>
                <div><a href="#" className="hover:opacity-80">Careers</a></div>
              </div>
            </div>
            <div>
              <h4 className="mb-4" style={{ color: 'var(--text-primary)' }}>Legal</h4>
              <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div><a href="#" className="hover:opacity-80">Privacy</a></div>
                <div><a href="#" className="hover:opacity-80">Terms</a></div>
                <div><a href="#" className="hover:opacity-80">Security</a></div>
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
    </div>
  );
}