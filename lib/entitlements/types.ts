/**
 * Reusable Product Entitlement Types
 * 
 * Defines feature flags, product tiers, and contextual upgrade metadata
 * across SQL Studio, Excel Studio Pro, Power BI Studio, and future labs.
 */

export type ProductId = 'sql' | 'excel' | 'powerbi' | 'python' | 'tableau';

export type ProductTier = 'free' | 'pro' | 'enterprise';

export type FeatureId =
  | 'sql.core_challenges'
  | 'sql.custom_datasets'
  | 'sql.advanced_scenarios'
  | 'sql.portfolio_export'
  | 'sql.certified_assessments'
  | 'excel.core_worksheets'
  | 'excel.custom_upload'
  | 'excel.advanced_financial_models'
  | 'powerbi.core_dashboards'
  | 'powerbi.enterprise_schemas'
  | 'powerbi.custom_dax_benchmarks'
  | 'general.progress_tracking'
  | 'general.community_access';

export interface UpgradeBenefit {
  title: string;
  description: string;
}

export interface UpgradeContext {
  productId: ProductId;
  featureId: FeatureId;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: UpgradeBenefit[];
  recommendedPlan: string;
  ctaText: string;
}

export interface EntitlementCheckResult {
  allowed: boolean;
  tier: ProductTier;
  featureId: FeatureId;
  reason?: string;
  upgradeContext?: UpgradeContext;
}
