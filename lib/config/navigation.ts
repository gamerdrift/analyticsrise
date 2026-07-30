export interface NavLinkItem {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export const MAIN_NAV_LINKS: NavLinkItem[] = [
  { label: 'AI Copilot', href: '/career-copilot', badge: 'v2.0' },
  { label: 'Resume Studio', href: '/resume-studio' },
  { label: 'Interview Lab', href: '/interview-lab' },
  { label: 'Get Hired', href: '/get-hired', badge: 'JOBS' },
  { label: 'Companies', href: '/companies' },
  { label: 'Recruiters', href: '/recruiter' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Pricing', href: '/pricing' },
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
