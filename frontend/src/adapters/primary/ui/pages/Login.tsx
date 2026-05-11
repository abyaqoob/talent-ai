import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, User, Briefcase, Loader2, ArrowLeft, Home } from 'lucide-react';
import { ThemeToggle } from '@/adapters/primary/ui/components/ThemeToggle';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useAuth } from '@/presentation/hooks/useAuth';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full blur-[80px] md:blur-[120px] opacity-10"
          style={{ background: 'var(--gradient-radial)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[60px] md:blur-[100px] opacity-5"
          style={{ background: 'var(--gradient-secondary)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-modal)',
        }}
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
          Welcome back
        </h1>
        <p className="mb-6 md:mb-8 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
          Sign in to continue your journey
        </p>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="text-sm mb-3 block" style={{ color: 'var(--text-secondary)' }}>
            I am a
          </label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              onClick={() => setUserRole('candidate')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-xl transition-all duration-200 flex flex-col items-center gap-2"
              style={{
                background: userRole === 'candidate' ? 'var(--gradient-radial-subtle)' : 'var(--bg-tertiary)',
                border: userRole === 'candidate' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                boxShadow: userRole === 'candidate' ? 'var(--shadow-green-sm)' : 'none',
              }}
            >
              <User className="w-6 h-6" style={{ color: userRole === 'candidate' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
              <span className="text-sm" style={{ color: userRole === 'candidate' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                Candidate
              </span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setUserRole('recruiter')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-xl transition-all duration-200 flex flex-col items-center gap-2"
              style={{
                background: userRole === 'recruiter' ? 'var(--gradient-radial-subtle)' : 'var(--bg-tertiary)',
                border: userRole === 'recruiter' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                boxShadow: userRole === 'recruiter' ? 'var(--shadow-green-sm)' : 'none',
              }}
            >
              <Briefcase className="w-6 h-6" style={{ color: userRole === 'recruiter' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
              <span className="text-sm" style={{ color: userRole === 'recruiter' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                Recruiter
              </span>
            </motion.button>
          </div>
        </div>

        <form className="space-y-6">
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
                e.target.style.boxShadow = 'var(--shadow-green-sm)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <a href="#" className="text-xs hover:underline" style={{ color: 'var(--accent-primary)' }}>
                Forgot password?
              </a>
            </div>
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
                  e.target.style.boxShadow = 'var(--shadow-green-sm)';
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

          {error && (
            <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.1)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)' }}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              setError(null);
              setIsLoading(true);
              try {
                await login({ email, password, role: userRole });
                if (userRole === 'recruiter') {
                  navigate('/recruiter/dashboard');
                } else {
                  navigate('/dashboard');
                }
              } catch (err: any) {
                if (err.message && (err.message.includes('Access denied') || err.message.includes('Invalid role'))) {
                  setError('These credentials belong to a different account type');
                } else {
                  setError(err.message || 'Login failed. Please check your credentials.');
                }
              } finally {
                setIsLoading(false);
              }
            }}
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            {isLoading ? 'Signing In...' : `Sign In as ${userRole === 'candidate' ? 'Candidate' : 'Recruiter'}`}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--border-subtle)' }} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                or continue with
              </span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
          </motion.div>

          <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>
              Sign up
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}