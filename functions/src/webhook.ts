import { onRequest, Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import * as logger from 'firebase-functions/logger';
import { FieldValue } from 'firebase-admin/firestore';
import * as crypto from 'crypto';
import { db } from './index';
import { razorpayWebhookSecret, RAZORPAY_SECRETS } from './config';
import { activateSubscriptionFromPayment } from './subscriptions';

export interface WebhookProcessingResult {
  status: number;
  body: {
    received: boolean;
    duplicate?: boolean;
    reconciliation_required?: boolean;
    unhandled?: boolean;
    error?: string;
  };
}

/**
 * Processing Lease Duration (60,000 ms / 60 seconds).
 *
 * Firebase Cloud Functions v2 default execution timeout is 60 seconds.
 * Under normal conditions, webhook ingestion finishes in < 2 seconds.
 * A 60-second lease safely protects in-flight execution against concurrent duplicate
 * workers while permitting automated retries after timeouts or crashes.
 */
export const WEBHOOK_PROCESSING_LEASE_MS = 60_000;

/**
 * Extracts raw body string from Firebase Functions v2 / Express Request.
 * Preserves exact bytes, whitespace, and property ordering for cryptographic signature verification.
 */
export function extractRawBody(req: Request): string | null {
  const rawBody = (req as any).rawBody;
  if (Buffer.isBuffer(rawBody)) {
    return rawBody.toString('utf8');
  }
  if (typeof rawBody === 'string' && rawBody.length > 0) {
    return rawBody;
  }
  if (typeof req.body === 'string' && req.body.length > 0) {
    return req.body;
  }
  return null;
}

/**
 * Timing-safe HMAC-SHA256 verification of Razorpay webhook signature.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  if (!rawBody || !signature || !webhookSecret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody, 'utf8')
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const receivedBuffer = Buffer.from(signature, 'utf8');

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

/**
 * Atomically finalizes a webhook event document, verifying that the current
 * worker still owns the active processing attempt token.
 */
export async function finalizeWebhookEvent(
  database: FirebaseFirestore.Firestore,
  eventDocRef: FirebaseFirestore.DocumentReference,
  attemptId: string,
  updateData: Record<string, any>
): Promise<boolean> {
  return database.runTransaction(async (transaction) => {
    const snap = await transaction.get(eventDocRef);
    if (!snap.exists) {
      return false;
    }
    const data = snap.data();
    if (data?.processingAttemptId !== attemptId) {
      logger.warn('Stale worker attempted to finalize webhook event with mismatched attempt ID:', {
        currentAttemptId: data?.processingAttemptId,
        workerAttemptId: attemptId,
      });
      return false;
    }
    transaction.update(eventDocRef, {
      ...updateData,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
}

/**
 * Core business logic for processing incoming Razorpay webhook events.
 * Isolated for unit testing with dependency injection.
 */
export async function processWebhookEvent(
  req: {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    rawBody?: Buffer | string;
    body?: any;
  },
  webhookSecret?: string,
  firestoreDb?: FirebaseFirestore.Firestore
): Promise<WebhookProcessingResult> {
  // 1. Method check: Accept only POST
  if (req.method && req.method.toUpperCase() !== 'POST') {
    return {
      status: 405,
      body: { received: false, error: 'Method Not Allowed. Only POST requests are accepted.' },
    };
  }

  // 2. Extract Raw Body
  const rawBodyString = extractRawBody(req as any);
  if (!rawBodyString || rawBodyString.trim() === '') {
    return {
      status: 400,
      body: { received: false, error: 'Missing or empty request body.' },
    };
  }

  // 3. Extract Headers
  const getHeader = (name: string): string | undefined => {
    const val = req.headers[name] || req.headers[name.toLowerCase()];
    return Array.isArray(val) ? val[0] : val;
  };

  const signature = getHeader('x-razorpay-signature');
  if (!signature || typeof signature !== 'string' || signature.trim() === '') {
    return {
      status: 400,
      body: { received: false, error: 'Missing X-Razorpay-Signature header.' },
    };
  }

  const eventId = getHeader('x-razorpay-event-id');
  if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
    return {
      status: 400,
      body: { received: false, error: 'Missing x-razorpay-event-id header.' },
    };
  }

  // 4. Verify HMAC-SHA256 Webhook Signature
  const resolvedSecret = webhookSecret || razorpayWebhookSecret.value();
  if (!resolvedSecret) {
    logger.error('RAZORPAY_WEBHOOK_SECRET is not configured in Secret Manager');
    return {
      status: 500,
      body: { received: false, error: 'Webhook secret configuration missing.' },
    };
  }

  const isSignatureValid = verifyWebhookSignature(rawBodyString, signature, resolvedSecret);
  if (!isSignatureValid) {
    logger.warn('Invalid Razorpay webhook signature received:', { eventId });
    return {
      status: 400,
      body: { received: false, error: 'Invalid webhook signature.' },
    };
  }

  // 5. Parse JSON Payload
  let payload: any;
  try {
    payload = JSON.parse(rawBodyString);
  } catch (err: any) {
    logger.warn('Failed to parse webhook JSON payload:', { eventId, error: err.message });
    return {
      status: 400,
      body: { received: false, error: 'Malformed JSON payload.' },
    };
  }

  const eventType = payload.event;
  if (!eventType || typeof eventType !== 'string') {
    return {
      status: 400,
      body: { received: false, error: 'Missing or invalid "event" in webhook payload.' },
    };
  }

  const database = firestoreDb || db;
  const eventDocRef = database.collection('webhookEvents').doc(eventId);

  // 6. Idempotency Check & Atomic Claim via Firestore Transaction
  let isDuplicate = false;
  const currentAttemptId = crypto.randomUUID();

  try {
    await database.runTransaction(async (transaction) => {
      const eventSnap = await transaction.get(eventDocRef);

      if (!eventSnap.exists) {
        // CASE 1: Brand new webhook event
        transaction.set(eventDocRef, {
          eventId,
          eventType,
          provider: 'razorpay',
          processingStatus: 'processing',
          processingAttemptId: currentAttemptId,
          processingStartedAt: FieldValue.serverTimestamp(),
          receivedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          retryCount: 0,
        });
        return;
      }

      const existingData = eventSnap.data();
      const status = existingData?.processingStatus;

      // CASE 2: Terminal States (permanently idempotent)
      if (
        status === 'processed' ||
        status === 'reconciliation_required' ||
        status === 'ignored_unsupported_event'
      ) {
        isDuplicate = true;
        return;
      }

      // CASE 3 & 4: Active vs Stale Processing
      if (status === 'processing') {
        const startedAtDate = existingData?.processingStartedAt?.toDate?.() ||
          (existingData?.processingStartedAt?.toMillis ? new Date(existingData.processingStartedAt.toMillis()) : null);
        const startedAtMillis = startedAtDate ? startedAtDate.getTime() : 0;
        const isLeaseActive = startedAtMillis > 0 && (Date.now() - startedAtMillis < WEBHOOK_PROCESSING_LEASE_MS);

        if (isLeaseActive) {
          isDuplicate = true;
          return;
        }
      }

      // CASE 4 (Stale processing) & CASE 5 (Failed): Reclaim event with new attempt token
      const nextRetryCount = (existingData?.retryCount || 0) + 1;
      transaction.update(eventDocRef, {
        processingStatus: 'processing',
        processingAttemptId: currentAttemptId,
        processingStartedAt: FieldValue.serverTimestamp(),
        lastRetriedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        retryCount: nextRetryCount,
      });
    });
  } catch (err: any) {
    logger.error('Firestore transaction failed for webhook idempotency:', { eventId, error: err.message });
    return {
      status: 500,
      body: { received: false, error: 'Internal database error handling event idempotency.' },
    };
  }

  if (isDuplicate) {
    logger.info('Duplicate webhook event delivery ignored:', { eventId, eventType });
    return {
      status: 200,
      body: { received: true, duplicate: true },
    };
  }

  // 7. Event Processing & Reconciliation
  try {
    let razorpayOrderId: string | undefined;
    let razorpayPaymentId: string | undefined;
    let amount: number | undefined;
    let currency: string | undefined;
    let userId: string | undefined;
    let planId: string | undefined;
    let processingStatus: 'processed' | 'reconciliation_required' | 'ignored_unsupported_event' = 'processed';
    let reconciliationNotes: string | undefined;

    if (eventType === 'payment.captured') {
      const paymentEntity = payload?.payload?.payment?.entity;
      razorpayPaymentId = paymentEntity?.id;
      razorpayOrderId = paymentEntity?.order_id;
      amount = paymentEntity?.amount;
      currency = paymentEntity?.currency;

      if (razorpayPaymentId) {
        // Record / update payment entity
        const paymentDocRef = database.collection('payments').doc(razorpayPaymentId);
        await paymentDocRef.set(
          {
            paymentId: razorpayPaymentId,
            orderId: razorpayOrderId || null,
            provider: 'razorpay',
            amount: amount || null,
            currency: currency || null,
            paymentStatus: 'captured',
            captured: true,
            method: paymentEntity?.method || null,
            capturedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      if (razorpayOrderId) {
        const orderDocRef = database.collection('orders').doc(razorpayOrderId);
        const orderSnap = await orderDocRef.get();

        if (orderSnap.exists) {
          const orderData = orderSnap.data();
          userId = orderData?.userId;
          planId = orderData?.planId;

          // Verify amount and currency reconciliation
          if (amount && orderData?.amount && amount !== orderData.amount) {
            processingStatus = 'reconciliation_required';
            reconciliationNotes = `Amount mismatch: Webhook=${amount}, Order=${orderData.amount}`;
          } else if (currency && orderData?.currency && currency !== orderData.currency) {
            processingStatus = 'reconciliation_required';
            reconciliationNotes = `Currency mismatch: Webhook=${currency}, Order=${orderData.currency}`;
          } else if (orderData && razorpayPaymentId) {
            // Authoritatively activate subscription and feature entitlements in Firestore
            await activateSubscriptionFromPayment(
              {
                userId: orderData.userId,
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                planId: orderData.planId,
                billingCycle: orderData.billingCycle,
                amount: orderData.amount,
                currency: orderData.currency,
              },
              database
            );
          }
        } else {
          processingStatus = 'reconciliation_required';
          reconciliationNotes = `Internal order ${razorpayOrderId} not found in database.`;
        }
      } else {
        processingStatus = 'reconciliation_required';
        reconciliationNotes = 'Payment entity missing order_id.';
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = payload?.payload?.payment?.entity;
      razorpayPaymentId = paymentEntity?.id;
      razorpayOrderId = paymentEntity?.order_id;
      amount = paymentEntity?.amount;
      currency = paymentEntity?.currency;
      const errorCode = paymentEntity?.error_code;
      const errorDescription = paymentEntity?.error_description;

      if (razorpayPaymentId) {
        const paymentDocRef = database.collection('payments').doc(razorpayPaymentId);
        await paymentDocRef.set(
          {
            paymentId: razorpayPaymentId,
            orderId: razorpayOrderId || null,
            provider: 'razorpay',
            amount: amount || null,
            currency: currency || null,
            paymentStatus: 'failed',
            captured: false,
            errorCode: errorCode || null,
            errorDescription: errorDescription || null,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      if (razorpayOrderId) {
        const orderDocRef = database.collection('orders').doc(razorpayOrderId);
        const orderSnap = await orderDocRef.get();
        if (orderSnap.exists) {
          const orderData = orderSnap.data();
          userId = orderData?.userId;
          planId = orderData?.planId;

          await orderDocRef.update({
            lastPaymentError: errorDescription || 'Payment failed',
            latestPaymentId: razorpayPaymentId || null,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      }
    } else if (eventType === 'order.paid') {
      const orderEntity = payload?.payload?.order?.entity;
      razorpayOrderId = orderEntity?.id;
      amount = orderEntity?.amount;
      currency = orderEntity?.currency;

      if (razorpayOrderId) {
        const orderDocRef = database.collection('orders').doc(razorpayOrderId);
        const orderSnap = await orderDocRef.get();

        if (orderSnap.exists) {
          const orderData = orderSnap.data();
          userId = orderData?.userId;
          planId = orderData?.planId;

          if (amount && orderData?.amount && amount !== orderData.amount) {
            processingStatus = 'reconciliation_required';
            reconciliationNotes = `Order amount mismatch: Webhook=${amount}, Order=${orderData.amount}`;
          } else if (currency && orderData?.currency && currency !== orderData.currency) {
            processingStatus = 'reconciliation_required';
            reconciliationNotes = `Order currency mismatch: Webhook=${currency}, Order=${orderData.currency}`;
          } else {
            await orderDocRef.update({
              gatewayOrderStatus: 'paid',
              amountPaid: orderEntity?.amount_paid || amount,
              gatewayPaidAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp(),
            });
          }
        } else {
          processingStatus = 'reconciliation_required';
          reconciliationNotes = `Internal order ${razorpayOrderId} not found in database.`;
        }
      }
    } else {
      // Unhandled / other event type: signature verified and acknowledged safely
      processingStatus = 'ignored_unsupported_event';
      logger.info('Unsupported webhook event verified and acknowledged:', { eventId, eventType });
    }

    // 8. Update Webhook Audit Record verifying current worker's attempt token
    const finalized = await finalizeWebhookEvent(database, eventDocRef, currentAttemptId, {
      processingStatus,
      processedAt: FieldValue.serverTimestamp(),
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
      userId: userId || null,
      planId: planId || null,
      amount: amount || null,
      currency: currency || null,
      reconciliationNotes: reconciliationNotes || null,
    });

    if (!finalized) {
      logger.warn('Stale worker lost processing attempt ownership, skipping response mutation:', {
        eventId,
        attemptId: currentAttemptId,
      });
      return {
        status: 200,
        body: { received: true, duplicate: true },
      };
    }

    logger.info('Webhook event processed successfully:', {
      eventId,
      eventType,
      processingStatus,
      razorpayOrderId,
      razorpayPaymentId,
      attemptId: currentAttemptId,
    });

    if (processingStatus === 'reconciliation_required') {
      return {
        status: 200,
        body: { received: true, reconciliation_required: true },
      };
    }

    if (processingStatus === 'ignored_unsupported_event') {
      return {
        status: 200,
        body: { received: true, unhandled: true },
      };
    }

    return {
      status: 200,
      body: { received: true },
    };
  } catch (err: any) {
    logger.error('Error during webhook event processing:', { eventId, eventType, error: err.message });
    await finalizeWebhookEvent(database, eventDocRef, currentAttemptId, {
      processingStatus: 'failed',
      error: err.message || 'Processing error',
    });

    return {
      status: 500,
      body: { received: false, error: 'Internal error processing webhook event.' },
    };
  }
}

/**
 * Cloud Function v2 HTTP Endpoint: handleRazorpayWebhook
 *
 * Ingests and processes Razorpay webhook deliveries securely.
 */
export const handleRazorpayWebhook = onRequest(
  {
    secrets: RAZORPAY_SECRETS,
    cors: false,
    maxInstances: 20,
  },
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await processWebhookEvent(req);
      res.status(result.status).json(result.body);
    } catch (err: any) {
      logger.error('Unhandled webhook controller error:', { error: err.message });
      res.status(500).json({ received: false, error: 'Internal Server Error' });
    }
  }
);
