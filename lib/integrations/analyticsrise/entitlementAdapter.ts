/**
 * RevenueRiseAI — Entitlement Adapter
 * Consumes authoritative entitlement state and enforces zero-trust feature gating.
 */

import { AuthoritativeEntitlement, RevenueRiseFeatureKey, UsageQuotaSnapshot, PlanTier } from './types';
import { AuthorizationError, QuotaExceededError } from '@/lib/errors';
import { logger } from '@/lib/observability';

export interface IEntitlementAdapter {
  hasFeatureAccess(userId: string, feature: RevenueRiseFeatureKey): Promise<boolean>;
  getAuthoritativeEntitlement(userId: string): Promise<AuthoritativeEntitlement>;
  getQuotaSnapshot(userId: string, quotaKey: string): Promise<UsageQuotaSnapshot>;
  requireFeatureAccess(userId: string, feature: RevenueRiseFeatureKey): Promise<void>;
}

export class AnalyticsRiseEntitlementAdapter implements IEntitlementAdapter {
  private mockEntitlements: Map<string, AuthoritativeEntitlement> = new Map();
  private mockUsage: Map<string, number> = new Map();

  public setMockEntitlement(userId: string, entitlement: AuthoritativeEntitlement) {
    this.mockEntitlements.set(userId, entitlement);
  }

  public setMockUsage(userId: string, quotaKey: string, consumed: number) {
    this.mockUsage.set(`${userId}:${quotaKey}`, consumed);
  }

  public async getAuthoritativeEntitlement(userId: string): Promise<AuthoritativeEntitlement> {
    if (this.mockEntitlements.has(userId)) {
      return this.mockEntitlements.get(userId)!;
    }

    try {
      // Direct reading from Firestore /entitlements/{uid}
      if (typeof window !== 'undefined') {
        const { EntitlementService } = await import('@/lib/services/entitlementService');
        const plan = await EntitlementService.fetchAuthoritativePlan(userId);
        const isPro = plan === 'pro' || plan === 'enterprise' || plan === 'student_pro';

        return {
          userId,
          planId: plan as PlanTier,
          featureFlags: {
            ai_mentor_queries: true,
            analytics_lab_execution: true,
            market_paper_trading: true,
            market_backtesting: isPro,
            career_mock_interviews: isPro,
            ats_resume_optimizer: true,
            cryptographic_certificates: isPro,
            custom_dataset_storage: isPro,
          },
          monthlyQuotas: {
            ai_mentor_queries: isPro ? -1 : 15,
            career_mock_interviews: isPro ? 50 : 1,
            custom_dataset_storage_mb: isPro ? 2048 : 50,
          },
          updatedAt: new Date().toISOString(),
        };
      }
    } catch (err: any) {
      logger.warn('Failed to resolve authoritative entitlement from parent service:', { error: err?.message });
    }

    // Default free tier fallback
    return {
      userId,
      planId: 'free',
      featureFlags: {
        ai_mentor_queries: true,
        analytics_lab_execution: true,
        market_paper_trading: true,
        market_backtesting: false,
        career_mock_interviews: false,
        ats_resume_optimizer: true,
        cryptographic_certificates: false,
        custom_dataset_storage: false,
      },
      monthlyQuotas: {
        ai_mentor_queries: 15,
        career_mock_interviews: 1,
        custom_dataset_storage_mb: 50,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  public async hasFeatureAccess(userId: string, feature: RevenueRiseFeatureKey): Promise<boolean> {
    const entitlement = await this.getAuthoritativeEntitlement(userId);
    return !!entitlement.featureFlags[feature];
  }

  public async getQuotaSnapshot(userId: string, quotaKey: string): Promise<UsageQuotaSnapshot> {
    const entitlement = await this.getAuthoritativeEntitlement(userId);
    const limit = entitlement.monthlyQuotas[quotaKey] ?? 0;

    if (limit === -1) {
      return {
        quotaKey,
        limit: -1,
        consumed: 0,
        remaining: 999999,
        isExhausted: false,
      };
    }

    const consumed = this.mockUsage.get(`${userId}:${quotaKey}`) || 0;
    const remaining = Math.max(0, limit - consumed);

    return {
      quotaKey,
      limit,
      consumed,
      remaining,
      isExhausted: remaining <= 0,
    };
  }

  public async requireFeatureAccess(userId: string, feature: RevenueRiseFeatureKey): Promise<void> {
    const allowed = await this.hasFeatureAccess(userId, feature);
    if (!allowed) {
      throw new AuthorizationError(`Feature access denied for ${feature}`);
    }
  }

  public async requireQuota(userId: string, quotaKey: string, units = 1): Promise<void> {
    const snapshot = await this.getQuotaSnapshot(userId, quotaKey);
    if (snapshot.limit !== -1 && snapshot.remaining < units) {
      throw new QuotaExceededError(`Quota exhausted for ${quotaKey}. Remaining: ${snapshot.remaining}`);
    }
  }
}

export const entitlementAdapter = new AnalyticsRiseEntitlementAdapter();
