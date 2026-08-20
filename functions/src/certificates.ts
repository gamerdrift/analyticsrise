import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { FieldValue } from 'firebase-admin/firestore';
import * as crypto from 'crypto';
import { db } from './index';
import { certificateSigningSecret, CERTIFICATE_SECRETS } from './config';
import { getAuthoritativeEntitlement } from './subscriptions';
import { AUTHORITATIVE_ASSESSMENTS } from './assessments';

export interface CanonicalCertificateData {
  certificateId: string;
  userId: string;
  assessmentId: string;
  courseId: string;
  credentialTitle: string;
  issuedAt: string;
}

/**
 * Deterministic canonical serialization of certificate metadata before HMAC calculation.
 * Uses a strict versioned, delimiter-escaped format to prevent property-ordering vulnerabilities.
 */
export function canonicalizeCertificatePayload(data: CanonicalCertificateData): string {
  const sanitize = (val: string) => (val || '').trim().replace(/\|/g, '%7C');
  return [
    'v1',
    sanitize(data.certificateId),
    sanitize(data.userId),
    sanitize(data.assessmentId),
    sanitize(data.courseId),
    sanitize(data.credentialTitle),
    sanitize(data.issuedAt),
  ].join('|');
}

/**
 * Compute cryptographic HMAC-SHA256 signature for canonical certificate payload.
 */
export function signCertificatePayload(canonicalString: string, secret: string): string {
  if (!secret) {
    throw new Error('Cannot sign certificate payload without cryptographic secret.');
  }
  return crypto.createHmac('sha256', secret).update(canonicalString, 'utf8').digest('hex');
}

/**
 * Verify cryptographic HMAC signature using timing-safe comparison to prevent timing side-channel attacks.
 */
export function verifyCertificateSignature(
  canonicalString: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || typeof signature !== 'string' || !secret) {
    return false;
  }

  try {
    const expectedSignature = signCertificatePayload(canonicalString, secret);
    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedSignature, 'hex');

    if (sigBuf.length !== expBuf.length || sigBuf.length === 0) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch (err) {
    return false;
  }
}

/**
 * Safe resolver for certificate signing key from Secret Manager or environment.
 */
export function getCertificateSigningKey(injectedSecret?: string): string {
  if (injectedSecret) return injectedSecret;
  if (process.env.CERTIFICATE_SIGNING_SECRET) return process.env.CERTIFICATE_SIGNING_SECRET;

  try {
    const val = certificateSigningSecret.value();
    if (val) return val;
  } catch (e) {
    // Secret not bound in this execution context
  }

  if (process.env.NODE_ENV === 'test') {
    return 'test_hmac_signing_secret_key_analyticsrise_mission01c';
  }

  throw new HttpsError(
    'failed-precondition',
    'Certificate signing secret is not configured in Google Secret Manager.'
  );
}

export interface CertificateRecord {
  certificateId: string;
  userId: string;
  recipientName: string;
  assessmentId: string;
  courseId: string;
  credentialTitle: string;
  score: number;
  submissionId: string;
  issuedAt: string;
  status: 'valid' | 'revoked';
  signature: string;
  verificationUrl: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface IssueCertificateData {
  submissionId: string;
}

export interface IssueCertificateResponse {
  certificateId: string;
  recipientName: string;
  credentialTitle: string;
  assessmentId: string;
  courseId: string;
  score: number;
  issuedAt: string;
  verificationUrl: string;
  status: 'valid';
  isDuplicate: boolean;
}

/**
 * Process authoritative certificate issuance.
 * Enforces server-side submission ownership, passing grade verification,
 * subscription plan entitlement, idempotency, and cryptographic signing.
 */
export async function processCertificateIssuance(
  userId: string,
  data: IssueCertificateData,
  signingSecret?: string,
  firestoreDb?: FirebaseFirestore.Firestore
): Promise<IssueCertificateResponse> {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new HttpsError(
      'unauthenticated',
      'User must be authenticated with Firebase Auth to issue a certificate.'
    );
  }

  if (!data || typeof data !== 'object' || !data.submissionId || typeof data.submissionId !== 'string') {
    throw new HttpsError(
      'invalid-argument',
      'Missing or invalid "submissionId" parameter.'
    );
  }

  const submissionId = data.submissionId.trim();
  const database = firestoreDb || db;

  // 1. Verify Submission Existence & Ownership
  const submissionDocRef = database.collection('submissions').doc(submissionId);
  const submissionSnap = await submissionDocRef.get();

  if (!submissionSnap.exists) {
    throw new HttpsError(
      'not-found',
      `Assessment submission record "${submissionId}" not found.`
    );
  }

  const submission = submissionSnap.data();
  if (submission?.userId !== userId) {
    throw new HttpsError(
      'permission-denied',
      'You are not authorized to claim a certificate for this submission.'
    );
  }

  if (!submission?.passed) {
    throw new HttpsError(
      'failed-precondition',
      `Cannot issue certificate: Assessment submission did not achieve the required passing score (Score: ${submission?.percentage || 0}%, Required: ${submission?.passingScore || 80}%).`
    );
  }

  // 2. Verify Server-Authoritative Subscription Entitlement
  const entitlement = await getAuthoritativeEntitlement(userId, database);
  if (!entitlement.features.certificateAccess || entitlement.status === 'expired') {
    logger.warn('Certificate issuance blocked due to plan limits:', {
      userId,
      planId: entitlement.planId,
      status: entitlement.status,
      certificateAccess: entitlement.features.certificateAccess,
    });
    throw new HttpsError(
      'permission-denied',
      'Your current membership plan does not include verified certificate issuance. Please upgrade to an accredited Student Pro or Pro plan to claim and share credentials.'
    );
  }

  // 3. Resolve Recipient Profile & Credential Title
  let recipientName = 'AnalyticsRise Scholar';
  try {
    const userDocRef = database.collection('users').doc(userId);
    const userSnap = await userDocRef.get();
    if (userSnap.exists) {
      const userData = userSnap.data();
      recipientName = userData?.profile?.displayName || userData?.profile?.email?.split('@')[0] || recipientName;
    }
  } catch (err) {
    logger.warn('Failed to retrieve profile display name during certificate issuance:', { userId });
  }

  const assessmentId: string = submission.assessmentId;
  const assessmentMeta = AUTHORITATIVE_ASSESSMENTS[assessmentId];
  const credentialTitle = assessmentMeta?.title || `${assessmentId.toUpperCase()} Certification`;
  const courseId = assessmentMeta?.courseId || (assessmentId === 'exam-sql' ? 'sql-01' : 'excel-01');

  // 4. Deterministic Certificate Identity (Guarantees absolute idempotency)
  const certificateId = `cert_${userId}_${assessmentId}`;
  const certDocRef = database.collection('certificates').doc(certificateId);
  const resolvedSecret = getCertificateSigningKey(signingSecret);

  // 5. Atomic Transaction: Idempotent Issuance & Telemetry Tracking
  return await database.runTransaction(async (transaction) => {
    const existingCert = await transaction.get(certDocRef);
    if (existingCert.exists) {
      const certData = existingCert.data() as CertificateRecord;
      logger.info('Duplicate certificate issuance request returned existing credential:', {
        certificateId,
        userId,
      });

      return {
        certificateId,
        recipientName: certData.recipientName,
        credentialTitle: certData.credentialTitle,
        assessmentId: certData.assessmentId,
        courseId: certData.courseId,
        score: certData.score,
        issuedAt: certData.issuedAt,
        verificationUrl: certData.verificationUrl,
        status: 'valid',
        isDuplicate: true,
      };
    }

    const issuedAt = new Date().toISOString();
    const canonicalPayload = canonicalizeCertificatePayload({
      certificateId,
      userId,
      assessmentId,
      courseId,
      credentialTitle,
      issuedAt,
    });

    const signature = signCertificatePayload(canonicalPayload, resolvedSecret);
    const verificationUrl = `https://analyticsrise.com/verify/${certificateId}`;

    const certRecord: CertificateRecord = {
      certificateId,
      userId,
      recipientName,
      assessmentId,
      courseId,
      credentialTitle,
      score: submission.percentage || 100,
      submissionId,
      issuedAt,
      status: 'valid',
      signature,
      verificationUrl,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    transaction.set(certDocRef, certRecord);

    // Update user telemetry in /users/{userId}
    const userDocRef = database.collection('users').doc(userId);
    const userSnap = await transaction.get(userDocRef);
    if (userSnap.exists) {
      transaction.update(userDocRef, {
        'telemetry.certificatesEarned': FieldValue.increment(1),
        'telemetry.xp': FieldValue.increment(500),
        'telemetry.lastActiveDate': new Date().toISOString().split('T')[0],
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    logger.info('Official signed certificate issued successfully:', {
      certificateId,
      userId,
      assessmentId,
      score: submission.percentage,
    });

    return {
      certificateId,
      recipientName,
      credentialTitle,
      assessmentId,
      courseId,
      score: submission.percentage || 100,
      issuedAt,
      verificationUrl,
      status: 'valid',
      isDuplicate: false,
    };
  });
}

export interface VerifyCertificateData {
  certificateId: string;
}

export interface VerifyCertificateResponse {
  valid: boolean;
  certificateId: string;
  recipientName?: string;
  credentialTitle?: string;
  assessmentId?: string;
  courseId?: string;
  score?: number;
  issuedAt?: string;
  status: 'valid' | 'revoked' | 'tampered' | 'not_found';
  verifiedAt?: string;
  error?: string;
}

/**
 * Authoritative Public Certificate Verification.
 * Reads certificate, reconstructs canonical payload, and validates
 * HMAC-SHA256 signature using the server-side signing secret.
 */
export async function processCertificateVerification(
  data: VerifyCertificateData,
  signingSecret?: string,
  firestoreDb?: FirebaseFirestore.Firestore
): Promise<VerifyCertificateResponse> {
  if (!data || typeof data !== 'object' || !data.certificateId || typeof data.certificateId !== 'string') {
    throw new HttpsError(
      'invalid-argument',
      'Missing or invalid "certificateId" parameter.'
    );
  }

  const certificateId = data.certificateId.trim();
  if (!/^[a-zA-Z0-9_-]{4,128}$/.test(certificateId)) {
    throw new HttpsError(
      'invalid-argument',
      'Invalid certificate identifier format.'
    );
  }

  const database = firestoreDb || db;
  const certDocRef = database.collection('certificates').doc(certificateId);
  const certSnap = await certDocRef.get();

  if (!certSnap.exists) {
    return {
      valid: false,
      certificateId,
      status: 'not_found',
      error: 'Certificate not found in official AnalyticsRise credential registry.',
    };
  }

  const cert = certSnap.data() as CertificateRecord;

  // Check revocation status
  if (cert.status && cert.status !== 'valid') {
    return {
      valid: false,
      certificateId,
      recipientName: cert.recipientName,
      credentialTitle: cert.credentialTitle,
      assessmentId: cert.assessmentId,
      courseId: cert.courseId,
      issuedAt: cert.issuedAt,
      status: cert.status,
      error: `Certificate status is "${cert.status}". This credential has been revoked.`,
    };
  }

  // Reconstruct canonical payload and verify signature
  const resolvedSecret = getCertificateSigningKey(signingSecret);
  const canonicalPayload = canonicalizeCertificatePayload({
    certificateId: cert.certificateId,
    userId: cert.userId,
    assessmentId: cert.assessmentId,
    courseId: cert.courseId,
    credentialTitle: cert.credentialTitle,
    issuedAt: cert.issuedAt,
  });

  const isSignatureValid = verifyCertificateSignature(canonicalPayload, cert.signature, resolvedSecret);
  if (!isSignatureValid) {
    logger.error('Certificate verification failed: Cryptographic signature mismatch (tampered record)', {
      certificateId,
    });
    return {
      valid: false,
      certificateId,
      recipientName: cert.recipientName,
      credentialTitle: cert.credentialTitle,
      status: 'tampered',
      error: 'Cryptographic signature mismatch. Credential verification failed.',
    };
  }

  return {
    valid: true,
    certificateId: cert.certificateId,
    recipientName: cert.recipientName,
    credentialTitle: cert.credentialTitle,
    assessmentId: cert.assessmentId,
    courseId: cert.courseId,
    score: cert.score,
    issuedAt: cert.issuedAt,
    status: 'valid',
    verifiedAt: new Date().toISOString(),
  };
}

/**
 * Cloud Function v2 Callable: issueCertificate
 *
 * Authenticated Firebase endpoint to issue an authoritative cryptographically signed certificate.
 */
export const issueCertificate = onCall(
  {
    secrets: CERTIFICATE_SECRETS,
    cors: true,
    maxInstances: 20,
  },
  async (request: CallableRequest<IssueCertificateData>): Promise<IssueCertificateResponse> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError(
        'unauthenticated',
        'User must be authenticated with Firebase Auth to claim a certificate.'
      );
    }

    const userId = request.auth.uid;
    return processCertificateIssuance(userId, request.data);
  }
);

/**
 * Cloud Function v2 Callable: verifyCertificate
 *
 * Publicly accessible Firebase endpoint to verify authentic credentials against HMAC signatures.
 */
export const verifyCertificate = onCall(
  {
    secrets: CERTIFICATE_SECRETS,
    cors: true,
    maxInstances: 20,
  },
  async (request: CallableRequest<VerifyCertificateData>): Promise<VerifyCertificateResponse> => {
    return processCertificateVerification(request.data);
  }
);
