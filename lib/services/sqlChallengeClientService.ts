import { httpsCallable } from 'firebase/functions';
import { functions, auth } from '@/lib/firebase/config';
import {
  PublicChallenge,
  ChallengeFilter,
  DifficultyLevel,
  SubmitChallengeAttemptRequest,
  SubmitChallengeAttemptResponse,
  ChallengeProgressRecord,
  ChallengeAttemptRecord,
  UserChallengeSummary,
  UnlockDecision,
  UserProgressionMap,
} from '../sql/challenges/types';
import { getPublicChallenge, listPublicChallenges } from '../sql/challenges/public/registry';

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
 * Normalizes backend and network exceptions into sanitized client-safe errors
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

  if (errorCode.includes('unavailable') || errorMsg.includes('network') || errorMsg.includes('offline') || errorMsg.includes('fetch')) {
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

/**
 * SQL Challenge Client Service
 * Provides strongly-typed, client-safe interactions with the AnalyticsRise backend
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
   * Retrieves learner progress for a specific challenge
   */
  static async getChallengeProgress(
    challengeId: string
  ): Promise<ChallengeProgressRecord | null> {
    if (!auth?.currentUser) {
      throw { code: 'AUTH_REQUIRED', message: 'Authentication required' };
    }
    if (!functions) {
      return null;
    }

    try {
      const getProgressFn = httpsCallable<{ challengeId: string }, ChallengeProgressRecord | null>(
        functions,
        'getChallengeProgress'
      );
      const result = await getProgressFn({ challengeId });
      return result.data;
    } catch (err) {
      throw normalizeChallengeError(err);
    }
  }

  /**
   * Retrieves submission attempt history for a challenge
   */
  static async getChallengeAttempts(
    challengeId?: string,
    limit: number = 10
  ): Promise<ChallengeAttemptRecord[]> {
    if (!auth?.currentUser) {
      throw { code: 'AUTH_REQUIRED', message: 'Authentication required' };
    }
    if (!functions) {
      return [];
    }

    try {
      const getAttemptsFn = httpsCallable<
        { challengeId?: string; limit?: number },
        ChallengeAttemptRecord[]
      >(functions, 'getChallengeAttempts');
      const result = await getAttemptsFn({ challengeId, limit });
      return result.data || [];
    } catch (err) {
      throw normalizeChallengeError(err);
    }
  }

  /**
   * Retrieves cumulative challenge progression summary for the authenticated user
   */
  static async getUserChallengeSummary(): Promise<UserChallengeSummary | null> {
    if (!auth?.currentUser) {
      throw { code: 'AUTH_REQUIRED', message: 'Authentication required' };
    }
    if (!functions) {
      return null;
    }

    try {
      const getSummaryFn = httpsCallable<void, UserChallengeSummary | null>(
        functions,
        'getUserChallengeSummary'
      );
      const result = await getSummaryFn();
      return result.data;
    } catch (err) {
      throw normalizeChallengeError(err);
    }
  }

  /**
   * Retrieves the unlock decision and prerequisite requirements for a challenge
   */
  static async getChallengeUnlockStatus(
    challengeId: string
  ): Promise<UnlockDecision | null> {
    if (!auth?.currentUser) {
      throw { code: 'AUTH_REQUIRED', message: 'Authentication required' };
    }
    if (!functions) {
      return null;
    }

    try {
      const getUnlockFn = httpsCallable<{ challengeId: string }, UnlockDecision | null>(
        functions,
        'getChallengeUnlockStatus'
      );
      const result = await getUnlockFn({ challengeId });
      return result.data;
    } catch (err) {
      throw normalizeChallengeError(err);
    }
  }

  /**
   * Retrieves the full sanitized progression map for the learner
   */
  static async getUserProgressionMap(): Promise<UserProgressionMap | null> {
    if (!auth?.currentUser) {
      throw { code: 'AUTH_REQUIRED', message: 'Authentication required' };
    }
    if (!functions) {
      return null;
    }

    try {
      const getMapFn = httpsCallable<void, UserProgressionMap | null>(
        functions,
        'getUserProgressionMap'
      );
      const result = await getMapFn();
      return result.data;
    } catch (err) {
      throw normalizeChallengeError(err);
    }
  }

  /**
   * Submits a challenge query for authoritative server execution, validation, scoring, and progress update
   */
  static async submitChallengeAttempt(
    request: SubmitChallengeAttemptRequest
  ): Promise<SubmitChallengeAttemptResponse> {
    if (!auth?.currentUser) {
      throw { code: 'AUTH_REQUIRED', message: 'Authentication required' };
    }
    if (!functions) {
      throw { code: 'SERVICE_UNAVAILABLE', message: 'Functions service unavailable.' };
    }

    const idempotencyKey = request.idempotencyKey || generateSubmissionIdempotencyKey(request.challengeId);

    try {
      const submitFn = httpsCallable<
        SubmitChallengeAttemptRequest,
        SubmitChallengeAttemptResponse
      >(functions, 'submitChallengeAttempt');

      const result = await submitFn({
        challengeId: request.challengeId,
        sql: request.sql,
        hintsUsed: request.hintsUsed || 0,
        idempotencyKey,
      });

      return result.data;
    } catch (err) {
      throw normalizeChallengeError(err);
    }
  }
}
