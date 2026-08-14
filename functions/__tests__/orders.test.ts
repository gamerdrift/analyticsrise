import { resolvePlanPricing } from '../src/pricing';
import { processOrderCreation } from '../src/orders';

describe('Mission 03: Secure Server-Side Order Creation', () => {
  // Mock Firestore Database
  let mockSet: jest.Mock;
  let mockDoc: jest.Mock;
  let mockCollection: jest.Mock;
  let mockDb: any;

  // Mock Razorpay Client
  let mockOrdersCreate: jest.Mock;
  let mockRazorpayClient: any;

  const mockPublicRazorpayKeyId = 'rzp_test_mockKeyId123';
  const validAuthUid = 'user_firebase_auth_9988';

  beforeEach(() => {
    mockSet = jest.fn().mockResolvedValue({ writeTime: { seconds: 12345 } });
    mockDoc = jest.fn().mockReturnValue({ set: mockSet });
    mockCollection = jest.fn().mockReturnValue({ doc: mockDoc });
    mockDb = {
      collection: mockCollection,
    };

    mockOrdersCreate = jest.fn().mockResolvedValue({
      id: 'order_rzp_mock_123456789',
      entity: 'order',
      amount: 2900,
      amount_paid: 0,
      amount_due: 2900,
      currency: 'USD',
      receipt: 'rcpt_user_fir_123456',
      status: 'created',
      attempts: 0,
    });

    mockRazorpayClient = {
      orders: {
        create: mockOrdersCreate,
      },
    };
  });

  describe('Server-Side Authoritative Pricing Catalog', () => {
    test('1 & 6. Resolves correct server-side amounts for all paid plans (Monthly & Annual)', () => {
      // Pro Plan
      const proMonthly = resolvePlanPricing('pro', 'monthly');
      expect(proMonthly.amountInSubunits).toBe(2900); // $29.00 -> 2900 cents
      expect(proMonthly.displayAmount).toBe(29);
      expect(proMonthly.currency).toBe('USD');

      const proAnnual = resolvePlanPricing('pro', 'annual');
      expect(proAnnual.amountInSubunits).toBe(27800); // $278.00 -> 27800 cents
      expect(proAnnual.displayAmount).toBe(278);

      // Student Pro Plan
      const studentMonthly = resolvePlanPricing('student_pro', 'monthly');
      expect(studentMonthly.amountInSubunits).toBe(1200); // $12.00
      const studentAnnual = resolvePlanPricing('student_pro', 'annual');
      expect(studentAnnual.amountInSubunits).toBe(11500); // $115.00

      // Enterprise Plan
      const entMonthly = resolvePlanPricing('enterprise', 'monthly');
      expect(entMonthly.amountInSubunits).toBe(9900); // $99.00
      const entAnnual = resolvePlanPricing('enterprise', 'annual');
      expect(entAnnual.amountInSubunits).toBe(95000); // $950.00

      // Recruiter Plan
      const recMonthly = resolvePlanPricing('recruiter', 'monthly');
      expect(recMonthly.amountInSubunits).toBe(14900); // $149.00
      const recAnnual = resolvePlanPricing('recruiter', 'annual');
      expect(recAnnual.amountInSubunits).toBe(143000); // $1430.00
    });

    test('4. Rejects free or guest tiers as ineligible for payment orders', () => {
      expect(() => resolvePlanPricing('free')).toThrow(/Invalid plan ID.*free/i);
      expect(() => resolvePlanPricing('guest')).toThrow(/Invalid plan ID.*guest/i);
    });

    test('4. Rejects invalid and arbitrary plan IDs', () => {
      expect(() => resolvePlanPricing('vip_diamond')).toThrow(/Invalid plan ID/i);
      expect(() => resolvePlanPricing('')).toThrow(/Plan ID is required/i);
    });

    test('7. Enforces standard currency configuration', () => {
      const plan = resolvePlanPricing('pro');
      expect(plan.currency).toBe('USD');
    });
  });

  describe('Process Order Creation Logic', () => {
    test('1 & 8. Creates a real Razorpay order for authenticated valid plan', async () => {
      const response = await processOrderCreation(
        validAuthUid,
        { planId: 'pro', billingCycle: 'monthly' },
        mockRazorpayClient,
        mockPublicRazorpayKeyId,
        mockDb
      );

      expect(response).toEqual({
        orderId: 'order_rzp_mock_123456789',
        amount: 2900,
        currency: 'USD',
        keyId: mockPublicRazorpayKeyId,
        planId: 'pro',
        planName: 'Professional Pro',
        billingCycle: 'monthly',
      });

      expect(mockOrdersCreate).toHaveBeenCalledTimes(1);
      expect(mockOrdersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 2900,
          currency: 'USD',
          notes: expect.objectContaining({
            userId: validAuthUid,
            planId: 'pro',
            billingCycle: 'monthly',
            platform: 'analyticsrise',
          }),
        })
      );
    });

    test('2. Rejects unauthenticated request with unauthenticated error', async () => {
      await expect(
        processOrderCreation(
          '',
          { planId: 'pro' },
          mockRazorpayClient,
          mockPublicRazorpayKeyId,
          mockDb
        )
      ).rejects.toThrow(/User must be authenticated/i);
    });

    test('3. Rejects request with missing planId', async () => {
      await expect(
        processOrderCreation(
          validAuthUid,
          { planId: '' },
          mockRazorpayClient,
          mockPublicRazorpayKeyId,
          mockDb
        )
      ).rejects.toThrow(/Missing or invalid "planId"/i);
    });

    test('4. Rejects request with invalid planId', async () => {
      await expect(
        processOrderCreation(
          validAuthUid,
          { planId: 'non_existent_tier' },
          mockRazorpayClient,
          mockPublicRazorpayKeyId,
          mockDb
        )
      ).rejects.toThrow(/Invalid plan ID/i);
    });

    test('5. Arbitrary client amount or parameters in body are ignored', async () => {
      const hackedPayload: any = {
        planId: 'pro',
        amount: 1, // User trying to pay $0.01 instead of $29.00
        currency: 'JPY',
        price: 0,
      };

      const response = await processOrderCreation(
        validAuthUid,
        hackedPayload,
        mockRazorpayClient,
        mockPublicRazorpayKeyId,
        mockDb
      );

      // Server overrides with authoritative price
      expect(response.amount).toBe(2900);
      expect(response.currency).toBe('USD');
      expect(mockOrdersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 2900,
          currency: 'USD',
        })
      );
    });

    test('9 & 12. Creates pending Firestore order record bound strictly to auth UID', async () => {
      await processOrderCreation(
        validAuthUid,
        { planId: 'pro', billingCycle: 'annual' },
        mockRazorpayClient,
        mockPublicRazorpayKeyId,
        mockDb
      );

      expect(mockCollection).toHaveBeenCalledWith('orders');
      expect(mockDoc).toHaveBeenCalledWith('order_rzp_mock_123456789');
      expect(mockSet).toHaveBeenCalledTimes(1);

      const savedData = mockSet.mock.calls[0][0];
      expect(savedData.orderId).toBe('order_rzp_mock_123456789');
      expect(savedData.userId).toBe(validAuthUid);
      expect(savedData.planId).toBe('pro');
      expect(savedData.billingCycle).toBe('annual');
      expect(savedData.amount).toBe(27800);
      expect(savedData.displayAmount).toBe(278);
      expect(savedData.currency).toBe('USD');
      expect(savedData.provider).toBe('razorpay');
      expect(savedData.providerOrderId).toBe('order_rzp_mock_123456789');
      expect(savedData.status).toBe('pending'); // NEVER 'paid'
    });

    test('10. Gracefully handles Razorpay API failure without exposing secrets', async () => {
      mockOrdersCreate.mockRejectedValueOnce(new Error('Gateway timeout (504)'));

      await expect(
        processOrderCreation(
          validAuthUid,
          { planId: 'pro' },
          mockRazorpayClient,
          mockPublicRazorpayKeyId,
          mockDb
        )
      ).rejects.toThrow(/Unable to initiate payment order with gateway/i);
    });

    test('11. Gracefully handles Firestore database write failure', async () => {
      mockSet.mockRejectedValueOnce(new Error('Firestore unavailable'));

      await expect(
        processOrderCreation(
          validAuthUid,
          { planId: 'pro' },
          mockRazorpayClient,
          mockPublicRazorpayKeyId,
          mockDb
        )
      ).rejects.toThrow(/Failed to record pending order state in database/i);
    });

    test('12. User ID is guaranteed from authenticated context and cannot be spoofed', async () => {
      const spoofedPayload: any = {
        planId: 'pro',
        userId: 'victim_user_123', // Attacker trying to charge another user
      };

      await processOrderCreation(
        validAuthUid,
        spoofedPayload,
        mockRazorpayClient,
        mockPublicRazorpayKeyId,
        mockDb
      );

      const savedData = mockSet.mock.calls[0][0];
      // Bound strictly to caller's verified auth UID
      expect(savedData.userId).toBe(validAuthUid);
      expect(savedData.userId).not.toBe('victim_user_123');
    });
  });
});
