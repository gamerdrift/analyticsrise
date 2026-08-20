/**
 * Multi-Currency Pricing Configuration
 * 
 * Configures explicit, market-specific pricing for INR (₹) and USD ($).
 * Does NOT rely on live dynamic conversions or active payment gateway requests.
 */

export type Currency = 'INR' | 'USD';
export type BillingCycle = 'monthly' | 'annual';

export interface PlanPricing {
  planId: string;
  name: string;
  currency: Currency;
  monthlyPrice: number;
  annualMonthlyEquivalent: number;
  annualBilledTotal: number;
  annualDiscountPercent: number;
  symbol: string;
}

export const PRICING_CONFIG: Record<Currency, Record<string, PlanPricing>> = {
  INR: {
    free: {
      planId: 'free',
      name: 'Sandbox Free',
      currency: 'INR',
      monthlyPrice: 0,
      annualMonthlyEquivalent: 0,
      annualBilledTotal: 0,
      annualDiscountPercent: 0,
      symbol: '₹',
    },
    pro: {
      planId: 'pro',
      name: 'Pro Analyst',
      currency: 'INR',
      monthlyPrice: 1499,
      annualMonthlyEquivalent: 999,
      annualBilledTotal: 11988,
      annualDiscountPercent: 33,
      symbol: '₹',
    },
    enterprise: {
      planId: 'enterprise',
      name: 'Enterprise Cohort',
      currency: 'INR',
      monthlyPrice: 0,
      annualMonthlyEquivalent: 0,
      annualBilledTotal: 0,
      annualDiscountPercent: 0,
      symbol: '₹',
    },
  },
  USD: {
    free: {
      planId: 'free',
      name: 'Sandbox Free',
      currency: 'USD',
      monthlyPrice: 0,
      annualMonthlyEquivalent: 0,
      annualBilledTotal: 0,
      annualDiscountPercent: 0,
      symbol: '$',
    },
    pro: {
      planId: 'pro',
      name: 'Pro Analyst',
      currency: 'USD',
      monthlyPrice: 29,
      annualMonthlyEquivalent: 19,
      annualBilledTotal: 228,
      annualDiscountPercent: 35,
      symbol: '$',
    },
    enterprise: {
      planId: 'enterprise',
      name: 'Enterprise Cohort',
      currency: 'USD',
      monthlyPrice: 0,
      annualMonthlyEquivalent: 0,
      annualBilledTotal: 0,
      annualDiscountPercent: 0,
      symbol: '$',
    },
  },
};

/**
 * Resolve formatted price string for a plan in a specific currency and billing cycle
 */
export function getPlanPriceDisplay(
  planId: string,
  currency: Currency = 'USD',
  billingCycle: BillingCycle = 'monthly'
): { formatted: string; amount: number; symbol: string; suffix: string } {
  const currencyPlans = PRICING_CONFIG[currency] || PRICING_CONFIG.USD;
  const plan = currencyPlans[planId] || currencyPlans.free;

  if (planId === 'enterprise') {
    return { formatted: 'Custom', amount: 0, symbol: '', suffix: '' };
  }

  if (planId === 'free') {
    return { formatted: `${plan.symbol}0`, amount: 0, symbol: plan.symbol, suffix: '/forever' };
  }

  const amount = billingCycle === 'annual' ? plan.annualMonthlyEquivalent : plan.monthlyPrice;
  const formatted = currency === 'INR' ? `₹${amount.toLocaleString('en-IN')}` : `$${amount}`;

  return {
    formatted,
    amount,
    symbol: plan.symbol,
    suffix: '/mo',
  };
}

/**
 * Format currency amount with symbol
 */
export function formatCurrencyAmount(amount: number, currency: Currency = 'USD'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `$${amount}`;
}
