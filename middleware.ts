import { NextRequest, NextResponse } from 'next/server';

/**
 * Route protection middleware for Next.js (Edge Runtime)
 * 
 * Enforces guest, authenticated, recruiter, and administrator route accessibility
 * using secure cookies synchronized client-side by the AuthContext.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('__session')?.value;
  const role = request.cookies.get('user-role')?.value;

  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Static assets bypass
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Route classifications
  const isGuestOnlyRoute = pathname === '/login' || pathname === '/register';
  const isAdminRoute = pathname.startsWith('/admin');
  const isRecruiterRoute = pathname.startsWith('/recruiter') || pathname.startsWith('/jobs/manage');
  
  const isAuthRequiredRoute = 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/courses') ||
    pathname.startsWith('/datasets') ||
    pathname.startsWith('/assessments') ||
    pathname.startsWith('/certifications') ||
    pathname.startsWith('/leaderboard') ||
    pathname.startsWith('/practice') ||
    pathname.startsWith('/simulators');

  // Rule 1: Redirect unauthenticated requests to login
  if (isAuthRequiredRoute && !token) {
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Rule 2: Redirect authenticated requests away from guest login/register pages
  if (isGuestOnlyRoute && token) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Rule 3: Enforce Administrator access
  if (isAdminRoute && (!token || role !== 'admin')) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Rule 4: Enforce Recruiter/Partner access
  if (isRecruiterRoute && (!token || (role !== 'recruiter' && role !== 'admin'))) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Configure Middleware matchers
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes
     * 2. Assets in public/ (like logos or icons)
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
