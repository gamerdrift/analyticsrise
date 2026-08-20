import {
  claimCertificate,
  verifyCertificateStatus,
  fetchUserCertificates,
} from '../lib/services/certificateService';
import { functions, db } from '../lib/firebase/config';
import { httpsCallable } from 'firebase/functions';
import { getDocs } from 'firebase/firestore';

describe('Certificate Frontend Service Contracts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Claim Certificate Flow', () => {
    test('Invokes issueCertificate Cloud Function with submissionId only', async () => {
      const mockCallable = jest.fn().mockResolvedValue({
        data: {
          certificateId: 'cert_user123_exam-sql',
          recipientName: 'Elena Rostova',
          credentialTitle: 'SQL Relational Optimization Certification',
          assessmentId: 'exam-sql',
          courseId: 'course_sql_mastery',
          score: 100,
          issuedAt: '2026-08-19T06:10:00.000Z',
          verificationUrl: 'https://analyticsrise.com/verify/cert_user123_exam-sql',
          status: 'valid',
          isDuplicate: false,
        },
      });
      (httpsCallable as jest.Mock).mockReturnValue(mockCallable);

      const res = await claimCertificate('sub_123456789');

      expect(httpsCallable).toHaveBeenCalledWith(functions, 'issueCertificate');
      expect(mockCallable).toHaveBeenCalledWith({ submissionId: 'sub_123456789' });
      expect(res.certificateId).toBe('cert_user123_exam-sql');
      expect(res.recipientName).toBe('Elena Rostova');
    });

    test('Handles entitlement rejection error from server gracefully', async () => {
      const mockCallable = jest
        .fn()
        .mockRejectedValue(new Error('Certificate issuance requires an active Pro plan.'));
      (httpsCallable as jest.Mock).mockReturnValue(mockCallable);

      await expect(claimCertificate('sub_unentitled')).rejects.toThrow(
        'Certificate issuance requires an active Pro plan.'
      );
    });
  });

  describe('2. Verify Certificate Status Flow', () => {
    test('Invokes verifyCertificate Cloud Function with certificateId and returns validation result', async () => {
      const mockCallable = jest.fn().mockResolvedValue({
        data: {
          valid: true,
          certificateId: 'cert_user123_exam-sql',
          recipientName: 'Elena Rostova',
          credentialTitle: 'SQL Relational Optimization Certification',
          assessmentId: 'exam-sql',
          courseId: 'course_sql_mastery',
          score: 100,
          issuedAt: '2026-08-19T06:10:00.000Z',
          status: 'valid',
          verifiedAt: '2026-08-19T06:15:00.000Z',
        },
      });
      (httpsCallable as jest.Mock).mockReturnValue(mockCallable);

      const res = await verifyCertificateStatus('cert_user123_exam-sql');

      expect(httpsCallable).toHaveBeenCalledWith(functions, 'verifyCertificate');
      expect(mockCallable).toHaveBeenCalledWith({ certificateId: 'cert_user123_exam-sql' });
      expect(res.valid).toBe(true);
      expect(res.status).toBe('valid');
    });

    test('Returns tampered/invalid signature state for corrupted certificates', async () => {
      const mockCallable = jest.fn().mockResolvedValue({
        data: {
          valid: false,
          certificateId: 'cert_tampered',
          status: 'tampered',
          error: 'Certificate cryptographic signature mismatch.',
        },
      });
      (httpsCallable as jest.Mock).mockReturnValue(mockCallable);

      const res = await verifyCertificateStatus('cert_tampered');

      expect(res.valid).toBe(false);
      expect(res.status).toBe('tampered');
    });
  });

  describe('3. Fetch User Certificates Shelf', () => {
    test('Queries Firestore /certificates for the authenticated user only', async () => {
      const mockDocs = [
        {
          id: 'cert_1',
          data: () => ({
            certificateId: 'cert_1',
            userId: 'user_123',
            recipientName: 'Alex Rivera',
            credentialTitle: 'Certified SQL Relational Expert',
            score: 95,
            issuedAt: '2026-08-01T00:00:00.000Z',
            status: 'valid',
          }),
        },
      ];
      (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

      const certs = await fetchUserCertificates('user_123');

      expect(certs).toHaveLength(1);
      expect(certs[0].certificateId).toBe('cert_1');
      expect(certs[0].recipientName).toBe('Alex Rivera');
    });
  });
});
