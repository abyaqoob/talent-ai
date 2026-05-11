import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BackButton } from './BackButton';

interface AppLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  sidebarType?: 'candidate' | 'recruiter';
}

export function AppLayout({
  children,
  showBackButton = false,
  sidebarType = 'candidate',
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar reads user from useAuth internally */}
      <Sidebar type={sidebarType} isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 p-8 overflow-auto">
          {showBackButton && (
            <div className="mb-6"><BackButton /></div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}