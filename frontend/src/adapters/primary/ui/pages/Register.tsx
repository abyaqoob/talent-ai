import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Briefcase, Building2, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/adapters/primary/ui/components/ThemeToggle';
import { useAuth } from '@/presentation/hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'recruiter' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // Recruiter company fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('1-10');
  const [website, setWebsite] = useState('');

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Back to Home - Floating in top left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-20"
      >
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs md:text-sm">Home</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Theme Toggle - Floating in top right */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Left Panel */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ 
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15), var(--bg-primary))',
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
            style={{ background: 'var(--accent-primary)' }}
          />
        </div>
        <div className="relative z-10 max-w-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Your Career Journey Starts Here
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg mb-12"
            style={{ color: 'var(--text-secondary)' }}
          >
            Join thousands of professionals using AI to find their perfect match in the job market.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-2xl"
            style={{ 
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              "TalentAI helped me find my dream job in just 2 weeks. The AI matching is incredible!"
            </p>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
              />
              <div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>Sarah Chen</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Software Engineer</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-6 md:mb-8">
            <span className="font-bold text-xl md:text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              TalentAI
            </span>
          </Link>

          <h1
            className="text-3xl md:text-4xl mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Create your account
          </h1>
          <p className="mb-6 md:mb-8 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
            Get started in under 2 minutes.
          </p>

          {/* Role Selector */}
          <div className="mb-8">
            <label className="text-sm mb-3 block" style={{ color: 'var(--text-secondary)' }}>
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'candidate', icon: Briefcase, title: "I'm a Candidate", subtitle: 'Looking for jobs' },
                { value: 'recruiter', icon: Building2, title: "I'm a Recruiter", subtitle: 'Hiring talent' },
              ].map((role) => (
                <motion.button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value as any)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative p-4 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: selectedRole === role.value ? 'rgba(5, 150, 105, 0.08)' : 'var(--bg-secondary)',
                    border: selectedRole === role.value ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    boxShadow: selectedRole === role.value ? 'var(--shadow-glow)' : 'none',
                  }}
                >
                  {selectedRole === role.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--accent-primary)' }}
                    >
                      <CheckCircle className="w-3 h-3" style={{ color: 'white' }} />
                    </motion.div>
                  )}
                  <role.icon
                    className="w-6 h-6 mb-3"
                    style={{ color: selectedRole === role.value ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                  />
                  <div className="text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                    {role.title}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {role.subtitle}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <form className="space-y-6">
            <div>
              <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none pr-12"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-subtle)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>

            {/* Company Fields — show only for recruiter */}
            <AnimatePresence>
              {selectedRole === 'recruiter' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Company Name *</label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={companyName}
                      onChange={(e) => { setCompanyName(e.target.value); setError(null); }}
                      className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Industry *</label>
                      <input
                        type="text"
                        placeholder="e.g. Software"
                        value={industry}
                        onChange={(e) => { setIndustry(e.target.value); setError(null); }}
                        className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none"
                        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Company Size</label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none"
                        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                      >
                        {['1-10','11-50','51-200','201-500','501-1000','1000+'].map(s => (
                          <option key={s} value={s}>{s} employees</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Company Website</label>
                    <input
                      type="url"
                      placeholder="https://yourcompany.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.1)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                if (!selectedRole) {
                  setError('Please select a role to continue');
                  return;
                }
                if (selectedRole === 'recruiter') {
                  if (!companyName.trim()) {
                    setError('Company Name is required');
                    return;
                  }
                  if (!industry.trim()) {
                    setError('Industry is required');
                    return;
                  }
                }
                setError(null);
                setIsLoading(true);
                try {
                  // Pass company details for recruiter registration
                  await register({
                    name,
                    email,
                    password,
                    role: selectedRole,
                    ...(selectedRole === 'recruiter' ? { companyName, industry, companySize, website } : {}),
                  } as any);
                  if (selectedRole === 'recruiter') {
                    navigate('/recruiter/dashboard');
                  } else {
                    navigate('/dashboard');
                  }
                } catch (err: any) {
                  setError(err.message || 'Registration failed. Please try again.');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-2"
              style={{
                background: isLoading ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                color: 'var(--text-primary)',
                boxShadow: isLoading ? 'none' : 'var(--shadow-glow)',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid var(--border-subtle)' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                  or continue with
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-3"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </motion.button>

            <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>
                Login
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}