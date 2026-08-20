import {
  ChallengeProgressRecord,
  UserChallengeSummary,
  ChallengeIdempotencyRecord,
} from './types.server';
import { ProductId } from '../../types';

// In-memory progress cache (Key: `${userId}:${challengeId}`)
const inMemoryProgress = new Map<string, ChallengeProgressRecord>();

// In-memory idempotency cache (Key: `${userId}:${challengeId}:${idempotencyKey}`)
const inMemoryIdempotency = new Map<string, ChallengeIdempotencyRecord>();

/**
 * Retrieves a user's progress record for a challenge from in-memory cache
 */
export function getProgressInMemory(
  userId: string,
  challengeId: string
): ChallengeProgressRecord | undefined {
  const key = `${userId}:${challengeId}`;
  return inMemoryProgress.get(key);
}

/**
 * Persists a progress record to in-memory cache
 */
export function saveProgressInMemory(progress: ChallengeProgressRecord): void {
  const key = `${progress.userId}:${progress.challengeId}`;
  inMemoryProgress.set(key, progress);
}

/**
 * Retrieves an existing idempotency record from in-memory cache
 */
export function getIdempotencyInMemory(
  userId: string,
  challengeId: string,
  idempotencyKey: string
): ChallengeIdempotencyRecord | undefined {
  const key = `${userId}:${challengeId}:${idempotencyKey}`;
  return inMemoryIdempotency.get(key);
}

/**
 * Persists an idempotency record to in-memory cache
 */
export function saveIdempotencyInMemory(record: ChallengeIdempotencyRecord): void {
  const key = `${record.userId}:${record.challengeId}:${record.idempotencyKey}`;
  inMemoryIdempotency.set(key, record);
}

/**
 * Aggregates a user's overall progress across all challenges
 */
export function getUserSummaryInMemory(
  userId: string,
  productId: ProductId = 'sql'
): UserChallengeSummary {
  const userRecords = Array.from(inMemoryProgress.values()).filter(
    (p) => p.userId === userId && p.productId === productId
  );

  let totalXp = 0;
  let started = 0;
  let completed = 0;
  let mastered = 0;
  let lastActive: string | null = null;

  for (const rec of userRecords) {
    if (rec.status !== 'NOT_STARTED') {
      started++;
    }
    if (rec.status === 'COMPLETED' || rec.status === 'MASTERED') {
      completed++;
    }
    if (rec.status === 'MASTERED') {
      mastered++;
    }
    totalXp += rec.xpEarned;

    if (!lastActive || new Date(rec.lastAttemptAt).getTime() > new Date(lastActive).getTime()) {
      lastActive = rec.lastAttemptAt;
    }
  }

  return {
    userId,
    productId,
    totalChallengesStarted: started,
    totalChallengesCompleted: completed,
    totalChallengesMastered: mastered,
    totalXpEarned: totalXp,
    lastActiveAt: lastActive,
  };
}

/**
 * Clears in-memory progress and idempotency stores (useful for testing)
 */
export function clearProgressInMemory(): void {
  inMemoryProgress.clear();
  inMemoryIdempotency.clear();
}
