import { QueryResult } from '../../../types';
import { ValidationRuleDefinition } from '../../types';
import { RuleEvaluationResult, ValidationOptions } from './types.server';
import { compareSchemas } from './comparators.server';

/**
 * Evaluates a single declarative validation rule
 */
export function evaluateRule(
  rule: ValidationRuleDefinition,
  actual: QueryResult,
  expected?: QueryResult,
  options: ValidationOptions = {}
): RuleEvaluationResult {
  switch (rule.type) {
    case 'COLUMN_MATCH': {
      const expCols = rule.expectedColumns || expected?.columns || [];
      const schemaRes = compareSchemas(actual.columns, expCols, options);

      return {
        ruleType: rule.type,
        passed: schemaRes.matched,
        score: schemaRes.matched ? 100 : 0,
        description: rule.gradingRubric || `Required columns: ${expCols.join(', ')}`,
        internalReason: schemaRes.internalReason,
      };
    }

    case 'EXACT_ROW_COUNT': {
      const expCount = rule.expectedRowCount ?? expected?.rowCount ?? 0;
      const passed = actual.rowCount === expCount;

      return {
        ruleType: rule.type,
        passed,
        score: passed ? 100 : 0,
        description: rule.gradingRubric || `Expected exactly ${expCount} rows`,
        internalReason: passed
          ? undefined
          : `Expected ${expCount} rows, but received ${actual.rowCount}`,
      };
    }

    case 'MIN_ROW_COUNT': {
      const minCount = rule.minimumRowCount ?? 1;
      const passed = actual.rowCount >= minCount;

      return {
        ruleType: rule.type,
        passed,
        score: passed ? 100 : 0,
        description: rule.gradingRubric || `Expected at least ${minCount} rows`,
        internalReason: passed
          ? undefined
          : `Expected at least ${minCount} rows, but received ${actual.rowCount}`,
      };
    }

    case 'ORDER_MATCH': {
      if (!rule.orderByColumn) {
        return {
          ruleType: rule.type,
          passed: true,
          score: 100,
          description: 'No sort column specified',
        };
      }

      const colName = rule.orderByColumn;
      const actualCol = actual.columns.find((c) => c.toLowerCase() === colName.toLowerCase());

      if (!actualCol) {
        return {
          ruleType: rule.type,
          passed: false,
          score: 0,
          description: `Sorted column '${colName}' not found in query results`,
          internalReason: `Output is missing sort column '${colName}'`,
        };
      }

      // Check if actual rows are sorted
      let isSorted = true;
      let sortDir: 'ASC' | 'DESC' | 'UNKNOWN' = 'UNKNOWN';

      if (expected && expected.rowCount > 1) {
        // Detect expected direction
        const expCol = expected.columns.find((c) => c.toLowerCase() === colName.toLowerCase());
        if (expCol) {
          const v0 = expected.rowObjects[0][expCol];
          const vLast = expected.rowObjects[expected.rowCount - 1][expCol];
          if (v0 !== null && v0 !== undefined && vLast !== null && vLast !== undefined) {
            sortDir = (v0 as any) > (vLast as any) ? 'DESC' : 'ASC';
          }
        }
      }

      for (let i = 1; i < actual.rowCount; i++) {
        const prev = actual.rowObjects[i - 1][actualCol];
        const curr = actual.rowObjects[i][actualCol];

        if (prev !== null && prev !== undefined && curr !== null && curr !== undefined) {
          if (sortDir === 'DESC' && (prev as any) < (curr as any)) {
            isSorted = false;
            break;
          }
          if (sortDir === 'ASC' && (prev as any) > (curr as any)) {
            isSorted = false;
            break;
          }
        }
      }

      return {
        ruleType: rule.type,
        passed: isSorted,
        score: isSorted ? 100 : 0,
        description: rule.gradingRubric || `Results ordered by '${colName}'`,
        internalReason: isSorted ? undefined : `Results are not sorted by '${colName}' in correct order`,
      };
    }

    case 'VALUE_CHECK': {
      const passed = actual.rowCount > 0;
      return {
        ruleType: rule.type,
        passed,
        score: passed ? 100 : 0,
        description: rule.gradingRubric || 'Value constraints satisfied',
      };
    }

    default:
      return {
        ruleType: rule.type,
        passed: true,
        score: 100,
        description: rule.gradingRubric || 'Validation rule',
      };
  }
}

/**
 * Evaluates a list of validation rules against query results
 */
export function evaluateRules(
  rules: ValidationRuleDefinition[],
  actual: QueryResult,
  expected?: QueryResult,
  options: ValidationOptions = {}
): RuleEvaluationResult[] {
  return rules.map((r) => evaluateRule(r, actual, expected, options));
}
