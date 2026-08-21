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
  certificateSigningSecret,
  CERTIFICATE_SECRETS,
} from './config';

// Re-export pricing utilities
export {
  resolvePlanPricing,
  AUTHORITATIVE_PLANS,
  type PaidPlanTier,
  type BillingCycle,
} from './pricing';

// Export Assessment Functions & Authority
export {
  startAssessment,
  processAssessmentStart,
  submitAssessment,
  processAssessmentSubmission,
  getSanitizedAssessment,
  getAssessmentAnswerKey,
  AUTHORITATIVE_ASSESSMENTS,
  AUTHORITATIVE_ANSWER_KEYS,
  type PublicAssessmentQuestion,
  type PublicAssessmentMetadata,
  type PrivateQuestionKey,
  type PrivateAssessmentKey,
  type StartAssessmentData,
  type StartAssessmentResponse,
  type SubmitAssessmentData,
  type SubmitAssessmentResponse,
} from './assessments';

// Export Certificate Authority Functions & Helpers
export {
  issueCertificate,
  processCertificateIssuance,
  verifyCertificate,
  processCertificateVerification,
  canonicalizeCertificatePayload,
  signCertificatePayload,
  verifyCertificateSignature,
  getCertificateSigningKey,
  type CanonicalCertificateData,
  type CertificateRecord,
  type IssueCertificateData,
  type IssueCertificateResponse,
  type VerifyCertificateData,
  type VerifyCertificateResponse,
} from './certificates';

// Export Cloud Functions
export { createRazorpayOrder, processOrderCreation, getRazorpayClient } from './orders';
export { verifyRazorpayPayment, processPaymentVerification, verifySignatureHmacSha256 } from './verifyPayment';
export { handleRazorpayWebhook, processWebhookEvent, verifyWebhookSignature, extractRawBody } from './webhook';
export {
  activateSubscriptionFromPayment,
  getAuthoritativeEntitlement,
  cancelSubscriptionAtPeriodEnd,
  calculatePeriodEnd,
  AUTHORITATIVE_PLAN_LIMITS,
  type ActivationParams,
  type ActivationResult,
  type SubscriptionRecord,
  type EntitlementRecord,
  type PlanLimits,
} from './subscriptions';

// Export AI Intelligence Engine Cloud Functions
export {
  aiMentorQuery,
  aiEvaQuery,
  processAIMentorQuery,
  AISecurityFirewall,
  AIModelPolicyResolver,
  AIQuotaService,
  AIContextEngine,
  AIConversationRepository,
  AIProviderManager,
  mockAIProvider,
  MockAIProvider,
  type AIMentorQueryData,
  type AIMentorQueryResponse,
  type AICapability,
} from './ai';

// Export Challenge Engine Cloud Functions
export {
  submitChallengeAttempt,
  getChallengeProgress,
  getChallengeAttempts,
  getUserChallengeSummary,
  getChallengeUnlockStatus,
  getUserProgressionMap,
  processChallengeSubmissionServer,
  calculateXpDelta,
  calculateNextStatus,
  SERVER_CHALLENGES,
  type SubmitChallengeAttemptData,
  type SubmitChallengeAttemptResponse,
  type GetChallengeProgressData,
  type GetChallengeAttemptsData,
  type UserChallengeSummaryResponse,
} from './challenges';

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
