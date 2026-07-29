export type RecruiterTier = 'recruiter_starter' | 'recruiter_business' | 'recruiter_enterprise';

export interface RecruiterPlanLimits {
  activeJobPosts: number;
  candidateSearchesPerMonth: number;
  portfolioViewsPerMonth: number;
  messagingCreditsPerMonth: number;
  analyticsAccess: boolean;
  atsIntegration: boolean;
}

export interface RecruiterPlanDefinition {
  id: RecruiterTier;
  name: string;
  monthlyPriceUsd: number;
  annualPriceUsd: number;
  limits: RecruiterPlanLimits;
  features: string[];
}

export const RECRUITER_PLANS: Record<RecruiterTier, RecruiterPlanDefinition> = {
  recruiter_starter: {
    id: 'recruiter_starter',
    name: 'Recruiter Starter',
    monthlyPriceUsd: 149,
    annualPriceUsd: 1430,
    limits: {
      activeJobPosts: 3,
      candidateSearchesPerMonth: 100,
      portfolioViewsPerMonth: 250,
      messagingCreditsPerMonth: 30,
      analyticsAccess: false,
      atsIntegration: false,
    },
    features: [
      '3 Active Job Postings',
      '100 Candidate Searches/mo',
      '250 Full Portfolio Views/mo',
      '30 Direct InMail Credits/mo',
      'Basic Candidate Pipeline Stepper',
    ],
  },
  recruiter_business: {
    id: 'recruiter_business',
    name: 'Recruiter Business',
    monthlyPriceUsd: 399,
    annualPriceUsd: 3830,
    limits: {
      activeJobPosts: 15,
      candidateSearchesPerMonth: 1000,
      portfolioViewsPerMonth: 2000,
      messagingCreditsPerMonth: 200,
      analyticsAccess: true,
      atsIntegration: true,
    },
    features: [
      '15 Active Job Postings',
      '1,000 Candidate Searches/mo',
      '2,000 Full Portfolio Views/mo',
      '200 Direct InMail Credits/mo',
      'AI Candidate Technical Match Scoring',
      'Recruiter Team Analytics',
      'ATS Integration (Greenhouse/Lever)',
    ],
  },
  recruiter_enterprise: {
    id: 'recruiter_enterprise',
    name: 'Recruiter Enterprise',
    monthlyPriceUsd: 999,
    annualPriceUsd: 9590,
    limits: {
      activeJobPosts: -1, // Unlimited
      candidateSearchesPerMonth: -1,
      portfolioViewsPerMonth: -1,
      messagingCreditsPerMonth: 1000,
      analyticsAccess: true,
      atsIntegration: true,
    },
    features: [
      'UNLIMITED Active Job Postings',
      'UNLIMITED Candidate Searches & Portfolio Views',
      '1,000 Direct InMail Credits/mo',
      'Dedicated Talent Scout Account Manager',
      'Custom Assessment Test Integration',
      'Enterprise SLA & Dedicated Support',
    ],
  },
};
