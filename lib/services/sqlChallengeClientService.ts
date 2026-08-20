import { auth } from '@/lib/firebase/config';
import {
  PublicChallenge,
  ChallengeFilter,
  SubmitChallengeAttemptRequest,
  SubmitChallengeAttemptResponse,
  ChallengeProgressRecord,
  ChallengeAttemptRecord,
  UserChallengeSummary,
  UnlockDecision,
  UserProgressionMap,
} from '../sql/challenges/types';
import { getPublicChallenge, listPublicChallenges } from '../sql/challenges/public/registry';
import {
  getLaunchProgress,
  getLaunchAttempts,
  getLaunchUserSummary,
  evaluateLaunchUnlock,
  getLaunchProgressionMap,
  evaluateLaunchSubmission,
} from '../sql/challenges/launch';

export type ChallengeRequestStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

export type ChallengeValidationOutcome = 'PASS' | 'PARTIAL' | 'FAIL' | 'INVALID' | 'ERROR';

export type NormalizedErrorCode =
  | 'AUTH_REQUIRED'
  | 'NETWORK_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'INVALID_REQUEST'
  | 'CHALLENGE_NOT_FOUND'
  | 'UNKNOWN_ERROR';

export interface NormalizedError {
  code: NormalizedErrorCode;
  message: string;
  originalError?: any;
}

/**
 * Generates a unique, deterministic idempotency key per logical submission attempt
 */
export function generateSubmissionIdempotencyKey(challengeId: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  return `idemp_${challengeId}_${timestamp}_${randomSuffix}`;
}

/**
 * Normalizes exceptions into sanitized client-safe errors
 */
export function normalizeChallengeError(error: any): NormalizedError {
  if (!error) {
    return { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' };
  }

  const errorMsg = String(error?.message || error || '').toLowerCase();
  const errorCode = String(error?.code || '').toLowerCase();

  if (errorCode.includes('unauthenticated') || errorMsg.includes('unauthenticated') || errorMsg.includes('auth')) {
    return {
      code: 'AUTH_REQUIRED',
      message: 'Please sign in to submit challenge attempts and track your progress.',
    };
  }

  if (
    errorCode.includes('unavailable') ||
    errorCode.includes('network') ||
    errorMsg.includes('network') ||
    errorMsg.includes('offline') ||
    errorMsg.includes('fetch')
  ) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection issue. Please check your internet connection and retry.',
    };
  }

  if (errorCode.includes('not-found') || errorMsg.includes('not found')) {
    return {
      code: 'CHALLENGE_NOT_FOUND',
      message: 'The requested challenge could not be found.',
    };
  }

  if (errorCode.includes('invalid-argument') || errorMsg.includes('invalid') || errorMsg.includes('missing')) {
    return {
      code: 'INVALID_REQUEST',
      message: 'Invalid submission request. Please ensure all required fields are provided.',
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'A temporary service error occurred. Please try again.',
  };
}

function resolveCurrentUserId(): string {
  try {
    return auth?.currentUser?.uid || 'guest';
  } catch {
    return 'guest';
  }
}

/**
 * SQL Challenge Client Service — Launch Mode Free Tier & Hybrid Ready
 * Provides instant, in-browser execution, progression, and unlock evaluation
 * without requiring Firebase Blaze activation or Cloud Functions deployment.
 */
export class SqlChallengeClientService {
  /**
   * Retrieves public challenge definition from local verified catalog
   */
  static getChallenge(challengeId: string): PublicChallenge | null {
    return getPublicChallenge(challengeId) || null;
  }

  /**
   * Lists public challenges with optional filters
   */
  static listChallenges(filter?: ChallengeFilter): PublicChallenge[] {
    return listPublicChallenges(filter);
  }

  /**
   * Retrieves learner progress for a specific challenge in Launch Mode
   */
  static async getChallengeProgress(
    challengeId: string
  ): Promise<ChallengeProgressRecord | null> {
    const userId = resolveCurrentUserId();
    return getLaunchProgress(userId, challengeId);
  }

  /**
   * Retrieves submission attempt history for a challenge in Launch Mode
   */
  static async getChallengeAttempts(
    challengeId?: string,
    limit: number = 10
  ): Promise<ChallengeAttemptRecord[]> {
    const userId = resolveCurrentUserId();
    return getLaunchAttempts(userId, challengeId, limit);
  }

  /**
   * Retrieves cumulative challenge progression summary for the learner
   */
  static async getUserChallengeSummary(): Promise<UserChallengeSummary | null> {
    const userId = resolveCurrentUserId();
    return getLaunchUserSummary(userId);
  }

  /**
   * Retrieves the unlock decision and prerequisite requirements for a challenge
   */
  static async getChallengeUnlockStatus(
    challengeId: string
  ): Promise<UnlockDecision | null> {
    const userId = resolveCurrentUserId();
    return evaluateLaunchUnlock(userId, challengeId);
  }

  /**
   * Retrieves the full sanitized progression map for the learner
   */
  static async getUserProgressionMap(): Promise<UserProgressionMap | null> {
    const userId = resolveCurrentUserId();
    return getLaunchProgressionMap(userId);
  }

  /**
   * Submits a challenge query for instant in-browser execution, validation, scoring, and progress update
   */
  static async submitChallengeAttempt(
    request: SubmitChallengeAttemptRequest
  ): Promise<SubmitChallengeAttemptResponse> {
    const userId = resolveCurrentUserId();
    return evaluateLaunchSubmission(userId, request);
  }
}
