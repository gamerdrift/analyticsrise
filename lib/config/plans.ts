export type PlanTier = 'guest' | 'free' | 'student_pro' | 'pro' | 'enterprise' | 'recruiter';

export interface PlanLimits {
  aiMentorQuota: number; // Monthly queries (-1 for unlimited)
  simulatorHours: number; // Monthly simulator access hours (-1 for unlimited)
  certificateAccess: boolean;
  resumeBuilderQuota: number; // Resume ATS scans/creations per month
  interviewCoachQuota: number; // Mock interview sessions per month
  jobAppQuota: number; // Monthly job applications via Get Hired
  portfolioExportAllowed: boolean;
  storageMb: number; // Custom project/dataset storage in MB
  customDomainAllowed: boolean;
}

export interface PlanPricing {
  monthlyPriceUsd: number;
  annualPriceUsd: number; // Total annual cost
  annualMonthlyEquivalentUsd: number; // Display cost per month when billed annually
}

export interface PlanDefinition {
  id: PlanTier;
  name: string;
  badge?: string;
  tagline: string;
  popular?: boolean;
  pricing: PlanPricing;
  limits: PlanLimits;
  highlights: string[];
}

export const MEMBERSHIP_PLANS: Record<PlanTier, PlanDefinition> = {
  guest: {
    id: 'guest',
    name: 'Guest Explorer',
    tagline: 'Experience AnalyticsRise interactive preview',
    pricing: {
      monthlyPriceUsd: 0,
      annualPriceUsd: 0,
      annualMonthlyEquivalentUsd: 0,
    },
    limits: {
      aiMentorQuota: 3,
      simulatorHours: 1,
      certificateAccess: false,
      resumeBuilderQuota: 0,
      interviewCoachQuota: 0,
      jobAppQuota: 0,
      portfolioExportAllowed: false,
      storageMb: 10,
      customDomainAllowed: false,
    },
    highlights: [
      'Interactive Excel & SQL preview',
      '3 AI Mentor queries',
      'Public community access',
    ],
  },
  free: {
    id: 'free',
    name: 'Free Learner',
    tagline: 'Essential foundation for analytics beginners',
    pricing: {
      monthlyPriceUsd: 0,
      annualPriceUsd: 0,
      annualMonthlyEquivalentUsd: 0,
    },
    limits: {
      aiMentorQuota: 15,
      simulatorHours: 5,
      certificateAccess: false,
      resumeBuilderQuota: 1,
      interviewCoachQuota: 1,
      jobAppQuota: 3,
      portfolioExportAllowed: false,
      storageMb: 50,
      customDomainAllowed: false,
    },
    highlights: [
      'Access to 4 foundation courses',
      '15 monthly AI Mentor credits',
      '5 simulator practice hours/mo',
      '1 ATS resume scan/mo',
      '3 job applications/mo',
    ],
  },
  student_pro: {
    id: 'student_pro',
    name: 'Student Pro',
    badge: 'ACADEMIC',
    tagline: 'Discounted power tools for accredited students',
    pricing: {
      monthlyPriceUsd: 12,
      annualPriceUsd: 115,
      annualMonthlyEquivalentUsd: 9.5,
    },
    limits: {
      aiMentorQuota: 200,
      simulatorHours: 50,
      certificateAccess: true,
      resumeBuilderQuota: 10,
      interviewCoachQuota: 10,
      jobAppQuota: 25,
      portfolioExportAllowed: true,
      storageMb: 500,
      customDomainAllowed: false,
    },
    highlights: [
      'All 15+ Advanced Courses',
      '200 AI Mentor credits/mo',
      '50 simulator practice hours/mo',
      '10 ATS Resume Scans & Reviews',
      'Official Verified Certifications',
      'Student Job Match Priority',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Professional Pro',
    badge: 'MOST POPULAR',
    popular: true,
    tagline: 'Complete career acceleration suite for working pros',
    pricing: {
      monthlyPriceUsd: 29,
      annualPriceUsd: 278,
      annualMonthlyEquivalentUsd: 23,
    },
    limits: {
      aiMentorQuota: -1, // Unlimited
      simulatorHours: -1, // Unlimited
      certificateAccess: true,
      resumeBuilderQuota: -1,
      interviewCoachQuota: 50,
      jobAppQuota: -1,
      portfolioExportAllowed: true,
      storageMb: 2048,
      customDomainAllowed: true,
    },
    highlights: [
      'UNLIMITED AI Mentor & Excel/SQL/Python Labs',
      'UNLIMITED Course Certifications',
      'UNLIMITED ATS Resume Optimization',
      '50 AI Technical Interview sessions/mo',
      'Featured Portfolio & Direct Recruiter Inbox',
      'Priority 24/7 Technical Support',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Workforce',
    badge: 'CORPORATE',
    tagline: 'Custom team upskilling & workforce intelligence',
    pricing: {
      monthlyPriceUsd: 99,
      annualPriceUsd: 950,
      annualMonthlyEquivalentUsd: 79,
    },
    limits: {
      aiMentorQuota: -1,
      simulatorHours: -1,
      certificateAccess: true,
      resumeBuilderQuota: -1,
      interviewCoachQuota: -1,
      jobAppQuota: -1,
      portfolioExportAllowed: true,
      storageMb: 10240,
      customDomainAllowed: true,
    },
    highlights: [
      'All Professional Pro features',
      'Dedicated Team Admin Portal & Manager Dashboards',
      'Custom Corporate Skill Assessment Pathways',
      'Single Sign-On (SAML/Okta SSO)',
      'Dedicated Customer Success Manager',
      'Custom SLA & Invoicing',
    ],
  },
  recruiter: {
    id: 'recruiter',
    name: 'Recruiter Suite',
    badge: 'EMPLOYER',
    tagline: 'Hiring portal for verified analytics candidates',
    pricing: {
      monthlyPriceUsd: 149,
      annualPriceUsd: 1430,
      annualMonthlyEquivalentUsd: 119,
    },
    limits: {
      aiMentorQuota: 100,
      simulatorHours: 10,
      certificateAccess: true,
      resumeBuilderQuota: 50,
      interviewCoachQuota: 50,
      jobAppQuota: -1,
      portfolioExportAllowed: true,
      storageMb: 5120,
      customDomainAllowed: true,
    },
    highlights: [
      'Post Verified Global Job Openings',
      'Search Candidate Portfolios & Code Proofs',
      'Direct Candidate Messaging & InMail',
      'AI Candidate Technical Match Scoring',
      'ATS Integration & Pipeline Stepper',
    ],
  },
};
