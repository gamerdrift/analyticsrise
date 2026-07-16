import { PaymentProvider } from './PaymentProvider';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

/**
 * Minimal Razorpay provider placeholder.
 */
export class RazorpayProvider implements PaymentProvider {
  private app: FirebaseApp;
  private db = getFirestore();

  constructor(app: FirebaseApp) {
    this.app = app;
  }

  async createCheckoutSession(tier: string, userId: string, isAnnual: boolean): Promise<string> {
    const sessionId = `rp_test_${Date.now()}`;
    await setDoc(doc(this.db, 'payments', sessionId), {
      provider: 'razorpay',
      userId,
      tier,
      isAnnual,
      status: 'pending',
    });
    return `https://checkout.razorpay.com/v1/checkout/${sessionId}`;
  }

  async verifyWebhook(_rawBody: Buffer, _signature: string): Promise<any> {
    return { provider: 'razorpay', event: 'payment.captured' };
  }
}
