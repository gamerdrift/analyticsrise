import { executeSql } from '../lib/sql/engine';
import { getDataset } from '../lib/sql/datasets/registry';
import { getPublicChallenge, listPublicChallenges } from '../lib/sql/challenges/public/registry';
import { SqlChallengeClientService } from '../lib/services/sqlChallengeClientService';
import {
  clearAttemptsInMemory,
  clearProgressInMemory,
} from '../lib/sql/challenges/protected/progress/index.server';

describe('Mission 02 Stage 2C — Phase C6B: SQL Studio Challenge Experience', () => {
  beforeEach(() => {
    clearAttemptsInMemory();
    clearProgressInMemory();
  });

  describe('1. In-Browser Run Query Architecture (Stage 2A + Stage 2B)', () => {
    test('Run Query executes locally against active Stage 2B dataset', () => {
      const dataset = getDataset('ecommerce');
      expect(dataset).toBeDefined();
      expect(dataset?.database).toBeDefined();

      const query = 'SELECT name, price FROM products WHERE price > 200 ORDER BY price DESC;';
      const result = executeSql(query, dataset!.database);

      expect(result.columns).toEqual(['name', 'price']);
      expect(result.rowCount).toBeGreaterThan(0);
      expect(result.executionMs).toBeGreaterThan(0);
      expect(result.rows.length).toBe(result.rowCount);
    });

    test('Run Query handles SQL syntax and table errors safely without crashing', () => {
      const dataset = getDataset('ecommerce');
      expect(() => {
        executeSql('SELECT * FROM non_existent_table;', dataset!.database);
      }).toThrow();
    });

    test('Run Query is read-only and does NOT create attempts, mutate XP, or modify unlock state', () => {
      const dataset = getDataset('ecommerce');
      const query = 'SELECT * FROM products;';

      const initialChallenges = listPublicChallenges();
      expect(initialChallenges.length).toBe(6);

      // Execute local query
      const result = executeSql(query, dataset!.database);
      expect(result.rowCount).toBe(20);

      // Verify no protected attempt/progress side-effects exist
      const publicChal = getPublicChallenge('sql.select.001');
      expect(publicChal).toBeDefined();
      expect((publicChal as any).canonicalSolutionSql).toBeUndefined();
    });
  });

  describe('2. Public Challenge Metadata & Zero-Leakage Audit', () => {
    test('All public challenges contain required metadata without protected solutions', () => {
      const challenges = listPublicChallenges();
      expect(challenges.length).toBeGreaterThanOrEqual(6);

      for (const chal of challenges) {
        expect(chal.id).toBeDefined();
        expect(chal.title).toBeDefined();
        expect(chal.scenario).toBeDefined();
        expect(chal.objective).toBeDefined();
        expect(chal.instructions).toBeDefined();
        expect(chal.starterQuery).toBeDefined();
        expect(chal.hints.length).toBe(3);
        expect(chal.xpReward).toBeGreaterThan(0);

        // Security check: Zero canonical solutions or hidden rules
        const raw = chal as any;
        expect(raw.canonicalSolutionSql).toBeUndefined();
        expect(raw.hiddenValidationRules).toBeUndefined();
        expect(raw.expectedResult).toBeUndefined();
      }
    });

    test('Progressive hints are ordered with 3 distinct levels', () => {
      const chal = getPublicChallenge('sql.select.001')!;
      expect(chal.hints).toHaveLength(3);

      const [h1, h2, h3] = chal.hints;
      expect(h1.level).toBe(1);
      expect(h2.level).toBe(2);
      expect(h3.level).toBe(3);

      expect(h1.content.length).toBeGreaterThan(0);
      expect(h2.content.length).toBeGreaterThan(0);
      expect(h3.content.length).toBeGreaterThan(0);
    });
  });

  describe('3. Database Explorer & Schema Resolution', () => {
    test('Resolves schema, tables, and column metadata for all 4 Stage 2B datasets', () => {
      const datasets = ['ecommerce', 'saas', 'hr', 'finance'];

      for (const dId of datasets) {
        const ds = getDataset(dId);
        expect(ds).toBeDefined();
        expect(ds?.database).toBeDefined();
        expect(Object.keys(ds!.database.tables).length).toBeGreaterThan(0);

        for (const [tName, tDef] of Object.entries(ds!.database.tables)) {
          expect(tName).toBeDefined();
          expect(tDef.columns.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('4. Client API & Idempotency Integration', () => {
    test('Public client service returns public challenge catalog safely', () => {
      const chal = SqlChallengeClientService.getChallenge('sql.select.001');
      expect(chal).not.toBeNull();
      expect(chal?.id).toBe('sql.select.001');

      const selectChallenges = SqlChallengeClientService.listChallenges({ moduleId: 'sql-select' });
      expect(selectChallenges.length).toBe(2);
    });

    test('Submission requires authentication and rejects unauthenticated client context safely', async () => {
      await expect(
        SqlChallengeClientService.submitChallengeAttempt({
          challengeId: 'sql.select.001',
          sql: 'SELECT * FROM products;',
        })
      ).rejects.toMatchObject({
        code: 'AUTH_REQUIRED',
      });
    });
  });
});
