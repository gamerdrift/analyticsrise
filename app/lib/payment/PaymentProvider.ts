import { Stripe } from 'stripe';
import type { FirebaseApp } from 'firebase/app';

/**
 * Common interface for payment provider implementations.
 */
export interface PaymentProvider {
  /**
   * Create a payment session / checkout URL for a subscription.
   * @param tier - subscription tier identifier
   * @param userId - UID of the Firebase Auth user
   * @param isAnnual - true for annual billing, false for monthly
   * @returns URL that the frontend should redirect the user to.
   */
  createCheckoutSession(
    tier: string,
    userId: string,
    isAnnual: boolean,
  ): Promise<string>;

  /**
   * Verify a webhook payload received from the provider.
   * @param rawBody - raw request body
   * @param signature - provider‑specific signature header
   * @returns normalized event data that can be processed by the app.
   */
  verifyWebhook(rawBody: Buffer, signature: string): Promise<any>;
}

/**
 * Factory to obtain a concrete provider implementation based on a name.
 * The function lazily imports the concrete module so the bundle size stays small.
 */
export async function getPaymentProvider(
  name: 'stripe' | 'razorpay' | 'paypal',
  firebaseApp: FirebaseApp,
): Promise<PaymentProvider> {
  switch (name) {
    case 'stripe':
      const { StripeProvider } = await import('./stripe');
      return new StripeProvider(firebaseApp);
    case 'razorpay':
      const { RazorpayProvider } = await import('./razorpay');
      return new RazorpayProvider(firebaseApp);
    case 'paypal':
      const { PayPalProvider } = await import('./paypal');
      return new PayPalProvider(firebaseApp);
    default:
      throw new Error(`Unsupported payment provider: ${name}`);
  }
}
