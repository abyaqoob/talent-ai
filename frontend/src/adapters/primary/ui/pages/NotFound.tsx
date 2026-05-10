import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Home, Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.07]"
          style={{ background: 'var(--accent-primary)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-[0.04]"
          style={{ background: 'var(--accent-secondary)' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Compass Icon */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <Compass
              className="w-8 h-8"
              style={{ color: 'var(--text-muted)' }}
            />
          </motion.div>

          {/* 404 Text */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="leading-none mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '160px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </motion.h1>

          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-primary)' }}
          >
            You've wandered somewhere we haven't mapped yet.
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
            style={{ fontSize: '16px', color: 'var(--text-muted)' }}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-150 active:scale-[0.97]"
              style={{
                background: 'var(--gradient-primary)',
                color: 'white',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <Home className="w-5 h-5" />
              Take me home
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl transition-all duration-150 active:scale-[0.97] hover:opacity-80"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Go back
            </button>
          </motion.div>
        </motion.div>

        {/* Floating geometric shapes */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-16 right-16 w-12 h-12 rounded-lg opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(16, 185, 129, 0.15))',
            border: '1px solid rgba(5, 150, 105, 0.2)',
          }}
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-24 left-16 w-16 h-16 rounded-full opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15))',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-40 left-32 w-8 h-8 opacity-20"
          style={{
            background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(52, 211, 153, 0.2))',
            border: '1px solid rgba(5, 150, 105, 0.25)',
            borderRadius: '6px',
          }}
        />
      </div>
    </div>
  );
}
