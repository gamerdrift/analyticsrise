import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { FieldValue } from 'firebase-admin/firestore';
import Razorpay from 'razorpay';
import { db } from './index';
import { razorpayKeyId, razorpayKeySecret, RAZORPAY_SECRETS } from './config';
import { resolvePlanPricing, ResolvedPlanDetails } from './pricing';

export interface CreateOrderData {
  planId: string;
  billingCycle?: 'monthly' | 'annual';
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  planId: string;
  planName: string;
  billingCycle: string;
}

/**
 * Factory to construct the Razorpay client using injected Secret Manager credentials
 */
export function getRazorpayClient(keyId?: string, keySecret?: string): Razorpay {
  const resolvedKeyId = keyId || razorpayKeyId.value();
  const resolvedKeySecret = keySecret || razorpayKeySecret.value();

  if (!resolvedKeyId || !resolvedKeySecret) {
    throw new HttpsError(
      'failed-precondition',
      'Razorpay credentials are not configured in Secret Manager.'
    );
  }

  return new Razorpay({
    key_id: resolvedKeyId,
    key_secret: resolvedKeySecret,
  });
}

/**
 * Business logic for creating a Razorpay order and persisting pending Firestore record.
 * Isolated for unit testing with dependency injection.
 */
export async function processOrderCreation(
  userId: string,
  data: CreateOrderData,
  razorpayClient?: Razorpay,
  publicRazorpayKeyId?: string,
  firestoreDb?: FirebaseFirestore.Firestore
): Promise<CreateOrderResponse> {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new HttpsError(
      'unauthenticated',
      'User must be authenticated with Firebase Auth to create a payment order.'
    );
  }

  if (!data || typeof data !== 'object') {
    throw new HttpsError(
      'invalid-argument',
      'Request data must be a valid JSON object.'
    );
  }

  if (!data.planId || typeof data.planId !== 'string') {
    throw new HttpsError(
      'invalid-argument',
      'Missing or invalid "planId" in request.'
    );
  }

  // Server-side authoritative pricing; browser cannot dictate amount or currency
  let planDetails: ResolvedPlanDetails;
  try {
    planDetails = resolvePlanPricing(data.planId, data.billingCycle);
  } catch (err: any) {
    throw new HttpsError(
      'invalid-argument',
      err.message || 'Invalid pricing plan selected.'
    );
  }

  const client = razorpayClient || getRazorpayClient();
  const keyId = publicRazorpayKeyId || razorpayKeyId.value();

  // Generate unique internal receipt reference
  const receipt = `rcpt_${userId.substring(0, 8)}_${Date.now()}`;

  // Call official Razorpay Orders API
  let razorpayOrder: any;
  try {
    razorpayOrder = await client.orders.create({
      amount: planDetails.amountInSubunits,
      currency: planDetails.currency,
      receipt: receipt,
      notes: {
        userId: userId,
        planId: planDetails.id,
        planName: planDetails.name,
        billingCycle: planDetails.billingCycle,
        platform: 'analyticsrise',
      },
    });
  } catch (err: any) {
    logger.error('Razorpay Orders API call failed:', {
      userId,
      planId: planDetails.id,
      error: err.message || err,
    });
    throw new HttpsError(
      'internal',
      'Unable to initiate payment order with gateway. Please try again.'
    );
  }

  if (!razorpayOrder || !razorpayOrder.id) {
    logger.error('Razorpay returned empty order response', {
      userId,
      planId: planDetails.id,
    });
    throw new HttpsError(
      'internal',
      'Payment gateway returned invalid order details.'
    );
  }

  // Persist pending order in Firestore
  const database = firestoreDb || db;
  try {
    const orderDocRef = database.collection('orders').doc(razorpayOrder.id);
    await orderDocRef.set({
      orderId: razorpayOrder.id,
      receipt: receipt,
      userId: userId,
      planId: planDetails.id,
      planName: planDetails.name,
      billingCycle: planDetails.billingCycle,
      amount: planDetails.amountInSubunits,
      displayAmount: planDetails.displayAmount,
      currency: planDetails.currency,
      provider: 'razorpay',
      providerOrderId: razorpayOrder.id,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: {
        entity: razorpayOrder.entity || 'order',
        attempts: razorpayOrder.attempts || 0,
      },
    });
  } catch (err: any) {
    logger.error('Failed to persist pending order in Firestore:', {
      userId,
      orderId: razorpayOrder.id,
      error: err.message || err,
    });
    throw new HttpsError(
      'internal',
      'Failed to record pending order state in database.'
    );
  }

  logger.info('Razorpay pending order created successfully:', {
    userId,
    orderId: razorpayOrder.id,
    planId: planDetails.id,
    amount: planDetails.amountInSubunits,
    currency: planDetails.currency,
  });

  return {
    orderId: razorpayOrder.id,
    amount: planDetails.amountInSubunits,
    currency: planDetails.currency,
    keyId: keyId,
    planId: planDetails.id,
    planName: planDetails.name,
    billingCycle: planDetails.billingCycle,
  };
}

/**
 * Cloud Function v2 Callable: createRazorpayOrder
 *
 * Authenticated Firebase endpoint for initiating real Razorpay payment orders.
 */
export const createRazorpayOrder = onCall(
  {
    secrets: RAZORPAY_SECRETS,
    cors: true,
    maxInstances: 20,
  },
  async (request: CallableRequest<CreateOrderData>): Promise<CreateOrderResponse> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError(
        'unauthenticated',
        'User must be authenticated with Firebase Auth to create a payment order.'
      );
    }

    const userId = request.auth.uid;
    return processOrderCreation(userId, request.data);
  }
);
