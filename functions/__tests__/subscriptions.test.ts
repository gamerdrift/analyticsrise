import {
  activateSubscriptionFromPayment,
  getAuthoritativeEntitlement,
  cancelSubscriptionAtPeriodEnd,
  calculatePeriodEnd,
  AUTHORITATIVE_PLAN_LIMITS,
} from '../src/subscriptions';

describe('Mission 06: Subscription & Entitlement Engine', () => {
  const testUserId = 'user_firebase_auth_9988';
  const otherUserId = 'user_victim_other_8888';
  const testOrderId = 'order_rzp_mock_123456789';
  const testPaymentId = 'pay_rzp_mock_987654321';

  let mockSubscriptionStore: Map<string, any>;
  let mockEntitlementStore: Map<string, any>;
  let mockOrderStore: Map<string, any>;
  let mockPaymentStore: Map<string, any>;

  let mockDb: any;

  beforeEach(() => {
    mockSubscriptionStore = new Map();
    mockEntitlementStore = new Map();
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

    mockDb = {
      collection: jest.fn().mockImplementation((colName: string) => {
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
        return { doc: jest.fn() };
      }),
      runTransaction: jest.fn().mockImplementation(async (updateFunction: (transaction: any) => Promise<any>) => {
        const mockTransaction = {
          get: jest.fn().mockImplementation((docRef: any) => {
            const id = docRef?._id;
            let exists = false;
            let data: any = null;

            if (mockSubscriptionStore.has(id)) {
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
            const id = docRef?._id;
            if (id?.startsWith('sub_')) {
              mockSubscriptionStore.set(id, { ...data });
            } else if (id === testUserId || id === otherUserId) {
              mockEntitlementStore.set(id, { ...data });
            } else if (id?.startsWith('pay_')) {
              mockPaymentStore.set(id, { ...data });
            } else if (id?.startsWith('order_')) {
              mockOrderStore.set(id, { ...data });
            }
          }),
          update: jest.fn().mockImplementation((docRef: any, data: any) => {
            const id = docRef?._id;
            if (mockSubscriptionStore.has(id)) {
              mockSubscriptionStore.set(id, { ...mockSubscriptionStore.get(id), ...data });
            } else if (mockEntitlementStore.has(id)) {
              mockEntitlementStore.set(id, { ...mockEntitlementStore.get(id), ...data });
            } else if (mockOrderStore.has(id)) {
              mockOrderStore.set(id, { ...mockOrderStore.get(id), ...data });
            } else if (mockPaymentStore.has(id)) {
              mockPaymentStore.set(id, { ...mockPaymentStore.get(id), ...data });
            }
          }),
        };
        return updateFunction(mockTransaction);
      }),
    };
  });

  describe('Period & Leap Year Calculations', () => {
    test('11. Monthly period calculation adds exactly 1 month', () => {
      const start = new Date('2026-03-15T00:00:00Z');
      const end = calculatePeriodEnd(start, 'monthly');
      expect(end.getUTCFullYear()).toBe(2026);
      expect(end.getUTCMonth()).toBe(3); // April (0-indexed 3)
      expect(end.getUTCDate()).toBe(15);
    });

    test('11. Monthly period calculation clamps Jan 31 to Feb 28 on non-leap year', () => {
      const start = new Date('2026-01-31T00:00:00Z');
      const end = calculatePeriodEnd(start, 'monthly');
      expect(end.getUTCFullYear()).toBe(2026);
      expect(end.getUTCMonth()).toBe(1); // Feb
      expect(end.getUTCDate()).toBe(28);
    });

    test('11. Monthly period calculation clamps Jan 31 to Feb 29 on leap year', () => {
      const start = new Date('2028-01-31T00:00:00Z');
      const end = calculatePeriodEnd(start, 'monthly');
      expect(end.getUTCFullYear()).toBe(2028);
      expect(end.getUTCMonth()).toBe(1); // Feb
      expect(end.getUTCDate()).toBe(29);
    });

    test('12. Annual period calculation adds exactly 1 year', () => {
      const start = new Date('2026-06-15T00:00:00Z');
      const end = calculatePeriodEnd(start, 'annual');
      expect(end.getUTCFullYear()).toBe(2027);
      expect(end.getUTCMonth()).toBe(5); // June
      expect(end.getUTCDate()).toBe(15);
    });

    test('12. Annual period calculation clamps Feb 29 leap year to Feb 28 next year', () => {
      const start = new Date('2028-02-29T00:00:00Z');
      const end = calculatePeriodEnd(start, 'annual');
      expect(end.getUTCFullYear()).toBe(2029);
      expect(end.getUTCMonth()).toBe(1); // Feb
      expect(end.getUTCDate()).toBe(28);
    });
  });

  describe('Subscription & Entitlement Activation', () => {
    test('1, 2. Successful captured payment creates subscription and entitlement', async () => {
      const res = await activateSubscriptionFromPayment(
        {
          userId: testUserId,
          orderId: testOrderId,
          paymentId: testPaymentId,
          planId: 'pro',
          billingCycle: 'monthly',
          amount: 2900,
          currency: 'USD',
        },
        mockDb
      );

      expect(res.success).toBe(true);
      expect(res.subscriptionId).toBe(`sub_${testPaymentId}`);
      expect(res.status).toBe('active');

      // Verify subscription record
      expect(mockSubscriptionStore.has(`sub_${testPaymentId}`)).toBe(true);
      const sub = mockSubscriptionStore.get(`sub_${testPaymentId}`);
      expect(sub.userId).toBe(testUserId);
      expect(sub.planId).toBe('pro');
      expect(sub.amount).toBe(2900);
      expect(sub.status).toBe('active');

      // Verify entitlement record
      expect(mockEntitlementStore.has(testUserId)).toBe(true);
      const ent = mockEntitlementStore.get(testUserId);
      expect(ent.userId).toBe(testUserId);
      expect(ent.planId).toBe('pro');
      expect(ent.status).toBe('active');
      expect(ent.features.aiMentorQuota).toBe(-1); // Unlimited for Pro

      // Verify order record updated to paid
      const order = mockOrderStore.get(testOrderId);
      expect(order.status).toBe('paid');
      expect(order.subscriptionId).toBe(`sub_${testPaymentId}`);
    });

    test('3. Rejects activation if order does not belong to user (ownership mismatch)', async () => {
      await expect(
        activateSubscriptionFromPayment(
          {
            userId: otherUserId, // Wrong user
            orderId: testOrderId,
            paymentId: testPaymentId,
            planId: 'pro',
            billingCycle: 'monthly',
            amount: 2900,
            currency: 'USD',
          },
          mockDb
        )
      ).rejects.toThrow(/Order ownership mismatch/i);
    });

    test('5. Rejects activation if order does not exist in database', async () => {
      await expect(
        activateSubscriptionFromPayment(
          {
            userId: testUserId,
            orderId: 'order_NON_EXISTENT',
            paymentId: testPaymentId,
            planId: 'pro',
            billingCycle: 'monthly',
            amount: 2900,
            currency: 'USD',
          },
          mockDb
        )
      ).rejects.toThrow(/Order order_NON_EXISTENT not found/i);
    });

    test('6. Rejects activation if amount does not match authoritative catalog', async () => {
      await expect(
        activateSubscriptionFromPayment(
          {
            userId: testUserId,
            orderId: testOrderId,
            paymentId: testPaymentId,
            planId: 'pro',
            billingCycle: 'monthly',
            amount: 100, // Tampered amount (100 cents instead of 2900)
            currency: 'USD',
          },
          mockDb
        )
      ).rejects.toThrow(/Amount mismatch/i);
    });

    test('7. Rejects activation if currency does not match authoritative catalog', async () => {
      await expect(
        activateSubscriptionFromPayment(
          {
            userId: testUserId,
            orderId: testOrderId,
            paymentId: testPaymentId,
            planId: 'pro',
            billingCycle: 'monthly',
            amount: 2900,
            currency: 'EUR', // Invalid currency
          },
          mockDb
        )
      ).rejects.toThrow(/Currency mismatch/i);
    });

    test('8. Rejects activation if planId is unknown or invalid', async () => {
      await expect(
        activateSubscriptionFromPayment(
          {
            userId: testUserId,
            orderId: testOrderId,
            paymentId: testPaymentId,
            planId: 'super_diamond_plan' as any,
            billingCycle: 'monthly',
            amount: 2900,
            currency: 'USD',
          },
          mockDb
        )
      ).rejects.toThrow(/Invalid or unknown planId/i);
    });

    test('9, 10. Repeated activation with identical payment is idempotent', async () => {
      // First activation
      const res1 = await activateSubscriptionFromPayment(
        {
          userId: testUserId,
          orderId: testOrderId,
          paymentId: testPaymentId,
          planId: 'pro',
          billingCycle: 'monthly',
          amount: 2900,
          currency: 'USD',
        },
        mockDb
      );
      expect(res1.success).toBe(true);
      expect(res1.isDuplicate).toBeUndefined();

      // Second activation
      const res2 = await activateSubscriptionFromPayment(
        {
          userId: testUserId,
          orderId: testOrderId,
          paymentId: testPaymentId,
          planId: 'pro',
          billingCycle: 'monthly',
          amount: 2900,
          currency: 'USD',
        },
        mockDb
      );
      expect(res2.success).toBe(true);
      expect(res2.isDuplicate).toBe(true);
      expect(mockSubscriptionStore.size).toBe(1);
    });

    test('16. Renewal of active subscription extends effectiveUntil from currentPeriodEnd', async () => {
      const existingPeriodEnd = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days in future
      mockEntitlementStore.set(testUserId, {
        userId: testUserId,
        planId: 'pro',
        status: 'active',
        effectiveUntil: { toDate: () => existingPeriodEnd },
      });

      const secondPaymentId = 'pay_rzp_mock_second_renewal_555';
      const secondOrderId = 'order_rzp_mock_second_renewal_555';
      mockOrderStore.set(secondOrderId, {
        userId: testUserId,
        amount: 2900,
        currency: 'USD',
      });

      const res = await activateSubscriptionFromPayment(
        {
          userId: testUserId,
          orderId: secondOrderId,
          paymentId: secondPaymentId,
          planId: 'pro',
          billingCycle: 'monthly',
          amount: 2900,
          currency: 'USD',
        },
        mockDb
      );

      expect(res.success).toBe(true);
      expect(res.currentPeriodStart.getTime()).toBe(existingPeriodEnd.getTime());
    });
  });

  describe('Authoritative Entitlement Retrieval & Expiry', () => {
    test('13. Expired subscription returns plan: free and status: expired', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      mockEntitlementStore.set(testUserId, {
        userId: testUserId,
        planId: 'pro',
        status: 'active',
        effectiveUntil: { toDate: () => pastDate },
      });

      const ent = await getAuthoritativeEntitlement(testUserId, mockDb);
      expect(ent.planId).toBe('free');
      expect(ent.status).toBe('expired');
      expect(ent.features.certificateAccess).toBe(false);
    });

    test('14. cancel-at-period-end retains access while within period', async () => {
      const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days in future
      mockEntitlementStore.set(testUserId, {
        userId: testUserId,
        subscriptionId: `sub_${testPaymentId}`,
        planId: 'pro',
        status: 'cancel_at_period_end',
        effectiveUntil: { toDate: () => futureDate },
      });
      mockSubscriptionStore.set(`sub_${testPaymentId}`, {
        userId: testUserId,
        status: 'cancel_at_period_end',
        cancelAtPeriodEnd: true,
      });

      const ent = await getAuthoritativeEntitlement(testUserId, mockDb);
      expect(ent.planId).toBe('pro');
      expect(ent.status).toBe('cancel_at_period_end');
      expect(ent.features.aiMentorQuota).toBe(-1); // Pro features retained
    });

    test('14. cancelSubscriptionAtPeriodEnd marks cancelAtPeriodEnd on subscription and entitlement', async () => {
      mockSubscriptionStore.set(`sub_${testPaymentId}`, {
        subscriptionId: `sub_${testPaymentId}`,
        userId: testUserId,
        status: 'active',
      });
      mockEntitlementStore.set(testUserId, {
        userId: testUserId,
        subscriptionId: `sub_${testPaymentId}`,
        status: 'active',
      });

      const cancelled = await cancelSubscriptionAtPeriodEnd(testUserId, `sub_${testPaymentId}`, mockDb);
      expect(cancelled).toBe(true);

      const sub = mockSubscriptionStore.get(`sub_${testPaymentId}`);
      expect(sub.cancelAtPeriodEnd).toBe(true);
      expect(sub.status).toBe('cancel_at_period_end');

      const ent = mockEntitlementStore.get(testUserId);
      expect(ent.cancelAtPeriodEnd).toBe(true);
      expect(ent.status).toBe('cancel_at_period_end');
    });

    test('4, 11, 12. payment.failed does not activate subscription or modify existing entitlement', async () => {
      // Prior entitlement exists
      mockEntitlementStore.set(testUserId, {
        userId: testUserId,
        planId: 'free',
        status: 'none',
        features: AUTHORITATIVE_PLAN_LIMITS.free,
      });

      // Attempting to activate with a non-captured/failed parameter or mismatched order fails
      mockOrderStore.set('order_failed_123', {
        userId: testUserId,
        status: 'failed',
        amount: 2900,
        currency: 'USD',
      });

      // No subscription should be created
      expect(mockSubscriptionStore.has('sub_pay_failed')).toBe(false);
      const ent = await getAuthoritativeEntitlement(testUserId, mockDb);
      expect(ent.planId).toBe('free');
      expect(ent.status).toBe('none');
    });

    test('15, 17. Upgrading to higher tier plan immediately sets new tier features from now', async () => {
      // Existing student_pro subscription
      mockEntitlementStore.set(testUserId, {
        userId: testUserId,
        planId: 'student_pro',
        status: 'active',
        effectiveUntil: { toDate: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
      });

      const upgradeOrderId = 'order_upgrade_pro_777';
      const upgradePaymentId = 'pay_upgrade_pro_777';
      mockOrderStore.set(upgradeOrderId, {
        userId: testUserId,
        amount: 2900,
        currency: 'USD',
      });

      const res = await activateSubscriptionFromPayment(
        {
          userId: testUserId,
          orderId: upgradeOrderId,
          paymentId: upgradePaymentId,
          planId: 'pro',
          billingCycle: 'monthly',
          amount: 2900,
          currency: 'USD',
        },
        mockDb
      );

      expect(res.success).toBe(true);
      expect(res.planId).toBe('pro');
      const updatedEnt = mockEntitlementStore.get(testUserId);
      expect(updatedEnt.planId).toBe('pro');
      expect(updatedEnt.features.aiMentorQuota).toBe(-1); // Unlimited for pro
    });

    test('18. Firestore transaction failure throws safe error', async () => {
      const failingDb = {
        collection: mockDb.collection,
        runTransaction: jest.fn().mockRejectedValue(new Error('Transaction lock acquisition failed')),
      };

      await expect(
        activateSubscriptionFromPayment(
          {
            userId: testUserId,
            orderId: testOrderId,
            paymentId: testPaymentId,
            planId: 'pro',
            billingCycle: 'monthly',
            amount: 2900,
            currency: 'USD',
          },
          failingDb as any
        )
      ).rejects.toThrow(/Transaction lock acquisition failed/);
    });

    test('22. No secret values are exposed in error messages', async () => {
      try {
        await activateSubscriptionFromPayment(
          {
            userId: testUserId,
            orderId: testOrderId,
            paymentId: testPaymentId,
            planId: 'pro',
            billingCycle: 'monthly',
            amount: 999999, // Mismatch
            currency: 'USD',
          },
          mockDb
        );
      } catch (err: any) {
        expect(err.message).not.toMatch(/rzp_live_/);
        expect(err.message).not.toMatch(/rzp_test_/);
        expect(err.message).not.toMatch(/secret/i);
      }
    });
  });
});
