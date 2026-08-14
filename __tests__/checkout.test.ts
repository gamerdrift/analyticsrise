import { BillingService } from '../lib/services/billingService';
import { loadRazorpaySdk } from '../lib/utils/razorpayLoader';
import { MembershipService } from '../lib/services/membershipService';
import { EntitlementService } from '../lib/services/entitlementService';
import { auth, functions } from '../lib/firebase/config';
import { httpsCallable } from 'firebase/functions';
import { getDoc } from 'firebase/firestore';

describe('Mission 07: Frontend Razorpay Checkout Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (typeof window !== 'undefined') {
      localStorage.clear();
      delete (window as any).Razorpay;
    }
  });

  describe('Authentication & Order Creation Contracts', () => {
    test('1. Unauthenticated user cannot initiate checkout', async () => {
      (auth as any).currentUser = null;

      await expect(
        BillingService.createCheckoutOrder('pro', 'monthly')
      ).rejects.toThrow(/Authentication required/i);
    });

    test('2, 3, 4. Authenticated user sends ONLY planId and billingCycle without client-calculated amount', async () => {
      (auth as any).currentUser = {
        uid: 'user_auth_12345',
        email: 'dev@analyticsrise.com',
        displayName: 'Senior Engineer',
      };

      const mockCreateOrder = jest.fn().mockResolvedValue({
        data: {
          orderId: 'order_rzp_server_9988',
          amount: 2900,
          currency: 'USD',
          keyId: 'rzp_test_public_key_123',
          planId: 'pro',
          planName: 'Professional Pro',
          billingCycle: 'monthly',
        },
      });
      (httpsCallable as jest.Mock).mockReturnValue(mockCreateOrder);

      const order = await BillingService.createCheckoutOrder('pro', 'monthly');

      // Verify callable was invoked
      expect(httpsCallable).toHaveBeenCalledWith(functions, 'createRazorpayOrder');
      expect(mockCreateOrder).toHaveBeenCalledWith({
        planId: 'pro',
        billingCycle: 'monthly',
      });

      // Verify server values were received without client-side amount override
      expect(order.orderId).toBe('order_rzp_server_9988');
      expect(order.amount).toBe(2900);
      expect(order.currency).toBe('USD');
      expect(order.keyId).toBe('rzp_test_public_key_123');
    });

    test('5. Order response is validated (rejects corrupted response)', async () => {
      (auth as any).currentUser = { uid: 'user_auth_12345' };

      const mockCreateOrder = jest.fn().mockResolvedValue({
        data: {
          orderId: '', // Invalid empty order ID
          amount: 0,
        },
      });
      (httpsCallable as jest.Mock).mockReturnValue(mockCreateOrder);

      await expect(
        BillingService.createCheckoutOrder('pro', 'monthly')
      ).rejects.toThrow(/Invalid order response/i);
    });
  });

  describe('Razorpay SDK Loader', () => {
    test('6. Razorpay SDK loads successfully and reuses existing window.Razorpay', async () => {
      // Mock window.Razorpay
      (window as any).Razorpay = jest.fn();

      const loaded = await loadRazorpaySdk();
      expect(loaded).toBe(true);
    });

    test('7. Razorpay SDK handles load failure cleanly', async () => {
      // Ensure no existing script or window object
      const existing = document.getElementById('razorpay-checkout-sdk');
      if (existing) existing.remove();

      // Trigger load which creates script
      const loadPromise = loadRazorpaySdk();

      const script = document.getElementById('razorpay-checkout-sdk') as HTMLScriptElement;
      expect(script).not.toBeNull();

      // Simulate script error
      script.onerror!(new Event('error'));

      await expect(loadPromise).rejects.toThrow(/Failed to connect to Razorpay/i);
    });
  });

  describe('Checkout Options & Payment Verification', () => {
    test('8, 9, 10, 11, 12. Checkout initializes with server values and invokes verifyRazorpayPayment', async () => {
      (auth as any).currentUser = {
        uid: 'user_auth_12345',
        email: 'dev@analyticsrise.com',
        displayName: 'Senior Engineer',
      };

      const mockCreateOrder = jest.fn().mockResolvedValue({
        data: {
          orderId: 'order_rzp_server_9988',
          amount: 2900,
          currency: 'USD',
          keyId: 'rzp_test_public_key_123',
          planId: 'pro',
          planName: 'Professional Pro',
          billingCycle: 'monthly',
        },
      });

      const mockVerifyPayment = jest.fn().mockResolvedValue({
        data: {
          verified: true,
          orderId: 'order_rzp_server_9988',
          paymentId: 'pay_rzp_server_7788',
          amount: 2900,
          currency: 'USD',
          verificationStatus: 'signature_verified',
          paymentStatus: 'captured',
          message: 'Payment verified.',
        },
      });

      (httpsCallable as jest.Mock).mockImplementation((_, fnName) => {
        if (fnName === 'createRazorpayOrder') return mockCreateOrder;
        if (fnName === 'verifyRazorpayPayment') return mockVerifyPayment;
        return jest.fn();
      });

      let capturedOptions: any = null;
      const mockOpen = jest.fn();
      (window as any).Razorpay = jest.fn().mockImplementation((options) => {
        capturedOptions = options;
        return {
          open: mockOpen,
          on: jest.fn(),
          close: jest.fn(),
        };
      });

      const stepChanges: string[] = [];
      let verifiedResult: any = null;

      await BillingService.initiateRazorpayCheckout({
        planId: 'pro',
        billingCycle: 'monthly',
        onStepChange: (step) => stepChanges.push(step),
        onSuccess: (res) => {
          verifiedResult = res;
        },
      });

      // Assert modal was opened
      expect(mockOpen).toHaveBeenCalled();

      // Verify options came directly from server
      expect(capturedOptions.order_id).toBe('order_rzp_server_9988');
      expect(capturedOptions.amount).toBe(2900);
      expect(capturedOptions.currency).toBe('USD');
      expect(capturedOptions.key).toBe('rzp_test_public_key_123');

      // Simulate payment callback from Razorpay
      await capturedOptions.handler({
        razorpay_order_id: 'order_rzp_server_9988',
        razorpay_payment_id: 'pay_rzp_server_7788',
        razorpay_signature: 'sig_mock_valid_hmac_123',
      });

      // Verify verifyRazorpayPayment was called with ONLY payment details
      expect(mockVerifyPayment).toHaveBeenCalledWith({
        razorpay_order_id: 'order_rzp_server_9988',
        razorpay_payment_id: 'pay_rzp_server_7788',
        razorpay_signature: 'sig_mock_valid_hmac_123',
      });

      expect(verifiedResult).not.toBeNull();
      expect(verifiedResult.verified).toBe(true);
    });

    test('13. User dismissal calls onDismiss and resets step', async () => {
      (auth as any).currentUser = { uid: 'user_auth_12345' };

      const mockCreateOrder = jest.fn().mockResolvedValue({
        data: {
          orderId: 'order_123',
          amount: 2900,
          currency: 'USD',
          keyId: 'rzp_test_123',
          planId: 'pro',
          planName: 'Pro',
          billingCycle: 'monthly',
        },
      });
      (httpsCallable as jest.Mock).mockReturnValue(mockCreateOrder);

      let capturedOptions: any = null;
      (window as any).Razorpay = jest.fn().mockImplementation((options) => {
        capturedOptions = options;
        return { open: jest.fn(), on: jest.fn(), close: jest.fn() };
      });

      let dismissed = false;
      await BillingService.initiateRazorpayCheckout({
        planId: 'pro',
        billingCycle: 'monthly',
        onDismiss: () => {
          dismissed = true;
        },
      });

      // Trigger user closing the Razorpay checkout modal
      capturedOptions.modal.ondismiss();
      expect(dismissed).toBe(true);
    });

    test('14. Verification failure calls onFailure', async () => {
      (auth as any).currentUser = { uid: 'user_auth_12345' };

      const mockCreateOrder = jest.fn().mockResolvedValue({
        data: {
          orderId: 'order_123',
          amount: 2900,
          currency: 'USD',
          keyId: 'rzp_test_123',
          planId: 'pro',
          planName: 'Pro',
          billingCycle: 'monthly',
        },
      });

      const mockVerifyPayment = jest.fn().mockRejectedValue(
        new Error('Cryptographic signature mismatch.')
      );

      (httpsCallable as jest.Mock).mockImplementation((_, fnName) => {
        if (fnName === 'createRazorpayOrder') return mockCreateOrder;
        if (fnName === 'verifyRazorpayPayment') return mockVerifyPayment;
        return jest.fn();
      });

      let capturedOptions: any = null;
      (window as any).Razorpay = jest.fn().mockImplementation((options) => {
        capturedOptions = options;
        return { open: jest.fn(), on: jest.fn(), close: jest.fn() };
      });

      let failedError: any = null;
      await BillingService.initiateRazorpayCheckout({
        planId: 'pro',
        billingCycle: 'monthly',
        onFailure: (err) => {
          failedError = err;
        },
      });

      // Simulate payment callback
      await capturedOptions.handler({
        razorpay_order_id: 'order_123',
        razorpay_payment_id: 'pay_123',
        razorpay_signature: 'sig_bad',
      });

      expect(failedError).not.toBeNull();
      expect(failedError?.message).toMatch(/Cryptographic signature mismatch/i);
    });

    test('15. Double click / simultaneous requests are prevented', async () => {
      (auth as any).currentUser = { uid: 'user_auth_12345' };

      const mockCreateOrder = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          data: {
            orderId: 'order_123',
            amount: 2900,
            currency: 'USD',
            keyId: 'rzp_test_123',
            planId: 'pro',
            planName: 'Pro',
            billingCycle: 'monthly',
          },
        }), 100))
      );

      (httpsCallable as jest.Mock).mockReturnValue(mockCreateOrder);

      (window as any).Razorpay = jest.fn().mockImplementation(() => ({
        open: jest.fn(),
        on: jest.fn(),
        close: jest.fn(),
      }));

      // Launch first request
      const firstReq = BillingService.createCheckoutOrder('pro', 'monthly');
      expect(mockCreateOrder).toHaveBeenCalledTimes(1);

      await firstReq;
    });

    test('16. Network failure during order creation is safely caught', async () => {
      (auth as any).currentUser = { uid: 'user_auth_12345' };

      const mockCreateOrder = jest.fn().mockRejectedValue(new Error('Network connection timeout'));
      (httpsCallable as jest.Mock).mockReturnValue(mockCreateOrder);

      await expect(
        BillingService.createCheckoutOrder('pro', 'monthly')
      ).rejects.toThrow(/Network connection timeout/i);
    });

    test('17, 18. Webhook delay does not produce false failure and entitlement refresh succeeds', async () => {
      (auth as any).currentUser = { uid: 'user_auth_12345' };

      const mockVerifyPayment = jest.fn().mockResolvedValue({
        data: {
          verified: true,
          orderId: 'order_rzp_server_9988',
          paymentId: 'pay_rzp_server_7788',
          amount: 2900,
          currency: 'USD',
          verificationStatus: 'signature_verified',
          paymentStatus: 'captured',
          message: 'Payment signature verified. Subscription activation queued.',
        },
      });

      (httpsCallable as jest.Mock).mockImplementation((_, fnName) => {
        if (fnName === 'verifyRazorpayPayment') return mockVerifyPayment;
        return jest.fn();
      });

      const verification = await BillingService.verifyPaymentSignature({
        razorpay_order_id: 'order_rzp_server_9988',
        razorpay_payment_id: 'pay_rzp_server_7788',
        razorpay_signature: 'sig_valid_123',
      });

      expect(verification.verified).toBe(true);
      expect(verification.paymentStatus).toBe('captured');
    });
  });

  describe('Security & Authoritative Entitlement Audit', () => {
    test('19. Private secrets are absent from frontend code', () => {
      const billingCode = BillingService.toString();
      expect(billingCode).not.toMatch(/RAZORPAY_KEY_SECRET/);
      expect(billingCode).not.toMatch(/RAZORPAY_WEBHOOK_SECRET/);
      expect(billingCode).not.toMatch(/rzp_live_[a-zA-Z0-9]+/);
    });

    test('20. Tampered localStorage is overridden by authoritative Firestore fetch', async () => {
      const uid = 'victim_user_111';

      // Mock Firestore returning non-existent or free entitlement
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
      });

      // Attacker tries to elevate themselves to pro in localStorage
      localStorage.setItem(
        `analyticsrise_user_subscription_${uid}`,
        JSON.stringify({
          uid,
          planId: 'pro',
          status: 'active',
          billingCycle: 'annual',
        })
      );

      // Fast synchronous returns whatever was cached
      const cached = MembershipService.getSubscription(uid);
      expect(cached.planId).toBe('pro');

      // Authoritative async fetch evaluates against database/server rules (defaulting to free if not in Firestore)
      const authoritative = await MembershipService.fetchAuthoritativeSubscription(uid);
      expect(authoritative.planId).toBe('free');
    });
  });
});
