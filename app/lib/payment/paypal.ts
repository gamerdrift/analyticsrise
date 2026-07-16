import { PaymentProvider } from './PaymentProvider';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

/**
 * Minimal PayPal provider placeholder.
 */
export class PayPalProvider implements PaymentProvider {
  private app: FirebaseApp;
  private db = getFirestore();

  constructor(app: FirebaseApp) {
    this.app = app;
  }

  async createCheckoutSession(tier: string, userId: string, isAnnual: boolean): Promise<string> {
    const sessionId = `pp_test_${Date.now()}`;
    await setDoc(doc(this.db, 'payments', sessionId), {
      provider: 'paypal',
      userId,
      tier,
      isAnnual,
      status: 'pending',
    });
    return `https://www.paypal.com/checkoutnow?token=${sessionId}`;
  }

  async verifyWebhook(_rawBody: Buffer, _signature: string): Promise<any> {
    return { provider: 'paypal', event: 'PAYMENT.CAPTURE.COMPLETED' };
  }
}
