// lib/guards/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

/**
 * AuthGuard redirects users based on authentication state.
 * - If `requireAuth` is true, unauthenticated users are sent to /login.
 * - If `requireUnauth` is true, authenticated users are sent to /dashboard.
 */
export const AuthGuard = ({
  requireAuth = false,
  requireUnauth = false,
}: {
  requireAuth?: boolean;
  requireUnauth?: boolean;
}) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (requireAuth && !isAuthenticated) {
      router.replace('/login');
    }
    if (requireUnauth && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, requireAuth, requireUnauth, router]);

  // Render nothing – guard works via redirects.
  return null;
};
