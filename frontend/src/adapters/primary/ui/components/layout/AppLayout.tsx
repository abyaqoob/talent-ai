import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BackButton } from './BackButton';

interface AppLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  sidebarType?: 'candidate' | 'recruiter';
  userName?: string;
  userType?: string;
}

export function AppLayout({
  children,
  showBackButton = false,
  sidebarType = 'candidate',
  userName,
  userType
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        type={sidebarType}
        userName={userName}
        userType={userType}
        isOpen={sidebarOpen}
      />
      <div className="flex-1 flex flex-col">
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