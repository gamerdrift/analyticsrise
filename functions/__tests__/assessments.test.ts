import {
  processAssessmentStart,
  processAssessmentSubmission,
  getSanitizedAssessment,
  getAssessmentAnswerKey,
} from '../src/assessments';

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
              data: () => (data ? { ...data } : null),
              id: docId,
            };
          },
          set: async (data: any, options?: any) => {
            if (options?.merge && col.has(docId)) {
              col.set(docId, { ...col.get(docId), ...data });
            } else {
              col.set(docId, { ...data });
            }
          },
          update: async (data: any) => {
            if (!col.has(docId)) throw new Error(`Document ${docId} not found`);
            col.set(docId, { ...col.get(docId), ...data });
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

describe('Mission 01C: Server-Authoritative Assessment & Scoring Engine', () => {
  let mockDb: any;
  const testUserId = 'usr_student_9988';

  beforeEach(() => {
    mockDb = createMockFirestore();
  });

  describe('1. Private Answer Key Isolation & Sanitization', () => {
    test('getSanitizedAssessment returns assessment without answer keys or correct indices', async () => {
      const sqlMeta = await getSanitizedAssessment('exam-sql', mockDb);
      expect(sqlMeta).not.toBeNull();
      expect(sqlMeta?.id).toBe('exam-sql');
      expect(sqlMeta?.questions.length).toBe(5);

      sqlMeta?.questions.forEach((q) => {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('text');
        expect(q).toHaveProperty('options');
        expect(q).toHaveProperty('points');
        expect(q).not.toHaveProperty('correct');
        expect(q).not.toHaveProperty('correctIndex');
        expect(q).not.toHaveProperty('answer');
      });
    });

    test('Private answer key is accessible exclusively on the server', async () => {
      const sqlKey = await getAssessmentAnswerKey('exam-sql', mockDb);
      expect(sqlKey).not.toBeNull();
      expect(sqlKey?.keys.sql_q1.correctIndex).toBe(1);
      expect(sqlKey?.keys.sql_q5.correctIndex).toBe(0);
    });
  });

  describe('2. Assessment Attempt Creation (processAssessmentStart)', () => {
    test('Rejects unauthenticated start requests', async () => {
      await expect(
        processAssessmentStart('', { assessmentId: 'exam-sql' }, mockDb)
      ).rejects.toThrow(/must be authenticated/i);
    });

    test('Rejects unknown assessment ID with not-found', async () => {
      await expect(
        processAssessmentStart(testUserId, { assessmentId: 'exam-nonexistent' }, mockDb)
      ).rejects.toThrow(/does not exist/i);
    });

    test('Rejects missing or invalid input payload', async () => {
      await expect(
        processAssessmentStart(testUserId, null as any, mockDb)
      ).rejects.toThrow(/invalid.*parameter/i);
    });

    test('Creates valid timed attempt in Firestore and returns sanitized questions', async () => {
      const response = await processAssessmentStart(testUserId, { assessmentId: 'exam-sql' }, mockDb);

      expect(response.attemptId).toMatch(/^att_/);
      expect(response.assessmentId).toBe('exam-sql');
      expect(response.durationMinutes).toBe(10);
      expect(response.passingScore).toBe(80);
      expect(response.questions.length).toBe(5);

      // Verify attempt is recorded in /assessmentAttempts/{attemptId}
      const attemptDoc = mockDb._store.get('assessmentAttempts')?.get(response.attemptId);
      expect(attemptDoc).toBeDefined();
      expect(attemptDoc.userId).toBe(testUserId);
      expect(attemptDoc.status).toBe('in_progress');
      expect(attemptDoc.durationMinutes).toBe(10);

      // Verify response never contains private answer keys
      const rawString = JSON.stringify(response);
      expect(rawString).not.toMatch(/correctIndex/i);
    });
  });

  describe('3. Server-Authoritative Submission & Scoring (processAssessmentSubmission)', () => {
    let activeAttemptId: string;

    beforeEach(async () => {
      const startRes = await processAssessmentStart(testUserId, { assessmentId: 'exam-sql' }, mockDb);
      activeAttemptId = startRes.attemptId;
    });

    test('Rejects unauthenticated submission requests', async () => {
      await expect(
        processAssessmentSubmission('', { attemptId: activeAttemptId, answers: {} }, mockDb)
      ).rejects.toThrow(/must be authenticated/i);
    });

    test('Rejects submission for non-existent attempt', async () => {
      await expect(
        processAssessmentSubmission(testUserId, { attemptId: 'att_invalid_999', answers: {} }, mockDb)
      ).rejects.toThrow(/not found/i);
    });

    test('Enforces attempt ownership (rejects other user attempt)', async () => {
      await expect(
        processAssessmentSubmission('usr_attacker_666', { attemptId: activeAttemptId, answers: {} }, mockDb)
      ).rejects.toThrow(/not authorized/i);
    });

    test('Rejects invalid question ID in answers map', async () => {
      await expect(
        processAssessmentSubmission(testUserId, {
          attemptId: activeAttemptId,
          answers: { 'sql_fake_question_99': 1 },
        }, mockDb)
      ).rejects.toThrow(/unknown or unrecognized question id/i);
    });

    test('Rejects out-of-bounds option index', async () => {
      await expect(
        processAssessmentSubmission(testUserId, {
          attemptId: activeAttemptId,
          answers: { 'sql_q1': 99 }, // Options length is 4
        }, mockDb)
      ).rejects.toThrow(/out of bounds/i);
    });

    test('Rejects negative option index', async () => {
      await expect(
        processAssessmentSubmission(testUserId, {
          attemptId: activeAttemptId,
          answers: { 'sql_q1': -1 },
        }, mockDb)
      ).rejects.toThrow(/non-negative integer/i);
    });

    test('Calculates perfect score (100%) and records passing submission', async () => {
      const perfectAnswers = {
        sql_q1: 1,
        sql_q2: 1,
        sql_q3: 1,
        sql_q4: 1,
        sql_q5: 0,
      };

      const result = await processAssessmentSubmission(testUserId, {
        attemptId: activeAttemptId,
        answers: perfectAnswers,
      }, mockDb);

      expect(result.score).toBe(100);
      expect(result.totalPoints).toBe(100);
      expect(result.percentage).toBe(100);
      expect(result.passed).toBe(true);
      expect(result.certificateEligible).toBe(true);
      expect(result.submissionId).toBe(`sub_${activeAttemptId}`);

      // Verify official submission persisted in /submissions
      const submissionDoc = mockDb._store.get('submissions')?.get(result.submissionId);
      expect(submissionDoc).toBeDefined();
      expect(submissionDoc.userId).toBe(testUserId);
      expect(submissionDoc.score).toBe(100);
      expect(submissionDoc.passed).toBe(true);

      // Verify attempt marked as submitted
      const attemptDoc = mockDb._store.get('assessmentAttempts')?.get(activeAttemptId);
      expect(attemptDoc.status).toBe('submitted');
    });

    test('Calculates failing score (20%) when answers are mostly incorrect', async () => {
      const failingAnswers = {
        sql_q1: 1, // Correct (+20)
        sql_q2: 0, // Wrong
        sql_q3: 0, // Wrong
        sql_q4: 0, // Wrong
        sql_q5: 3, // Wrong
      };

      const result = await processAssessmentSubmission(testUserId, {
        attemptId: activeAttemptId,
        answers: failingAnswers,
      }, mockDb);

      expect(result.score).toBe(20);
      expect(result.percentage).toBe(20);
      expect(result.passed).toBe(false);
      expect(result.certificateEligible).toBe(false);
    });

    test('Calculates exactly 80% passing threshold for 4/5 correct answers', async () => {
      const passingAnswers = {
        sql_q1: 1, // Correct
        sql_q2: 1, // Correct
        sql_q3: 1, // Correct
        sql_q4: 1, // Correct
        sql_q5: 3, // Wrong
      };

      const result = await processAssessmentSubmission(testUserId, {
        attemptId: activeAttemptId,
        answers: passingAnswers,
      }, mockDb);

      expect(result.score).toBe(80);
      expect(result.percentage).toBe(80);
      expect(result.passed).toBe(true);
      expect(result.certificateEligible).toBe(true);
    });

    test('Prevents duplicate submission of the same attempt', async () => {
      const validAnswers = { sql_q1: 1, sql_q2: 1, sql_q3: 1, sql_q4: 1, sql_q5: 0 };

      // First submission
      await processAssessmentSubmission(testUserId, {
        attemptId: activeAttemptId,
        answers: validAnswers,
      }, mockDb);

      // Duplicate submission
      await expect(
        processAssessmentSubmission(testUserId, {
          attemptId: activeAttemptId,
          answers: validAnswers,
        }, mockDb)
      ).rejects.toThrow(/already been submitted/i);
    });

    test('Rejects submissions after attempt expiration deadline', async () => {
      // Artificially expire the attempt in database
      const expiredDate = new Date(Date.now() - 5000);
      const attemptCol = mockDb._store.get('assessmentAttempts')!;
      const attemptDoc = attemptCol.get(activeAttemptId);
      attemptCol.set(activeAttemptId, {
        ...attemptDoc,
        expiresAt: { toDate: () => expiredDate },
      });

      await expect(
        processAssessmentSubmission(testUserId, {
          attemptId: activeAttemptId,
          answers: { sql_q1: 1 },
        }, mockDb)
      ).rejects.toThrow(/deadline has expired/i);
    });
  });
});
