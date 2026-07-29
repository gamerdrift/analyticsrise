import { PlanTier } from '@/lib/config/plans';

export type PaymentProvider = 'stripe' | 'razorpay' | 'paddle';

export interface CheckoutSessionRequest {
  planId: PlanTier;
  billingCycle: 'monthly' | 'annual';
  provider?: PaymentProvider;
  successUrl?: string;
  cancelUrl?: string;
  couponCode?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
  provider: PaymentProvider;
  amountUsd: number;
}

export interface InvoiceItem {
  id: string;
  date: string;
  amountUsd: number;
  status: 'paid' | 'pending' | 'failed';
  planName: string;
  pdfUrl: string;
}

export class BillingService {
  /**
   * Initialize a checkout session via abstraction interface
   */
  static async createCheckoutSession(
    req: CheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> {
    console.log('[BillingService] Creating checkout session for:', req);

    // Simulated provider response (Stripe / Razorpay / Paddle integration abstraction)
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 10)}`;
    const checkoutUrl = `/settings/subscription?checkout_status=success&plan=${req.planId}&cycle=${req.billingCycle}&session_id=${mockSessionId}`;

    return {
      sessionId: mockSessionId,
      checkoutUrl,
      provider: req.provider || 'stripe',
      amountUsd: req.billingCycle === 'annual' ? 278 : 29,
    };
  }

  /**
   * Fetch invoice history
   */
  static getBillingHistory(uid: string = 'demo-user'): InvoiceItem[] {
    return [
      {
        id: 'INV-2026-001',
        date: '2026-07-01',
        amountUsd: 29,
        status: 'paid',
        planName: 'Professional Pro (Monthly)',
        pdfUrl: '#',
      },
      {
        id: 'INV-2026-002',
        date: '2026-06-01',
        amountUsd: 29,
        status: 'paid',
        planName: 'Professional Pro (Monthly)',
        pdfUrl: '#',
      },
    ];
  }
}
