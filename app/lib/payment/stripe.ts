import { PaymentProvider } from './PaymentProvider';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

/**
 * Minimal Stripe provider placeholder.
 * In a real implementation you would use the Stripe SDK server‑side.
 */
export class StripeProvider implements PaymentProvider {
  private app: any;
  private db = getFirestore();

  constructor(app: any) {
    this.app = app;
  }

  async createCheckoutSession(tier: string, userId: string, isAnnual: boolean): Promise<string> {
    // Placeholder: generate a fake checkout URL.
    const sessionId = `cs_test_${Date.now()}`;
    // Store a minimal record for debugging.
    await setDoc(doc(this.db, 'payments', sessionId), {
      provider: 'stripe',
      userId,
      tier,
      isAnnual,
      status: 'pending',
    });
    return `https://checkout.stripe.com/pay/${sessionId}`;
  }

  async verifyWebhook(_rawBody: Buffer, _signature: string): Promise<any> {
    // Placeholder – in production verify Stripe signature.
    return { provider: 'stripe', event: 'checkout.session.completed' };
  }
}
