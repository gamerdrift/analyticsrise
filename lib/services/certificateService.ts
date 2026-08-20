import { httpsCallable } from 'firebase/functions';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, functions } from '@/lib/firebase/config';

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

export interface UserCertificateRecord {
  id: string;
  certificateId: string;
  userId: string;
  recipientName: string;
  credentialTitle: string;
  assessmentId: string;
  courseId: string;
  score: number;
  issuedAt: string;
  status: 'valid' | 'revoked';
  verificationUrl: string;
}

/**
 * Claim/Issue official cryptographically signed certificate via Cloud Function.
 */
export async function claimCertificate(submissionId: string): Promise<IssueCertificateResponse> {
  const issueFn = httpsCallable<{ submissionId: string }, IssueCertificateResponse>(
    functions,
    'issueCertificate'
  );
  const result = await issueFn({ submissionId });
  return result.data;
}

/**
 * Publicly verify certificate authenticity via Cloud Function.
 */
export async function verifyCertificateStatus(certificateId: string): Promise<VerifyCertificateResponse> {
  const verifyFn = httpsCallable<{ certificateId: string }, VerifyCertificateResponse>(
    functions,
    'verifyCertificate'
  );
  const result = await verifyFn({ certificateId });
  return result.data;
}

/**
 * Retrieve authentic user certificates from Firestore.
 */
export async function fetchUserCertificates(userId: string): Promise<UserCertificateRecord[]> {
  try {
    const certsRef = collection(db, 'certificates');
    const q = query(certsRef, where('userId', '==', userId));
    const snap = await getDocs(q);

    return snap.docs.map((doc: any) => {
      const d = doc.data();
      return {
        id: doc.id,
        certificateId: d.certificateId || doc.id,
        userId: d.userId,
        recipientName: d.recipientName || 'AnalyticsRise Scholar',
        credentialTitle: d.credentialTitle || 'AnalyticsRise Certification',
        assessmentId: d.assessmentId || '',
        courseId: d.courseId || '',
        score: Number(d.score) || 100,
        issuedAt: d.issuedAt || new Date().toISOString(),
        status: d.status || 'valid',
        verificationUrl: d.verificationUrl || `https://analyticsrise.com/verify/${doc.id}`,
      };
    });
  } catch (err) {
    console.error('Error fetching user certificates:', err);
    return [];
  }
}
