/**
 * Server-Side Authoritative Pricing Catalog for AnalyticsRise
 *
 * This is the SINGLE source of truth for all plan pricing calculations.
 * The client/browser NEVER dictates the payment amount or currency.
 */

export type PaidPlanTier = 'student_pro' | 'pro' | 'enterprise' | 'recruiter';
export type BillingCycle = 'monthly' | 'annual';

export interface AuthoritativePlan {
  id: PaidPlanTier;
  name: string;
  monthlyPriceUsd: number;
  annualPriceUsd: number;
  currency: string;
}

export const AUTHORITATIVE_PLANS: Record<PaidPlanTier, AuthoritativePlan> = {
  student_pro: {
    id: 'student_pro',
    name: 'Student Pro',
    monthlyPriceUsd: 12,
    annualPriceUsd: 115,
    currency: 'USD',
  },
  pro: {
    id: 'pro',
    name: 'Professional Pro',
    monthlyPriceUsd: 29,
    annualPriceUsd: 278,
    currency: 'USD',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Workforce',
    monthlyPriceUsd: 99,
    annualPriceUsd: 950,
    currency: 'USD',
  },
  recruiter: {
    id: 'recruiter',
    name: 'Recruiter Suite',
    monthlyPriceUsd: 149,
    annualPriceUsd: 1430,
    currency: 'USD',
  },
};

export interface ResolvedPlanDetails {
  id: PaidPlanTier;
  name: string;
  billingCycle: BillingCycle;
  displayAmount: number; // in USD dollars
  amountInSubunits: number; // in USD cents (e.g., $29 -> 2900)
  currency: string; // 'USD'
}

/**
 * Validates requested plan ID and calculates authoritative price.
 * Rejects free tiers ('guest', 'free') and unknown plan identifiers.
 */
export function resolvePlanPricing(
  planId: string,
  billingCycle: string = 'monthly'
): ResolvedPlanDetails {
  if (!planId || typeof planId !== 'string') {
    throw new Error('Plan ID is required and must be a string.');
  }

  const normalizedPlanId = planId.trim().toLowerCase() as PaidPlanTier;
  const plan = AUTHORITATIVE_PLANS[normalizedPlanId];

  if (!plan) {
    throw new Error(
      `Invalid plan ID: "${planId}". Only paid tiers (student_pro, pro, enterprise, recruiter) can be checked out.`
    );
  }

  const normalizedCycle: BillingCycle =
    billingCycle && billingCycle.toLowerCase() === 'annual' ? 'annual' : 'monthly';

  const displayAmount =
    normalizedCycle === 'annual' ? plan.annualPriceUsd : plan.monthlyPriceUsd;

  // Smallest subunit conversion for USD: $1 = 100 cents
  const amountInSubunits = Math.round(displayAmount * 100);

  return {
    id: plan.id,
    name: plan.name,
    billingCycle: normalizedCycle,
    displayAmount,
    amountInSubunits,
    currency: plan.currency,
  };
}
