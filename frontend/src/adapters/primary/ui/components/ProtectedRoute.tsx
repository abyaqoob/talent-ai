import { createElement } from 'react';
import { Navigate, useLocation } from 'react-router';

function getSessionRole(): string | null {
  try {
    const s = localStorage.getItem('auth_session');
    if (!s) return null;
    const parsed = JSON.parse(s);
    return parsed?.user?.role || null;
  } catch {
    return null;
  }
}

function isAuthenticated(): boolean {
  try {
    const s = localStorage.getItem('auth_session');
    if (!s) return false;
    const parsed = JSON.parse(s);
    return !!(parsed?.token && parsed?.user);
  } catch {
    return false;
  }
}

export function ProtectedRoute({ children, requiredRole }: { children: JSX.Element; requiredRole?: 'candidate' | 'recruiter' }) {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const role = getSessionRole();

  if (!authenticated) {
    return createElement(Navigate, { to: '/login', state: { from: location }, replace: true });
  }

  if (requiredRole && role !== requiredRole) {
    const redirect = role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard';
    return createElement(Navigate, { to: redirect, replace: true });
  }

  return children;
}
