import { getDataset } from '../../../datasets';
import { getPublicChallenge } from '../../public/registry';
import { getProtectedChallenge } from '../registry.server';
import {
  ChallengeSubmission,
  ChallengeValidationResult,
  ChallengeValidationConfig,
  ValidationStatus,
} from './types.server';
import { executeSubmission } from './executeSubmission.server';
import {
  compareSchemas,
  compareOrderedResults,
  compareUnorderedResults,
} from './comparators.server';
import { evaluateRules } from './rules.server';

/**
 * Built-in default validation configs for the 6 representative seed challenges
 */
const DEFAULT_CHALLENGE_CONFIGS: Record<string, ChallengeValidationConfig> = {
  'sql.select.001': {
    challengeId: 'sql.select.001',
    strategies: ['SCHEMA_RESULT', 'UNORDERED_RESULT'],
    options: {
      rowOrderMatters: false,
      columnOrderMatters: false,
      allowPartialCredit: true,
      requiredColumns: ['name', 'category_id', 'price'],
    },
  },
  'sql.select.002': {
    challengeId: 'sql.select.002',
    strategies: ['SCHEMA_RESULT', 'UNORDERED_RESULT'],
    options: {
      rowOrderMatters: false,
      columnOrderMatters: false,
      allowPartialCredit: true,
      requiredColumns: ['customer_id', 'first_name', 'last_name', 'email', 'city', 'country'],
    },
  },
  'sql.where.001': {
    challengeId: 'sql.where.001',
    strategies: ['SCHEMA_RESULT', 'UNORDERED_RESULT', 'RULE_BASED'],
    options: {
      rowOrderMatters: false,
      columnOrderMatters: false,
      allowPartialCredit: true,
      requiredColumns: ['subscription_id', 'company_id', 'plan_id', 'mrr'],
    },
  },
  'sql.where.002': {
    challengeId: 'sql.where.002',
    strategies: ['SCHEMA_RESULT', 'UNORDERED_RESULT', 'RULE_BASED'],
    options: {
      rowOrderMatters: false,
      columnOrderMatters: false,
      allowPartialCredit: true,
      requiredColumns: ['customer_id', 'first_name', 'last_name', 'email', 'city'],
    },
  },
  'sql.orderby.001': {
    challengeId: 'sql.orderby.001',
    strategies: ['SCHEMA_RESULT', 'EXACT_RESULT', 'RULE_BASED'],
    options: {
      rowOrderMatters: true,
      columnOrderMatters: false,
      allowPartialCredit: true,
      requiredColumns: ['product_id', 'name', 'category_id', 'price'],
    },
  },
  'sql.orderby.002': {
    challengeId: 'sql.orderby.002',
    strategies: ['SCHEMA_RESULT', 'EXACT_RESULT', 'RULE_BASED'],
    options: {
      rowOrderMatters: true,
      columnOrderMatters: false,
      allowPartialCredit: true,
      requiredColumns: ['employee_id', 'first_name', 'last_name', 'department_id', 'hire_date'],
    },
  },
};

/**
 * Authoritatively validates a learner's SQL submission against a challenge definition
 */
export function validateChallenge(
  submission: ChallengeSubmission,
  customConfig?: Partial<ChallengeValidationConfig>
): ChallengeValidationResult {
  const evaluatedAt = new Date().toISOString();

  // 1. Resolve Public and Protected challenge definitions
  const publicChal = getPublicChallenge(submission.challengeId);
  const protectedChal = getProtectedChallenge(submission.challengeId);

  if (!publicChal || !protectedChal) {
    return {
      status: 'ERROR',
      passed: false,
      score: 0,
      feedback: 'The requested challenge could not be found or is invalid.',
      metadata: { challengeId: submission.challengeId, evaluatedAt },
    };
  }

  // 2. Resolve Dataset
  const dataset = getDataset(publicChal.datasetId);
  if (!dataset) {
    return {
      status: 'ERROR',
      passed: false,
      score: 0,
      feedback: `The associated challenge dataset '${publicChal.datasetId}' is unavailable.`,
      metadata: { challengeId: submission.challengeId, evaluatedAt },
    };
  }

  // 3. Resolve validation config
  const baseConfig = DEFAULT_CHALLENGE_CONFIGS[submission.challengeId] || {
    challengeId: submission.challengeId,
    strategies: ['SCHEMA_RESULT', 'UNORDERED_RESULT'],
    options: {
      rowOrderMatters: publicChal.moduleId.includes('orderby'),
      allowPartialCredit: true,
    },
  };

  const config: ChallengeValidationConfig = {
    ...baseConfig,
    ...customConfig,
    options: {
      ...baseConfig.options,
      ...customConfig?.options,
    },
  };

  const options = config.options || {};
  const rules = protectedChal.hiddenValidationRules || [];

  // 4. Execute Learner SQL
  const learnerExecution = executeSubmission(submission.sql, dataset.database);

  if (!learnerExecution.success || !learnerExecution.result) {
    return {
      status: 'INVALID',
      passed: false,
      score: 0,
      feedback: learnerExecution.error || 'Your SQL could not be executed successfully. Review the query syntax and try again.',
      execution: {
        executionMs: learnerExecution.executionMs,
        error: learnerExecution.error,
      },
      metadata: { challengeId: submission.challengeId, evaluatedAt },
    };
  }

  const actualResult = learnerExecution.result;

  // 5. Execute Protected Canonical SQL to obtain authoritative expected result
  const canonicalExecution = executeSubmission(protectedChal.canonicalSolutionSql, dataset.database);

  if (!canonicalExecution.success || !canonicalExecution.result) {
    return {
      status: 'ERROR',
      passed: false,
      score: 0,
      feedback: 'An internal error occurred during reference evaluation.',
      metadata: { challengeId: submission.challengeId, evaluatedAt },
    };
  }

  const expectedResult = canonicalExecution.result;

  // 6. Execute Validation Checks
  let schemaMatched = true;
  let dataMatched = true;
  let rulesMatched = true;

  let checksTotal = 0;
  let checksPassed = 0;

  // A. Schema Check
  if (config.strategies.includes('SCHEMA_RESULT')) {
    checksTotal++;
    const schemaRes = compareSchemas(
      actualResult.columns,
      expectedResult.columns,
      options
    );
    schemaMatched = schemaRes.matched;
    if (schemaMatched) {
      checksPassed++;
    }
  }

  // B. Data / Row Comparison
  const rowOrderMatters = options.rowOrderMatters ?? false;
  if (config.strategies.includes('EXACT_RESULT') || rowOrderMatters) {
    checksTotal++;
    const dataRes = compareOrderedResults(actualResult, expectedResult, options);
    dataMatched = dataRes.matched;
    if (dataMatched) {
      checksPassed++;
    }
  } else if (config.strategies.includes('UNORDERED_RESULT')) {
    checksTotal++;
    const dataRes = compareUnorderedResults(actualResult, expectedResult, options);
    dataMatched = dataRes.matched;
    if (dataMatched) {
      checksPassed++;
    }
  }

  // C. Rule-based checks
  if (rules.length > 0) {
    const ruleResults = evaluateRules(rules, actualResult, expectedResult, options);
    checksTotal += ruleResults.length;
    const passedRuleCount = ruleResults.filter((r) => r.passed).length;
    checksPassed += passedRuleCount;
    rulesMatched = passedRuleCount === ruleResults.length;
  }

  // 7. Compute Final Status & Score
  const allPassed = schemaMatched && dataMatched && rulesMatched;
  let status: ValidationStatus = 'FAIL';
  let score = 0;
  let feedback = 'Your query executed successfully, but the result does not yet satisfy all challenge requirements.';

  if (allPassed) {
    status = 'PASS';
    score = 100;
    feedback = 'Correct! Your query produced the expected result.';
  } else if (options.allowPartialCredit && checksPassed > 0 && checksTotal > 0) {
    const computedRatio = checksPassed / checksTotal;
    score = Math.round(computedRatio * 80); // max 80 for partial
    status = score > 0 ? 'PARTIAL' : 'FAIL';
    feedback = 'Your query satisfies some requirements, but additional conditions are still missing.';
  }

  return {
    status,
    passed: allPassed,
    score,
    feedback,
    validationSummary: {
      checksTotal,
      checksPassed,
      schemaMatched,
      dataMatched,
      rulesMatched,
    },
    execution: {
      executionMs: learnerExecution.executionMs,
      rowCount: actualResult.rowCount,
      columnCount: actualResult.columns.length,
    },
    metadata: {
      challengeId: submission.challengeId,
      evaluatedAt,
    },
  };
}
