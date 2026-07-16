export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export interface FeatureSet {
  dailySimulatorLimit?: number; // undefined = unlimited
  missions: string[]; // identifiers of missions available
  datasets: string[]; // identifiers of datasets
  certificates: string[]; // certificate types
  aiMentor?: boolean;
  resumeBuilder?: boolean;
  portfolioBuilder?: boolean;
  analytics?: boolean;
  dashboardAdvanced?: boolean;
  prioritySupport?: boolean;
  teamFeatures?: boolean;
  customBranding?: boolean;
}

export const TierFeatures: Record<SubscriptionTier, FeatureSet> = {
  [SubscriptionTier.FREE]: {
    dailySimulatorLimit: 5,
    missions: ['beginner'],
    datasets: ['public'],
    certificates: ['basic'],
  },
  [SubscriptionTier.PRO]: {
    dailySimulatorLimit: undefined, // unlimited
    missions: ['beginner', 'advanced'],
    datasets: ['public', 'premium'],
    certificates: ['basic', 'premium'],
    aiMentor: true,
    resumeBuilder: true,
    portfolioBuilder: true,
    analytics: true,
    dashboardAdvanced: true,
    prioritySupport: true,
  },
  [SubscriptionTier.ENTERPRISE]: {
    dailySimulatorLimit: undefined,
    missions: ['beginner', 'advanced', 'enterprise'],
    datasets: ['public', 'premium', 'enterprise'],
    certificates: ['basic', 'premium', 'enterprise'],
    aiMentor: true,
    resumeBuilder: true,
    portfolioBuilder: true,
    analytics: true,
    dashboardAdvanced: true,
    prioritySupport: true,
    teamFeatures: true,
    customBranding: true,
  },
};
