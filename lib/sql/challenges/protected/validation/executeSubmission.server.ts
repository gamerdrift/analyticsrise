import { Database } from '../../../types';
import { executeSql } from '../../../engine';
import { SQLError } from '../../../errors';
import { ExecutionOutcome } from './types.server';

/**
 * Safely executes a learner or canonical SQL submission against the challenge database
 */
export function executeSubmission(sql: string, database: Database): ExecutionOutcome {
  const start = performance.now();

  if (!sql || typeof sql !== 'string' || sql.trim().length === 0) {
    return {
      success: false,
      error: 'SQL query cannot be empty.',
      errorCode: 'EMPTY_SUBMISSION',
      executionMs: 0,
    };
  }

  try {
    const result = executeSql(sql, database);
    const executionMs = performance.now() - start;

    return {
      success: true,
      result,
      executionMs: Math.max(0.1, executionMs),
    };
  } catch (err: any) {
    const executionMs = performance.now() - start;

    if (err instanceof SQLError) {
      return {
        success: false,
        error: err.message,
        errorCode: err.code,
        executionMs: Math.max(0.1, executionMs),
      };
    }

    // Generic safe error message (no stack trace or internal server path)
    const rawMsg = err?.message || 'Query execution failed.';
    const safeMsg = rawMsg.replace(/(\/|[A-Za-z]:\\)[\w\-./\\]+/g, '[internal]');

    return {
      success: false,
      error: safeMsg,
      errorCode: 'EXECUTION_ERROR',
      executionMs: Math.max(0.1, executionMs),
    };
  }
}
