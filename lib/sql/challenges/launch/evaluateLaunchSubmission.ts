import {
  SubmitChallengeAttemptRequest,
  SubmitChallengeAttemptResponse,
  ChallengeProgressRecord,
  ChallengeAttemptRecord,
  ChallengeValidationStatus,
  ChallengeProgressStatus,
} from '../types';
import { getPublicChallenge } from '../public/registry';
import { getDataset } from '../../datasets/registry';
import { executeSql } from '../../engine';
import {
  getLaunchProgress,
  saveLaunchProgress,
  saveLaunchAttempt,
} from './launchProgressEngine';

/**
 * Known expected blueprint queries for the foundational launch catalog
 */
const BLUEPRINT_QUERIES: Record<string, { query: string; ordered: boolean; requiredColumns: string[] }> = {
  'sql.select.001': {
    query: 'SELECT name, category_id, price FROM products;',
    ordered: false,
    requiredColumns: ['name', 'category_id', 'price'],
  },
  'sql.select.002': {
    query: 'SELECT customer_id, first_name, last_name, email, city, country FROM customers;',
    ordered: false,
    requiredColumns: ['customer_id', 'first_name', 'last_name', 'email', 'city', 'country'],
  },
  'sql.where.001': {
    query: "SELECT subscription_id, company_id, plan_id, mrr FROM subscriptions WHERE plan_id = 5 AND status = 'active';",
    ordered: false,
    requiredColumns: ['subscription_id', 'company_id', 'plan_id', 'mrr'],
  },
  'sql.where.002': {
    query: "SELECT customer_id, first_name, last_name, email, city FROM customers WHERE segment = 'Enterprise' AND country = 'USA';",
    ordered: false,
    requiredColumns: ['customer_id', 'first_name', 'last_name', 'email', 'city'],
  },
  'sql.orderby.001': {
    query: 'SELECT product_id, name, category_id, price FROM products ORDER BY price DESC LIMIT 5;',
    ordered: true,
    requiredColumns: ['product_id', 'name', 'category_id', 'price'],
  },
  'sql.orderby.002': {
    query: "SELECT employee_id, first_name, last_name, department_id, hire_date FROM employees WHERE employment_status = 'Active' ORDER BY department_id ASC, hire_date ASC LIMIT 10;",
    ordered: true,
    requiredColumns: ['employee_id', 'first_name', 'last_name', 'department_id', 'hire_date'],
  },
};

function normalizeValue(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  return String(val).trim().toLowerCase();
}

/**
 * Compares two query results for equivalence
 */
function compareQueryOutputs(
  userRows: any[],
  userCols: string[],
  expectedRows: any[],
  expectedCols: string[],
  ordered: boolean
): { schemaMatched: boolean; dataMatched: boolean; rulesMatched: boolean; score: number } {
  // 1. Column matching (case-insensitive)
  const normUserCols = userCols.map((c) => c.toLowerCase());
  const normExpCols = expectedCols.map((c) => c.toLowerCase());

  const schemaMatched =
    normExpCols.length > 0 &&
    normExpCols.every((ec) => normUserCols.includes(ec)) &&
    normUserCols.length === normExpCols.length;

  if (!schemaMatched) {
    // Check if at least some required columns are present
    const partialColumns = normExpCols.filter((ec) => normUserCols.includes(ec)).length;
    const partialScore = partialColumns > 0 ? Math.round((partialColumns / normExpCols.length) * 30) : 0;
    return {
      schemaMatched: false,
      dataMatched: false,
      rulesMatched: false,
      score: partialScore,
    };
  }

  // 2. Row count matching
  if (userRows.length !== expectedRows.length) {
    return {
      schemaMatched: true,
      dataMatched: false,
      rulesMatched: false,
      score: 40,
    };
  }

  // 3. Row data matching
  if (ordered) {
    // Exact sequence comparison
    let allRowsMatch = true;
    for (let i = 0; i < userRows.length; i++) {
      const uRow = userRows[i];
      const eRow = expectedRows[i];

      for (const col of normExpCols) {
        const uVal = normalizeValue(uRow[col]);
        const eVal = normalizeValue(eRow[col]);
        if (uVal !== eVal) {
          allRowsMatch = false;
          break;
        }
      }
      if (!allRowsMatch) break;
    }

    return {
      schemaMatched: true,
      dataMatched: allRowsMatch,
      rulesMatched: allRowsMatch,
      score: allRowsMatch ? 100 : 60,
    };
  } else {
    // Unordered comparison: map row hashes
    const userRowHashes = userRows
      .map((row) => normExpCols.map((col) => normalizeValue(row[col])).join('|'))
      .sort();
    const expectedRowHashes = expectedRows
      .map((row) => normExpCols.map((col) => normalizeValue(row[col])).join('|'))
      .sort();

    const dataMatched =
      userRowHashes.length === expectedRowHashes.length &&
      userRowHashes.every((hash, idx) => hash === expectedRowHashes[idx]);

    return {
      schemaMatched: true,
      dataMatched,
      rulesMatched: dataMatched,
      score: dataMatched ? 100 : 60,
    };
  }
}

/**
 * Authoritatively executes, validates, and awards progression in Launch Mode (Free Tier)
 */
export async function evaluateLaunchSubmission(
  userId: string = 'guest',
  request: SubmitChallengeAttemptRequest
): Promise<SubmitChallengeAttemptResponse> {
  const submittedAt = new Date().toISOString();
  const attemptId = `att_launch_${request.challengeId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Resolve Challenge Definition
  const challenge = getPublicChallenge(request.challengeId);
  if (!challenge) {
    return {
      attemptId,
      challengeId: request.challengeId,
      status: 'ERROR',
      passed: false,
      score: 0,
      xpAwarded: 0,
      totalChallengeXp: 0,
      progressStatus: 'NOT_STARTED',
      bestScore: 0,
      feedback: `Challenge "${request.challengeId}" not found in catalog.`,
      submittedAt,
    };
  }

  // 2. Resolve Dataset
  const dataset = getDataset(challenge.datasetId) || getDataset('ecommerce');
  if (!dataset) {
    return {
      attemptId,
      challengeId: request.challengeId,
      status: 'ERROR',
      passed: false,
      score: 0,
      xpAwarded: 0,
      totalChallengeXp: 0,
      progressStatus: 'NOT_STARTED',
      bestScore: 0,
      feedback: `Challenge dataset "${challenge.datasetId}" is unavailable.`,
      submittedAt,
    };
  }

  // 3. Execute Learner SQL
  const startTime = performance.now();
  let userRows: any[] = [];
  let userCols: string[] = [];
  let executionError: string | null = null;

  try {
    const userResult = executeSql(request.sql, dataset.database);
    userRows = userResult.rows;
    userCols = userResult.columns;
  } catch (err: any) {
    executionError = err?.message || 'SQL syntax or execution error';
  }

  const executionMs = Math.round(performance.now() - startTime);

  // If query failed syntax or table execution
  if (executionError) {
    const existingProgress = getLaunchProgress(userId, challenge.id);
    const prevBestScore = existingProgress?.bestScore || 0;
    const prevXp = existingProgress?.xpEarned || 0;

    const attemptRecord: ChallengeAttemptRecord = {
      attemptId,
      userId,
      challengeId: challenge.id,
      productId: 'sql',
      submittedSql: request.sql,
      validationStatus: 'INVALID',
      passed: false,
      score: 0,
      xpAwarded: 0,
      hintsUsed: request.hintsUsed || 0,
      executionMetadata: { executionMs, error: executionError },
      submittedAt,
      schemaVersion: 1,
    };
    saveLaunchAttempt(userId, attemptRecord);

    return {
      attemptId,
      challengeId: challenge.id,
      status: 'INVALID',
      passed: false,
      score: 0,
      xpAwarded: 0,
      totalChallengeXp: prevXp,
      progressStatus: existingProgress?.status || 'NOT_STARTED',
      bestScore: prevBestScore,
      feedback: `SQL Syntax / Runtime Error: ${executionError}`,
      validationSummary: {
        checksTotal: 3,
        checksPassed: 0,
        schemaMatched: false,
        dataMatched: false,
        rulesMatched: false,
      },
      execution: { executionMs, error: executionError },
      submittedAt,
    };
  }

  // 4. Resolve Expected Query & Execute Reference Result
  const blueprintConfig = BLUEPRINT_QUERIES[challenge.id] || {
    query: challenge.hints.find((h) => h.level === 3)?.content || `SELECT * FROM ${challenge.targetTable || 'products'};`,
    ordered: false,
    requiredColumns: [],
  };

  let expectedRows: any[] = [];
  let expectedCols: string[] = [];

  try {
    const expResult = executeSql(blueprintConfig.query, dataset.database);
    expectedRows = expResult.rows;
    expectedCols = expResult.columns;
  } catch {
    // If blueprint query fails, fallback gracefully
    expectedRows = [];
    expectedCols = [];
  }

  // 5. Compare Results
  const comparison = compareQueryOutputs(
    userRows,
    userCols,
    expectedRows,
    expectedCols,
    blueprintConfig.ordered
  );

  const passed = comparison.score >= 80;
  const status: ChallengeValidationStatus =
    comparison.score === 100 ? 'PASS' : comparison.score > 0 ? 'PARTIAL' : 'FAIL';

  let feedback = '';
  if (passed) {
    feedback = 'Outstanding work! Your SQL query executed successfully and returned the exact expected results.';
  } else if (comparison.score > 0) {
    feedback = 'Partial solution: Check your selected column names, filter expressions, or row limit clauses.';
  } else {
    feedback = 'Query executed, but the output did not match the challenge criteria. Review the scenario instructions.';
  }

  // 6. Anti-Farming XP and Non-Regressing Progress State
  const existingProgress = getLaunchProgress(userId, challenge.id);
  const prevBestScore = existingProgress?.bestScore || 0;
  const prevXp = existingProgress?.xpEarned || 0;

  const newBestScore = Math.max(prevBestScore, comparison.score);

  // Calculate XP strictly on score progression
  const targetTotalXp = Math.round((newBestScore / 100) * challenge.xpReward);
  const xpAwarded = Math.max(0, targetTotalXp - prevXp);
  const totalChallengeXp = prevXp + xpAwarded;

  // Determine progress status with non-regression guarantees
  let newStatus: ChallengeProgressStatus = existingProgress?.status || 'NOT_STARTED';
  if (newBestScore >= challenge.masteryThreshold) {
    newStatus = 'MASTERED';
  } else if (newBestScore >= 80) {
    // If previously mastered, preserve MASTERED
    if (newStatus !== 'MASTERED') {
      newStatus = 'COMPLETED';
    }
  } else if (newBestScore > 0) {
    // If previously completed/mastered, preserve higher status
    if (newStatus !== 'COMPLETED' && newStatus !== 'MASTERED') {
      newStatus = 'IN_PROGRESS';
    }
  }

  const updatedProgressRecord: ChallengeProgressRecord = {
    userId,
    challengeId: challenge.id,
    productId: 'sql',
    status: newStatus,
    attemptCount: (existingProgress?.attemptCount || 0) + 1,
    bestScore: newBestScore,
    xpEarned: totalChallengeXp,
    firstAttemptAt: existingProgress?.firstAttemptAt || submittedAt,
    lastAttemptAt: submittedAt,
    completedAt:
      newStatus === 'COMPLETED' || newStatus === 'MASTERED'
        ? existingProgress?.completedAt || submittedAt
        : null,
    masteredAt: newStatus === 'MASTERED' ? existingProgress?.masteredAt || submittedAt : null,
    schemaVersion: 1,
  };

  saveLaunchProgress(userId, updatedProgressRecord);

  // 7. Save Attempt Audit Record
  const attemptRecord: ChallengeAttemptRecord = {
    attemptId,
    userId,
    challengeId: challenge.id,
    productId: 'sql',
    submittedSql: request.sql,
    validationStatus: status,
    passed,
    score: comparison.score,
    xpAwarded,
    hintsUsed: request.hintsUsed || 0,
    executionMetadata: {
      executionMs,
      rowCount: userRows.length,
      columnCount: userCols.length,
    },
    submittedAt,
    schemaVersion: 1,
  };
  saveLaunchAttempt(userId, attemptRecord);

  const checksPassed =
    (comparison.schemaMatched ? 1 : 0) +
    (comparison.dataMatched ? 1 : 0) +
    (comparison.rulesMatched ? 1 : 0);

  return {
    attemptId,
    challengeId: challenge.id,
    status,
    passed,
    score: comparison.score,
    xpAwarded,
    totalChallengeXp,
    progressStatus: newStatus,
    bestScore: newBestScore,
    feedback,
    validationSummary: {
      checksTotal: 3,
      checksPassed,
      schemaMatched: comparison.schemaMatched,
      dataMatched: comparison.dataMatched,
      rulesMatched: comparison.rulesMatched,
    },
    execution: {
      executionMs,
      rowCount: userRows.length,
      columnCount: userCols.length,
    },
    submittedAt,
  };
}
