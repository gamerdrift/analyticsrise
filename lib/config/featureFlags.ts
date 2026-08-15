/**
 * RevenueRiseAI — Client Feature Flags
 * Controls user-interface visibility of emerging intelligence modules.
 * NOTE: Server-authoritative entitlement checks remain mandatory for data access.
 */

export interface RevenueRiseFeatureFlags {
  AI_MENTOR: boolean;
  LEARNING_ENGINE: boolean;
  ANALYTICS_LAB: boolean;
  MARKET_LAB: boolean;
  CAREER_INTELLIGENCE: boolean;
  CERTIFICATION: boolean;
  ADVANCED_BACKTESTING: boolean;
}

export const DEFAULT_FEATURE_FLAGS: RevenueRiseFeatureFlags = {
  AI_MENTOR: true,
  LEARNING_ENGINE: true,
  ANALYTICS_LAB: true,
  MARKET_LAB: true,
  CAREER_INTELLIGENCE: true,
  CERTIFICATION: true,
  ADVANCED_BACKTESTING: false, // Scaffolded for future phase
};

export class FeatureFlagService {
  private flags: RevenueRiseFeatureFlags = { ...DEFAULT_FEATURE_FLAGS };

  public isEnabled(flag: keyof RevenueRiseFeatureFlags): boolean {
    return !!this.flags[flag];
  }

  public setFlag(flag: keyof RevenueRiseFeatureFlags, enabled: boolean) {
    this.flags[flag] = enabled;
  }

  public getAllFlags(): RevenueRiseFeatureFlags {
    return { ...this.flags };
  }
}

export const featureFlagService = new FeatureFlagService();
