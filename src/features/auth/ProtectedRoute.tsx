// ============================================================
// Tewtorify — Protected Route Wrapper
// ============================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If specified, user must have one of these roles */
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but profile not loaded yet
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    // Redirect to appropriate dashboard based on actual role
    const redirectMap: Record<UserRole, string> = {
      guardian: '/guardian/dashboard',
      tutor: '/tutor/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={redirectMap[userProfile.role] || '/'} replace />;
  }

  return <>{children}</>;
}
