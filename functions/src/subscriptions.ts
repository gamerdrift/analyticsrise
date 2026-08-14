import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from './index';
import { AUTHORITATIVE_PLANS, PaidPlanTier, BillingCycle } from './pricing';

export interface PlanLimits {
  aiMentorQuota: number;
  simulatorHours: number;
  certificateAccess: boolean;
  resumeBuilderQuota: number;
  interviewCoachQuota: number;
  jobAppQuota: number;
  portfolioExportAllowed: boolean;
  storageMb: number;
  customDomainAllowed: boolean;
}

export const AUTHORITATIVE_PLAN_LIMITS: Record<PaidPlanTier | 'free' | 'guest', PlanLimits> = {
  guest: {
    aiMentorQuota: 3,
    simulatorHours: 1,
    certificateAccess: false,
    resumeBuilderQuota: 0,
    interviewCoachQuota: 0,
    jobAppQuota: 0,
    portfolioExportAllowed: false,
    storageMb: 10,
    customDomainAllowed: false,
  },
  free: {
    aiMentorQuota: 15,
    simulatorHours: 5,
    certificateAccess: false,
    resumeBuilderQuota: 1,
    interviewCoachQuota: 1,
    jobAppQuota: 3,
    portfolioExportAllowed: false,
    storageMb: 50,
    customDomainAllowed: false,
  },
  student_pro: {
    aiMentorQuota: 200,
    simulatorHours: 50,
    certificateAccess: true,
    resumeBuilderQuota: 10,
    interviewCoachQuota: 10,
    jobAppQuota: 25,
    portfolioExportAllowed: true,
    storageMb: 500,
    customDomainAllowed: false,
  },
  pro: {
    aiMentorQuota: -1, // Unlimited
    simulatorHours: -1, // Unlimited
    certificateAccess: true,
    resumeBuilderQuota: -1,
    interviewCoachQuota: 50,
    jobAppQuota: -1,
    portfolioExportAllowed: true,
    storageMb: 2048,
    customDomainAllowed: true,
  },
  enterprise: {
    aiMentorQuota: -1,
    simulatorHours: -1,
    certificateAccess: true,
    resumeBuilderQuota: -1,
    interviewCoachQuota: -1,
    jobAppQuota: -1,
    portfolioExportAllowed: true,
    storageMb: 10240,
    customDomainAllowed: true,
  },
  recruiter: {
    aiMentorQuota: 100,
    simulatorHours: 10,
    certificateAccess: true,
    resumeBuilderQuota: 50,
    interviewCoachQuota: 50,
    jobAppQuota: -1,
    portfolioExportAllowed: true,
    storageMb: 5120,
    customDomainAllowed: true,
  },
};

export interface SubscriptionRecord {
  subscriptionId: string;
  userId: string;
  planId: PaidPlanTier;
  planName: string;
  billingCycle: BillingCycle;
  provider: 'razorpay';
  providerOrderId: string;
  providerPaymentId: string;
  status: 'active' | 'cancel_at_period_end' | 'canceled' | 'expired';
  currency: string;
  amount: number;
  startedAt: Timestamp;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface EntitlementRecord {
  userId: string;
  subscriptionId: string;
  planId: PaidPlanTier | 'free';
  planName: string;
  billingCycle?: BillingCycle;
  status: 'active' | 'cancel_at_period_end' | 'expired' | 'none';
  effectiveFrom: Timestamp;
  effectiveUntil: Timestamp;
  features: PlanLimits;
  cancelAtPeriodEnd: boolean;
  updatedAt: FieldValue;
}

export interface ActivationParams {
  userId: string;
  orderId: string;
  paymentId: string;
  planId: PaidPlanTier;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  provider?: 'razorpay';
}

export interface ActivationResult {
  success: boolean;
  subscriptionId: string;
  userId: string;
  planId: PaidPlanTier;
  billingCycle: BillingCycle;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  status: 'active';
  isDuplicate?: boolean;
}

/**
 * Calculates accurate period end date given a start date and billing cycle.
 * Accurately handles month boundaries (e.g. Jan 31 -> Feb 28/29) and leap years.
 */
export function calculatePeriodEnd(startDate: Date, billingCycle: BillingCycle): Date {
  const result = new Date(startDate.getTime());
  const startDay = startDate.getUTCDate();

  if (billingCycle === 'annual') {
    const targetYear = result.getUTCFullYear() + 1;
    result.setUTCFullYear(targetYear);
    // Handle Feb 29 on leap year rolling to March 1 on standard years
    if (result.getUTCDate() !== startDay) {
      result.setUTCDate(0); // Clamps to Feb 28
    }
  } else {
    // Monthly calculation
    const currentMonth = result.getUTCMonth();
    result.setUTCMonth(currentMonth + 1);
    // If day changed because target month has fewer days (e.g., Jan 31 -> March)
    if (result.getUTCDate() !== startDay) {
      result.setUTCDate(0); // Clamps to last valid day of target month (e.g., Feb 28/29)
    }
  }

  return result;
}

/**
 * Atomically activates subscription and feature entitlement in Firestore upon verified payment.
 */
export async function activateSubscriptionFromPayment(
  params: ActivationParams,
  firestoreDb?: FirebaseFirestore.Firestore
): Promise<ActivationResult> {
  const database = firestoreDb || db;
  const {
    userId,
    orderId,
    paymentId,
    planId,
    billingCycle,
    amount,
    currency,
  } = params;

  if (!userId || !orderId || !paymentId || !planId || !billingCycle) {
    throw new Error('Missing required activation parameters');
  }

  // Validate authoritative plan
  const planInfo = AUTHORITATIVE_PLANS[planId];
  if (!planInfo) {
    throw new Error(`Invalid or unknown planId: ${planId}`);
  }

  // Authoritative amount check (USD prices stored in dollars, amounts in cents)
  const expectedAmount = billingCycle === 'annual'
    ? Math.round(planInfo.annualPriceUsd * 100)
    : Math.round(planInfo.monthlyPriceUsd * 100);

  if (amount !== expectedAmount) {
    throw new Error(`Amount mismatch: expected ${expectedAmount}, received ${amount}`);
  }

  if (currency.toUpperCase() !== planInfo.currency) {
    throw new Error(`Currency mismatch: expected ${planInfo.currency}, received ${currency}`);
  }

  // Deterministic subscription document ID
  const subscriptionId = `sub_${paymentId}`;
  const subscriptionDocRef = database.collection('subscriptions').doc(subscriptionId);
  const entitlementDocRef = database.collection('entitlements').doc(userId);
  const orderDocRef = database.collection('orders').doc(orderId);
  const paymentDocRef = database.collection('payments').doc(paymentId);

  return await database.runTransaction(async (transaction) => {
    // 1. Verify internal order ownership and integrity
    const orderSnap = await transaction.get(orderDocRef);
    if (!orderSnap.exists) {
      throw new Error(`Order ${orderId} not found in database`);
    }
    const orderData = orderSnap.data();
    if (orderData?.userId !== userId) {
      throw new Error(`Order ownership mismatch: order belongs to ${orderData?.userId}, not ${userId}`);
    }
    if (orderData?.amount !== amount || orderData?.currency !== currency) {
      throw new Error('Order amount or currency does not match payment parameters');
    }

    // 2. Check if this subscription already exists (idempotency)
    const subSnap = await transaction.get(subscriptionDocRef);
    if (subSnap.exists) {
      const existingSub = subSnap.data();
      const start = existingSub?.currentPeriodStart?.toDate?.() || new Date();
      const end = existingSub?.currentPeriodEnd?.toDate?.() || new Date();
      return {
        success: true,
        subscriptionId,
        userId,
        planId: existingSub?.planId || planId,
        billingCycle: existingSub?.billingCycle || billingCycle,
        currentPeriodStart: start,
        currentPeriodEnd: end,
        status: existingSub?.status || 'active',
        isDuplicate: true,
      };
    }

    // 3. Read current user entitlement to handle renewals / extensions
    const entSnap = await transaction.get(entitlementDocRef);
    let startDate = new Date();
    const now = new Date();

    if (entSnap.exists) {
      const currentEnt = entSnap.data();
      const currentUntil = currentEnt?.effectiveUntil?.toDate?.() ||
        (currentEnt?.effectiveUntil?.toMillis ? new Date(currentEnt.effectiveUntil.toMillis()) : null);

      // If user has an active subscription of the same tier with time remaining, extend from current period end
      if (
        currentEnt?.status === 'active' &&
        currentEnt?.planId === planId &&
        currentUntil &&
        currentUntil.getTime() > now.getTime()
      ) {
        startDate = currentUntil;
      }
    }

    const endDate = calculatePeriodEnd(startDate, billingCycle);
    const planLimits = AUTHORITATIVE_PLAN_LIMITS[planId];

    // 4. Write Subscription Document
    transaction.set(subscriptionDocRef, {
      subscriptionId,
      userId,
      planId,
      planName: planInfo.name,
      billingCycle,
      provider: 'razorpay',
      providerOrderId: orderId,
      providerPaymentId: paymentId,
      status: 'active',
      currency,
      amount,
      startedAt: Timestamp.fromDate(now),
      currentPeriodStart: Timestamp.fromDate(startDate),
      currentPeriodEnd: Timestamp.fromDate(endDate),
      cancelAtPeriodEnd: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 5. Write Entitlement Document
    transaction.set(entitlementDocRef, {
      userId,
      subscriptionId,
      planId,
      planName: planInfo.name,
      billingCycle,
      status: 'active',
      effectiveFrom: Timestamp.fromDate(startDate),
      effectiveUntil: Timestamp.fromDate(endDate),
      features: planLimits,
      cancelAtPeriodEnd: false,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 6. Update Order Document
    transaction.update(orderDocRef, {
      status: 'paid',
      subscriptionId,
      paymentStatus: 'captured',
      latestPaymentId: paymentId,
      activatedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 7. Update Payment Document
    transaction.set(
      paymentDocRef,
      {
        paymentId,
        orderId,
        userId,
        provider: 'razorpay',
        amount,
        currency,
        planId,
        billingCycle,
        paymentStatus: 'captured',
        captured: true,
        subscriptionActivated: true,
        subscriptionId,
        activatedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return {
      success: true,
      subscriptionId,
      userId,
      planId,
      billingCycle,
      currentPeriodStart: startDate,
      currentPeriodEnd: endDate,
      status: 'active',
    };
  });
}

/**
 * Retrieves and validates the authoritative entitlement state for a user.
 * Automatically evaluates expiration against server time.
 */
export async function getAuthoritativeEntitlement(
  userId: string,
  firestoreDb?: FirebaseFirestore.Firestore
): Promise<{
  userId: string;
  planId: PaidPlanTier | 'free';
  status: 'active' | 'expired' | 'canceled' | 'none';
  features: PlanLimits;
  effectiveUntil: Date | null;
}> {
  const database = firestoreDb || db;
  const entDocRef = database.collection('entitlements').doc(userId);
  const snap = await entDocRef.get();

  if (!snap.exists) {
    return {
      userId,
      planId: 'free',
      status: 'none',
      features: AUTHORITATIVE_PLAN_LIMITS.free,
      effectiveUntil: null,
    };
  }

  const data = snap.data();
  const effectiveUntil = data?.effectiveUntil?.toDate?.() ||
    (data?.effectiveUntil?.toMillis ? new Date(data.effectiveUntil.toMillis()) : null);

  const now = new Date();
  const isExpired = effectiveUntil ? effectiveUntil.getTime() <= now.getTime() : false;

  if (isExpired || data?.status === 'expired') {
    return {
      userId,
      planId: 'free',
      status: 'expired',
      features: AUTHORITATIVE_PLAN_LIMITS.free,
      effectiveUntil,
    };
  }

  return {
    userId,
    planId: data?.planId || 'free',
    status: data?.status || 'active',
    features: data?.features || AUTHORITATIVE_PLAN_LIMITS[data?.planId as PaidPlanTier] || AUTHORITATIVE_PLAN_LIMITS.free,
    effectiveUntil,
  };
}

/**
 * Sets subscription and entitlement to cancel at period end without revoking active access immediately.
 */
export async function cancelSubscriptionAtPeriodEnd(
  userId: string,
  subscriptionId: string,
  firestoreDb?: FirebaseFirestore.Firestore
): Promise<boolean> {
  const database = firestoreDb || db;
  const subDocRef = database.collection('subscriptions').doc(subscriptionId);
  const entDocRef = database.collection('entitlements').doc(userId);

  return await database.runTransaction(async (transaction) => {
    const subSnap = await transaction.get(subDocRef);
    if (!subSnap.exists) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const subData = subSnap.data();
    if (subData?.userId !== userId) {
      throw new Error('User does not own this subscription');
    }

    transaction.update(subDocRef, {
      cancelAtPeriodEnd: true,
      status: 'cancel_at_period_end',
      updatedAt: FieldValue.serverTimestamp(),
    });

    const entSnap = await transaction.get(entDocRef);
    if (entSnap.exists && entSnap.data()?.subscriptionId === subscriptionId) {
      transaction.update(entDocRef, {
        cancelAtPeriodEnd: true,
        status: 'cancel_at_period_end',
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return true;
  });
}
