import { ChallengeAttemptRecord } from './types.server';
import { ValidationStatus } from '../validation/types.server';
import { ProductId } from '../../types';

// In-memory attempt cache (used in test environments or local execution)
const inMemoryAttempts: ChallengeAttemptRecord[] = [];

/**
 * Creates a strongly-typed attempt record
 */
export function buildAttemptRecord(params: {
  attemptId?: string;
  userId: string;
  challengeId: string;
  productId?: ProductId;
  submittedSql: string;
  validationStatus: ValidationStatus;
  passed: boolean;
  score: number;
  xpAwarded: number;
  hintsUsed?: number;
  executionMetadata?: {
    executionMs: number;
    rowCount?: number;
    columnCount?: number;
    error?: string;
  };
  submittedAt?: string;
}): ChallengeAttemptRecord {
  const timestamp = params.submittedAt || new Date().toISOString();
  const attemptId =
    params.attemptId ||
    `att_${params.userId.substring(0, 8)}_${params.challengeId.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;

  return {
    attemptId,
    userId: params.userId,
    challengeId: params.challengeId,
    productId: params.productId || 'sql',
    submittedSql: params.submittedSql,
    validationStatus: params.validationStatus,
    passed: params.passed,
    score: Math.min(100, Math.max(0, params.score)),
    xpAwarded: Math.max(0, params.xpAwarded),
    hintsUsed: params.hintsUsed || 0,
    executionMetadata: params.executionMetadata || { executionMs: 0 },
    submittedAt: timestamp,
    schemaVersion: 1,
  };
}

/**
 * Persists an attempt record to in-memory store
 */
export function recordAttemptInMemory(attempt: ChallengeAttemptRecord): void {
  inMemoryAttempts.push(attempt);
}

/**
 * Retrieves all attempts for a user from in-memory store
 */
export function getAttemptsInMemory(userId: string, challengeId?: string): ChallengeAttemptRecord[] {
  return inMemoryAttempts
    .filter((a) => a.userId === userId && (!challengeId || a.challengeId === challengeId))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

/**
 * Clears the in-memory attempt store (useful for testing)
 */
export function clearAttemptsInMemory(): void {
  inMemoryAttempts.length = 0;
}
