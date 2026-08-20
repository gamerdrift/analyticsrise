import {
  processAssessmentStart,
  processAssessmentSubmission,
} from '../src/assessments';
import {
  processCertificateIssuance,
  processCertificateVerification,
  canonicalizeCertificatePayload,
  signCertificatePayload,
} from '../src/certificates';

function createMockFirestore() {
  const store = new Map<string, Map<string, any>>();

  const getCollection = (name: string) => {
    if (!store.has(name)) {
      store.set(name, new Map());
    }
    return store.get(name)!;
  };

  const applyUpdates = (target: any, updates: any) => {
    for (const [key, value] of Object.entries(updates)) {
      let resolvedValue = value;
      if (value && typeof value === 'object' && ('_methodName' in (value as any) || (value as any).constructor?.name === 'FieldValue')) {
        resolvedValue = new Date().toISOString();
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

describe('Mission 01C: Backend End-to-End User Journeys Verification', () => {
  const TEST_SECRET = 'ar_test_e2e_signing_secret_998877';
  let mockDb: any;

  beforeEach(() => {
    mockDb = createMockFirestore();
  });

  describe('Journey 1 — New Learner Full Assessment Flow', () => {
    test('Learner initializes assessment, receives sanitized payload, and gets authoritative server score', async () => {
      const learnerId = 'learner_new_101';
      const assessmentId = 'exam-sql';

      // 1. Server Attempt Initialization
      const startResult = await processAssessmentStart(
        learnerId,
        { assessmentId },
        mockDb
      );

      expect(startResult.attemptId).toBeDefined();
      expect(startResult.questions).toHaveLength(5);

      // Verify sanitized data contains zero answer keys
      startResult.questions.forEach((q: any) => {
        expect(q.correct).toBeUndefined();
        expect(q.correctIndex).toBeUndefined();
      });

      // 2. Learner submits answers
      const learnerAnswers = {
        sql_q1: 1,
        sql_q2: 1,
        sql_q3: 1,
        sql_q4: 1,
        sql_q5: 0,
      };

      const submitResult = await processAssessmentSubmission(
        learnerId,
        {
          attemptId: startResult.attemptId,
          answers: learnerAnswers,
        },
        mockDb
      );

      expect(submitResult.score).toBe(100);
      expect(submitResult.percentage).toBe(100);
      expect(submitResult.passed).toBe(true);
      expect(submitResult.certificateEligible).toBe(true);
    });
  });

  describe('Journey 2 — Successful Certification Lifecycle', () => {
    test('Pro learner passes exam, claims signed certificate, and passes public cryptographic verification', async () => {
      const learnerId = 'learner_pro_202';
      const assessmentId = 'exam-sql';

      // Seed user profile and pro entitlement
      await mockDb.collection('users').doc(learnerId).set({
        profile: {
          displayName: 'Elena Rostova',
          email: 'elena@analyticsrise.com',
        },
      });
      await mockDb.collection('entitlements').doc(learnerId).set({
        userId: learnerId,
        planId: 'pro',
        status: 'active',
        features: { certificateAccess: true },
      });

      // 1. Start & Pass Assessment
      const startRes = await processAssessmentStart(learnerId, { assessmentId }, mockDb);
      const submitRes = await processAssessmentSubmission(
        learnerId,
        {
          attemptId: startRes.attemptId,
          answers: { sql_q1: 1, sql_q2: 1, sql_q3: 1, sql_q4: 1, sql_q5: 0 },
        },
        mockDb
      );

      expect(submitRes.passed).toBe(true);

      // 2. Issue Certificate
      const issueResult = await processCertificateIssuance(
        learnerId,
        { submissionId: submitRes.submissionId },
        TEST_SECRET,
        mockDb
      );

      expect(issueResult.certificateId).toBe(`cert_${learnerId}_${assessmentId}`);
      expect(issueResult.recipientName).toBe('Elena Rostova');
      expect(issueResult.score).toBe(100);
      expect(issueResult.status).toBe('valid');

      // 3. Public Verification
      const verifyResult = await processCertificateVerification(
        { certificateId: issueResult.certificateId },
        TEST_SECRET,
        mockDb
      );

      expect(verifyResult.valid).toBe(true);
      expect(verifyResult.status).toBe('valid');
      expect(verifyResult.recipientName).toBe('Elena Rostova');
      expect(verifyResult.score).toBe(100);
    });
  });

  describe('Journey 3 — Failed Assessment Outcome', () => {
    test('Failing learner receives failed result and cannot issue certificate', async () => {
      const learnerId = 'learner_fail_303';
      const assessmentId = 'exam-sql';

      const startRes = await processAssessmentStart(learnerId, { assessmentId }, mockDb);
      const submitRes = await processAssessmentSubmission(
        learnerId,
        {
          attemptId: startRes.attemptId,
          answers: { sql_q1: 3, sql_q2: 3, sql_q3: 3, sql_q4: 3, sql_q5: 3 },
        },
        mockDb
      );

      expect(submitRes.score).toBe(0);
      expect(submitRes.percentage).toBe(0);
      expect(submitRes.passed).toBe(false);
      expect(submitRes.certificateEligible).toBe(false);

      // Certificate issuance must be rejected
      await expect(
        processCertificateIssuance(
          learnerId,
          { submissionId: submitRes.submissionId },
          TEST_SECRET,
          mockDb
        )
      ).rejects.toThrow(/did not achieve the required passing score/i);
    });
  });

  describe('Journey 4 — Unauthorized Plan Certification Rejection', () => {
    test('Free learner passing exam is rejected at certificate issuance due to missing entitlement', async () => {
      const learnerId = 'learner_free_404';
      const assessmentId = 'exam-sql';

      // Free user without certificate entitlement
      await mockDb.collection('users').doc(learnerId).set({
        profile: { displayName: 'Free Learner' },
      });
      await mockDb.collection('entitlements').doc(learnerId).set({
        userId: learnerId,
        planId: 'free',
        status: 'active',
        features: { certificateAccess: false },
      });

      const startRes = await processAssessmentStart(learnerId, { assessmentId }, mockDb);
      const submitRes = await processAssessmentSubmission(
        learnerId,
        {
          attemptId: startRes.attemptId,
          answers: { sql_q1: 1, sql_q2: 1, sql_q3: 1, sql_q4: 1, sql_q5: 0 },
        },
        mockDb
      );

      expect(submitRes.passed).toBe(true);

      // Certificate issuance should fail entitlement check
      await expect(
        processCertificateIssuance(
          learnerId,
          { submissionId: submitRes.submissionId },
          TEST_SECRET,
          mockDb
        )
      ).rejects.toThrow(/does not include verified certificate issuance/i);
    });
  });

  describe('Journey 5 — Anti-Tampering & Security Hardening', () => {
    test('Corrupted or modified certificate payload fails timing-safe signature verification', async () => {
      const legitimatePayload = {
        certificateId: 'cert_legit_505',
        userId: 'user_505',
        recipientName: 'Alex Rivera',
        credentialTitle: 'SQL Relational Optimization Certification',
        assessmentId: 'exam-sql',
        courseId: 'course_sql_mastery',
        score: 85,
        issuedAt: '2026-08-19T06:00:00.000Z',
        status: 'valid' as const,
      };

      const canonical = canonicalizeCertificatePayload(legitimatePayload);
      const signature = signCertificatePayload(canonical, TEST_SECRET);

      // Store in DB with tampered credentialTitle
      await mockDb.collection('certificates').doc('cert_legit_505').set({
        ...legitimatePayload,
        credentialTitle: 'Master Principal Architect', // tampered title!
        signature,
      });

      const verifyResult = await processCertificateVerification(
        { certificateId: 'cert_legit_505' },
        TEST_SECRET,
        mockDb
      );

      expect(verifyResult.valid).toBe(false);
      expect(verifyResult.status).toBe('tampered');
      expect(verifyResult.error).toMatch(/cryptographic signature mismatch/i);
    });
  });
});
