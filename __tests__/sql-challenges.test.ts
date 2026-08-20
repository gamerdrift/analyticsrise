import {
  getPublicChallenge,
  listPublicChallenges,
  getChallengesByModule,
  getChallengesByTrack,
  getChallengesBySkill,
  getChallengesByDataset,
  getNextChallenge,
  getPreviousChallenge,
  getChallengeSequence,
  listTracks,
  getTrackById,
  listModules,
  getModuleById,
  SQL_TRACKS,
  SQL_MODULES,
} from '../lib/sql/challenges';
import {
  getProtectedChallenge,
  getFullChallenge,
  listFullChallenges,
  validateChallengeIntegrity,
} from '../lib/sql/challenges/protected/registry.server';
import { getDataset } from '../lib/sql/datasets';
import { executeSql } from '../lib/sql';

describe('Mission 02 Stage 2C — Phase C1: Challenge Domain Model & Registry', () => {
  describe('1. Security Boundary & Client Protection', () => {
    test('Public challenges never contain canonicalSolutionSql or hiddenValidationRules', () => {
      const publicChallenges = listPublicChallenges();
      expect(publicChallenges.length).toBeGreaterThanOrEqual(6);

      publicChallenges.forEach((challenge: any) => {
        expect(challenge.canonicalSolutionSql).toBeUndefined();
        expect(challenge.hiddenValidationRules).toBeUndefined();
        expect(challenge.internalNotes).toBeUndefined();
        expect(challenge.gradingRubric).toBeUndefined();

        // Public fields must be present
        expect(challenge.id).toMatch(/^sql\.[a-z_]+\.\d{3}$/);
        expect(challenge.title).toBeTruthy();
        expect(challenge.scenario).toBeTruthy();
        expect(challenge.instructions.length).toBeGreaterThan(0);
        expect(challenge.starterQuery).toBeTruthy();
        expect(challenge.hints.length).toBe(3);
        expect(challenge.xpReward).toBeGreaterThan(0);
      });
    });

    test('getPublicChallenge returns clean client-safe object for specific ID', () => {
      const challenge: any = getPublicChallenge('sql.select.001');
      expect(challenge).toBeDefined();
      expect(challenge.id).toBe('sql.select.001');
      expect(challenge.canonicalSolutionSql).toBeUndefined();
      expect(challenge.hiddenValidationRules).toBeUndefined();
    });

    test('Protected registry provides server-authoritative data only on explicit server import', () => {
      const protectedData = getProtectedChallenge('sql.select.001');
      expect(protectedData).toBeDefined();
      expect(protectedData!.canonicalSolutionSql).toBe('SELECT name, category_id, price FROM products;');
      expect(protectedData!.hiddenValidationRules.length).toBeGreaterThan(0);
    });
  });

  describe('2. Challenge Registry API & Query Operations', () => {
    test('listPublicChallenges returns all registered seed challenges', () => {
      const all = listPublicChallenges();
      expect(all.length).toBe(6);
      const ids = all.map((c) => c.id);
      expect(ids).toEqual([
        'sql.select.001',
        'sql.select.002',
        'sql.where.001',
        'sql.where.002',
        'sql.orderby.001',
        'sql.orderby.002',
      ]);
    });

    test('Filtering challenges by module, difficulty, skillTag, and dataset', () => {
      const selectModule = listPublicChallenges({ moduleId: 'sql-select' });
      expect(selectModule.length).toBe(2);
      expect(selectModule.every((c) => c.moduleId === 'sql-select')).toBe(true);

      const whereSkill = listPublicChallenges({ skillTag: 'WHERE' });
      expect(whereSkill.length).toBe(2);
      expect(whereSkill.every((c) => c.skillTags.includes('WHERE'))).toBe(true);

      const saasDataset = listPublicChallenges({ datasetId: 'saas' });
      expect(saasDataset.length).toBe(1);
      expect(saasDataset[0].id).toBe('sql.where.001');

      const beginnerDiff = listPublicChallenges({ difficulty: 'Beginner' });
      expect(beginnerDiff.length).toBe(6);
    });

    test('getChallengesByModule returns sequence in ascending order', () => {
      const selectChals = getChallengesByModule('sql-select');
      expect(selectChals.length).toBe(2);
      expect(selectChals[0].sequence).toBe(1);
      expect(selectChals[1].sequence).toBe(2);
    });

    test('getChallengesByTrack returns all challenges in track', () => {
      const foundationChals = getChallengesByTrack('sql-foundation');
      expect(foundationChals.length).toBe(6);
      expect(foundationChals[0].id).toBe('sql.select.001');
      expect(foundationChals[5].id).toBe('sql.orderby.002');
    });

    test('getChallengesBySkill retrieves matching challenges', () => {
      const projectionChals = getChallengesBySkill('PROJECTION');
      expect(projectionChals.length).toBe(2);

      const sortingChals = getChallengesBySkill('SORTING');
      expect(sortingChals.length).toBe(2);
    });

    test('getChallengesByDataset retrieves challenges for given dataset', () => {
      const ecom = getChallengesByDataset('ecommerce');
      expect(ecom.length).toBe(4);

      const hr = getChallengesByDataset('hr');
      expect(hr.length).toBe(1);
      expect(hr[0].id).toBe('sql.orderby.002');
    });

    test('getNextChallenge and getPreviousChallenge navigation', () => {
      // In same module
      expect(getNextChallenge('sql.select.001')?.id).toBe('sql.select.002');
      expect(getPreviousChallenge('sql.select.002')?.id).toBe('sql.select.001');

      // Across modules in same track
      expect(getNextChallenge('sql.select.002')?.id).toBe('sql.where.001');
      expect(getPreviousChallenge('sql.where.001')?.id).toBe('sql.select.002');

      expect(getNextChallenge('sql.where.002')?.id).toBe('sql.orderby.001');
      expect(getPreviousChallenge('sql.orderby.001')?.id).toBe('sql.where.002');

      // End of seed progression
      expect(getNextChallenge('sql.orderby.002')).toBeUndefined();
      expect(getPreviousChallenge('sql.select.001')).toBeUndefined();
    });

    test('listTracks and listModules return complete curriculum structure', () => {
      const tracks = listTracks('sql');
      expect(tracks.length).toBe(6);
      expect(tracks[0].id).toBe('sql-foundation');

      const allModules = listModules();
      expect(allModules.length).toBe(11);

      const foundationModules = listModules('sql-foundation');
      expect(foundationModules.length).toBe(3);
      expect(foundationModules.map((m) => m.id)).toEqual([
        'sql-select',
        'sql-where',
        'sql-orderby-limit',
      ]);
    });
  });

  describe('3. Graph Integrity & Referential Validation', () => {
    test('validateChallengeIntegrity reports valid catalog with 0 errors', () => {
      const result = validateChallengeIntegrity();
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('All challenges have valid progressive hint structures', () => {
      const challenges = listPublicChallenges();
      challenges.forEach((c) => {
        expect(c.hints.length).toBe(3);
        expect(c.hints[0].level).toBe(1);
        expect(c.hints[1].level).toBe(2);
        expect(c.hints[2].level).toBe(3);
        c.hints.forEach((h) => {
          expect(h.title).toBeTruthy();
          expect(h.content).toBeTruthy();
        });
      });
    });

    test('All unlock rules and prerequisites are valid', () => {
      const challenges = listPublicChallenges();
      challenges.forEach((c) => {
        expect(c.unlockRules).toBeDefined();
        if (c.prerequisites.length > 0) {
          expect(c.unlockRules.type).toBe('PREREQUISITE_CHALLENGES');
          expect(c.unlockRules.prerequisiteChallengeIds).toEqual(c.prerequisites);
        }
      });
    });
  });

  describe('4. Canonical Solution Execution against Stage 2A Engine & Stage 2B Datasets', () => {
    test('Executes sql.select.001 canonical solution against ecommerce dataset', () => {
      const full = getFullChallenge('sql.select.001')!;
      expect(full).toBeDefined();

      const dataset = getDataset(full.public.datasetId)!;
      expect(dataset).toBeDefined();

      const result = executeSql(full.protected.canonicalSolutionSql, dataset.database);
      expect(result.columns).toEqual(['name', 'category_id', 'price']);
      expect(result.rowCount).toBeGreaterThanOrEqual(20);
      expect(result.warnings.length).toBe(0);
    });

    test('Executes sql.select.002 canonical solution against ecommerce dataset', () => {
      const full = getFullChallenge('sql.select.002')!;
      const dataset = getDataset(full.public.datasetId)!;

      const result = executeSql(full.protected.canonicalSolutionSql, dataset.database);
      expect(result.columns).toEqual([
        'customer_id',
        'first_name',
        'last_name',
        'email',
        'city',
        'country',
      ]);
      expect(result.rowCount).toBe(80);
    });

    test('Executes sql.where.001 canonical solution against saas dataset', () => {
      const full = getFullChallenge('sql.where.001')!;
      const dataset = getDataset(full.public.datasetId)!;

      const result = executeSql(full.protected.canonicalSolutionSql, dataset.database);
      expect(result.columns).toEqual(['subscription_id', 'company_id', 'plan_id', 'mrr']);
      expect(result.rowCount).toBeGreaterThanOrEqual(1);

      // Verify WHERE logic
      result.rowObjects.forEach((row) => {
        expect(row.plan_id).toBe(5);
      });
    });

    test('Executes sql.where.002 canonical solution against ecommerce dataset', () => {
      const full = getFullChallenge('sql.where.002')!;
      const dataset = getDataset(full.public.datasetId)!;

      const result = executeSql(full.protected.canonicalSolutionSql, dataset.database);
      expect(result.columns).toEqual(['customer_id', 'first_name', 'last_name', 'email', 'city']);
      expect(result.rowCount).toBeGreaterThanOrEqual(1);
    });

    test('Executes sql.orderby.001 canonical solution against ecommerce dataset', () => {
      const full = getFullChallenge('sql.orderby.001')!;
      const dataset = getDataset(full.public.datasetId)!;

      const result = executeSql(full.protected.canonicalSolutionSql, dataset.database);
      expect(result.columns).toEqual(['product_id', 'name', 'category_id', 'price']);
      expect(result.rowCount).toBe(5);

      // Verify descending order
      const prices = result.rowObjects.map((r) => Number(r.price));
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i - 1]).toBeGreaterThanOrEqual(prices[i]);
      }
    });

    test('Executes sql.orderby.002 canonical solution against hr dataset', () => {
      const full = getFullChallenge('sql.orderby.002')!;
      const dataset = getDataset(full.public.datasetId)!;

      const result = executeSql(full.protected.canonicalSolutionSql, dataset.database);
      expect(result.columns).toEqual([
        'employee_id',
        'first_name',
        'last_name',
        'department_id',
        'hire_date',
      ]);
      expect(result.rowCount).toBe(10);
    });
  });
});
