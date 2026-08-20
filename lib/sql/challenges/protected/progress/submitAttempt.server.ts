import { getPublicChallenge } from '../../public/registry';
import { getProtectedChallenge } from '../registry.server';
import { validateChallenge } from '../validation/validateChallenge.server';
import {
  SubmitChallengeAttemptRequest,
  SubmitChallengeAttemptResponse,
  ChallengeProgressRecord,
} from './types.server';
import { calculateIncrementalXp } from './xp.server';
import { determineProgressStatus } from './mastery.server';
import { buildAttemptRecord, recordAttemptInMemory } from './attempts.server';
import {
  getProgressInMemory,
  saveProgressInMemory,
  getIdempotencyInMemory,
  saveIdempotencyInMemory,
} from './progress.server';

/**
 * Authoritative Server-Side Processing of a Challenge Submission
 * 
 * 1. Authenticates & validates user/challenge identity
 * 2. Enforces idempotency to prevent duplicate mutations or network replay issues
 * 3. Executes C2 Challenge Validation Engine
 * 4. Deterministically computes best score, incremental XP, and lifecycle mastery
 * 5. Persists attempt and progress records atomically
 * 6. Returns client-safe authoritative result
 */
export async function processChallengeSubmission(
  userId: string,
  request: SubmitChallengeAttemptRequest
): Promise<SubmitChallengeAttemptResponse> {
  const now = new Date().toISOString();

  // 1. Authenticate user context
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new Error('User must be authenticated to submit a challenge attempt.');
  }

  // 2. Validate request parameters
  if (!request || typeof request !== 'object') {
    throw new Error('Invalid challenge submission request payload.');
  }

  if (!request.challengeId || typeof request.challengeId !== 'string') {
    throw new Error('Missing or invalid "challengeId" in submission payload.');
  }

  if (typeof request.sql !== 'string') {
    throw new Error('Missing or invalid "sql" in submission payload.');
  }

  const challengeId = request.challengeId.trim();
  const idempotencyKey = request.idempotencyKey?.trim();

  // 3. Check Idempotency Key
  if (idempotencyKey) {
    const existingIdempotency = getIdempotencyInMemory(userId, challengeId, idempotencyKey);
    if (existingIdempotency) {
      return existingIdempotency.response;
    }
  }

  // 4. Resolve Authoritative Challenge Metadata
  const publicChal = getPublicChallenge(challengeId);
  const protectedChal = getProtectedChallenge(challengeId);

  if (!publicChal || !protectedChal) {
    throw new Error(`Challenge "${challengeId}" could not be found or is invalid.`);
  }

  // 5. Execute Authoritative C2 Validation Engine
  const validationResult = validateChallenge({
    challengeId,
    sql: request.sql,
    userId,
  });

  // 6. Load Existing Progress
  const existingProgress = getProgressInMemory(userId, challengeId) || {
    userId,
    challengeId,
    productId: publicChal.productId,
    status: 'NOT_STARTED',
    attemptCount: 0,
    bestScore: 0,
    xpEarned: 0,
    firstAttemptAt: now,
    lastAttemptAt: now,
    completedAt: null,
    masteredAt: null,
    schemaVersion: 1,
  };

  // 7. Calculate Incremental & Cumulative XP (Anti-farming protection)
  const xpResult = calculateIncrementalXp(
    publicChal.xpReward,
    validationResult.status,
    validationResult.score,
    existingProgress.bestScore,
    existingProgress.xpEarned
  );

  // 8. Determine Best Score & Lifecycle Progress Status (Non-regression enforcement)
  const newBestScore = Math.min(100, Math.max(existingProgress.bestScore, validationResult.score));
  const masteryResult = determineProgressStatus(
    existingProgress.status,
    validationResult.status,
    validationResult.passed,
    validationResult.score,
    publicChal.masteryThreshold,
    existingProgress.completedAt,
    existingProgress.masteredAt,
    now
  );

  // 9. Construct Attempt Record
  const attemptRecord = buildAttemptRecord({
    userId,
    challengeId,
    productId: publicChal.productId,
    submittedSql: request.sql,
    validationStatus: validationResult.status,
    passed: validationResult.passed,
    score: validationResult.score,
    xpAwarded: xpResult.xpAwarded,
    hintsUsed: request.hintsUsed || 0,
    executionMetadata: validationResult.execution || { executionMs: 0 },
    submittedAt: now,
  });

  // 10. Construct Updated Progress Record
  const updatedProgress: ChallengeProgressRecord = {
    userId,
    challengeId,
    productId: publicChal.productId,
    status: masteryResult.status,
    attemptCount: existingProgress.attemptCount + 1,
    bestScore: newBestScore,
    xpEarned: xpResult.newTotalXp,
    firstAttemptAt: existingProgress.firstAttemptAt || now,
    lastAttemptAt: now,
    completedAt: masteryResult.completedAt,
    masteredAt: masteryResult.masteredAt,
    schemaVersion: 1,
  };

  // 11. Persist Records
  recordAttemptInMemory(attemptRecord);
  saveProgressInMemory(updatedProgress);

  // 12. Build Authoritative Client Response
  const response: SubmitChallengeAttemptResponse = {
    attemptId: attemptRecord.attemptId,
    challengeId,
    status: validationResult.status,
    passed: validationResult.passed,
    score: validationResult.score,
    xpAwarded: xpResult.xpAwarded,
    totalChallengeXp: xpResult.newTotalXp,
    progressStatus: masteryResult.status,
    bestScore: newBestScore,
    feedback: validationResult.feedback,
    validationSummary: validationResult.validationSummary,
    execution: validationResult.execution,
    submittedAt: now,
  };

  // 13. Persist Idempotency Record if key provided
  if (idempotencyKey) {
    saveIdempotencyInMemory({
      idempotencyKey,
      userId,
      challengeId,
      attemptId: attemptRecord.attemptId,
      response,
      createdAt: now,
    });
  }

  return response;
}
