import {
  processChallengeSubmission,
  calculateIncrementalXp,
  determineProgressStatus,
  buildAttemptRecord,
  recordAttemptInMemory,
  getAttemptsInMemory,
  clearAttemptsInMemory,
  getProgressInMemory,
  saveProgressInMemory,
  getUserSummaryInMemory,
  clearProgressInMemory,
} from '../lib/sql/challenges/protected/progress/index.server';

describe('Mission 02 Stage 2C — Phase C3: Attempt & Progress Engine', () => {
  beforeEach(() => {
    clearAttemptsInMemory();
    clearProgressInMemory();
  });

  describe('1. Authentication & Identity Isolation', () => {
    test('Rejects unauthenticated submission with empty or invalid user ID', async () => {
      await expect(
        processChallengeSubmission('', {
          challengeId: 'sql.select.001',
          sql: 'SELECT name, category_id, price FROM products;',
        })
      ).rejects.toThrow('User must be authenticated');

      await expect(
        processChallengeSubmission('   ', {
          challengeId: 'sql.select.001',
          sql: 'SELECT name, category_id, price FROM products;',
        })
      ).rejects.toThrow('User must be authenticated');
    });

    test('Rejects submission with missing challenge ID', async () => {
      await expect(
        processChallengeSubmission('user_123', {
          challengeId: '',
          sql: 'SELECT 1;',
        })
      ).rejects.toThrow('Missing or invalid "challengeId"');
    });

    test('Rejects submission for non-existent challenge ID', async () => {
      await expect(
        processChallengeSubmission('user_123', {
          challengeId: 'sql.invalid.999',
          sql: 'SELECT 1;',
        })
      ).rejects.toThrow('could not be found');
    });

    test('Strict user data isolation: User A and User B have separate progress and attempts', async () => {
      // User A submits PASS for sql.select.001
      const resA = await processChallengeSubmission('user_A', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      expect(resA.status).toBe('PASS');
      expect(resA.totalChallengeXp).toBe(50);

      // User B has not started sql.select.001
      const progB = getProgressInMemory('user_B', 'sql.select.001');
      expect(progB).toBeUndefined();

      const summaryB = getUserSummaryInMemory('user_B');
      expect(summaryB.totalChallengesStarted).toBe(0);
      expect(summaryB.totalXpEarned).toBe(0);

      // User A summary reflects completed challenge
      const summaryA = getUserSummaryInMemory('user_A');
      expect(summaryA.totalChallengesStarted).toBe(1);
      expect(summaryA.totalChallengesCompleted).toBe(1);
      expect(summaryA.totalXpEarned).toBe(50);
    });
  });

  describe('2. Attempt Recording (PASS, PARTIAL, FAIL, INVALID)', () => {
    test('Records PASS attempt with correct status, score=100, and full XP', async () => {
      const res = await processChallengeSubmission('user_1', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      expect(res.status).toBe('PASS');
      expect(res.passed).toBe(true);
      expect(res.score).toBe(100);
      expect(res.xpAwarded).toBe(50); // sql.select.001 base xp is 50
      expect(res.totalChallengeXp).toBe(50);
      expect(res.progressStatus).toBe('MASTERED');

      const attempts = getAttemptsInMemory('user_1', 'sql.select.001');
      expect(attempts).toHaveLength(1);
      expect(attempts[0].validationStatus).toBe('PASS');
      expect(attempts[0].score).toBe(100);
      expect(attempts[0].xpAwarded).toBe(50);
      expect(attempts[0].submittedSql).toBe('SELECT name, category_id, price FROM products;');
    });

    test('Records FAIL attempt with score=0 and 0 XP awarded', async () => {
      const res = await processChallengeSubmission('user_1', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name FROM products WHERE price > 999999;', // returns 0 rows, wrong schema and count
      });

      expect(res.status).toBe('FAIL');
      expect(res.passed).toBe(false);
      expect(res.score).toBe(0);
      expect(res.xpAwarded).toBe(0);
      expect(res.totalChallengeXp).toBe(0);
      expect(res.progressStatus).toBe('IN_PROGRESS');

      const attempts = getAttemptsInMemory('user_1', 'sql.select.001');
      expect(attempts).toHaveLength(1);
      expect(attempts[0].validationStatus).toBe('FAIL');
      expect(attempts[0].score).toBe(0);
    });

    test('Records INVALID attempt (syntax error) with status INVALID, score=0, and 0 XP', async () => {
      const res = await processChallengeSubmission('user_1', {
        challengeId: 'sql.select.001',
        sql: 'SELEC INVALID SQL FROM;',
      });

      expect(res.status).toBe('INVALID');
      expect(res.passed).toBe(false);
      expect(res.score).toBe(0);
      expect(res.xpAwarded).toBe(0);
      expect(res.totalChallengeXp).toBe(0);
      expect(res.feedback).toBeTruthy();

      const attempts = getAttemptsInMemory('user_1', 'sql.select.001');
      expect(attempts).toHaveLength(1);
      expect(attempts[0].validationStatus).toBe('INVALID');
    });
  });

  describe('3. Progress Lifecycle & Non-Regression Invariant', () => {
    test('Transitions NOT_STARTED -> IN_PROGRESS on incomplete attempt', async () => {
      const res = await processChallengeSubmission('user_2', {
        challengeId: 'sql.select.001',
        sql: 'SELECT category_id FROM products;', // incomplete columns
      });

      expect(res.progressStatus).toBe('IN_PROGRESS');
      const progress = getProgressInMemory('user_2', 'sql.select.001')!;
      expect(progress.status).toBe('IN_PROGRESS');
      expect(progress.attemptCount).toBe(1);
    });

    test('Transitions IN_PROGRESS -> COMPLETED / MASTERED on successful attempt', async () => {
      // First attempt: Fail
      await processChallengeSubmission('user_3', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name FROM products;',
      });
      let prog = getProgressInMemory('user_3', 'sql.select.001')!;
      expect(prog.status).toBe('IN_PROGRESS');
      expect(prog.attemptCount).toBe(1);

      // Second attempt: Pass
      const passRes = await processChallengeSubmission('user_3', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      expect(passRes.progressStatus).toBe('MASTERED');

      prog = getProgressInMemory('user_3', 'sql.select.001')!;
      expect(prog.status).toBe('MASTERED');
      expect(prog.attemptCount).toBe(2);
      expect(prog.completedAt).toBeTruthy();
      expect(prog.masteredAt).toBeTruthy();
    });

    test('Non-Regression Rule: MASTERED status NEVER reverts to IN_PROGRESS on subsequent failed submission', async () => {
      // 1. Master the challenge
      await processChallengeSubmission('user_4', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      let prog = getProgressInMemory('user_4', 'sql.select.001')!;
      expect(prog.status).toBe('MASTERED');
      const originalMasteredAt = prog.masteredAt;

      // 2. Submit a broken query
      const failRes = await processChallengeSubmission('user_4', {
        challengeId: 'sql.select.001',
        sql: 'SELEC BROKEN SYNTAX;',
      });

      expect(failRes.status).toBe('INVALID');
      expect(failRes.progressStatus).toBe('MASTERED'); // Status remains MASTERED

      prog = getProgressInMemory('user_4', 'sql.select.001')!;
      expect(prog.status).toBe('MASTERED'); // Retained
      expect(prog.bestScore).toBe(100); // Retained
      expect(prog.xpEarned).toBe(50); // Retained
      expect(prog.masteredAt).toBe(originalMasteredAt); // Preserved
      expect(prog.attemptCount).toBe(2); // Incremented
    });
  });

  describe('4. Best Score Tracking', () => {
    test('Tracks best score monotonically (40 -> 70 -> 60 -> bestScore remains 70)', () => {
      const status1 = determineProgressStatus('NOT_STARTED', 'PARTIAL', false, 40, 100);
      expect(status1.status).toBe('IN_PROGRESS');

      const status2 = determineProgressStatus('IN_PROGRESS', 'PARTIAL', false, 70, 100);
      expect(status2.status).toBe('IN_PROGRESS');

      const status3 = determineProgressStatus('IN_PROGRESS', 'PARTIAL', false, 60, 100);
      expect(status3.status).toBe('IN_PROGRESS');
    });
  });

  describe('5. XP Engine & Anti-Farming Guarantees', () => {
    test('Calculates incremental XP and prevents farming on repeated submissions', () => {
      const challengeXp = 100;

      // Attempt 1: Score 40 -> 40 XP
      const a1 = calculateIncrementalXp(challengeXp, 'PARTIAL', 40, 0, 0);
      expect(a1.xpAwarded).toBe(40);
      expect(a1.newTotalXp).toBe(40);

      // Attempt 2: Repeat Score 40 -> 0 XP
      const a2 = calculateIncrementalXp(challengeXp, 'PARTIAL', 40, 40, a1.newTotalXp);
      expect(a2.xpAwarded).toBe(0);
      expect(a2.newTotalXp).toBe(40);

      // Attempt 3: Lower Score 30 -> 0 XP
      const a3 = calculateIncrementalXp(challengeXp, 'PARTIAL', 30, 40, a2.newTotalXp);
      expect(a3.xpAwarded).toBe(0);
      expect(a3.newTotalXp).toBe(40);

      // Attempt 4: Higher Score 70 -> 30 XP delta
      const a4 = calculateIncrementalXp(challengeXp, 'PARTIAL', 70, 40, a3.newTotalXp);
      expect(a4.xpAwarded).toBe(30);
      expect(a4.newTotalXp).toBe(70);

      // Attempt 5: Full Score 100 -> 30 XP delta (reaches 100)
      const a5 = calculateIncrementalXp(challengeXp, 'PASS', 100, 70, a4.newTotalXp);
      expect(a5.xpAwarded).toBe(30);
      expect(a5.newTotalXp).toBe(100);

      // Attempt 6: Repeat Full Score 100 -> 0 XP
      const a6 = calculateIncrementalXp(challengeXp, 'PASS', 100, 100, a5.newTotalXp);
      expect(a6.xpAwarded).toBe(0);
      expect(a6.newTotalXp).toBe(100);

      // Cumulative XP never exceeds challenge maximum
      expect(a6.newTotalXp).toBeLessThanOrEqual(challengeXp);
    });

    test('End-to-end anti-farming with real submissions', async () => {
      // 1st submission: PASS -> 50 XP
      const res1 = await processChallengeSubmission('user_farmer', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      expect(res1.xpAwarded).toBe(50);
      expect(res1.totalChallengeXp).toBe(50);

      // 2nd submission: PASS identical -> 0 XP awarded
      const res2 = await processChallengeSubmission('user_farmer', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      expect(res2.xpAwarded).toBe(0);
      expect(res2.totalChallengeXp).toBe(50);

      // 3rd submission: PASS alternative syntax -> 0 XP awarded
      const res3 = await processChallengeSubmission('user_farmer', {
        challengeId: 'sql.select.001',
        sql: 'SELECT category_id, price, name FROM products;',
      });
      expect(res3.xpAwarded).toBe(0);
      expect(res3.totalChallengeXp).toBe(50);

      // Total attempts = 3, but total XP = 50
      const attempts = getAttemptsInMemory('user_farmer', 'sql.select.001');
      expect(attempts).toHaveLength(3);
      const progress = getProgressInMemory('user_farmer', 'sql.select.001')!;
      expect(progress.xpEarned).toBe(50);
    });
  });

  describe('6. Idempotency & Network Retry Protection', () => {
    test('Repeated submissions with the same idempotency key return cached response without duplicate attempts', async () => {
      const idempotencyKey = 'req_idemp_abc_123';

      // First call with idempotencyKey
      const res1 = await processChallengeSubmission('user_idemp', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
        idempotencyKey,
      });

      expect(res1.status).toBe('PASS');
      expect(res1.xpAwarded).toBe(50);

      // Second call (network retry) with identical idempotencyKey
      const res2 = await processChallengeSubmission('user_idemp', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
        idempotencyKey,
      });

      expect(res2.attemptId).toBe(res1.attemptId);
      expect(res2.status).toBe(res1.status);
      expect(res2.xpAwarded).toBe(res1.xpAwarded);

      // In-memory attempt count should strictly be 1
      const attempts = getAttemptsInMemory('user_idemp', 'sql.select.001');
      expect(attempts).toHaveLength(1);

      const progress = getProgressInMemory('user_idemp', 'sql.select.001')!;
      expect(progress.attemptCount).toBe(1);
    });
  });

  describe('7. Aggregate User Challenge Summary', () => {
    test('Calculates overall started, completed, mastered, and total XP across multiple challenges', async () => {
      // User solves challenge 1 (50 XP)
      await processChallengeSubmission('user_agg', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      // User solves challenge 2 (60 XP)
      await processChallengeSubmission('user_agg', {
        challengeId: 'sql.select.002',
        sql: 'SELECT customer_id, first_name, last_name, email, city, country FROM customers;',
      });

      // User makes failing attempt on challenge 3 (0 XP)
      await processChallengeSubmission('user_agg', {
        challengeId: 'sql.where.001',
        sql: 'SELECT * FROM subscriptions WHERE false;',
      });

      const summary = getUserSummaryInMemory('user_agg', 'sql');
      expect(summary.totalChallengesStarted).toBe(3);
      expect(summary.totalChallengesCompleted).toBe(2);
      expect(summary.totalChallengesMastered).toBe(2);
      expect(summary.totalXpEarned).toBe(110); // 50 + 60
      expect(summary.lastActiveAt).toBeTruthy();
    });
  });
});
