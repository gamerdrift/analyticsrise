import { AnalyticsRiseEntitlementAdapter } from '@/lib/integrations/analyticsrise/entitlementAdapter';
import { AuthorizationError, QuotaExceededError } from '@/lib/errors';

describe('RevenueRiseAI — Entitlement Adapter', () => {
  it('should enforce default free tier permissions for unknown users', async () => {
    const adapter = new AnalyticsRiseEntitlementAdapter();
    const entitlement = await adapter.getAuthoritativeEntitlement('new_user_123');

    expect(entitlement.planId).toBe('free');
    expect(entitlement.featureFlags.ai_mentor_queries).toBe(true);
    expect(entitlement.featureFlags.analytics_lab_execution).toBe(true);
    expect(entitlement.featureFlags.market_backtesting).toBe(false);
    expect(entitlement.featureFlags.cryptographic_certificates).toBe(false);
  });

  it('should correctly grant feature access to pro tier entitlements', async () => {
    const adapter = new AnalyticsRiseEntitlementAdapter();
    adapter.setMockEntitlement('pro_user_456', {
      userId: 'pro_user_456',
      planId: 'pro',
      featureFlags: {
        ai_mentor_queries: true,
        analytics_lab_execution: true,
        market_paper_trading: true,
        market_backtesting: true,
        career_mock_interviews: true,
        ats_resume_optimizer: true,
        cryptographic_certificates: true,
        custom_dataset_storage: true,
      },
      monthlyQuotas: {
        ai_mentor_queries: -1,
        career_mock_interviews: 50,
        custom_dataset_storage_mb: 2048,
      },
      updatedAt: new Date().toISOString(),
    });

    const hasBacktest = await adapter.hasFeatureAccess('pro_user_456', 'market_backtesting');
    expect(hasBacktest).toBe(true);

    const hasCert = await adapter.hasFeatureAccess('pro_user_456', 'cryptographic_certificates');
    expect(hasCert).toBe(true);
  });

  it('should throw AuthorizationError when unauthorized feature is required', async () => {
    const adapter = new AnalyticsRiseEntitlementAdapter();
    await expect(
      adapter.requireFeatureAccess('free_user_789', 'market_backtesting')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should track and enforce numerical quotas correctly', async () => {
    const adapter = new AnalyticsRiseEntitlementAdapter();
    adapter.setMockEntitlement('free_user_quota', {
      userId: 'free_user_quota',
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
      },
      updatedAt: new Date().toISOString(),
    });

    // 0 consumed
    const snapshot1 = await adapter.getQuotaSnapshot('free_user_quota', 'ai_mentor_queries');
    expect(snapshot1.remaining).toBe(15);
    expect(snapshot1.isExhausted).toBe(false);

    // Consume 15
    adapter.setMockUsage('free_user_quota', 'ai_mentor_queries', 15);
    const snapshot2 = await adapter.getQuotaSnapshot('free_user_quota', 'ai_mentor_queries');
    expect(snapshot2.remaining).toBe(0);
    expect(snapshot2.isExhausted).toBe(true);

    await expect(
      adapter.requireQuota('free_user_quota', 'ai_mentor_queries', 1)
    ).rejects.toThrow(QuotaExceededError);
  });
});
