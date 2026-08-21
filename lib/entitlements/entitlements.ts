/**
 * Reusable Product Entitlement Engine
 * 
 * Central capability & entitlement checker for AnalyticsRise products.
 * 
 * ARCHITECTURAL NOTICE:
 * Under the current Firebase Free Tier (Spark) launch mode, this module provides
 * structured client-side capability gating and contextual upgrade presentation.
 * It is engineered to seamlessly integrate with server-authoritative token validation
 * and Firestore user profile entitlements once Blaze / backend functions are authorized.
 * No client-side checks are falsely represented as security boundaries.
 */

import {
  ProductId,
  ProductTier,
  FeatureId,
  UpgradeContext,
  EntitlementCheckResult,
} from './types';

// Feature to Tier Matrix
const FEATURE_TIER_REQUIREMENTS: Record<FeatureId, ProductTier> = {
  'sql.core_challenges': 'free',
  'sql.custom_datasets': 'pro',
  'sql.advanced_scenarios': 'pro',
  'sql.portfolio_export': 'pro',
  'sql.certified_assessments': 'pro',
  'excel.core_worksheets': 'free',
  'excel.custom_upload': 'pro',
  'excel.advanced_financial_models': 'pro',
  'powerbi.core_dashboards': 'free',
  'powerbi.enterprise_schemas': 'pro',
  'powerbi.custom_dax_benchmarks': 'pro',
  'powerbi.custom_datasets': 'free',
  'powerbi.multiple_datasets': 'pro',
  'powerbi.advanced_modeling': 'pro',
  'powerbi.dashboard_export': 'pro',
  'powerbi.ai_insights': 'pro',
  'general.progress_tracking': 'free',
  'general.community_access': 'free',
};


// Contextual Upgrade Presentation Catalog
const UPGRADE_CONTEXTS: Record<FeatureId, UpgradeContext> = {
  'sql.custom_datasets': {
    productId: 'sql',
    featureId: 'sql.custom_datasets',
    badge: 'SQL STUDIO PRO CAPABILITY',
    title: 'Analyze Your Own Data',
    subtitle: 'Upload custom CSV, Parquet, and relational schemas directly into SQL Studio.',
    description:
      'Practice querying real company tables, investigate proprietary data models, and run unlimited joins against your own datasets.',
    benefits: [
      {
        title: 'Custom CSV & Parquet Uploads',
        description: 'Instant client-side table parsing with automatic schema inference.',
      },
      {
        title: 'Multi-Schema Query Workbench',
        description: 'Define custom foreign keys and evaluate multi-table queries against your data.',
      },
      {
        title: 'Portfolio Analysis Exporter',
        description: 'Export clean SQL queries and results to showcase in your personal data portfolio.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Explore SQL Studio Pro',
  },
  'sql.advanced_scenarios': {
    productId: 'sql',
    featureId: 'sql.advanced_scenarios',
    badge: 'ADVANCED LEARNING TRACK',
    title: 'Unlock Enterprise Business Scenarios',
    subtitle: 'Level up from basic queries to enterprise-grade analytical challenges.',
    description:
      'Solve complex multi-tenant billing reconciliations, cohort churn analytics, and multi-stage subquery optimizations.',
    benefits: [
      {
        title: 'Real Enterprise Schema Scenarios',
        description: 'Work with 100,000+ row datasets modeled on real Fortune 500 operations.',
      },
      {
        title: 'Advanced Analytical Window Functions',
        description: 'Master PARTITION BY, ROW_NUMBER(), LEAD(), and LAG() calculations.',
      },
      {
        title: 'Graded Challenge Assessments',
        description: 'Official timed benchmark examinations with verifiable mastery badges.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Unlock Advanced Tracks',
  },
  'sql.portfolio_export': {
    productId: 'sql',
    featureId: 'sql.portfolio_export',
    badge: 'PORTFOLIO & CREDENTIALS',
    title: 'Verified Portfolio Showcase',
    subtitle: 'Turn your solved queries and challenge logs into verifiable proof of skill.',
    description:
      'Generate a public portfolio page displaying your verified challenge solutions, execution logs, and cryptographic completion hashes.',
    benefits: [
      {
        title: 'Public Analyst Profile',
        description: 'Sharable link on LinkedIn and resumes demonstrating hands-on SQL proficiency.',
      },
      {
        title: 'Cryptographic SHA-256 Ledger',
        description: 'Employers can inspect your exact challenge submissions and benchmark runtimes.',
      },
      {
        title: 'Priority Recruiter Visibility',
        description: 'Verified analysts are featured in the AnalyticsRise hiring partner talent network.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Unlock Verified Portfolio',
  },
  'sql.core_challenges': {
    productId: 'sql',
    featureId: 'sql.core_challenges',
    badge: 'CORE LEARNING',
    title: 'Core SQL Challenges',
    subtitle: 'Included in the free tier.',
    description: 'Free foundational SQL challenges and structured learning modules.',
    benefits: [],
    recommendedPlan: 'Free',
    ctaText: 'Start Learning Free',
  },
  'sql.certified_assessments': {
    productId: 'sql',
    featureId: 'sql.certified_assessments',
    badge: 'CERTIFICATIONS',
    title: 'Official SQL Certification',
    subtitle: 'Pass formal exams to earn verifiable credentials.',
    description: 'Timed formal assessments evaluated by the AnalyticsRise assessment engine.',
    benefits: [
      {
        title: 'Official Certification Badge',
        description: 'Verifiable credentials for your resume and LinkedIn profile.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Unlock Pro Certifications',
  },
  'excel.core_worksheets': {
    productId: 'excel',
    featureId: 'excel.core_worksheets',
    badge: 'CORE LEARNING',
    title: 'Excel Studio Fundamentals',
    subtitle: 'Included in the free tier.',
    description: 'Free spreadsheet exercises and formula practice.',
    benefits: [],
    recommendedPlan: 'Free',
    ctaText: 'Start Learning Free',
  },
  'excel.custom_upload': {
    productId: 'excel',
    featureId: 'excel.custom_upload',
    badge: 'EXCEL STUDIO PRO',
    title: 'Custom Workbook Uploads',
    subtitle: 'Upload and model your own spreadsheet workbooks.',
    description: 'Work with your own XLSX models in an interactive browser grid.',
    benefits: [
      {
        title: 'Full Workbook Import',
        description: 'Analyze multi-sheet financial models and forecast tables.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Explore Excel Studio Pro',
  },
  'excel.advanced_financial_models': {
    productId: 'excel',
    featureId: 'excel.advanced_financial_models',
    badge: 'ADVANCED MODELING',
    title: 'Advanced Financial Modeling',
    subtitle: 'Master DCF, LBO, and scenario analysis.',
    description: 'Build enterprise-grade valuation and financial forecasting models.',
    benefits: [
      {
        title: 'Scenario & Sensitivity Matrices',
        description: 'Interactive data tables and multi-variable goal seeking.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Unlock Financial Modeling',
  },
  'powerbi.core_dashboards': {
    productId: 'powerbi',
    featureId: 'powerbi.core_dashboards',
    badge: 'CORE LEARNING',
    title: 'Power BI Fundamentals',
    subtitle: 'Included in the free tier.',
    description: 'Free business intelligence reporting and basic DAX calculations.',
    benefits: [],
    recommendedPlan: 'Free',
    ctaText: 'Start Learning Free',
  },
  'powerbi.enterprise_schemas': {
    productId: 'powerbi',
    featureId: 'powerbi.enterprise_schemas',
    badge: 'POWER BI PRO',
    title: 'Enterprise Dimensional Schemas',
    subtitle: 'Build complex multi-fact star schemas.',
    description: 'Model dimensional data warehouses with high-cardinality cross-filtering.',
    benefits: [
      {
        title: 'Advanced Star Schema Modeler',
        description: 'Connect multiple fact and dimension tables with custom relationships.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Explore Power BI Pro',
  },
  'powerbi.custom_dax_benchmarks': {
    productId: 'powerbi',
    featureId: 'powerbi.custom_dax_benchmarks',
    badge: 'ADVANCED DAX',
    title: 'DAX Performance Benchmarks',
    subtitle: 'Optimize measure calculations and query plans.',
    description: 'Evaluate iterator functions (SUMX, CALCULATE) for enterprise dashboard performance.',
    benefits: [
      {
        title: 'DAX Query Inspector',
        description: 'Examine filter context transitions and memory execution plans.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Unlock Advanced DAX',
  },
  'powerbi.custom_datasets': {
    productId: 'powerbi',
    featureId: 'powerbi.custom_datasets',
    badge: 'POWER BI WORKSPACE',
    title: 'Bring Your Own Data',
    subtitle: 'Upload CSV, TSV, and delimited files directly into your workspace.',
    description: 'Load custom datasets and inspect column profiles in a secure in-browser environment.',
    benefits: [],
    recommendedPlan: 'Free',
    ctaText: 'Start Modeling Free',
  },
  'powerbi.multiple_datasets': {
    productId: 'powerbi',
    featureId: 'powerbi.multiple_datasets',
    badge: 'MULTI-DATASET MODELING',
    title: 'Multi-Dataset Modeling',
    subtitle: 'Load and connect up to 10 datasets in a single project.',
    description: 'Unlock enterprise star schemas and multi-fact relational models.',
    benefits: [
      {
        title: 'Up to 10 Datasets per Project',
        description: 'Combine sales, products, customers, and territory datasets simultaneously.',
      },
      {
        title: '100,000 Rows per Dataset',
        description: 'Expand your capacity from 25,000 to 100,000 rows per dataset.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Upgrade to Pro Analyst',
  },
  'powerbi.advanced_modeling': {
    productId: 'powerbi',
    featureId: 'powerbi.advanced_modeling',
    badge: 'ADVANCED SEMANTIC MODELING',
    title: 'Semantic Data Modeling',
    subtitle: 'Define custom relationships and cross-filter semantics.',
    description: 'Build complex multi-table analytical schemas with automatic relationship candidate detection.',
    benefits: [
      {
        title: 'Semantic Relationship Engine',
        description: 'Configure 1:1, 1:N, and N:N cardinality with bidirectional cross-filtering.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Unlock Advanced Modeling',
  },
  'powerbi.dashboard_export': {
    productId: 'powerbi',
    featureId: 'powerbi.dashboard_export',
    badge: 'MODEL EXPORT',
    title: 'Portfolio Model Exporter',
    subtitle: 'Export prepared data models and schemas.',
    description: 'Export clean data models to showcase in your personal portfolio or presentation decks.',
    benefits: [
      {
        title: 'Dataset Schema Exporter',
        description: 'Export multi-table schemas and column profiles in standard formats.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Unlock Export Capabilities',
  },
  'powerbi.ai_insights': {
    productId: 'powerbi',
    featureId: 'powerbi.ai_insights',
    badge: 'AI-EVA BI COPILOT',
    title: 'AI-EVA Workspace Intelligence',
    subtitle: 'Ask questions, detect model anomalies, and discover relationship candidates.',
    description: 'Context-aware intelligence that analyzes your dataset schemas and profiling warnings.',
    benefits: [
      {
        title: 'Intelligent Schema Assistant',
        description: 'Discover join keys and receive guided modeling recommendations.',
      },
    ],
    recommendedPlan: 'Pro Analyst',
    ctaText: 'Unlock AI-EVA Insights',
  },

  'general.progress_tracking': {
    productId: 'sql',
    featureId: 'general.progress_tracking',
    badge: 'FREE CAPABILITY',
    title: 'Progress Tracking',
    subtitle: 'Included in all plans.',
    description: 'Track XP, level progression, and solved challenge milestones.',
    benefits: [],
    recommendedPlan: 'Free',
    ctaText: 'Start Learning Free',
  },
  'general.community_access': {
    productId: 'sql',
    featureId: 'general.community_access',
    badge: 'FREE CAPABILITY',
    title: 'Community & Datasets',
    subtitle: 'Included in all plans.',
    description: 'Access curated public practice datasets and community discussion.',
    benefits: [],
    recommendedPlan: 'Free',
    ctaText: 'Start Learning Free',
  },
};

const TIER_WEIGHTS: Record<ProductTier, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

/**
 * Check if a feature is accessible under the given product tier.
 */
export function canUseFeature(featureId: FeatureId, userTier: ProductTier = 'free'): boolean {
  const requiredTier = FEATURE_TIER_REQUIREMENTS[featureId] || 'free';
  return TIER_WEIGHTS[userTier] >= TIER_WEIGHTS[requiredTier];
}

/**
 * Check if a feature requires an upgrade from the current user tier.
 */
export function requiresUpgrade(featureId: FeatureId, userTier: ProductTier = 'free'): boolean {
  return !canUseFeature(featureId, userTier);
}

/**
 * Retrieve the contextual upgrade metadata for a specific feature.
 */
export function getUpgradeContext(featureId: FeatureId): UpgradeContext {
  return (
    UPGRADE_CONTEXTS[featureId] || {
      productId: 'sql',
      featureId,
      badge: 'PRO CAPABILITY',
      title: 'Upgrade Required',
      subtitle: 'Unlock this advanced capability.',
      description: 'This feature is part of the Pro Analyst curriculum.',
      benefits: [],
      recommendedPlan: 'Pro Analyst',
      ctaText: 'Explore Pro Access',
    }
  );
}

/**
 * Evaluate entitlement status and return full check result with upgrade context.
 */
export function evaluateEntitlement(
  featureId: FeatureId,
  userTier: ProductTier = 'free'
): EntitlementCheckResult {
  const allowed = canUseFeature(featureId, userTier);
  return {
    allowed,
    tier: userTier,
    featureId,
    reason: allowed ? undefined : 'Feature requires higher subscription tier',
    upgradeContext: allowed ? undefined : getUpgradeContext(featureId),
  };
}

/**
 * Retrieve active product access tier.
 */
export function getProductAccess(productId: ProductId, userTier: ProductTier = 'free'): ProductTier {
  // Returns current tier for the given product
  return userTier;
}
