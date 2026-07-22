import { PaymentProvider } from './PaymentProvider';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

/**
 * Minimal PayPal provider implementation.
 * Generates mock checkout session and stores payment intent.
 */
export class PayPalProvider implements PaymentProvider {
  private app: any;
  private db = getFirestore();

  constructor(app: any) {
    this.app = app;
  }

  async createCheckoutSession(tier: string, userId: string, isAnnual: boolean): Promise<string> {
    const payToken = `token_${Date.now()}`;
    await setDoc(doc(this.db, 'payments', payToken), {
      provider: 'paypal',
      userId,
      tier,
      isAnnual,
      status: 'pending',
    });
    return `https://www.paypal.com/checkoutnow?token=${payToken}`;
  }

  async verifyWebhook(_rawBody: Buffer, _signature: string): Promise<any> {
    return { provider: 'paypal', event: 'CHECKOUT.ORDER.APPROVED' };
  }
}
