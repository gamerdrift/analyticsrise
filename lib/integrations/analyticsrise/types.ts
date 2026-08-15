/**
 * RevenueRiseAI <-> AnalyticsRise Integration Contracts
 * Defines pure interfaces for consuming parent identity, billing state, and entitlements.
 */

export type PlanTier = 'guest' | 'free' | 'student_pro' | 'pro' | 'elite' | 'enterprise' | 'recruiter';

export type RevenueRiseFeatureKey =
  | 'ai_mentor_queries'
  | 'analytics_lab_execution'
  | 'market_paper_trading'
  | 'market_backtesting'
  | 'career_mock_interviews'
  | 'ats_resume_optimizer'
  | 'cryptographic_certificates'
  | 'custom_dataset_storage';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role?: string;
  createdAt?: string;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  idToken?: string;
}

export interface AuthoritativeSubscription {
  userId: string;
  planId: PlanTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired' | 'incomplete';
  billingCycle: 'monthly' | 'annual';
  effectiveFrom: string;
  effectiveUntil: string;
  cancelAtPeriodEnd: boolean;
  razorpaySubscriptionId?: string;
}

export interface AuthoritativeEntitlement {
  userId: string;
  planId: PlanTier;
  featureFlags: Record<RevenueRiseFeatureKey, boolean>;
  monthlyQuotas: Record<string, number>; // -1 represents unlimited
  updatedAt: string;
}

export interface UsageQuotaSnapshot {
  quotaKey: string;
  limit: number;
  consumed: number;
  remaining: number;
  isExhausted: boolean;
}
