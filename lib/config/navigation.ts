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
  { label: 'Get Hired', href: '/get-hired', badge: 'JOBS' },
  { label: 'Career Hub', href: '/career-hub' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Referrals', href: '/referral', badge: 'EARN' },
];

export const AUTH_NAV_ROUTES = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
  analytics: '/dashboard/analytics',
  subscription: '/settings/subscription',
  referral: '/referral',
  recruiter: '/recruiter',
  admin: '/admin',
  adminGrowth: '/admin/growth',
} as const;

export const FOOTER_LEGAL_LINKS: NavLinkItem[] = [
  { label: 'Privacy Policy', href: '/help' },
  { label: 'Terms of Service', href: '/help' },
  { label: 'Security Standard', href: '/help' },
];
