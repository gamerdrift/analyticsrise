import { ValidationRuleDefinition } from '../../types';
import { QueryResult, SqlValue } from '../../../types';

export type ValidationStatus = 'PASS' | 'FAIL' | 'PARTIAL' | 'INVALID' | 'ERROR';

export type ValidationStrategyType =
  | 'EXACT_RESULT'
  | 'UNORDERED_RESULT'
  | 'SCHEMA_RESULT'
  | 'RULE_BASED';

/**
 * Authoritative Challenge Submission Input
 */
export interface ChallengeSubmission {
  challengeId: string;
  sql: string;
  sessionId?: string;
  userId?: string;
}

/**
 * Fine-grained validation configuration options
 */
export interface ValidationOptions {
  rowOrderMatters?: boolean;
  columnOrderMatters?: boolean;
  caseSensitiveColumns?: boolean;
  numericTolerance?: number;
  allowPartialCredit?: boolean;
  requiredColumns?: string[];
  disallowedKeywords?: string[];
}

/**
 * Protected validation configuration attached to a challenge
 */
export interface ChallengeValidationConfig {
  challengeId: string;
  strategies: ValidationStrategyType[];
  options?: ValidationOptions;
  rules?: ValidationRuleDefinition[];
}

/**
 * Result of evaluating a single validation rule
 */
export interface RuleEvaluationResult {
  ruleType: string;
  passed: boolean;
  score: number;
  description: string;
  internalReason?: string;
}

/**
 * Safe summary of validation checks (safe for client inspection)
 */
export interface ChallengeValidationSummary {
  checksTotal: number;
  checksPassed: number;
  schemaMatched: boolean;
  dataMatched: boolean;
  rulesMatched: boolean;
}

/**
 * Authoritative Validation Result returned to client/caller
 */
export interface ChallengeValidationResult {
  status: ValidationStatus;
  passed: boolean;
  score: number;
  feedback: string;
  validationSummary?: ChallengeValidationSummary;
  execution?: {
    executionMs: number;
    rowCount?: number;
    columnCount?: number;
    error?: string;
  };
  metadata?: {
    challengeId: string;
    evaluatedAt: string;
  };
}

/**
 * Internal execution result wrapper
 */
export interface ExecutionOutcome {
  success: boolean;
  result?: QueryResult;
  error?: string;
  errorCode?: string;
  executionMs: number;
}
