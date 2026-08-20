import {
  canonicalizeCertificatePayload,
  signCertificatePayload,
  verifyCertificateSignature,
  processCertificateIssuance,
  processCertificateVerification,
} from '../src/certificates';

/**
 * Mock Firestore in-memory database helper for unit testing Cloud Functions
 */
function createMockFirestore() {
  const store = new Map<string, Map<string, any>>();

  const getCollection = (colName: string) => {
    if (!store.has(colName)) {
      store.set(colName, new Map<string, any>());
    }
    return store.get(colName)!;
  };

  const applyUpdates = (target: any, updates: Record<string, any>) => {
    for (const [key, value] of Object.entries(updates)) {
      let resolvedValue = value;
      if (value && typeof value === 'object') {
        if ('operand' in (value as any)) {
          resolvedValue = (value as any).operand;
        } else if (typeof (value as any).isEqual === 'function') {
          resolvedValue = 1;
        }
      }

      if (key.includes('.')) {
        const parts = key.split('.');
        let current = target;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        const lastKey = parts[parts.length - 1];
        if (value && typeof value === 'object' && ('operand' in (value as any) || (value as any)._methodName === 'FieldValue.increment')) {
          const inc = (value as any).operand ?? 1;
          current[lastKey] = (current[lastKey] || 0) + inc;
        } else {
          current[lastKey] = resolvedValue;
        }
      } else {
        if (value && typeof value === 'object' && ('operand' in (value as any) || (value as any)._methodName === 'FieldValue.increment')) {
          const inc = (value as any).operand ?? 1;
          target[key] = (target[key] || 0) + inc;
        } else {
          target[key] = resolvedValue;
        }
      }
    }
  };

  const firestore: any = {
    _store: store,
    collection: (colName: string) => {
      const col = getCollection(colName);
      return {
        doc: (docId: string) => ({
          get: async () => {
            const data = col.get(docId);
            return {
              exists: !!data,
              data: () => (data ? JSON.parse(JSON.stringify(data)) : null),
              id: docId,
            };
          },
          set: async (data: any, options?: any) => {
            if (options?.merge && col.has(docId)) {
              const existing = col.get(docId) || {};
              applyUpdates(existing, data);
              col.set(docId, existing);
            } else {
              col.set(docId, JSON.parse(JSON.stringify(data)));
            }
          },
          update: async (data: any) => {
            if (!col.has(docId)) throw new Error(`Document ${docId} not found`);
            const existing = col.get(docId);
            applyUpdates(existing, data);
            col.set(docId, existing);
          },
        }),
      };
    },
    runTransaction: async (updateFunction: (transaction: any) => Promise<any>) => {
      const transaction = {
        get: async (docRef: any) => docRef.get(),
        set: async (docRef: any, data: any) => docRef.set(data),
        update: async (docRef: any, data: any) => docRef.update(data),
      };
      return updateFunction(transaction);
    },
  };

  return firestore;
}

describe('Mission 01C: Server-Authoritative Certificate Authority & Verification', () => {
  let mockDb: any;
  const testSecret = 'secret_hmac_key_test_mission01c_analyticsrise_9988';
  const testUserId = 'usr_student_pro_123';

  beforeEach(async () => {
    mockDb = createMockFirestore();

    // Seed Pro User Profile
    await mockDb.collection('users').doc(testUserId).set({
      profile: {
        displayName: 'Elena Rostova',
        email: 'elena@analyticsrise.com',
        role: 'student',
      },
      telemetry: {
        xp: 1500,
        certificatesEarned: 0,
      },
    });

    // Seed Active Pro Entitlement (certificateAccess: true)
    await mockDb.collection('entitlements').doc(testUserId).set({
      userId: testUserId,
      planId: 'pro',
      planName: 'Professional Pro',
      status: 'active',
      features: {
        certificateAccess: true,
        aiMentorQuota: -1,
        simulatorHours: -1,
      },
    });

    // Seed Passed Assessment Submission
    await mockDb.collection('submissions').doc('sub_passed_sql_100').set({
      submissionId: 'sub_passed_sql_100',
      userId: testUserId,
      assessmentId: 'exam-sql',
      attemptId: 'att_test_100',
      score: 100,
      totalPoints: 100,
      percentage: 100,
      passed: true,
      submittedAt: new Date().toISOString(),
    });

    // Seed Failed Assessment Submission
    await mockDb.collection('submissions').doc('sub_failed_sql_40').set({
      submissionId: 'sub_failed_sql_40',
      userId: testUserId,
      assessmentId: 'exam-sql',
      attemptId: 'att_test_40',
      score: 40,
      totalPoints: 100,
      percentage: 40,
      passed: false,
      submittedAt: new Date().toISOString(),
    });
  });

  describe('1. Canonical Payload & HMAC-SHA256 Cryptographic Signing', () => {
    const samplePayload = {
      certificateId: 'cert_usr123_exam-sql',
      userId: 'usr_student_pro_123',
      assessmentId: 'exam-sql',
      courseId: 'sql-01',
      credentialTitle: 'Certified SQL Relational Expert',
      issuedAt: '2026-06-30T12:00:00.000Z',
    };

    test('canonicalizeCertificatePayload produces deterministic string', () => {
      const canonical1 = canonicalizeCertificatePayload(samplePayload);
      const canonical2 = canonicalizeCertificatePayload({ ...samplePayload });
      expect(canonical1).toBe(canonical2);
      expect(canonical1).toBe(
        'v1|cert_usr123_exam-sql|usr_student_pro_123|exam-sql|sql-01|Certified SQL Relational Expert|2026-06-30T12:00:00.000Z'
      );
    });

    test('signCertificatePayload generates valid 64-char hex HMAC-SHA256 signature', () => {
      const canonical = canonicalizeCertificatePayload(samplePayload);
      const signature = signCertificatePayload(canonical, testSecret);
      expect(signature).toMatch(/^[a-f0-9]{64}$/);
    });

    test('verifyCertificateSignature returns true for valid authentic signature', () => {
      const canonical = canonicalizeCertificatePayload(samplePayload);
      const signature = signCertificatePayload(canonical, testSecret);
      const isValid = verifyCertificateSignature(canonical, signature, testSecret);
      expect(isValid).toBe(true);
    });

    test('verifyCertificateSignature returns false if payload has been tampered with', () => {
      const canonical = canonicalizeCertificatePayload(samplePayload);
      const signature = signCertificatePayload(canonical, testSecret);
      const tamperedCanonical = canonicalizeCertificatePayload({
        ...samplePayload,
        credentialTitle: 'Hacked Fake Master Credential',
      });
      const isValid = verifyCertificateSignature(tamperedCanonical, signature, testSecret);
      expect(isValid).toBe(false);
    });

    test('verifyCertificateSignature returns false for wrong secret key', () => {
      const canonical = canonicalizeCertificatePayload(samplePayload);
      const signature = signCertificatePayload(canonical, testSecret);
      const isValid = verifyCertificateSignature(canonical, signature, 'wrong_attacker_secret');
      expect(isValid).toBe(false);
    });
  });

  describe('2. Authoritative Certificate Issuance (processCertificateIssuance)', () => {
    test('Rejects unauthenticated certificate issuance', async () => {
      await expect(
        processCertificateIssuance('', { submissionId: 'sub_passed_sql_100' }, testSecret, mockDb)
      ).rejects.toThrow(/must be authenticated/i);
    });

    test('Rejects non-existent submission record', async () => {
      await expect(
        processCertificateIssuance(testUserId, { submissionId: 'sub_nonexistent' }, testSecret, mockDb)
      ).rejects.toThrow(/not found/i);
    });

    test('Rejects issuance if submission belongs to another user', async () => {
      await expect(
        processCertificateIssuance('usr_other_hacker_777', { submissionId: 'sub_passed_sql_100' }, testSecret, mockDb)
      ).rejects.toThrow(/not authorized/i);
    });

    test('Rejects issuance if assessment submission did not achieve passing grade', async () => {
      await expect(
        processCertificateIssuance(testUserId, { submissionId: 'sub_failed_sql_40' }, testSecret, mockDb)
      ).rejects.toThrow(/did not achieve the required passing score/i);
    });

    test('Rejects issuance if user is on Free / Guest plan without certificateAccess', async () => {
      const freeUser = 'usr_free_tier_555';
      await mockDb.collection('entitlements').doc(freeUser).set({
        userId: freeUser,
        planId: 'free',
        status: 'active',
        features: { certificateAccess: false },
      });

      await mockDb.collection('submissions').doc('sub_free_passed_100').set({
        submissionId: 'sub_free_passed_100',
        userId: freeUser,
        assessmentId: 'exam-sql',
        passed: true,
        percentage: 100,
      });

      await expect(
        processCertificateIssuance(freeUser, { submissionId: 'sub_free_passed_100' }, testSecret, mockDb)
      ).rejects.toThrow(/membership plan does not include verified certificate issuance/i);
    });

    test('Successfully issues official signed certificate for eligible passing learner', async () => {
      const cert = await processCertificateIssuance(
        testUserId,
        { submissionId: 'sub_passed_sql_100' },
        testSecret,
        mockDb
      );

      expect(cert.certificateId).toBe(`cert_${testUserId}_exam-sql`);
      expect(cert.recipientName).toBe('Elena Rostova');
      expect(cert.credentialTitle).toBe('SQL Relational Optimization Certification');
      expect(cert.courseId).toBe('sql-01');
      expect(cert.score).toBe(100);
      expect(cert.status).toBe('valid');
      expect(cert.isDuplicate).toBe(false);
      expect(cert.verificationUrl).toBe(`https://analyticsrise.com/verify/${cert.certificateId}`);

      // Verify certificate document was persisted in /certificates/{certId}
      const certDocSnap = await mockDb.collection('certificates').doc(cert.certificateId).get();
      expect(certDocSnap.exists).toBe(true);
      const certDoc = certDocSnap.data();
      expect(certDoc.userId).toBe(testUserId);
      expect(certDoc.signature).toMatch(/^[a-f0-9]{64}$/);

      // Verify user telemetry incremented certificatesEarned and awarded XP
      const userDocSnap = await mockDb.collection('users').doc(testUserId).get();
      const userDoc = userDocSnap.data();
      expect(userDoc.telemetry.certificatesEarned).toBe(1);
      expect(userDoc.telemetry.xp).toBe(2000); // 1500 + 500
    });

    test('Idempotency: Repeated issuance requests return existing certificate without creating duplicates', async () => {
      // First issuance
      const cert1 = await processCertificateIssuance(
        testUserId,
        { submissionId: 'sub_passed_sql_100' },
        testSecret,
        mockDb
      );
      expect(cert1.isDuplicate).toBe(false);

      // Second issuance (e.g. double-click / retry)
      const cert2 = await processCertificateIssuance(
        testUserId,
        { submissionId: 'sub_passed_sql_100' },
        testSecret,
        mockDb
      );

      expect(cert2.isDuplicate).toBe(true);
      expect(cert2.certificateId).toBe(cert1.certificateId);
      expect(cert2.issuedAt).toBe(cert1.issuedAt);

      // Verify user telemetry was NOT incremented a second time
      const userDocSnap = await mockDb.collection('users').doc(testUserId).get();
      const userDoc = userDocSnap.data();
      expect(userDoc.telemetry.certificatesEarned).toBe(1);
    });
  });

  describe('3. Authoritative Certificate Verification (processCertificateVerification)', () => {
    let validCertId: string;

    beforeEach(async () => {
      const issued = await processCertificateIssuance(
        testUserId,
        { submissionId: 'sub_passed_sql_100' },
        testSecret,
        mockDb
      );
      validCertId = issued.certificateId;
    });

    test('Verifies valid official certificate successfully', async () => {
      const result = await processCertificateVerification(
        { certificateId: validCertId },
        testSecret,
        mockDb
      );

      expect(result.valid).toBe(true);
      expect(result.certificateId).toBe(validCertId);
      expect(result.recipientName).toBe('Elena Rostova');
      expect(result.credentialTitle).toBe('SQL Relational Optimization Certification');
      expect(result.status).toBe('valid');
      expect(result.score).toBe(100);
      expect(result.verifiedAt).toBeDefined();

      // Ensure no private secrets leaked in response and no standalone userId property
      const rawRes = JSON.stringify(result);
      expect(rawRes).not.toMatch(new RegExp(testSecret));
      expect((result as any).userId).toBeUndefined();
    });

    test('Returns valid: false with status not_found for unknown certificate ID', async () => {
      const result = await processCertificateVerification(
        { certificateId: 'cert_unknown_fake_999' },
        testSecret,
        mockDb
      );

      expect(result.valid).toBe(false);
      expect(result.status).toBe('not_found');
      expect(result.error).toMatch(/not found/i);
    });

    test('Returns valid: false with status tampered if certificate data modified in database', async () => {
      // Attacker tampers with score in database directly
      const certDocSnap = await mockDb.collection('certificates').doc(validCertId).get();
      const originalDoc = certDocSnap.data();
      await mockDb.collection('certificates').doc(validCertId).set({
        ...originalDoc,
        credentialTitle: 'Master Senior Director Data Officer Certification',
      });

      const result = await processCertificateVerification(
        { certificateId: validCertId },
        testSecret,
        mockDb
      );

      expect(result.valid).toBe(false);
      expect(result.status).toBe('tampered');
      expect(result.error).toMatch(/signature mismatch/i);
    });

    test('Returns valid: false with status revoked if certificate has been revoked', async () => {
      const certDocSnap = await mockDb.collection('certificates').doc(validCertId).get();
      const originalDoc = certDocSnap.data();
      await mockDb.collection('certificates').doc(validCertId).set({
        ...originalDoc,
        status: 'revoked',
      });

      const result = await processCertificateVerification(
        { certificateId: validCertId },
        testSecret,
        mockDb
      );

      expect(result.valid).toBe(false);
      expect(result.status).toBe('revoked');
      expect(result.error).toMatch(/has been revoked/i);
    });
  });
});
