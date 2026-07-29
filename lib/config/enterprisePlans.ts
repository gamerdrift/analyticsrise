export type EnterpriseTier = 'team_small' | 'team_growth' | 'team_corporate';

export interface EnterprisePlanDefinition {
  id: EnterpriseTier;
  name: string;
  minSeats: number;
  maxSeats: number;
  pricePerSeatMonthlyUsd: number;
  pricePerSeatAnnualUsd: number;
  features: string[];
}

export const ENTERPRISE_PLANS: Record<EnterpriseTier, EnterprisePlanDefinition> = {
  team_small: {
    id: 'team_small',
    name: 'Small Team Pack',
    minSeats: 5,
    maxSeats: 20,
    pricePerSeatMonthlyUsd: 35,
    pricePerSeatAnnualUsd: 28,
    features: [
      '5 - 20 Employee Seats',
      'Full Access to All 15+ Practice Labs & Simulators',
      'Manager Dashboard & Progress Tracking',
      'Team Skill Gap Analytics',
      'Shared Team Workspace',
    ],
  },
  team_growth: {
    id: 'team_growth',
    name: 'Growth Team Pack',
    minSeats: 21,
    maxSeats: 100,
    pricePerSeatMonthlyUsd: 28,
    pricePerSeatAnnualUsd: 22,
    features: [
      '21 - 100 Employee Seats',
      'All Small Team Features',
      'Custom Corporate Learning Pathways',
      'SSO Integration (Okta/SAML/Azure AD)',
      'Automated Weekly Manager Email Reports',
      'Priority Customer Success Support',
    ],
  },
  team_corporate: {
    id: 'team_corporate',
    name: 'Enterprise Custom',
    minSeats: 101,
    maxSeats: 10000,
    pricePerSeatMonthlyUsd: 20,
    pricePerSeatAnnualUsd: 15,
    features: [
      '100+ Employee Seats',
      'Custom Branded Learning Portal (White-label UI)',
      'Dedicated Customer Success & Onboarding Manager',
      'API & HRIS Data Export Integration',
      'Custom SLA & Invoicing (PO Billing)',
      'Security Audit & Dedicated Tenant Encryption',
    ],
  },
};
