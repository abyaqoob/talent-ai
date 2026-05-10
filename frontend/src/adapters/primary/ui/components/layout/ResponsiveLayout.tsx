import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  type?: 'candidate' | 'recruiter';
  userName?: string;
  userType?: string;
}

export function ResponsiveLayout({ children, type = 'candidate', userName, userType }: ResponsiveLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <Sidebar type={type} userName={userName} userType={userType} />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-64"
          >
            <Sidebar type={type} userName={userName} userType={userType} />
          </motion.div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-16 md:pb-0">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav type={type} />
    </div>
  );
}
