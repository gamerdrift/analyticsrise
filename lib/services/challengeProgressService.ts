import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase/config';
import {
  SubmitChallengeAttemptRequest,
  SubmitChallengeAttemptResponse,
  ChallengeProgressRecord,
  ChallengeAttemptRecord,
  UserChallengeSummary,
} from '../sql/challenges/types';

/**
 * Client Service for AnalyticsRise Challenge Attempts & Progress
 * Wraps Firebase Cloud Functions callables with safe fallbacks
 */

/**
 * Submits a learner's SQL challenge attempt for server-authoritative evaluation and progress update
 */
export async function submitChallengeAttempt(
  data: SubmitChallengeAttemptRequest
): Promise<SubmitChallengeAttemptResponse> {
  if (!functions) {
    throw new Error('Firebase Functions is not initialized.');
  }

  const submitFn = httpsCallable<SubmitChallengeAttemptRequest, SubmitChallengeAttemptResponse>(
    functions,
    'submitChallengeAttempt'
  );

  const result = await submitFn(data);
  return result.data;
}

/**
 * Retrieves the current user's progress for a specific challenge
 */
export async function getChallengeProgress(
  challengeId: string
): Promise<ChallengeProgressRecord | null> {
  if (!functions) {
    return null;
  }

  const getProgressFn = httpsCallable<{ challengeId: string }, ChallengeProgressRecord | null>(
    functions,
    'getChallengeProgress'
  );

  const result = await getProgressFn({ challengeId });
  return result.data;
}

/**
 * Retrieves the current user's attempts for a challenge
 */
export async function getChallengeAttempts(
  challengeId?: string
): Promise<ChallengeAttemptRecord[]> {
  if (!functions) {
    return [];
  }

  const getAttemptsFn = httpsCallable<{ challengeId?: string }, ChallengeAttemptRecord[]>(
    functions,
    'getChallengeAttempts'
  );

  const result = await getAttemptsFn({ challengeId });
  return result.data || [];
}

/**
 * Retrieves the overall challenge progress summary for the current user
 */
export async function getUserChallengeSummary(): Promise<UserChallengeSummary | null> {
  if (!functions) {
    return null;
  }

  const getSummaryFn = httpsCallable<void, UserChallengeSummary | null>(
    functions,
    'getUserChallengeSummary'
  );

  const result = await getSummaryFn();
  return result.data;
}
