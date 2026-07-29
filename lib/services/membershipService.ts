import { PlanTier, MEMBERSHIP_PLANS, PlanDefinition } from '@/lib/config/plans';

export interface UserSubscription {
  uid: string;
  planId: PlanTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  billingCycle: 'monthly' | 'annual';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

const STORAGE_KEY = 'analyticsrise_user_subscription';

export class MembershipService {
  /**
   * Fetch current user subscription state
   */
  static getSubscription(uid: string = 'demo-user'): UserSubscription {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse subscription from localStorage:', e);
        }
      }
    }

    // Default Fallback Plan for demo/unauthenticated users
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    return {
      uid,
      planId: 'free',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextMonth.toISOString(),
      cancelAtPeriodEnd: false,
    };
  }

  /**
   * Save or update subscription plan
   */
  static updateSubscription(
    uid: string,
    planId: PlanTier,
    billingCycle: 'monthly' | 'annual' = 'monthly'
  ): UserSubscription {
    const now = new Date();
    const periodEnd = new Date(
      billingCycle === 'annual'
        ? now.getFullYear() + 1
        : now.getFullYear(),
      billingCycle === 'annual'
        ? now.getMonth()
        : now.getMonth() + 1,
      now.getDate()
    );

    const sub: UserSubscription = {
      uid,
      planId,
      status: 'active',
      billingCycle,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(sub));
    }

    return sub;
  }

  /**
   * Cancel subscription at period end
   */
  static cancelSubscription(uid: string): UserSubscription {
    const sub = this.getSubscription(uid);
    sub.cancelAtPeriodEnd = true;
    sub.status = 'canceled';
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(sub));
    }
    return sub;
  }

  /**
   * Retrieve full plan definition
   */
  static getPlanDefinition(planId: PlanTier): PlanDefinition {
    return MEMBERSHIP_PLANS[planId] || MEMBERSHIP_PLANS.free;
  }
}
