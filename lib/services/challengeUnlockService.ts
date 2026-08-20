import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase/config';
import {
  UnlockDecision,
  UserProgressionMap,
} from '../sql/challenges/types';

/**
 * Client Service for AnalyticsRise Challenge Unlock & Progression Maps
 * Wraps Firebase Cloud Functions callables with safe fallbacks
 */

/**
 * Retrieves the unlock status and prerequisite requirements for a specific challenge
 */
export async function getChallengeUnlockStatus(
  challengeId: string
): Promise<UnlockDecision | null> {
  if (!functions) {
    return null;
  }

  const getUnlockFn = httpsCallable<{ challengeId: string }, UnlockDecision | null>(
    functions,
    'getChallengeUnlockStatus'
  );

  const result = await getUnlockFn({ challengeId });
  return result.data;
}

/**
 * Retrieves the unlock status for a curriculum module
 */
export async function getModuleUnlockStatus(
  moduleId: string
): Promise<UnlockDecision | null> {
  if (!functions) {
    return null;
  }

  const getUnlockFn = httpsCallable<{ moduleId: string }, UnlockDecision | null>(
    functions,
    'getModuleUnlockStatus'
  );

  const result = await getUnlockFn({ moduleId });
  return result.data;
}

/**
 * Retrieves the unlock status for a curriculum track
 */
export async function getTrackUnlockStatus(
  trackId: string
): Promise<UnlockDecision | null> {
  if (!functions) {
    return null;
  }

  const getUnlockFn = httpsCallable<{ trackId: string }, UnlockDecision | null>(
    functions,
    'getTrackUnlockStatus'
  );

  const result = await getUnlockFn({ trackId });
  return result.data;
}

/**
 * Retrieves the full sanitized curriculum progression map for the current user
 */
export async function getUserProgressionMap(): Promise<UserProgressionMap | null> {
  if (!functions) {
    return null;
  }

  const getMapFn = httpsCallable<void, UserProgressionMap | null>(
    functions,
    'getUserProgressionMap'
  );

  const result = await getMapFn();
  return result.data;
}
