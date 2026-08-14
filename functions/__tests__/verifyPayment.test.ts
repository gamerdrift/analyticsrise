import * as crypto from 'crypto';
import {
  verifySignatureHmacSha256,
  processPaymentVerification,
} from '../src/verifyPayment';

describe('Mission 04: Secure Payment Signature Verification', () => {
  const testSecretKey = 'rzp_test_secret_key_mock_445566';
  const testOrderId = 'order_rzp_mock_123456789';
  const testPaymentId = 'pay_rzp_mock_987654321';
  const validAuthUid = 'user_firebase_auth_9988';

  // Compute authentic test signature for given order & payment
  function computeTestSignature(orderId: string, paymentId: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  }

  const validSignature = computeTestSignature(testOrderId, testPaymentId, testSecretKey);

  // Mock Firestore Database
  let mockOrderData: any;
  let mockOrderGet: jest.Mock;
  let mockOrderUpdate: jest.Mock;
  let mockOrderDoc: jest.Mock;

  let mockPaymentData: any;
  let mockPaymentGet: jest.Mock;
  let mockPaymentSet: jest.Mock;
  let mockPaymentDoc: jest.Mock;

  let mockCollection: jest.Mock;
  let mockDb: any;

  // Mock Razorpay Client
  let mockOrdersFetch: jest.Mock;
  let mockPaymentsFetch: jest.Mock;
  let mockRazorpayClient: any;

  beforeEach(() => {
    mockOrderData = {
      orderId: testOrderId,
      receipt: 'rcpt_user123_1723650000',
      userId: validAuthUid,
      planId: 'pro',
      planName: 'Professional Pro',
      billingCycle: 'monthly',
      amount: 2900,
      displayAmount: 29,
      currency: 'USD',
      provider: 'razorpay',
      providerOrderId: testOrderId,
      status: 'pending',
    };

    mockOrderGet = jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({ ...mockOrderData }),
    });

    mockOrderUpdate = jest.fn().mockResolvedValue({ writeTime: { seconds: 12345 } });

    mockOrderDoc = jest.fn().mockReturnValue({
      get: mockOrderGet,
      update: mockOrderUpdate,
    });

    mockPaymentData = null;
    mockPaymentGet = jest.fn().mockImplementation(() =>
      Promise.resolve({
        exists: mockPaymentData !== null,
        data: () => mockPaymentData,
      })
    );

    mockPaymentSet = jest.fn().mockImplementation((data: any) => {
      mockPaymentData = data;
      return Promise.resolve({ writeTime: { seconds: 12345 } });
    });

    mockPaymentDoc = jest.fn().mockReturnValue({
      get: mockPaymentGet,
      set: mockPaymentSet,
    });

    mockCollection = jest.fn().mockImplementation((colName: string) => {
      if (colName === 'orders') {
        return { doc: mockOrderDoc };
      }
      if (colName === 'payments') {
        return { doc: mockPaymentDoc };
      }
      return { doc: jest.fn() };
    });

    mockDb = {
      collection: mockCollection,
    };

    mockOrdersFetch = jest.fn().mockResolvedValue({
      id: testOrderId,
      entity: 'order',
      amount: 2900,
      amount_paid: 2900,
      amount_due: 0,
      currency: 'USD',
      receipt: 'rcpt_user123_1723650000',
      status: 'paid',
      attempts: 1,
    });

    mockPaymentsFetch = jest.fn().mockResolvedValue({
      id: testPaymentId,
      entity: 'payment',
      amount: 2900,
      currency: 'USD',
      status: 'captured',
      order_id: testOrderId,
      method: 'card',
      captured: true,
    });

    mockRazorpayClient = {
      orders: {
        fetch: mockOrdersFetch,
      },
      payments: {
        fetch: mockPaymentsFetch,
      },
    };
  });

  describe('Cryptographic HMAC-SHA256 Test Vectors & Timing-Safe Comparison', () => {
    test('13 & 22. Correct HMAC-SHA256 signature → PASS', () => {
      const isValid = verifySignatureHmacSha256(testOrderId, testPaymentId, validSignature, testSecretKey);
      expect(isValid).toBe(true);
    });

    test('22. Modified Order ID → FAIL', () => {
      const isValid = verifySignatureHmacSha256('order_TAMPERED', testPaymentId, validSignature, testSecretKey);
      expect(isValid).toBe(false);
    });

    test('22. Modified Payment ID → FAIL', () => {
      const isValid = verifySignatureHmacSha256(testOrderId, 'pay_TAMPERED', validSignature, testSecretKey);
      expect(isValid).toBe(false);
    });

    test('22. Modified Signature → FAIL', () => {
      const fakeSig = 'a'.repeat(64);
      const isValid = verifySignatureHmacSha256(testOrderId, testPaymentId, fakeSig, testSecretKey);
      expect(isValid).toBe(false);
    });

    test('22. Modified Secret → FAIL', () => {
      const isValid = verifySignatureHmacSha256(testOrderId, testPaymentId, validSignature, 'wrong_secret_key');
      expect(isValid).toBe(false);
    });

    test('14. Timing-safe comparison handles unequal signature lengths safely without throw', () => {
      const shortSignature = 'abc123';
      const isValid = verifySignatureHmacSha256(testOrderId, testPaymentId, shortSignature, testSecretKey);
      expect(isValid).toBe(false);
    });

    test('12. Empty inputs return false immediately', () => {
      expect(verifySignatureHmacSha256('', testPaymentId, validSignature, testSecretKey)).toBe(false);
      expect(verifySignatureHmacSha256(testOrderId, '', validSignature, testSecretKey)).toBe(false);
      expect(verifySignatureHmacSha256(testOrderId, testPaymentId, '', testSecretKey)).toBe(false);
      expect(verifySignatureHmacSha256(testOrderId, testPaymentId, validSignature, '')).toBe(false);
    });
  });

  describe('Process Payment Verification Endpoint Logic', () => {
    test('1, 16 & 17. Authenticated valid request with captured payment succeeds and creates payment record', async () => {
      const response = await processPaymentVerification(
        validAuthUid,
        {
          razorpay_order_id: testOrderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: validSignature,
        },
        mockRazorpayClient,
        testSecretKey,
        mockDb
      );

      expect(response).toEqual({
        verified: true,
        orderId: testOrderId,
        paymentId: testPaymentId,
        amount: 2900,
        currency: 'USD',
        verificationStatus: 'signature_verified',
        paymentStatus: 'captured',
        message: 'Payment signature verified successfully.',
      });

      // Verify Firestore payment record was created
      expect(mockCollection).toHaveBeenCalledWith('payments');
      expect(mockPaymentDoc).toHaveBeenCalledWith(testPaymentId);
      expect(mockPaymentSet).toHaveBeenCalledTimes(1);

      const savedPayment = mockPaymentSet.mock.calls[0][0];
      expect(savedPayment.paymentId).toBe(testPaymentId);
      expect(savedPayment.orderId).toBe(testOrderId);
      expect(savedPayment.userId).toBe(validAuthUid);
      expect(savedPayment.verificationStatus).toBe('signature_verified');
      expect(savedPayment.paymentStatus).toBe('captured');
      expect(savedPayment.amount).toBe(2900);
      expect(savedPayment.currency).toBe('USD');

      // Verify internal order was updated with paymentVerificationStatus: 'verified' (status remains 'pending')
      expect(mockOrderUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentVerificationStatus: 'verified',
          latestPaymentId: testPaymentId,
        })
      );
    });

    test('2. Rejects unauthenticated request with unauthenticated error', async () => {
      await expect(
        processPaymentVerification(
          '',
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/User must be authenticated/i);
    });

    test('3. Rejects missing razorpay_order_id', async () => {
      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: '',
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Missing or invalid "razorpay_order_id"/i);
    });

    test('4. Rejects missing razorpay_payment_id', async () => {
      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: '',
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Missing or invalid "razorpay_payment_id"/i);
    });

    test('5. Rejects missing razorpay_signature', async () => {
      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: '',
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Missing or invalid "razorpay_signature"/i);
    });

    test('6. Rejects invalid field types', async () => {
      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: 12345 as any,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Missing or invalid "razorpay_order_id"/i);
    });

    test('7. Rejects if order does not exist in Firestore', async () => {
      mockOrderGet.mockResolvedValueOnce({ exists: false });

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: 'order_non_existent',
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Order not found/i);
    });

    test('7. Rejects if authenticated user does not own the order (permission-denied)', async () => {
      mockOrderData.userId = 'victim_other_user_888';

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/You do not have permission to verify this order/i);
    });

    test('12. Rejects forged/invalid payment signature', async () => {
      const forgedSignature = '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: forgedSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Payment signature verification failed/i);
    });

    test('8. Rejects if Razorpay Orders API returns order ID mismatch', async () => {
      mockOrdersFetch.mockResolvedValueOnce({
        id: 'order_different_999',
        amount: 2900,
        currency: 'USD',
      });

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Gateway order identifier mismatch/i);
    });

    test('9. Rejects if payment belongs to another order', async () => {
      mockPaymentsFetch.mockResolvedValueOnce({
        id: testPaymentId,
        order_id: 'order_DIFFERENT_ORDER_ID',
        amount: 2900,
        currency: 'USD',
        status: 'captured',
      });

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/The payment does not belong to the specified order/i);
    });

    test('10. Rejects if order amount does not match gateway amount', async () => {
      mockOrdersFetch.mockResolvedValueOnce({
        id: testOrderId,
        amount: 100, // Gateway says $1.00 but internal says $29.00
        currency: 'USD',
      });

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Order amount mismatch/i);
    });

    test('11. Rejects if order currency does not match gateway currency', async () => {
      mockOrdersFetch.mockResolvedValueOnce({
        id: testOrderId,
        amount: 2900,
        currency: 'EUR', // Gateway EUR vs internal USD
      });

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Order currency mismatch/i);
    });

    test('15. Valid signature with authorized (un-captured) payment returns verification without error', async () => {
      mockPaymentsFetch.mockResolvedValueOnce({
        id: testPaymentId,
        order_id: testOrderId,
        amount: 2900,
        currency: 'USD',
        status: 'authorized',
        captured: false,
      });

      const response = await processPaymentVerification(
        validAuthUid,
        {
          razorpay_order_id: testOrderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: validSignature,
        },
        mockRazorpayClient,
        testSecretKey,
        mockDb
      );

      expect(response.verified).toBe(true);
      expect(response.paymentStatus).toBe('authorized');
    });

    test('18. Repeated verification of the same payment updates the deterministic payment document and avoids duplicates', async () => {
      // First verification
      await processPaymentVerification(
        validAuthUid,
        {
          razorpay_order_id: testOrderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: validSignature,
        },
        mockRazorpayClient,
        testSecretKey,
        mockDb
      );

      // Second verification of same payment
      await processPaymentVerification(
        validAuthUid,
        {
          razorpay_order_id: testOrderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: validSignature,
        },
        mockRazorpayClient,
        testSecretKey,
        mockDb
      );

      // Both target payments/{testPaymentId} deterministically
      expect(mockPaymentDoc).toHaveBeenCalledWith(testPaymentId);
    });

    test('19. Gracefully handles Razorpay Orders API failure without exposing secrets', async () => {
      mockOrdersFetch.mockRejectedValueOnce(new Error('Gateway timeout'));

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Unable to verify order status with payment gateway/i);
    });

    test('19. Gracefully handles Razorpay Payments API failure without exposing secrets', async () => {
      mockPaymentsFetch.mockRejectedValueOnce(new Error('Connection reset'));

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Unable to retrieve payment details from payment gateway/i);
    });

    test('20. Gracefully handles Firestore write failure', async () => {
      mockPaymentSet.mockRejectedValueOnce(new Error('Firestore connection timeout'));

      await expect(
        processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        )
      ).rejects.toThrow(/Failed to record payment verification state in database/i);
    });

    test('21. Secret values never appear in thrown error messages', async () => {
      mockOrderGet.mockRejectedValueOnce(new Error('Error involving secret ' + testSecretKey));

      try {
        await processPaymentVerification(
          validAuthUid,
          {
            razorpay_order_id: testOrderId,
            razorpay_payment_id: testPaymentId,
            razorpay_signature: validSignature,
          },
          mockRazorpayClient,
          testSecretKey,
          mockDb
        );
        fail('Should have thrown error');
      } catch (err: any) {
        expect(err.message).not.toContain(testSecretKey);
      }
    });
  });
});
