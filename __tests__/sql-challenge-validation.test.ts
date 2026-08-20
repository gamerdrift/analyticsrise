import {
  validateChallenge,
  executeSubmission,
  compareSchemas,
  compareOrderedResults,
  compareUnorderedResults,
  normalizeSqlValue,
  evaluateRule,
} from '../lib/sql/challenges/protected/validation/index.server';
import { getDataset } from '../lib/sql/datasets';
import { QueryResult } from '../lib/sql/types';

describe('Mission 02 Stage 2C — Phase C2: Challenge Validation Engine', () => {
  describe('1. SQL String Independence (Multiple Valid Formulations Pass)', () => {
    test('Different valid SQL query formulations pass sql.select.001', () => {
      // Formulation 1: Canonical order
      const res1 = validateChallenge({
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      expect(res1.status).toBe('PASS');
      expect(res1.passed).toBe(true);
      expect(res1.score).toBe(100);

      // Formulation 2: Different column order (since columnOrderMatters is false)
      const res2 = validateChallenge({
        challengeId: 'sql.select.001',
        sql: 'SELECT category_id, price, name FROM products;',
      });
      expect(res2.status).toBe('PASS');
      expect(res2.passed).toBe(true);
      expect(res2.score).toBe(100);

      // Formulation 3: Uppercase keywords and extra whitespace
      const res3 = validateChallenge({
        challengeId: 'sql.select.001',
        sql: '   SELECT    name   ,   category_id  ,   price   FROM   products   ;  ',
      });
      expect(res3.status).toBe('PASS');
      expect(res3.passed).toBe(true);
      expect(res3.score).toBe(100);

      // Formulation 4: Explicit table qualifier (products.name)
      const res4 = validateChallenge({
        challengeId: 'sql.select.001',
        sql: 'SELECT products.name, products.category_id, products.price FROM products;',
      });
      expect(res4.status).toBe('PASS');
      expect(res4.passed).toBe(true);
    });

    test('Different valid WHERE syntax passes sql.where.002', () => {
      // Formulation 1: Standard
      const res1 = validateChallenge({
        challengeId: 'sql.where.002',
        sql: "SELECT customer_id, first_name, last_name, email, city FROM customers WHERE segment = 'Enterprise' AND country = 'USA';",
      });
      expect(res1.status).toBe('PASS');
      expect(res1.passed).toBe(true);

      // Formulation 2: Inverted condition order (country = 'USA' AND segment = 'Enterprise')
      const res2 = validateChallenge({
        challengeId: 'sql.where.002',
        sql: "SELECT customer_id, first_name, last_name, email, city FROM customers WHERE country = 'USA' AND segment = 'Enterprise';",
      });
      expect(res2.status).toBe('PASS');
      expect(res2.passed).toBe(true);
    });
  });

  describe('2. Exact vs Unordered Result Validation', () => {
    test('Unordered comparison allows different row orders when order does not matter', () => {
      const ecom = getDataset('ecommerce')!;
      const actual: QueryResult = {
        columns: ['name', 'price'],
        rows: [
          ['Item B', 20],
          ['Item A', 10],
        ],
        rowObjects: [
          { name: 'Item B', price: 20 },
          { name: 'Item A', price: 10 },
        ],
        rowCount: 2,
        executionMs: 1,
        warnings: [],
      };

      const expected: QueryResult = {
        columns: ['name', 'price'],
        rows: [
          ['Item A', 10],
          ['Item B', 20],
        ],
        rowObjects: [
          { name: 'Item A', price: 10 },
          { name: 'Item B', price: 20 },
        ],
        rowCount: 2,
        executionMs: 1,
        warnings: [],
      };

      const unordRes = compareUnorderedResults(actual, expected);
      expect(unordRes.matched).toBe(true);
      expect(unordRes.score).toBe(100);

      const ordRes = compareOrderedResults(actual, expected);
      expect(ordRes.matched).toBe(false);
    });

    test('Strict ordered validation requires exact sequence for ORDER BY challenges', () => {
      // Correct descending order
      const correctRes = validateChallenge({
        challengeId: 'sql.orderby.001',
        sql: 'SELECT product_id, name, category_id, price FROM products ORDER BY price DESC LIMIT 5;',
      });
      expect(correctRes.status).toBe('PASS');
      expect(correctRes.passed).toBe(true);
      expect(correctRes.score).toBe(100);

      // Incorrect ascending order fails
      const wrongOrderRes = validateChallenge({
        challengeId: 'sql.orderby.001',
        sql: 'SELECT product_id, name, category_id, price FROM products ORDER BY price ASC LIMIT 5;',
      });
      expect(wrongOrderRes.passed).toBe(false);
      expect(wrongOrderRes.status).not.toBe('PASS');

      // Missing LIMIT fails
      const missingLimitRes = validateChallenge({
        challengeId: 'sql.orderby.001',
        sql: 'SELECT product_id, name, category_id, price FROM products ORDER BY price DESC;',
      });
      expect(missingLimitRes.passed).toBe(false);
    });
  });

  describe('3. Schema & Column Validation', () => {
    test('Missing required columns fails validation with partial or fail status', () => {
      const res = validateChallenge({
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id FROM products;', // missing price
      });
      expect(res.passed).toBe(false);
      expect(res.validationSummary?.schemaMatched).toBe(false);
    });

    test('Case-insensitive column name matching succeeds', () => {
      const res = validateChallenge({
        challengeId: 'sql.select.001',
        sql: 'SELECT NAME, CATEGORY_ID, PRICE FROM products;',
      });
      expect(res.status).toBe('PASS');
      expect(res.passed).toBe(true);
    });
  });

  describe('4. Rule-Based Evaluation', () => {
    test('evaluateRule properly validates COLUMN_MATCH, ROW_COUNT, and ORDER_MATCH', () => {
      const mockResult: QueryResult = {
        columns: ['id', 'salary'],
        rows: [
          [1, 100000],
          [2, 90000],
        ],
        rowObjects: [
          { id: 1, salary: 100000 },
          { id: 2, salary: 90000 },
        ],
        rowCount: 2,
        executionMs: 1,
        warnings: [],
      };

      const colRule = evaluateRule(
        { type: 'COLUMN_MATCH', expectedColumns: ['id', 'salary'] },
        mockResult
      );
      expect(colRule.passed).toBe(true);

      const countRule = evaluateRule(
        { type: 'EXACT_ROW_COUNT', expectedRowCount: 2 },
        mockResult
      );
      expect(countRule.passed).toBe(true);

      const minRule = evaluateRule(
        { type: 'MIN_ROW_COUNT', minimumRowCount: 5 },
        mockResult
      );
      expect(minRule.passed).toBe(false);

      const orderRule = evaluateRule(
        { type: 'ORDER_MATCH', orderByColumn: 'salary' },
        mockResult,
        mockResult
      );
      expect(orderRule.passed).toBe(true);
    });
  });

  describe('5. NULL & Numeric Precision Normalization', () => {
    test('normalizeSqlValue handles null, undefined, boolean, and numeric tolerance', () => {
      expect(normalizeSqlValue(null)).toBeNull();
      expect(normalizeSqlValue(undefined)).toBeNull();
      expect(normalizeSqlValue(true)).toBe(true);
      expect(normalizeSqlValue(false)).toBe(false);
      expect(normalizeSqlValue('  test  ')).toBe('test');

      // Tolerance rounding
      expect(normalizeSqlValue(10.004, 0.01)).toBe(10.0);
      expect(normalizeSqlValue(10.009, 0.01)).toBe(10.01);
    });
  });

  describe('6. Execution Errors & Invalid SQL Handling', () => {
    test('Syntax error returns status INVALID with safe feedback and no stack trace', () => {
      const res = validateChallenge({
        challengeId: 'sql.select.001',
        sql: 'SELEC name, price FROM products', // syntax typo
      });
      expect(res.status).toBe('INVALID');
      expect(res.passed).toBe(false);
      expect(res.score).toBe(0);
      expect(res.feedback).toBeTruthy();
      expect(res.execution?.error).toBeTruthy();
      // Must not leak internal stack traces or filesystem paths
      expect(res.feedback).not.toContain('node_modules');
      expect(res.feedback).not.toContain('evaluator.ts');
    });

    test('Table not found error returns status INVALID', () => {
      const res = validateChallenge({
        challengeId: 'sql.select.001',
        sql: 'SELECT name FROM nonexistent_table;',
      });
      expect(res.status).toBe('INVALID');
      expect(res.passed).toBe(false);
    });

    test('Empty submission returns status INVALID', () => {
      const res = validateChallenge({
        challengeId: 'sql.select.001',
        sql: '   ',
      });
      expect(res.status).toBe('INVALID');
      expect(res.passed).toBe(false);
    });

    test('Invalid challenge ID returns status ERROR', () => {
      const res = validateChallenge({
        challengeId: 'nonexistent_challenge_id',
        sql: 'SELECT * FROM products;',
      });
      expect(res.status).toBe('ERROR');
      expect(res.passed).toBe(false);
    });
  });

  describe('7. Validation on All 6 Approved Seed Challenges', () => {
    test('Validates sql.select.001 (Product Catalog Scout)', () => {
      const res = validateChallenge({
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });
      expect(res.status).toBe('PASS');
      expect(res.passed).toBe(true);
      expect(res.score).toBe(100);
      expect(res.validationSummary?.checksPassed).toBe(res.validationSummary?.checksTotal);
    });

    test('Validates sql.select.002 (Customer Directory Lookup)', () => {
      const res = validateChallenge({
        challengeId: 'sql.select.002',
        sql: 'SELECT customer_id, first_name, last_name, email, city, country FROM customers;',
      });
      expect(res.status).toBe('PASS');
      expect(res.passed).toBe(true);
      expect(res.score).toBe(100);
    });

    test('Validates sql.where.001 (Enterprise Subscription Filter)', () => {
      const res = validateChallenge({
        challengeId: 'sql.where.001',
        sql: "SELECT subscription_id, company_id, plan_id, mrr FROM subscriptions WHERE plan_id = 5 AND status = 'active';",
      });
      expect(res.status).toBe('PASS');
      expect(res.passed).toBe(true);
      expect(res.score).toBe(100);
    });

    test('Validates sql.where.002 (VIP E-Commerce Shoppers)', () => {
      const res = validateChallenge({
        challengeId: 'sql.where.002',
        sql: "SELECT customer_id, first_name, last_name, email, city FROM customers WHERE segment = 'Enterprise' AND country = 'USA';",
      });
      expect(res.status).toBe('PASS');
      expect(res.passed).toBe(true);
      expect(res.score).toBe(100);
    });

    test('Validates sql.orderby.001 (Top 5 Most Expensive Products)', () => {
      const res = validateChallenge({
        challengeId: 'sql.orderby.001',
        sql: 'SELECT product_id, name, category_id, price FROM products ORDER BY price DESC LIMIT 5;',
      });
      expect(res.status).toBe('PASS');
      expect(res.passed).toBe(true);
      expect(res.score).toBe(100);
    });

    test('Validates sql.orderby.002 (Executive Salary Rankings)', () => {
      const res = validateChallenge({
        challengeId: 'sql.orderby.002',
        sql: "SELECT employee_id, first_name, last_name, department_id, hire_date FROM employees WHERE employment_status = 'Active' ORDER BY department_id ASC, hire_date ASC LIMIT 10;",
      });
      expect(res.status).toBe('PASS');
      expect(res.passed).toBe(true);
      expect(res.score).toBe(100);
    });
  });

  describe('8. Security & Data Protection', () => {
    test('Validation result never exposes canonical SQL or raw expected rows', () => {
      const res: any = validateChallenge({
        challengeId: 'sql.select.001',
        sql: 'SELECT name, category_id, price FROM products;',
      });

      expect(res.canonicalSolutionSql).toBeUndefined();
      expect(res.expectedResult).toBeUndefined();
      expect(res.expectedRows).toBeUndefined();
      expect(res.hiddenValidationRules).toBeUndefined();
    });
  });
});
