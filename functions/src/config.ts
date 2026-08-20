import { defineSecret } from 'firebase-functions/params';

/**
 * Razorpay Private Runtime Secrets
 *
 * Managed securely via Google Cloud Secret Manager / Firebase Functions v2.
 * At runtime, access secret values via `.value()` inside functions configured with `{ secrets: [...] }`.
 *
 * NEVER hardcode values, log them, or expose them to client-side bundles.
 */
export const razorpayKeyId = defineSecret('RAZORPAY_KEY_ID');
export const razorpayKeySecret = defineSecret('RAZORPAY_KEY_SECRET');
export const razorpayWebhookSecret = defineSecret('RAZORPAY_WEBHOOK_SECRET');

/**
 * Array of all Razorpay secrets required by billing functions.
 * Can be passed directly to function option configurations:
 * e.g. `onCall({ secrets: RAZORPAY_SECRETS }, ...)` or `onRequest({ secrets: RAZORPAY_SECRETS }, ...)`
 */
export const RAZORPAY_SECRETS = [
  razorpayKeyId,
  razorpayKeySecret,
  razorpayWebhookSecret,
];

/**
 * Certificate HMAC Cryptographic Signing Secret
 *
 * Managed securely via Google Cloud Secret Manager / Firebase Functions v2.
 * Used exclusively on the server to compute and verify tamper-proof HMAC signatures.
 */
export const certificateSigningSecret = defineSecret('CERTIFICATE_SIGNING_SECRET');

export const CERTIFICATE_SECRETS = [
  certificateSigningSecret,
];

