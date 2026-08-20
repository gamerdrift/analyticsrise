import {
  evaluateUnlockRule,
  evaluateChallengeUnlock,
  evaluateModuleUnlock,
  evaluateTrackUnlock,
  getUserProgressionMap,
  detectCurriculumCycles,
  buildUnlockContext,
} from '../lib/sql/challenges/protected/unlock/index.server';
import {
  processChallengeSubmission,
  clearAttemptsInMemory,
  clearProgressInMemory,
  saveProgressInMemory,
} from '../lib/sql/challenges/protected/progress/index.server';
import { ChallengeProgressRecord } from '../lib/sql/challenges/protected/progress/types.server';
import { PublicChallenge, ChallengeModule, ChallengeTrack } from '../lib/sql/challenges/types';

describe('Mission 02 Stage 2C — Phase C4: Unlock Engine', () => {
  beforeEach(() => {
    clearAttemptsInMemory();
    clearProgressInMemory();
  });

  describe('1. ALWAYS_UNLOCKED Rule', () => {
    test('Evaluates ALWAYS_UNLOCKED rule to UNLOCKED status', () => {
      const context = buildUnlockContext('user_test');
      const outcome = evaluateUnlockRule({ type: 'ALWAYS_UNLOCKED' }, context);

      expect(outcome.isUnlocked).toBe(true);
      expect(outcome.status).toBe('UNLOCKED');
      expect(outcome.reasonCode).toBe('ALWAYS_UNLOCKED');
      expect(outcome.requirements[0].satisfied).toBe(true);
    });

    test('First seed challenge sql.select.001 is immediately unlocked for a new learner', () => {
      const decision = evaluateChallengeUnlock('new_user_1', 'sql.select.001');

      expect(decision.isUnlocked).toBe(true);
      expect(decision.status).toBe('UNLOCKED');
      expect(decision.reasonCode).toBe('ALWAYS_UNLOCKED');
      expect(decision.targetType).toBe('challenge');
    });
  });

  describe('2. PREREQUISITE_CHALLENGES Rule & Mastery Compatibility', () => {
    test('Content is LOCKED when prerequisite challenge is NOT_STARTED or IN_PROGRESS', () => {
      // User has not started sql.select.001 -> sql.select.002 is locked
      const decision1 = evaluateChallengeUnlock('user_locked', 'sql.select.002');
      expect(decision1.isUnlocked).toBe(false);
      expect(decision1.status).toBe('LOCKED');
      expect(decision1.reasonCode).toBe('PREREQUISITES_INCOMPLETE');
      expect(decision1.requirements[0].remaining).toBe(1);

      // User makes a failing attempt on sql.select.001 -> remains IN_PROGRESS -> sql.select.002 is locked
      saveProgressInMemory({
        userId: 'user_locked',
        challengeId: 'sql.select.001',
        productId: 'sql',
        status: 'IN_PROGRESS',
        attemptCount: 1,
        bestScore: 30,
        xpEarned: 15,
        firstAttemptAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        completedAt: null,
        masteredAt: null,
        schemaVersion: 1,
      });

      const decision2 = evaluateChallengeUnlock('user_locked', 'sql.select.002');
      expect(decision2.isUnlocked).toBe(false);
      expect(decision2.status).toBe('LOCKED');
    });

    test('Content is UNLOCKED when prerequisite challenge is COMPLETED', () => {
      saveProgressInMemory({
        userId: 'user_completed',
        challengeId: 'sql.select.001',
        productId: 'sql',
        status: 'COMPLETED',
        attemptCount: 1,
        bestScore: 100,
        xpEarned: 50,
        firstAttemptAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        masteredAt: null,
        schemaVersion: 1,
      });

      const decision = evaluateChallengeUnlock('user_completed', 'sql.select.002');
      expect(decision.isUnlocked).toBe(true);
      expect(decision.status).toBe('UNLOCKED');
      expect(decision.reasonCode).toBe('PREREQUISITES_COMPLETE');
    });

    test('Mastery counts as completion: MASTERED prerequisite satisfies unlock requirement', () => {
      saveProgressInMemory({
        userId: 'user_mastered',
        challengeId: 'sql.select.001',
        productId: 'sql',
        status: 'MASTERED',
        attemptCount: 1,
        bestScore: 100,
        xpEarned: 50,
        firstAttemptAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        masteredAt: new Date().toISOString(),
        schemaVersion: 1,
      });

      const decision = evaluateChallengeUnlock('user_mastered', 'sql.select.002');
      expect(decision.isUnlocked).toBe(true);
      expect(decision.status).toBe('UNLOCKED');
      expect(decision.reasonCode).toBe('PREREQUISITES_COMPLETE');
    });

    test('Multiple prerequisites require ALL to be completed', () => {
      const context = buildUnlockContext('user_multi');
      const rule = {
        type: 'PREREQUISITE_CHALLENGES' as const,
        prerequisiteChallengeIds: ['req.001', 'req.002'],
      };

      // 0 complete
      const out1 = evaluateUnlockRule(rule, context);
      expect(out1.isUnlocked).toBe(false);
      expect(out1.requirements[0].remaining).toBe(2);

      // 1 complete, 1 incomplete
      context.progressMap.set('req.001', {
        userId: 'user_multi',
        challengeId: 'req.001',
        productId: 'sql',
        status: 'COMPLETED',
        attemptCount: 1,
        bestScore: 100,
        xpEarned: 50,
        firstAttemptAt: '',
        lastAttemptAt: '',
        completedAt: '',
        masteredAt: null,
        schemaVersion: 1,
      });

      const out2 = evaluateUnlockRule(rule, context);
      expect(out2.isUnlocked).toBe(false);
      expect(out2.requirements[0].remaining).toBe(1);

      // Both complete
      context.progressMap.set('req.002', {
        userId: 'user_multi',
        challengeId: 'req.002',
        productId: 'sql',
        status: 'MASTERED',
        attemptCount: 1,
        bestScore: 100,
        xpEarned: 50,
        firstAttemptAt: '',
        lastAttemptAt: '',
        completedAt: '',
        masteredAt: '',
        schemaVersion: 1,
      });

      const out3 = evaluateUnlockRule(rule, context);
      expect(out3.isUnlocked).toBe(true);
      expect(out3.status).toBe('UNLOCKED');
      expect(out3.requirements[0].remaining).toBe(0);
    });
  });

  describe('3. XP_THRESHOLD Rule', () => {
    test('Evaluates XP threshold rule based on authoritative cumulative XP', () => {
      const context = buildUnlockContext('user_xp');
      const rule = { type: 'XP_THRESHOLD' as const, requiredXp: 100 };

      // Case A: User has 40 XP -> LOCKED
      context.userSummary = {
        userId: 'user_xp',
        productId: 'sql',
        totalChallengesStarted: 1,
        totalChallengesCompleted: 0,
        totalChallengesMastered: 0,
        totalXpEarned: 40,
        lastActiveAt: null,
      };

      const out1 = evaluateUnlockRule(rule, context);
      expect(out1.isUnlocked).toBe(false);
      expect(out1.status).toBe('LOCKED');
      expect(out1.reasonCode).toBe('XP_REQUIREMENT_NOT_MET');
      expect(out1.requirements[0].remaining).toBe(60);

      // Case B: User reaches 100 XP -> UNLOCKED
      context.userSummary.totalXpEarned = 100;
      const out2 = evaluateUnlockRule(rule, context);
      expect(out2.isUnlocked).toBe(true);
      expect(out2.status).toBe('UNLOCKED');
      expect(out2.reasonCode).toBe('XP_REQUIREMENT_MET');
      expect(out2.requirements[0].remaining).toBe(0);

      // Case C: User exceeds with 150 XP -> UNLOCKED
      context.userSummary.totalXpEarned = 150;
      const out3 = evaluateUnlockRule(rule, context);
      expect(out3.isUnlocked).toBe(true);
      expect(out3.status).toBe('UNLOCKED');
      expect(out3.reasonCode).toBe('XP_REQUIREMENT_MET');
    });
  });

  describe('4. TRACK_COMPLETION Rule', () => {
    test('Requires all challenges in prerequisite track to be completed', () => {
      const context = buildUnlockContext('user_track');
      const rule = { type: 'TRACK_COMPLETION' as const, requiredModuleId: 'sql-foundation' };

      // All 6 seed challenges in sql-foundation
      // Initially 0 complete -> LOCKED
      const out1 = evaluateUnlockRule(rule, context);
      expect(out1.isUnlocked).toBe(false);
      expect(out1.status).toBe('LOCKED');
      expect(out1.reasonCode).toBe('TRACK_INCOMPLETE');

      // Complete all 6 seed challenges in sql-foundation
      const seedIds = [
        'sql.select.001',
        'sql.select.002',
        'sql.where.001',
        'sql.where.002',
        'sql.orderby.001',
        'sql.orderby.002',
      ];

      for (const id of seedIds) {
        context.progressMap.set(id, {
          userId: 'user_track',
          challengeId: id,
          productId: 'sql',
          status: 'COMPLETED',
          attemptCount: 1,
          bestScore: 100,
          xpEarned: 50,
          firstAttemptAt: '',
          lastAttemptAt: '',
          completedAt: '',
          masteredAt: null,
          schemaVersion: 1,
        });
      }

      const out2 = evaluateUnlockRule(rule, context);
      expect(out2.isUnlocked).toBe(true);
      expect(out2.status).toBe('UNLOCKED');
      expect(out2.reasonCode).toBe('TRACK_COMPLETE');
    });
  });

  describe('5. Module & Track Unlock Resolution', () => {
    test('First module (sql-select) and foundational track (sql-foundation) are always UNLOCKED', () => {
      const trackDec = evaluateTrackUnlock('user_1', 'sql-foundation');
      expect(trackDec.isUnlocked).toBe(true);
      expect(trackDec.status).toBe('UNLOCKED');

      const modDec = evaluateModuleUnlock('user_1', 'sql-select');
      expect(modDec.isUnlocked).toBe(true);
      expect(modDec.status).toBe('UNLOCKED');
    });

    test('Module sql-where requires completion of prerequisite module sql-select', () => {
      // Incomplete -> LOCKED
      const dec1 = evaluateModuleUnlock('user_mod', 'sql-where');
      expect(dec1.isUnlocked).toBe(false);
      expect(dec1.status).toBe('LOCKED');
      expect(dec1.reasonCode).toBe('MODULE_INCOMPLETE');

      // Complete sql-select challenges (sql.select.001, sql.select.002)
      saveProgressInMemory({
        userId: 'user_mod',
        challengeId: 'sql.select.001',
        productId: 'sql',
        status: 'COMPLETED',
        attemptCount: 1,
        bestScore: 100,
        xpEarned: 50,
        firstAttemptAt: '',
        lastAttemptAt: '',
        completedAt: '',
        masteredAt: null,
        schemaVersion: 1,
      });
      saveProgressInMemory({
        userId: 'user_mod',
        challengeId: 'sql.select.002',
        productId: 'sql',
        status: 'MASTERED',
        attemptCount: 1,
        bestScore: 100,
        xpEarned: 60,
        firstAttemptAt: '',
        lastAttemptAt: '',
        completedAt: '',
        masteredAt: '',
        schemaVersion: 1,
      });

      const dec2 = evaluateModuleUnlock('user_mod', 'sql-where');
      expect(dec2.isUnlocked).toBe(true);
      expect(dec2.status).toBe('UNLOCKED');
      expect(dec2.reasonCode).toBe('MODULE_COMPLETE');
    });
  });

  describe('6. Full User Progression Map (getUserProgressionMap)', () => {
    test('Builds accurate, sanitized progression map across tracks, modules, and challenges', async () => {
      // User solves first challenge
      await processChallengeSubmission('user_prog_map', {
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      const map = getUserProgressionMap('user_prog_map', 'sql');

      expect(map.userId).toBe('user_prog_map');
      expect(map.productId).toBe('sql');
      expect(map.totalChallenges).toBe(6);
      expect(map.totalCompletedChallenges).toBe(1);
      expect(map.totalMasteredChallenges).toBe(1);
      expect(map.totalXpEarned).toBe(50);

      // Challenge 1 is unlocked & completed
      const c1 = map.challenges.find((c) => c.id === 'sql.select.001')!;
      expect(c1.isUnlocked).toBe(true);
      expect(c1.progressStatus).toBe('MASTERED');

      // Challenge 2 is now unlocked
      const c2 = map.challenges.find((c) => c.id === 'sql.select.002')!;
      expect(c2.isUnlocked).toBe(true);
      expect(c2.progressStatus).toBe('NOT_STARTED');

      // Challenge 3 (sql.where.001) is still locked
      const c3 = map.challenges.find((c) => c.id === 'sql.where.001')!;
      expect(c3.isUnlocked).toBe(false);
      expect(c3.status).toBe('LOCKED');
    });
  });

  describe('7. Circular Dependency Protection', () => {
    test('Validates that current curriculum has zero circular dependencies', () => {
      const cycleResult = detectCurriculumCycles();
      expect(cycleResult.hasCycle).toBe(false);
      expect(cycleResult.cyclePaths).toHaveLength(0);
      expect(cycleResult.errors).toHaveLength(0);
    });

    test('Detects and rejects simulated circular prerequisite graphs', () => {
      const mockChallenges: PublicChallenge[] = [
        {
          id: 'chal.A',
          productId: 'sql',
          trackId: 'sql-foundation',
          moduleId: 'sql-select',
          sequence: 1,
          title: 'A',
          difficulty: 'Beginner',
          skillTags: ['SELECT'],
          prerequisites: ['chal.B'],
          datasetId: 'ecommerce',
          objective: '',
          scenario: '',
          instructions: [],
          starterQuery: '',
          hints: [],
          xpReward: 10,
          masteryThreshold: 100,
          unlockRules: { type: 'PREREQUISITE_CHALLENGES', prerequisiteChallengeIds: ['chal.B'] },
        },
        {
          id: 'chal.B',
          productId: 'sql',
          trackId: 'sql-foundation',
          moduleId: 'sql-select',
          sequence: 2,
          title: 'B',
          difficulty: 'Beginner',
          skillTags: ['SELECT'],
          prerequisites: ['chal.A'],
          datasetId: 'ecommerce',
          objective: '',
          scenario: '',
          instructions: [],
          starterQuery: '',
          hints: [],
          xpReward: 10,
          masteryThreshold: 100,
          unlockRules: { type: 'PREREQUISITE_CHALLENGES', prerequisiteChallengeIds: ['chal.A'] },
        },
      ];

      const cycleResult = detectCurriculumCycles(mockChallenges, [], []);
      expect(cycleResult.hasCycle).toBe(true);
      expect(cycleResult.cyclePaths.length).toBeGreaterThan(0);
      expect(cycleResult.errors[0]).toContain('Circular dependency detected');
    });
  });

  describe('8. Default Deny & Malformed Rule Handling', () => {
    test('Unknown rule type fails closed to LOCKED status', () => {
      const context = buildUnlockContext('user_deny');
      const malformedRule: any = { type: 'NON_EXISTENT_RULE_TYPE' };

      const outcome = evaluateUnlockRule(malformedRule, context);
      expect(outcome.isUnlocked).toBe(false);
      expect(outcome.status).toBe('LOCKED');
      expect(outcome.reasonCode).toBe('UNKNOWN_RULE');
    });

    test('Null or undefined rule fails closed to LOCKED status', () => {
      const context = buildUnlockContext('user_deny');
      const outcome = evaluateUnlockRule(null, context);

      expect(outcome.isUnlocked).toBe(false);
      expect(outcome.status).toBe('LOCKED');
      expect(outcome.reasonCode).toBe('UNKNOWN_RULE');
    });
  });

  describe('9. Non-Regression & User Isolation', () => {
    test('Unlock evaluation is pure and strictly does NOT mutate learner progress', () => {
      saveProgressInMemory({
        userId: 'user_pure',
        challengeId: 'sql.select.001',
        productId: 'sql',
        status: 'COMPLETED',
        attemptCount: 2,
        bestScore: 100,
        xpEarned: 50,
        firstAttemptAt: '2026-01-01T00:00:00Z',
        lastAttemptAt: '2026-01-01T00:00:00Z',
        completedAt: '2026-01-01T00:00:00Z',
        masteredAt: null,
        schemaVersion: 1,
      });

      // Run multiple unlock evaluations
      evaluateChallengeUnlock('user_pure', 'sql.select.002');
      evaluateChallengeUnlock('user_pure', 'sql.select.001');
      getUserProgressionMap('user_pure');

      // Progress record must remain identical
      const prog = buildUnlockContext('user_pure').progressMap.get('sql.select.001')!;
      expect(prog.attemptCount).toBe(2);
      expect(prog.bestScore).toBe(100);
      expect(prog.xpEarned).toBe(50);
      expect(prog.firstAttemptAt).toBe('2026-01-01T00:00:00Z');
    });

    test('User A progress does NOT unlock content for User B', () => {
      // User A completes sql.select.001
      saveProgressInMemory({
        userId: 'user_A',
        challengeId: 'sql.select.001',
        productId: 'sql',
        status: 'COMPLETED',
        attemptCount: 1,
        bestScore: 100,
        xpEarned: 50,
        firstAttemptAt: '',
        lastAttemptAt: '',
        completedAt: '',
        masteredAt: null,
        schemaVersion: 1,
      });

      // User A has sql.select.002 unlocked
      const decA = evaluateChallengeUnlock('user_A', 'sql.select.002');
      expect(decA.isUnlocked).toBe(true);

      // User B has sql.select.002 LOCKED
      const decB = evaluateChallengeUnlock('user_B', 'sql.select.002');
      expect(decB.isUnlocked).toBe(false);
      expect(decB.status).toBe('LOCKED');
    });
  });

  describe('10. Security & Zero Solution Leakage', () => {
    test('Unlock decision never exposes canonical SQL or hidden validation logic', () => {
      const decision: any = evaluateChallengeUnlock('user_sec', 'sql.select.001');

      expect(decision.canonicalSolutionSql).toBeUndefined();
      expect(decision.hiddenValidationRules).toBeUndefined();
      expect(decision.expectedResult).toBeUndefined();
      expect(decision.gradingRubric).toBeUndefined();
    });
  });
});
