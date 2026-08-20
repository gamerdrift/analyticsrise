import { SqlChallengeClientService } from '../lib/services/sqlChallengeClientService';
import {
  clearLaunchStorage,
  getLaunchProgress,
  getAllLaunchProgress,
  getLaunchAttempts,
  getLaunchUserSummary,
  evaluateLaunchUnlock,
  getLaunchProgressionMap,
} from '../lib/sql/challenges/launch/launchProgressEngine';
import { evaluateLaunchSubmission } from '../lib/sql/challenges/launch/evaluateLaunchSubmission';
import { listPublicChallenges, getPublicChallenge } from '../lib/sql/challenges/public/registry';

describe('Mission 02 — SQL Studio Phase C7: Launch Mode Free-Tier Progression & Anti-Farming', () => {
  const TEST_USER = 'learner_launch_test_user';
  const GUEST_USER = 'guest';

  beforeEach(() => {
    clearLaunchStorage();
  });

  afterEach(() => {
    clearLaunchStorage();
  });

  describe('1. Initial Launch State & Catalog Integrity', () => {
    test('Public challenge catalog loads all 6 foundational challenges with 0 server leakage', () => {
      const challenges = listPublicChallenges();
      expect(challenges).toHaveLength(6);

      for (const chal of challenges) {
        expect(chal.id).toBeDefined();
        expect(chal.title).toBeDefined();
        expect(chal.datasetId).toBeDefined();
        expect(chal.starterQuery).toBeDefined();
        expect(chal.hints).toHaveLength(3);
        expect(chal.xpReward).toBeGreaterThan(0);

        // Security check: Zero canonical server solutions or hidden rules in public objects
        const raw = chal as any;
        expect(raw.canonicalSolutionSql).toBeUndefined();
        expect(raw.hiddenValidationRules).toBeUndefined();
      }
    });

    test('Initial unlock state allows Challenge 1 and locks subsequent challenges', () => {
      const unlock1 = evaluateLaunchUnlock(TEST_USER, 'sql.select.001');
      expect(unlock1.isUnlocked).toBe(true);
      expect(unlock1.status).toBe('UNLOCKED');
      expect(unlock1.reasonCode).toBe('ALWAYS_UNLOCKED');

      const unlock2 = evaluateLaunchUnlock(TEST_USER, 'sql.select.002');
      expect(unlock2.isUnlocked).toBe(false);
      expect(unlock2.status).toBe('LOCKED');
      expect(unlock2.reasonCode).toBe('PREREQUISITES_INCOMPLETE');

      const unlock3 = evaluateLaunchUnlock(TEST_USER, 'sql.where.001');
      expect(unlock3.isUnlocked).toBe(false);
      expect(unlock3.status).toBe('LOCKED');
    });

    test('Initial user summary reports 0 progress and 0 XP', () => {
      const summary = getLaunchUserSummary(TEST_USER);
      expect(summary.totalChallengesStarted).toBe(0);
      expect(summary.totalChallengesCompleted).toBe(0);
      expect(summary.totalChallengesMastered).toBe(0);
      expect(summary.totalXpEarned).toBe(0);
    });
  });

  describe('2. Challenge Submission & Evaluation Engine', () => {
    test('Valid SQL query on Challenge 1 passes with score 100 and awards XP', async () => {
      const result = await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      expect(result.status).toBe('PASS');
      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
      expect(result.xpAwarded).toBe(50);
      expect(result.totalChallengeXp).toBe(50);
      expect(result.progressStatus).toBe('MASTERED');
      expect(result.bestScore).toBe(100);
      expect(result.validationSummary?.schemaMatched).toBe(true);
      expect(result.validationSummary?.dataMatched).toBe(true);
    });

    test('Invalid SQL syntax produces safe INVALID status with 0 XP and error feedback', async () => {
      const result = await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT FROM products WHERE;',
      });

      expect(result.status).toBe('INVALID');
      expect(result.passed).toBe(false);
      expect(result.score).toBe(0);
      expect(result.xpAwarded).toBe(0);
      expect(result.feedback).toContain('SQL Syntax / Runtime Error');
    });

    test('Query selecting wrong columns produces failure feedback and does not pass', async () => {
      const result = await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT product_id, stock_quantity FROM products;',
      });

      expect(result.passed).toBe(false);
      expect(result.score).toBeLessThan(80);
    });
  });

  describe('3. Anti-Farming & Progress Non-Regression Protections', () => {
    test('Replaying identical passed submission awards 0 additional XP', async () => {
      // First submission
      const res1 = await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      expect(res1.score).toBe(100);
      expect(res1.xpAwarded).toBe(50);
      expect(res1.totalChallengeXp).toBe(50);

      // Duplicate submission
      const res2 = await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      expect(res2.score).toBe(100);
      expect(res2.xpAwarded).toBe(0); // Anti-farming: 0 duplicate XP!
      expect(res2.totalChallengeXp).toBe(50);

      // Verify user cumulative summary XP remains strictly 50
      const summary = getLaunchUserSummary(TEST_USER);
      expect(summary.totalXpEarned).toBe(50);
    });

    test('Lower score attempt after completion does NOT regress bestScore or progress status', async () => {
      // 1. Pass challenge 1
      await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      // 2. Submit broken query
      const failRes = await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT non_existent_column FROM products;',
      });

      expect(failRes.status).toBe('INVALID');
      expect(failRes.bestScore).toBe(100); // Preserved best score!
      expect(failRes.progressStatus).toBe('MASTERED'); // Preserved status!
      expect(failRes.xpAwarded).toBe(0);

      const progress = getLaunchProgress(TEST_USER, 'sql.select.001');
      expect(progress?.bestScore).toBe(100);
      expect(progress?.status).toBe('MASTERED');
      expect(progress?.xpEarned).toBe(50);
    });

    test('Partial score upgrade awards only incremental delta XP', async () => {
      // 1. Partial submission (e.g. projecting only 1 required column)
      const res1 = await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name FROM products;',
      });
      expect(res1.score).toBe(10); // Partial credit
      const initialXp = res1.xpAwarded;
      expect(initialXp).toBe(5); // Math.round((10/100)*50)

      // 2. Perfect submission
      const res2 = await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      expect(res2.score).toBe(100);
      expect(res2.xpAwarded).toBe(50 - initialXp); // Delta XP awarded
      expect(res2.totalChallengeXp).toBe(50);
    });
  });

  describe('4. Full Curriculum Progression & Unlock Cascade', () => {
    test('Completing each challenge progressively unlocks the next in sequence', async () => {
      // Step 1: Challenge 1
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.select.001').isUnlocked).toBe(true);
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.select.002').isUnlocked).toBe(false);

      await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      // Step 2: Challenge 2 is now unlocked!
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.select.002').isUnlocked).toBe(true);
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.where.001').isUnlocked).toBe(false);

      await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.select.002',
        sql: 'SELECT customer_id, first_name, last_name, email, city, country FROM customers;',
      });

      // Step 3: Challenge 3 is now unlocked!
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.where.001').isUnlocked).toBe(true);
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.where.002').isUnlocked).toBe(false);

      await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.where.001',
        sql: "SELECT subscription_id, company_id, plan_id, mrr FROM subscriptions WHERE plan_id = 5 AND status = 'active';",
      });

      // Step 4: Challenge 4 is now unlocked!
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.where.002').isUnlocked).toBe(true);
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.orderby.001').isUnlocked).toBe(false);

      await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.where.002',
        sql: "SELECT customer_id, first_name, last_name, email, city FROM customers WHERE segment = 'Enterprise' AND country = 'USA';",
      });

      // Step 5: Challenge 5 (Ordered LIMIT) is now unlocked!
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.orderby.001').isUnlocked).toBe(true);
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.orderby.002').isUnlocked).toBe(false);

      await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.orderby.001',
        sql: 'SELECT product_id, name, category_id, price FROM products ORDER BY price DESC LIMIT 5;',
      });

      // Step 6: Challenge 6 (Multi-column Ordered) is now unlocked!
      expect(evaluateLaunchUnlock(TEST_USER, 'sql.orderby.002').isUnlocked).toBe(true);

      await evaluateLaunchSubmission(TEST_USER, {
        challengeId: 'sql.orderby.002',
        sql: "SELECT employee_id, first_name, last_name, department_id, hire_date FROM employees WHERE employment_status = 'Active' ORDER BY department_id ASC, hire_date ASC LIMIT 10;",
      });

      // Verify final progression map
      const map = getLaunchProgressionMap(TEST_USER);
      expect(map.totalChallenges).toBe(6);
      expect(map.totalCompletedChallenges).toBe(6);
      expect(map.totalMasteredChallenges).toBe(6);
      expect(map.totalUnlockedChallenges).toBe(6);
      expect(map.totalXpEarned).toBe(50 + 60 + 75 + 80 + 90 + 100); // 455 XP
    });
  });

  describe('5. User Isolation & Persistence Verification', () => {
    test('Different users maintain completely isolated progression state', async () => {
      const userAlice = 'user_alice';
      const userBob = 'user_bob';

      // Alice completes challenge 1
      await evaluateLaunchSubmission(userAlice, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      const summaryAlice = getLaunchUserSummary(userAlice);
      expect(summaryAlice.totalChallengesCompleted).toBe(1);
      expect(summaryAlice.totalXpEarned).toBe(50);

      // Bob has not completed anything
      const summaryBob = getLaunchUserSummary(userBob);
      expect(summaryBob.totalChallengesCompleted).toBe(0);
      expect(summaryBob.totalXpEarned).toBe(0);

      // Bob cannot access challenge 2 yet
      expect(evaluateLaunchUnlock(userBob, 'sql.select.002').isUnlocked).toBe(false);

      // Alice can access challenge 2
      expect(evaluateLaunchUnlock(userAlice, 'sql.select.002').isUnlocked).toBe(true);
    });

    test('Guest user progress is tracked and accessible', async () => {
      await evaluateLaunchSubmission('guest', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      const guestSummary = getLaunchUserSummary('guest');
      expect(guestSummary.totalChallengesCompleted).toBe(1);
      expect(guestSummary.totalXpEarned).toBe(50);
    });
  });
});
