import * as crypto from 'crypto';
import {
  verifyWebhookSignature,
  processWebhookEvent,
  extractRawBody,
  finalizeWebhookEvent,
} from '../src/webhook';

describe('Mission 05 & 05.1: Webhook Ingestion & Idempotency Hardening', () => {
  const testWebhookSecret = 'rzp_test_webhook_secret_mock_778899';
  const testEventId = 'event_rzp_mock_1122334455';
  const testOrderId = 'order_rzp_mock_123456789';
  const testPaymentId = 'pay_rzp_mock_987654321';
  const testUserId = 'user_firebase_auth_9988';

  function computeWebhookSignature(rawBody: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('hex');
  }

  // Sample payloads
  const paymentCapturedPayload = {
    entity: 'event',
    account_id: 'acc_mock_123',
    event: 'payment.captured',
    contains: ['payment'],
    payload: {
      payment: {
        entity: {
          id: testPaymentId,
          entity: 'payment',
          amount: 2900,
          currency: 'USD',
          status: 'captured',
          order_id: testOrderId,
          method: 'card',
          captured: true,
        },
      },
    },
    created_at: 1723650000,
  };

  const paymentFailedPayload = {
    entity: 'event',
    account_id: 'acc_mock_123',
    event: 'payment.failed',
    contains: ['payment'],
    payload: {
      payment: {
        entity: {
          id: testPaymentId,
          entity: 'payment',
          amount: 2900,
          currency: 'USD',
          status: 'failed',
          order_id: testOrderId,
          method: 'card',
          error_code: 'BAD_REQUEST_ERROR',
          error_description: 'Payment was declined by issuing bank',
        },
      },
    },
    created_at: 1723650000,
  };

  const orderPaidPayload = {
    entity: 'event',
    account_id: 'acc_mock_123',
    event: 'order.paid',
    contains: ['order', 'payment'],
    payload: {
      order: {
        entity: {
          id: testOrderId,
          entity: 'order',
          amount: 2900,
          amount_paid: 2900,
          amount_due: 0,
          currency: 'USD',
          status: 'paid',
        },
      },
    },
    created_at: 1723650000,
  };

  // Mock Firestore Database
  let mockEventStore: Map<string, any>;
  let mockOrderStore: Map<string, any>;
  let mockPaymentStore: Map<string, any>;

  let mockDb: any;

  beforeEach(() => {
    mockEventStore = new Map();
    mockOrderStore = new Map();
    mockPaymentStore = new Map();

    // Seed test order
    mockOrderStore.set(testOrderId, {
      orderId: testOrderId,
      receipt: 'rcpt_user123_1723650000',
      userId: testUserId,
      planId: 'pro',
      planName: 'Professional Pro',
      billingCycle: 'monthly',
      amount: 2900,
      displayAmount: 29,
      currency: 'USD',
      provider: 'razorpay',
      providerOrderId: testOrderId,
      status: 'pending',
    });

    const createDocMock = (store: Map<string, any>, id: string) => ({
      _id: id,
      get: jest.fn().mockImplementation(() =>
        Promise.resolve({
          exists: store.has(id),
          data: () => store.get(id),
        })
      ),
      set: jest.fn().mockImplementation((data: any, options?: any) => {
        if (options && options.merge && store.has(id)) {
          store.set(id, { ...store.get(id), ...data });
        } else {
          store.set(id, { ...data });
        }
        return Promise.resolve({ writeTime: { seconds: 12345 } });
      }),
      update: jest.fn().mockImplementation((data: any) => {
        if (store.has(id)) {
          store.set(id, { ...store.get(id), ...data });
        } else {
          store.set(id, { ...data });
        }
        return Promise.resolve({ writeTime: { seconds: 12345 } });
      }),
    });

    let mockSubscriptionStore = new Map<string, any>();
    let mockEntitlementStore = new Map<string, any>();

    mockDb = {
      collection: jest.fn().mockImplementation((colName: string) => {
        if (colName === 'webhookEvents') {
          return {
            doc: jest.fn().mockImplementation((id: string) => createDocMock(mockEventStore, id)),
          };
        }
        if (colName === 'orders') {
          return {
            doc: jest.fn().mockImplementation((id: string) => createDocMock(mockOrderStore, id)),
          };
        }
        if (colName === 'payments') {
          return {
            doc: jest.fn().mockImplementation((id: string) => createDocMock(mockPaymentStore, id)),
          };
        }
        if (colName === 'subscriptions') {
          return {
            doc: jest.fn().mockImplementation((id: string) => createDocMock(mockSubscriptionStore, id)),
          };
        }
        if (colName === 'entitlements') {
          return {
            doc: jest.fn().mockImplementation((id: string) => createDocMock(mockEntitlementStore, id)),
          };
        }
        return { doc: jest.fn() };
      }),
      runTransaction: jest.fn().mockImplementation(async (updateFunction: (transaction: any) => Promise<any>) => {
        const mockTransaction = {
          get: jest.fn().mockImplementation((docRef: any) => {
            const id = docRef?._id || testEventId;
            let exists = false;
            let data: any = null;

            if (mockEventStore.has(id)) {
              exists = true;
              data = mockEventStore.get(id);
            } else if (mockSubscriptionStore.has(id)) {
              exists = true;
              data = mockSubscriptionStore.get(id);
            } else if (mockEntitlementStore.has(id)) {
              exists = true;
              data = mockEntitlementStore.get(id);
            } else if (mockOrderStore.has(id)) {
              exists = true;
              data = mockOrderStore.get(id);
            } else if (mockPaymentStore.has(id)) {
              exists = true;
              data = mockPaymentStore.get(id);
            }

            return Promise.resolve({
              exists,
              data: () => data,
            });
          }),
          set: jest.fn().mockImplementation((docRef: any, data: any) => {
            const id = docRef?._id || testEventId;
            if (id?.startsWith('sub_')) {
              mockSubscriptionStore.set(id, { ...data });
            } else if (id === testUserId) {
              mockEntitlementStore.set(id, { ...data });
            } else if (id?.startsWith('pay_')) {
              mockPaymentStore.set(id, { ...data });
            } else if (id?.startsWith('order_')) {
              mockOrderStore.set(id, { ...data });
            } else {
              mockEventStore.set(id, { ...data });
            }
          }),
          update: jest.fn().mockImplementation((docRef: any, data: any) => {
            const id = docRef?._id || testEventId;
            if (mockEventStore.has(id)) {
              mockEventStore.set(id, { ...mockEventStore.get(id), ...data });
            } else if (mockOrderStore.has(id)) {
              mockOrderStore.set(id, { ...mockOrderStore.get(id), ...data });
            } else if (mockPaymentStore.has(id)) {
              mockPaymentStore.set(id, { ...mockPaymentStore.get(id), ...data });
            } else if (mockSubscriptionStore.has(id)) {
              mockSubscriptionStore.set(id, { ...mockSubscriptionStore.get(id), ...data });
            } else if (mockEntitlementStore.has(id)) {
              mockEntitlementStore.set(id, { ...mockEntitlementStore.get(id), ...data });
            }
          }),
        };
        return updateFunction(mockTransaction);
      }),
    };
  });

  describe('Cryptographic Raw-Body HMAC-SHA256 Test Vectors', () => {
    const rawJson = JSON.stringify(paymentCapturedPayload);
    const validSig = computeWebhookSignature(rawJson, testWebhookSecret);

    test('1. Exact raw body + correct secret → PASS', () => {
      const isValid = verifyWebhookSignature(rawJson, validSig, testWebhookSecret);
      expect(isValid).toBe(true);
    });

    test('2. Modified whitespace invalidates signature → FAIL', () => {
      const rawJsonWithExtraSpaces = JSON.stringify(paymentCapturedPayload, null, 2);
      const isValid = verifyWebhookSignature(rawJsonWithExtraSpaces, validSig, testWebhookSecret);
      expect(isValid).toBe(false);
    });

    test('3. Modified property ordering invalidates signature → FAIL', () => {
      const reorderedPayload = {
        event: paymentCapturedPayload.event,
        entity: paymentCapturedPayload.entity,
        created_at: paymentCapturedPayload.created_at,
        account_id: paymentCapturedPayload.account_id,
        contains: paymentCapturedPayload.contains,
        payload: paymentCapturedPayload.payload,
      };
      const reorderedJson = JSON.stringify(reorderedPayload);
      const isValid = verifyWebhookSignature(reorderedJson, validSig, testWebhookSecret);
      expect(isValid).toBe(false);
    });

    test('4. Modified payload data → FAIL', () => {
      const tamperedPayload = { ...paymentCapturedPayload, event: 'payment.tampered' };
      const isValid = verifyWebhookSignature(JSON.stringify(tamperedPayload), validSig, testWebhookSecret);
      expect(isValid).toBe(false);
    });

    test('5. Modified signature → FAIL', () => {
      const fakeSig = 'f'.repeat(64);
      const isValid = verifyWebhookSignature(rawJson, fakeSig, testWebhookSecret);
      expect(isValid).toBe(false);
    });

    test('6. Modified secret → FAIL', () => {
      const isValid = verifyWebhookSignature(rawJson, validSig, 'wrong_webhook_secret');
      expect(isValid).toBe(false);
    });

    test('7. extractRawBody correctly preserves Buffer and string raw bodies', () => {
      const reqWithBuffer = { rawBody: Buffer.from(rawJson, 'utf8') };
      expect(extractRawBody(reqWithBuffer as any)).toBe(rawJson);

      const reqWithString = { rawBody: rawJson };
      expect(extractRawBody(reqWithString as any)).toBe(rawJson);

      const reqWithBody = { body: rawJson };
      expect(extractRawBody(reqWithBody as any)).toBe(rawJson);

      const reqEmpty = {};
      expect(extractRawBody(reqEmpty as any)).toBeNull();
    });
  });

  describe('HTTP & Signature Ingestion Validation', () => {
    test('8. Rejects non-POST request with 405 Method Not Allowed', async () => {
      const res = await processWebhookEvent(
        {
          method: 'GET',
          headers: {},
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(405);
      expect(res.body.received).toBe(false);
      expect(res.body.error).toMatch(/Method Not Allowed/i);
    });

    test('9. Rejects missing X-Razorpay-Signature with 400 Bad Request', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: { 'x-razorpay-event-id': testEventId },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(400);
      expect(res.body.received).toBe(false);
      expect(res.body.error).toMatch(/Missing X-Razorpay-Signature header/i);
    });

    test('10. Rejects invalid/forged signature with 400 Bad Request', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-event-id': testEventId,
            'x-razorpay-signature': '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff',
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(400);
      expect(res.body.received).toBe(false);
      expect(res.body.error).toMatch(/Invalid webhook signature/i);
    });

    test('11. Rejects missing x-razorpay-event-id with 400 Bad Request', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);
      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(400);
      expect(res.body.received).toBe(false);
      expect(res.body.error).toMatch(/Missing x-razorpay-event-id header/i);
    });

    test('12. Rejects malformed non-JSON raw body with 400 Bad Request', async () => {
      const malformedBody = 'NOT_JSON_DATA{{{';
      const signature = computeWebhookSignature(malformedBody, testWebhookSecret);
      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody: malformedBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(400);
      expect(res.body.received).toBe(false);
      expect(res.body.error).toMatch(/Malformed JSON payload/i);
    });
  });

  describe('Event Processing & Reconciliation', () => {
    test('13. Processes payment.captured event and records payment & order status', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);

      expect(mockEventStore.has(testEventId)).toBe(true);
      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.eventId).toBe(testEventId);
      expect(eventDoc.eventType).toBe('payment.captured');
      expect(eventDoc.processingStatus).toBe('processed');
      expect(eventDoc.processingAttemptId).toBeDefined();

      const paymentDoc = mockPaymentStore.get(testPaymentId);
      expect(paymentDoc.paymentStatus).toBe('captured');
      expect(paymentDoc.captured).toBe(true);

      const orderDoc = mockOrderStore.get(testOrderId);
      expect(orderDoc.paymentStatus).toBe('captured');
      expect(orderDoc.latestPaymentId).toBe(testPaymentId);
    });

    test('14. Processes payment.failed event and records error description', async () => {
      const rawBody = JSON.stringify(paymentFailedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);

      const paymentDoc = mockPaymentStore.get(testPaymentId);
      expect(paymentDoc.paymentStatus).toBe('failed');
      expect(paymentDoc.errorCode).toBe('BAD_REQUEST_ERROR');
      expect(paymentDoc.errorDescription).toBe('Payment was declined by issuing bank');

      const orderDoc = mockOrderStore.get(testOrderId);
      expect(orderDoc.lastPaymentError).toBe('Payment was declined by issuing bank');
    });

    test('15. Processes order.paid event and updates gatewayOrderStatus', async () => {
      const rawBody = JSON.stringify(orderPaidPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);

      const orderDoc = mockOrderStore.get(testOrderId);
      expect(orderDoc.gatewayOrderStatus).toBe('paid');
      expect(orderDoc.amountPaid).toBe(2900);
    });

    test('16. Processes unsupported verified event safely without throwing error', async () => {
      const customPayload = { ...paymentCapturedPayload, event: 'refund.processed' };
      const rawBody = JSON.stringify(customPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
      expect(res.body.unhandled).toBe(true);

      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('ignored_unsupported_event');
    });

    test('17. Unknown internal order records reconciliation_required state', async () => {
      const unknownOrderPayload = {
        ...paymentCapturedPayload,
        payload: {
          payment: {
            entity: {
              ...paymentCapturedPayload.payload.payment.entity,
              order_id: 'order_UNKNOWN_NOT_IN_DB',
            },
          },
        },
      };

      const rawBody = JSON.stringify(unknownOrderPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
      expect(res.body.reconciliation_required).toBe(true);

      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('reconciliation_required');
    });

    test('18. Amount mismatch sets reconciliation_required state', async () => {
      const amountMismatchPayload = {
        ...paymentCapturedPayload,
        payload: {
          payment: {
            entity: {
              ...paymentCapturedPayload.payload.payment.entity,
              amount: 500,
            },
          },
        },
      };

      const rawBody = JSON.stringify(amountMismatchPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.reconciliation_required).toBe(true);

      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('reconciliation_required');
    });

    test('19. Currency mismatch sets reconciliation_required state', async () => {
      const currencyMismatchPayload = {
        ...paymentCapturedPayload,
        payload: {
          payment: {
            entity: {
              ...paymentCapturedPayload.payload.payment.entity,
              currency: 'EUR',
            },
          },
        },
      };

      const rawBody = JSON.stringify(currencyMismatchPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.reconciliation_required).toBe(true);

      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('reconciliation_required');
    });

    test('20. Webhook secrets are never exposed in error responses', async () => {
      mockDb.runTransaction.mockRejectedValueOnce(new Error('Internal fault with secret ' + testWebhookSecret));

      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(500);
      expect(res.body.error).not.toContain(testWebhookSecret);
    });
  });

  describe('Mission 05.1 Idempotency Hardening & Failure-Path Tests', () => {
    test('21. Failed event can be retried and successfully transitions to processed', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      // 1. Seed failed event in database
      const initialAttemptId = 'attempt_token_failed_111';
      mockEventStore.set(testEventId, {
        eventId: testEventId,
        eventType: 'payment.captured',
        provider: 'razorpay',
        processingStatus: 'failed',
        processingAttemptId: initialAttemptId,
        retryCount: 0,
        createdAt: { seconds: 1723650000 },
        updatedAt: { seconds: 1723650000 },
      });

      // 2. Gateway retries the webhook
      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
      expect(res.body.duplicate).toBeUndefined();

      // 3. Verify event was reclaimed and finalized as processed with new attempt ID
      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('processed');
      expect(eventDoc.processingAttemptId).not.toBe(initialAttemptId);
      expect(eventDoc.retryCount).toBe(1);
    });

    test('22. Stale processing (lease expired) can be reclaimed and processed', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      // Seed stale in-flight event (started 10 minutes ago, lease is 60s)
      const staleTimestamp = new Date(Date.now() - 10 * 60 * 1000);
      const staleAttemptId = 'attempt_token_stale_222';
      mockEventStore.set(testEventId, {
        eventId: testEventId,
        eventType: 'payment.captured',
        provider: 'razorpay',
        processingStatus: 'processing',
        processingAttemptId: staleAttemptId,
        processingStartedAt: { toDate: () => staleTimestamp },
        retryCount: 0,
      });

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
      expect(res.body.duplicate).toBeUndefined();

      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('processed');
      expect(eventDoc.processingAttemptId).not.toBe(staleAttemptId);
      expect(eventDoc.retryCount).toBe(1);
    });

    test('23. Active in-flight processing remains protected against concurrent duplicates', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      // Seed active in-flight event (started 5 seconds ago, lease is 60s)
      const activeTimestamp = new Date(Date.now() - 5000);
      const activeAttemptId = 'attempt_token_active_333';
      mockEventStore.set(testEventId, {
        eventId: testEventId,
        eventType: 'payment.captured',
        provider: 'razorpay',
        processingStatus: 'processing',
        processingAttemptId: activeAttemptId,
        processingStartedAt: { toDate: () => activeTimestamp },
        retryCount: 0,
      });

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      // Must be safely ignored as duplicate without modifying database
      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
      expect(res.body.duplicate).toBe(true);

      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('processing');
      expect(eventDoc.processingAttemptId).toBe(activeAttemptId);
      expect(eventDoc.retryCount).toBe(0);
    });

    test('24. Stale worker cannot finalize newer attempt (token A != token B)', async () => {
      const eventDocRef = mockDb.collection('webhookEvents').doc(testEventId);

      // Seed newer worker B as owner
      const workerBAttemptId = 'attempt_worker_B_token';
      mockEventStore.set(testEventId, {
        eventId: testEventId,
        processingStatus: 'processing',
        processingAttemptId: workerBAttemptId,
        retryCount: 1,
      });

      // Stale Worker A tries to finalize with old token A
      const workerAAttemptId = 'attempt_stale_worker_A_token';
      const finalized = await finalizeWebhookEvent(mockDb, eventDocRef as any, workerAAttemptId, {
        processingStatus: 'processed',
        reconciliationNotes: 'Stale attempt write',
      });

      // Must fail
      expect(finalized).toBe(false);

      // Ensure Worker B's state was NOT overwritten
      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('processing');
      expect(eventDoc.processingAttemptId).toBe(workerBAttemptId);
      expect(eventDoc.reconciliationNotes).toBeUndefined();
    });

    test('25. Stale worker cannot mark newer attempt as failed', async () => {
      const eventDocRef = mockDb.collection('webhookEvents').doc(testEventId);

      // Seed newer worker B as active owner
      const workerBAttemptId = 'attempt_worker_B_token';
      mockEventStore.set(testEventId, {
        eventId: testEventId,
        processingStatus: 'processing',
        processingAttemptId: workerBAttemptId,
        retryCount: 1,
      });

      // Stale worker A catches an error and tries to mark failed with old token A
      const workerAAttemptId = 'attempt_stale_worker_A_token';
      const finalized = await finalizeWebhookEvent(mockDb, eventDocRef as any, workerAAttemptId, {
        processingStatus: 'failed',
        error: 'Stale worker timeout error',
      });

      expect(finalized).toBe(false);

      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('processing');
      expect(eventDoc.processingAttemptId).toBe(workerBAttemptId);
      expect(eventDoc.error).toBeUndefined();
    });

    test('26. Terminal status "processed" returns duplicate: true without re-executing', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      mockEventStore.set(testEventId, {
        eventId: testEventId,
        processingStatus: 'processed',
        processingAttemptId: 'token_processed',
        retryCount: 0,
      });

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
      expect(res.body.duplicate).toBe(true);
    });

    test('27. Terminal status "reconciliation_required" returns duplicate: true without re-executing', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      mockEventStore.set(testEventId, {
        eventId: testEventId,
        processingStatus: 'reconciliation_required',
        processingAttemptId: 'token_reconciled',
        retryCount: 0,
      });

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
      expect(res.body.duplicate).toBe(true);
    });

    test('28. Terminal status "ignored_unsupported_event" returns duplicate: true without re-executing', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      mockEventStore.set(testEventId, {
        eventId: testEventId,
        processingStatus: 'ignored_unsupported_event',
        processingAttemptId: 'token_unsupported',
        retryCount: 0,
      });

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
      expect(res.body.duplicate).toBe(true);
    });

    test('29. Multiple successive retries increment retryCount properly', async () => {
      const rawBody = JSON.stringify(paymentCapturedPayload);
      const signature = computeWebhookSignature(rawBody, testWebhookSecret);

      // Seed with retryCount: 2
      mockEventStore.set(testEventId, {
        eventId: testEventId,
        eventType: 'payment.captured',
        provider: 'razorpay',
        processingStatus: 'failed',
        processingAttemptId: 'token_attempt_2',
        retryCount: 2,
      });

      const res = await processWebhookEvent(
        {
          method: 'POST',
          headers: {
            'x-razorpay-signature': signature,
            'x-razorpay-event-id': testEventId,
          },
          rawBody,
        },
        testWebhookSecret,
        mockDb
      );

      expect(res.status).toBe(200);
      const eventDoc = mockEventStore.get(testEventId);
      expect(eventDoc.processingStatus).toBe('processed');
      expect(eventDoc.retryCount).toBe(3);
    });
  });
});
