import { getAppEnvironment, getClientConfig } from '@/lib/config/env';
import { featureFlagService } from '@/lib/config/featureFlags';

describe('RevenueRiseAI — Configuration & Feature Flags', () => {
  it('should detect runtime environment safely', () => {
    const env = getAppEnvironment();
    expect(['development', 'test', 'production']).toContain(env);
  });

  it('should return client-safe config without secrets', () => {
    const config = getClientConfig();
    expect(config.appUrl).toBeDefined();
    expect(config.apiUrl).toBeDefined();
    // Verify no private secrets exist in client config
    expect((config as any).geminiApiKey).toBeUndefined();
    expect((config as any).razorpaySecret).toBeUndefined();
  });

  it('should manage feature flags correctly', () => {
    expect(featureFlagService.isEnabled('AI_MENTOR')).toBe(true);

    featureFlagService.setFlag('ADVANCED_BACKTESTING', true);
    expect(featureFlagService.isEnabled('ADVANCED_BACKTESTING')).toBe(true);

    featureFlagService.setFlag('ADVANCED_BACKTESTING', false);
    expect(featureFlagService.isEnabled('ADVANCED_BACKTESTING')).toBe(false);
  });
});
