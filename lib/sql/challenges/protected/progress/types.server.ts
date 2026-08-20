import { ProductId } from '../../types';
import { ValidationStatus } from '../validation/types.server';

export type ChallengeProgressStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'MASTERED';

/**
 * Persisted Challenge Attempt Record
 */
export interface ChallengeAttemptRecord {
  attemptId: string;
  userId: string;
  challengeId: string;
  productId: ProductId;
  submittedSql: string;
  validationStatus: ValidationStatus;
  passed: boolean;
  score: number; // 0 - 100
  xpAwarded: number; // Incremental XP awarded for this attempt
  hintsUsed: number;
  executionMetadata: {
    executionMs: number;
    rowCount?: number;
    columnCount?: number;
    error?: string;
  };
  submittedAt: string;
  schemaVersion: number;
}

/**
 * Persisted Durable Challenge Progress Record
 */
export interface ChallengeProgressRecord {
  userId: string;
  challengeId: string;
  productId: ProductId;
  status: ChallengeProgressStatus;
  attemptCount: number;
  bestScore: number; // 0 - 100
  xpEarned: number; // Cumulative XP earned for this challenge (<= challenge.xpReward)
  firstAttemptAt: string;
  lastAttemptAt: string;
  completedAt: string | null;
  masteredAt: string | null;
  schemaVersion: number;
}

/**
 * Idempotency Record to prevent duplicate submission processing
 */
export interface ChallengeIdempotencyRecord {
  idempotencyKey: string;
  userId: string;
  challengeId: string;
  attemptId: string;
  response: SubmitChallengeAttemptResponse;
  createdAt: string;
}

/**
 * Request payload for submitting a challenge attempt
 */
export interface SubmitChallengeAttemptRequest {
  challengeId: string;
  sql: string;
  hintsUsed?: number;
  idempotencyKey?: string;
}

/**
 * Authoritative response returned to the client upon submission
 */
export interface SubmitChallengeAttemptResponse {
  attemptId: string;
  challengeId: string;
  status: ValidationStatus;
  passed: boolean;
  score: number;
  xpAwarded: number;
  totalChallengeXp: number;
  progressStatus: ChallengeProgressStatus;
  bestScore: number;
  feedback: string;
  validationSummary?: {
    checksTotal: number;
    checksPassed: number;
    schemaMatched: boolean;
    dataMatched: boolean;
    rulesMatched: boolean;
  };
  execution?: {
    executionMs: number;
    rowCount?: number;
    columnCount?: number;
    error?: string;
  };
  submittedAt: string;
}

/**
 * Aggregated user progress summary across all challenges
 */
export interface UserChallengeSummary {
  userId: string;
  productId: ProductId;
  totalChallengesStarted: number;
  totalChallengesCompleted: number;
  totalChallengesMastered: number;
  totalXpEarned: number;
  lastActiveAt: string | null;
}
