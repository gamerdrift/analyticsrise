/**
 * RevenueRiseAI — Subscription Adapter
 * Reads subscription status and delegates upgrade actions to parent platform
 * without creating duplicate payment gateways.
 */

import { AuthoritativeSubscription } from './types';
import { logger } from '@/lib/observability';

export interface ISubscriptionAdapter {
  getSubscription(userId: string): Promise<AuthoritativeSubscription>;
  getUpgradeRoute(targetPlan: string): string;
}

export class AnalyticsRiseSubscriptionAdapter implements ISubscriptionAdapter {
  private mockSubscription: Map<string, AuthoritativeSubscription> = new Map();

  public setMockSubscription(userId: string, sub: AuthoritativeSubscription) {
    this.mockSubscription.set(userId, sub);
  }

  public async getSubscription(userId: string): Promise<AuthoritativeSubscription> {
    if (this.mockSubscription.has(userId)) {
      return this.mockSubscription.get(userId)!;
    }

    try {
      if (typeof window !== 'undefined') {
        const { MembershipService } = await import('@/lib/services/membershipService');
        const sub = MembershipService.getSubscription(userId);

        return {
          userId,
          planId: sub.planId,
          status: sub.status as any,
          billingCycle: sub.billingCycle,
          effectiveFrom: sub.currentPeriodStart,
          effectiveUntil: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        };
      }
    } catch (err: any) {
      logger.warn('Could not read subscription from parent platform membershipService:', { error: err?.message });
    }

    return {
      userId,
      planId: 'free',
      status: 'active',
      billingCycle: 'monthly',
      effectiveFrom: new Date().toISOString(),
      effectiveUntil: new Date(Date.now() + 365 * 86400000).toISOString(),
      cancelAtPeriodEnd: false,
    };
  }

  public getUpgradeRoute(targetPlan = 'pro'): string {
    return `/pricing?upgrade=${encodeURIComponent(targetPlan)}`;
  }
}

export const subscriptionAdapter = new AnalyticsRiseSubscriptionAdapter();
