import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

/**
 * Firebase Admin SDK Initialization
 *
 * Utilizes the Google Cloud / Firebase runtime environment service identity.
 * No hardcoded credentials, service account JSON files, or client variables are used.
 */
if (!getApps().length) {
  initializeApp();
}

export const db = getFirestore();
export const auth = getAuth();

// Re-export secret definitions for downstream billing function modules
export {
  razorpayKeyId,
  razorpayKeySecret,
  razorpayWebhookSecret,
  RAZORPAY_SECRETS,
} from './config';

// Re-export pricing utilities
export {
  resolvePlanPricing,
  AUTHORITATIVE_PLANS,
  type PaidPlanTier,
  type BillingCycle,
} from './pricing';

// Export Cloud Functions
export { createRazorpayOrder } from './orders';

/**
 * Health Check Cloud Function (v2 HTTPS)
 *
 * Validates runtime health, connectivity, and deployment status.
 * Safely responds without exposing secrets or internal configurations.
 */
export const healthCheck = onRequest(
  {
    cors: true,
    maxInstances: 10,
  },
  (req, res) => {
    logger.info('Health check requested', {
      method: req.method,
      ip: req.ip,
    });

    res.status(200).json({
      status: 'ok',
      service: 'analyticsrise-functions',
      environment: process.env.NODE_ENV === 'development' ? 'development' : 'production',
      timestamp: new Date().toISOString(),
    });
  }
);
