import { motion } from 'motion/react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            border: '3px solid transparent',
            borderTopColor: 'var(--accent-primary)',
            borderRightColor: 'var(--accent-secondary)',
          }}
        />
        <div 
          className="absolute inset-2 rounded-full"
          style={{ 
            border: '3px solid transparent',
            borderBottomColor: 'var(--accent-secondary)',
            borderLeftColor: 'var(--accent-primary)',
          }}
        />
      </motion.div>
    </div>
  );
}
