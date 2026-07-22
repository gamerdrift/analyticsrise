import { PaymentProvider } from './PaymentProvider';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

/**
 * Minimal Razorpay provider implementation.
 * Generates mock checkout session and stores payment intent.
 */
export class RazorpayProvider implements PaymentProvider {
  private app: any;
  private db = getFirestore();

  constructor(app: any) {
    this.app = app;
  }

  async createCheckoutSession(tier: string, userId: string, isAnnual: boolean): Promise<string> {
    const orderId = `order_${Date.now()}`;
    await setDoc(doc(this.db, 'payments', orderId), {
      provider: 'razorpay',
      userId,
      tier,
      isAnnual,
      status: 'pending',
    });
    return `https://api.razorpay.com/v1/checkout/${orderId}`;
  }

  async verifyWebhook(_rawBody: Buffer, _signature: string): Promise<any> {
    return { provider: 'razorpay', event: 'payment.captured' };
  }
}
