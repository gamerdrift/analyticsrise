import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { FieldValue } from 'firebase-admin/firestore';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { db } from './index';
import { razorpayKeySecret, RAZORPAY_SECRETS } from './config';
import { getRazorpayClient } from './orders';

export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  verified: boolean;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  verificationStatus: string;
  paymentStatus: string;
  message: string;
}

/**
 * Cryptographic HMAC-SHA256 signature verification with timing-safe comparison.
 *
 * Computes HMAC-SHA256 of `orderId|paymentId` using the server-side Razorpay Key Secret,
 * and performs a constant-time equality check to prevent timing attacks.
 */
export function verifySignatureHmacSha256(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  if (!orderId || !paymentId || !signature || !secret) {
    return false;
  }

  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const receivedBuffer = Buffer.from(signature, 'utf8');

  // crypto.timingSafeEqual throws if buffer byte lengths differ.
  // Returning false in constant-time length check prevents timing leakage.
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

/**
 * Business logic for verifying a Razorpay Checkout payment response.
 * Isolated for unit testing with dependency injection.
 */
export async function processPaymentVerification(
  userId: string,
  data: VerifyPaymentData,
  razorpayClient?: Razorpay,
  secretKey?: string,
  firestoreDb?: FirebaseFirestore.Firestore
): Promise<VerifyPaymentResponse> {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new HttpsError(
      'unauthenticated',
      'User must be authenticated with Firebase Auth to verify payment.'
    );
  }

  if (!data || typeof data !== 'object') {
    throw new HttpsError(
      'invalid-argument',
      'Request data must be a valid JSON object.'
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  if (!razorpay_order_id || typeof razorpay_order_id !== 'string' || razorpay_order_id.trim() === '') {
    throw new HttpsError(
      'invalid-argument',
      'Missing or invalid "razorpay_order_id".'
    );
  }

  if (!razorpay_payment_id || typeof razorpay_payment_id !== 'string' || razorpay_payment_id.trim() === '') {
    throw new HttpsError(
      'invalid-argument',
      'Missing or invalid "razorpay_payment_id".'
    );
  }

  if (!razorpay_signature || typeof razorpay_signature !== 'string' || razorpay_signature.trim() === '') {
    throw new HttpsError(
      'invalid-argument',
      'Missing or invalid "razorpay_signature".'
    );
  }

  const database = firestoreDb || db;

  // 1. Lookup internal Firestore order record
  let orderSnap: FirebaseFirestore.DocumentSnapshot;
  try {
    orderSnap = await database.collection('orders').doc(razorpay_order_id).get();
  } catch (err: any) {
    logger.error('Failed to lookup internal order in Firestore:', {
      userId,
      orderId: razorpay_order_id,
      error: err.message || err,
    });
    throw new HttpsError('internal', 'Internal database error looking up order.');
  }

  if (!orderSnap.exists) {
    logger.warn('Payment verification attempted for non-existent order:', {
      userId,
      orderId: razorpay_order_id,
    });
    throw new HttpsError('not-found', 'Order not found.');
  }

  const orderData = orderSnap.data();
  if (!orderData) {
    throw new HttpsError('not-found', 'Order record contains no data.');
  }

  // 2. Enforce strict order ownership (user A cannot verify user B's order)
  if (orderData.userId !== userId) {
    logger.warn('Order ownership mismatch during payment verification:', {
      requestUid: userId,
      orderOwnerUid: orderData.userId,
      orderId: razorpay_order_id,
    });
    throw new HttpsError(
      'permission-denied',
      'You do not have permission to verify this order.'
    );
  }

  // 3. Cryptographic HMAC-SHA256 signature verification
  const resolvedSecret = secretKey || razorpayKeySecret.value();
  if (!resolvedSecret) {
    throw new HttpsError(
      'failed-precondition',
      'Razorpay Key Secret is not configured in Secret Manager.'
    );
  }

  const isSignatureValid = verifySignatureHmacSha256(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    resolvedSecret
  );

  if (!isSignatureValid) {
    logger.warn('Cryptographic payment signature mismatch:', {
      userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
    throw new HttpsError(
      'invalid-argument',
      'Payment signature verification failed. The payment response is not authentic.'
    );
  }

  // 4. Retrieve and verify Razorpay Order via SDK
  const client = razorpayClient || getRazorpayClient();
  let razorpayOrder: any;
  try {
    razorpayOrder = await client.orders.fetch(razorpay_order_id);
  } catch (err: any) {
    logger.error('Razorpay Orders API fetch failed:', {
      userId,
      orderId: razorpay_order_id,
      error: err.message || err,
    });
    throw new HttpsError(
      'internal',
      'Unable to verify order status with payment gateway.'
    );
  }

  if (!razorpayOrder || razorpayOrder.id !== razorpay_order_id) {
    throw new HttpsError(
      'invalid-argument',
      'Gateway order identifier mismatch.'
    );
  }

  if (razorpayOrder.amount !== orderData.amount) {
    logger.error('Order amount mismatch between gateway and internal record:', {
      orderId: razorpay_order_id,
      gatewayAmount: razorpayOrder.amount,
      internalAmount: orderData.amount,
    });
    throw new HttpsError(
      'invalid-argument',
      'Order amount mismatch between payment gateway and internal record.'
    );
  }

  if (razorpayOrder.currency !== orderData.currency) {
    logger.error('Order currency mismatch between gateway and internal record:', {
      orderId: razorpay_order_id,
      gatewayCurrency: razorpayOrder.currency,
      internalCurrency: orderData.currency,
    });
    throw new HttpsError(
      'invalid-argument',
      'Order currency mismatch between payment gateway and internal record.'
    );
  }

  // 5. Retrieve and verify Razorpay Payment via SDK
  let razorpayPayment: any;
  try {
    razorpayPayment = await client.payments.fetch(razorpay_payment_id);
  } catch (err: any) {
    logger.error('Razorpay Payments API fetch failed:', {
      userId,
      paymentId: razorpay_payment_id,
      error: err.message || err,
    });
    throw new HttpsError(
      'internal',
      'Unable to retrieve payment details from payment gateway.'
    );
  }

  if (!razorpayPayment || !razorpayPayment.id) {
    throw new HttpsError(
      'invalid-argument',
      'Payment details not found on payment gateway.'
    );
  }

  // Ensure payment belongs to the verified order
  if (razorpayPayment.order_id !== razorpay_order_id) {
    logger.error('Payment belongs to a different order:', {
      paymentId: razorpay_payment_id,
      paymentOrderId: razorpayPayment.order_id,
      expectedOrderId: razorpay_order_id,
    });
    throw new HttpsError(
      'invalid-argument',
      'The payment does not belong to the specified order.'
    );
  }

  if (razorpayPayment.amount !== orderData.amount) {
    logger.error('Payment amount does not match order amount:', {
      paymentId: razorpay_payment_id,
      paymentAmount: razorpayPayment.amount,
      orderAmount: orderData.amount,
    });
    throw new HttpsError(
      'invalid-argument',
      'Payment amount does not match order amount.'
    );
  }

  if (razorpayPayment.currency !== orderData.currency) {
    logger.error('Payment currency does not match order currency:', {
      paymentId: razorpay_payment_id,
      paymentCurrency: razorpayPayment.currency,
      orderCurrency: orderData.currency,
    });
    throw new HttpsError(
      'invalid-argument',
      'Payment currency does not match order currency.'
    );
  }

  // 6. Record payment verification document in Firestore
  const paymentStatus = razorpayPayment.status || 'unknown';
  try {
    const paymentDocRef = database.collection('payments').doc(razorpay_payment_id);
    const paymentSnap = await paymentDocRef.get();

    const paymentRecord: any = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      userId: userId,
      provider: 'razorpay',
      amount: orderData.amount,
      currency: orderData.currency,
      planId: orderData.planId,
      billingCycle: orderData.billingCycle,
      verificationStatus: 'signature_verified',
      paymentStatus: paymentStatus,
      method: razorpayPayment.method || 'unknown',
      captured: razorpayPayment.captured ?? (paymentStatus === 'captured'),
      verifiedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (!paymentSnap.exists) {
      paymentRecord.createdAt = FieldValue.serverTimestamp();
    }

    await paymentDocRef.set(paymentRecord, { merge: true });

    // Update internal order payment verification state (leaving status: 'pending' intact)
    await database.collection('orders').doc(razorpay_order_id).update({
      paymentVerificationStatus: 'verified',
      latestPaymentId: razorpay_payment_id,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (err: any) {
    logger.error('Failed to record payment verification in Firestore:', {
      userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      error: err.message || err,
    });
    throw new HttpsError(
      'internal',
      'Failed to record payment verification state in database.'
    );
  }

  logger.info('Razorpay payment signature verified successfully:', {
    userId,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    paymentStatus: paymentStatus,
  });

  return {
    verified: true,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    amount: orderData.amount,
    currency: orderData.currency,
    verificationStatus: 'signature_verified',
    paymentStatus: paymentStatus,
    message: 'Payment signature verified successfully.',
  };
}

/**
 * Cloud Function v2 Callable: verifyRazorpayPayment
 *
 * Authenticated Firebase endpoint for verifying Razorpay Checkout signatures.
 */
export const verifyRazorpayPayment = onCall(
  {
    secrets: RAZORPAY_SECRETS,
    cors: true,
    maxInstances: 20,
  },
  async (request: CallableRequest<VerifyPaymentData>): Promise<VerifyPaymentResponse> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError(
        'unauthenticated',
        'User must be authenticated with Firebase Auth to verify payment.'
      );
    }

    const userId = request.auth.uid;
    return processPaymentVerification(userId, request.data);
  }
);
