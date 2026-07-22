export interface NavLinkItem {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export const MAIN_NAV_LINKS: NavLinkItem[] = [
  { label: 'Courses', href: '/courses' },
  { label: 'Simulators', href: '/simulators/sql' },
  { label: 'Practice', href: '/practice' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Career Hub', href: '/career-hub', badge: 'NEW' },
  { label: 'Community', href: '/community' },
];

export const AUTH_NAV_ROUTES = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
  recruiter: '/recruiter',
  admin: '/admin',
} as const;

export const FOOTER_LEGAL_LINKS: NavLinkItem[] = [
  { label: 'Privacy Policy', href: '/help' },
  { label: 'Terms of Service', href: '/help' },
  { label: 'Security Standard', href: '/help' },
];
