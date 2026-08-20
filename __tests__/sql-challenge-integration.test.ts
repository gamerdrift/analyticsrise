import {
  SqlChallengeClientService,
  generateSubmissionIdempotencyKey,
  normalizeChallengeError,
} from '../lib/services/sqlChallengeClientService';
import {
  processChallengeSubmission,
  clearAttemptsInMemory,
  clearProgressInMemory,
  saveProgressInMemory,
} from '../lib/sql/challenges/protected/progress/index.server';
import { getUserProgressionMap } from '../lib/sql/challenges/protected/unlock/index.server';
import { getPublicChallenge, listPublicChallenges } from '../lib/sql/challenges/public/registry';

describe('Mission 02 Stage 2C — Phase C5: SQL Studio Challenge API Integration', () => {
  beforeEach(() => {
    clearAttemptsInMemory();
    clearProgressInMemory();
  });

  describe('1. Public Catalog & Registry Client Operations', () => {
    test('getChallenge returns sanitized public challenge metadata', () => {
      const challenge = SqlChallengeClientService.getChallenge('sql.select.001');

      expect(challenge).not.toBeNull();
      expect(challenge?.id).toBe('sql.select.001');
      expect(challenge?.title).toBe('Product Catalog Scout');
      expect(challenge?.starterQuery).toBeDefined();
      expect(challenge?.hints).toHaveLength(3);

      // Verify zero protected leakage
      const raw = challenge as any;
      expect(raw.canonicalSolutionSql).toBeUndefined();
      expect(raw.hiddenValidationRules).toBeUndefined();
      expect(raw.expectedResult).toBeUndefined();
    });

    test('listChallenges filters catalog by track, module, and difficulty', () => {
      const allChallenges = SqlChallengeClientService.listChallenges();
      expect(allChallenges).toHaveLength(6);

      const selectModuleChallenges = SqlChallengeClientService.listChallenges({
        moduleId: 'sql-select',
      });
      expect(selectModuleChallenges).toHaveLength(2);
      expect(selectModuleChallenges.every((c) => c.moduleId === 'sql-select')).toBe(true);

      const beginnerChallenges = SqlChallengeClientService.listChallenges({
        difficulty: 'Beginner',
      });
      expect(beginnerChallenges).toHaveLength(6);
    });
  });

  describe('2. Idempotency Key Handling & Consistency', () => {
    test('generateSubmissionIdempotencyKey creates unique keys per challenge and execution', () => {
      const key1 = generateSubmissionIdempotencyKey('sql.select.001');
      const key2 = generateSubmissionIdempotencyKey('sql.select.001');
      const key3 = generateSubmissionIdempotencyKey('sql.select.002');

      expect(key1).toContain('idemp_sql.select.001');
      expect(key3).toContain('idemp_sql.select.002');
      expect(key1).not.toBe(key2);
    });

    test('Server authoritative submission honors identical idempotency key on replay', async () => {
      const userId = 'user_idemp_test';
      const key = 'idemp_key_fixed_12345';

      const res1 = await processChallengeSubmission(userId, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
        idempotencyKey: key,
      });

      expect(res1.score).toBe(100);
      expect(res1.xpAwarded).toBe(50);
      expect(res1.passed).toBe(true);

      // Replay identical submission with same key
      const res2 = await processChallengeSubmission(userId, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
        idempotencyKey: key,
      });

      expect(res2.attemptId).toBe(res1.attemptId);
      expect(res2.score).toBe(res1.score);
      expect(res2.xpAwarded).toBe(res1.xpAwarded);

      // Verify that the learner cumulative XP was not incremented twice
      const map = getUserProgressionMap(userId, 'sql');
      expect(map.totalXpEarned).toBe(50); // Remained 50, zero double-awarding
    });
  });

  describe('3. Progression Map Projection (getUserProgressionMap)', () => {
    test('Returns sanitized full progression map with accurate unlock states', async () => {
      const userId = 'learner_progression_test';

      // Initially only sql.select.001 is unlocked
      const map1 = getUserProgressionMap(userId, 'sql');
      expect(map1.userId).toBe(userId);
      expect(map1.totalChallenges).toBe(6);
      expect(map1.totalUnlockedChallenges).toBe(1);
      expect(map1.totalCompletedChallenges).toBe(0);
      expect(map1.totalXpEarned).toBe(0);

      const c1 = map1.challenges.find((c) => c.id === 'sql.select.001')!;
      expect(c1.isUnlocked).toBe(true);
      expect(c1.status).toBe('UNLOCKED');

      const c2 = map1.challenges.find((c) => c.id === 'sql.select.002')!;
      expect(c2.isUnlocked).toBe(false);
      expect(c2.status).toBe('LOCKED');

      // Solve first challenge
      await processChallengeSubmission(userId, {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      // Refetch map: sql.select.002 is now unlocked
      const map2 = getUserProgressionMap(userId, 'sql');
      expect(map2.totalCompletedChallenges).toBe(1);
      expect(map2.totalUnlockedChallenges).toBe(2);
      expect(map2.totalXpEarned).toBe(50);

      const c2Updated = map2.challenges.find((c) => c.id === 'sql.select.002')!;
      expect(c2Updated.isUnlocked).toBe(true);
      expect(c2Updated.status).toBe('UNLOCKED');
      expect(c2Updated.reasonCode).toBe('PREREQUISITES_COMPLETE');
    });
  });

  describe('4. Error Normalization', () => {
    test('Normalizes unauthenticated error into AUTH_REQUIRED', () => {
      const norm = normalizeChallengeError({ code: 'functions/unauthenticated', message: 'User unauthenticated' });
      expect(norm.code).toBe('AUTH_REQUIRED');
      expect(norm.message).toContain('sign in');
    });

    test('Normalizes network failure into NETWORK_ERROR', () => {
      const norm = normalizeChallengeError({ code: 'functions/unavailable', message: 'Failed to fetch' });
      expect(norm.code).toBe('NETWORK_ERROR');
      expect(norm.message).toContain('internet connection');
    });

    test('Normalizes not-found into CHALLENGE_NOT_FOUND', () => {
      const norm = normalizeChallengeError({ code: 'functions/not-found', message: 'Challenge does not exist' });
      expect(norm.code).toBe('CHALLENGE_NOT_FOUND');
    });

    test('Normalizes invalid argument into INVALID_REQUEST', () => {
      const norm = normalizeChallengeError({ code: 'functions/invalid-argument', message: 'Missing sql field' });
      expect(norm.code).toBe('INVALID_REQUEST');
    });

    test('Sanitizes server stack traces and internal errors into safe generic message', () => {
      const norm = normalizeChallengeError({ message: 'Error in C:\\Users\\hp\\server.ts line 42: SQL syntax dump' });
      expect(norm.code).toBe('UNKNOWN_ERROR');
      expect(norm.message).toBe('A temporary service error occurred. Please try again.');
      expect(norm.message).not.toContain('C:\\Users');
    });
  });

  describe('5. Security Regression & Zero Protected Data Leakage', () => {
    test('Public challenge catalog contains zero canonical solutions or hidden rules', () => {
      const challenges = listPublicChallenges();
      for (const chal of challenges) {
        const raw = chal as any;
        expect(raw.canonicalSolutionSql).toBeUndefined();
        expect(raw.hiddenValidationRules).toBeUndefined();
        expect(raw.gradingRubric).toBeUndefined();
        expect(raw.expectedResult).toBeUndefined();
      }
    });

    test('Progression map contains zero canonical solutions or hidden rules', () => {
      const map = getUserProgressionMap('user_sec_audit', 'sql');
      for (const chal of map.challenges) {
        const raw = chal as any;
        expect(raw.canonicalSolutionSql).toBeUndefined();
        expect(raw.hiddenValidationRules).toBeUndefined();
        expect(raw.gradingRubric).toBeUndefined();
        expect(raw.expectedResult).toBeUndefined();
      }
    });

    test('Submission response contains zero canonical solutions or hidden rules', async () => {
      const response = await processChallengeSubmission('user_sec_sub', {
        challengeId: 'sql.select.001',
        sql: 'SELECT * FROM products;', // Partial/wrong columns
      });

      const raw = response as any;
      expect(raw.canonicalSolutionSql).toBeUndefined();
      expect(raw.hiddenValidationRules).toBeUndefined();
      expect(raw.expectedResult).toBeUndefined();
      expect(raw.gradingRubric).toBeUndefined();
    });
  });

  describe('6. Production Cost Guardrails & Payload Boundary Enforcement', () => {
    test('Rejects SQL payloads exceeding 10,000 characters', async () => {
      const oversizedSql = 'SELECT ' + 'x'.repeat(10001);
      await expect(
        processChallengeSubmission('user_guardrail_test', {
          challengeId: 'sql.select.001',
          sql: oversizedSql,
        })
      ).rejects.toThrow('SQL payload exceeds maximum allowed length of 10,000 characters.');
    });

    test('Rejects Challenge ID exceeding 100 characters', async () => {
      const oversizedId = 'sql.select.' + 'a'.repeat(101);
      await expect(
        processChallengeSubmission('user_guardrail_test', {
          challengeId: oversizedId,
          sql: 'SELECT 1;',
        })
      ).rejects.toThrow('Challenge ID exceeds maximum allowed length of 100 characters.');
    });

    test('Rejects Idempotency Key exceeding 128 characters', async () => {
      const oversizedKey = 'idemp_' + 'k'.repeat(130);
      await expect(
        processChallengeSubmission('user_guardrail_test', {
          challengeId: 'sql.select.001',
          sql: 'SELECT 1;',
          idempotencyKey: oversizedKey,
        })
      ).rejects.toThrow('Idempotency key exceeds maximum allowed length of 128 characters.');
    });

    test('Rejects invalid hintsUsed parameter bounds', async () => {
      await expect(
        processChallengeSubmission('user_guardrail_test', {
          challengeId: 'sql.select.001',
          sql: 'SELECT 1;',
          hintsUsed: -1,
        })
      ).rejects.toThrow('Invalid hintsUsed parameter; must be an integer between 0 and 10.');

      await expect(
        processChallengeSubmission('user_guardrail_test', {
          challengeId: 'sql.select.001',
          sql: 'SELECT 1;',
          hintsUsed: 11,
        })
      ).rejects.toThrow('Invalid hintsUsed parameter; must be an integer between 0 and 10.');

      await expect(
        processChallengeSubmission('user_guardrail_test', {
          challengeId: 'sql.select.001',
          sql: 'SELECT 1;',
          hintsUsed: 2.5 as any,
        })
      ).rejects.toThrow('Invalid hintsUsed parameter; must be an integer between 0 and 10.');
    });
  });
});
