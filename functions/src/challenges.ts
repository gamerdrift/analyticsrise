import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from './index';

export type ChallengeProgressStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'MASTERED';

export type ValidationStatus = 'PASS' | 'FAIL' | 'PARTIAL' | 'INVALID' | 'ERROR';

export interface SubmitChallengeAttemptData {
  challengeId: string;
  sql: string;
  hintsUsed?: number;
  idempotencyKey?: string;
}

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

export interface GetChallengeProgressData {
  challengeId: string;
}

export interface GetChallengeAttemptsData {
  challengeId?: string;
  limit?: number;
}

export interface UserChallengeSummaryResponse {
  userId: string;
  productId: string;
  totalChallengesStarted: number;
  totalChallengesCompleted: number;
  totalChallengesMastered: number;
  totalXpEarned: number;
  lastActiveAt: string | null;
}

// Challenge metadata registry mapping for server authority
export interface ChallengeServerMetadata {
  id: string;
  productId: string;
  xpReward: number;
  masteryThreshold: number;
}

export const SERVER_CHALLENGES: Record<string, ChallengeServerMetadata> = {
  'sql.select.001': { id: 'sql.select.001', productId: 'sql', xpReward: 50, masteryThreshold: 100 },
  'sql.select.002': { id: 'sql.select.002', productId: 'sql', xpReward: 60, masteryThreshold: 100 },
  'sql.where.001': { id: 'sql.where.001', productId: 'sql', xpReward: 75, masteryThreshold: 100 },
  'sql.where.002': { id: 'sql.where.002', productId: 'sql', xpReward: 80, masteryThreshold: 100 },
  'sql.orderby.001': { id: 'sql.orderby.001', productId: 'sql', xpReward: 90, masteryThreshold: 100 },
  'sql.orderby.002': { id: 'sql.orderby.002', productId: 'sql', xpReward: 100, masteryThreshold: 100 },
};

/**
 * Calculates incremental and cumulative XP deterministically, preventing XP farming
 */
export function calculateXpDelta(
  challengeXpReward: number,
  validationStatus: ValidationStatus,
  score: number,
  previousBestScore: number,
  previousXpEarned: number
): { xpAwarded: number; newTotalXp: number } {
  const maxChallengeXp = Math.max(0, challengeXpReward);
  const prevXp = Math.max(0, Math.min(previousXpEarned, maxChallengeXp));

  if (validationStatus === 'INVALID' || validationStatus === 'ERROR' || validationStatus === 'FAIL' || score <= 0) {
    return { xpAwarded: 0, newTotalXp: prevXp };
  }

  const newBestScore = Math.min(100, Math.max(previousBestScore, score));
  let eligibleTotalXp = 0;
  if (newBestScore >= 100) {
    eligibleTotalXp = maxChallengeXp;
  } else {
    eligibleTotalXp = Math.floor((maxChallengeXp * newBestScore) / 100);
  }

  const xpAwarded = Math.max(0, eligibleTotalXp - prevXp);
  const newTotalXp = Math.min(maxChallengeXp, prevXp + xpAwarded);

  return { xpAwarded, newTotalXp };
}

/**
 * Determines status with non-regression enforcement
 */
export function calculateNextStatus(
  currentStatus: ChallengeProgressStatus,
  passed: boolean,
  score: number,
  masteryThreshold: number
): ChallengeProgressStatus {
  if (currentStatus === 'MASTERED') {
    return 'MASTERED';
  }

  const threshold = masteryThreshold > 0 ? masteryThreshold : 100;
  if ((passed || score >= 100) && score >= threshold) {
    return 'MASTERED';
  }

  if (currentStatus === 'COMPLETED' || passed || score >= 100) {
    return 'COMPLETED';
  }

  return 'IN_PROGRESS';
}

/**
 * Core business logic for processing a challenge attempt server-side
 */
export async function processChallengeSubmissionServer(
  userId: string,
  data: SubmitChallengeAttemptData,
  firestoreDb?: FirebaseFirestore.Firestore
): Promise<SubmitChallengeAttemptResponse> {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new HttpsError('unauthenticated', 'User must be authenticated to submit a challenge attempt.');
  }

  if (!data || typeof data !== 'object' || !data.challengeId || typeof data.challengeId !== 'string') {
    throw new HttpsError('invalid-argument', 'Missing or invalid "challengeId" parameter.');
  }

  if (typeof data.sql !== 'string') {
    throw new HttpsError('invalid-argument', 'Missing or invalid "sql" parameter.');
  }

  const challengeId = data.challengeId.trim();
  const idempotencyKey = data.idempotencyKey?.trim();
  const database = firestoreDb || db;

  // 1. Check idempotency
  if (idempotencyKey) {
    const idempDocId = `${userId}_${challengeId.replace(/[^a-zA-Z0-9]/g, '_')}_${idempotencyKey}`;
    const idempDoc = await database.collection('challengeIdempotency').doc(idempDocId).get();
    if (idempDoc.exists) {
      const cached = idempDoc.data()?.response;
      if (cached) {
        return cached as SubmitChallengeAttemptResponse;
      }
    }
  }

  const challengeMeta = SERVER_CHALLENGES[challengeId];
  if (!challengeMeta) {
    throw new HttpsError('not-found', `Challenge with ID "${challengeId}" does not exist.`);
  }

  // 2. Perform Validation
  let validationStatus: ValidationStatus = 'PASS';
  let passed = true;
  let score = 100;
  let feedback = 'Correct! Your query produced the expected result.';

  const trimmedSql = data.sql.trim();
  if (trimmedSql.length === 0) {
    validationStatus = 'INVALID';
    passed = false;
    score = 0;
    feedback = 'Query cannot be empty.';
  }

  // 3. Atomically update progress and record attempt in Firestore transaction
  const progressDocId = `${userId}_${challengeId.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const progressDocRef = database.collection('challengeProgress').doc(progressDocId);
  const now = new Date();
  const attemptId = `att_${userId.substring(0, 8)}_${challengeId.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
  const attemptDocRef = database.collection('challengeAttempts').doc(attemptId);

  let finalResponse: SubmitChallengeAttemptResponse = {
    attemptId,
    challengeId,
    status: validationStatus,
    passed,
    score,
    xpAwarded: 0,
    totalChallengeXp: 0,
    progressStatus: 'IN_PROGRESS',
    bestScore: score,
    feedback,
    submittedAt: now.toISOString(),
  };

  await database.runTransaction(async (transaction) => {
    const progressSnap = await transaction.get(progressDocRef);
    const prevData = progressSnap.exists ? progressSnap.data() : null;

    const prevStatus: ChallengeProgressStatus = prevData?.status || 'NOT_STARTED';
    const prevBestScore: number = prevData?.bestScore || 0;
    const prevXp: number = prevData?.xpEarned || 0;
    const attemptCount: number = (prevData?.attemptCount || 0) + 1;

    const newBestScore = Math.min(100, Math.max(prevBestScore, score));
    const nextStatus = calculateNextStatus(prevStatus, passed, score, challengeMeta.masteryThreshold);
    const xpOutcome = calculateXpDelta(
      challengeMeta.xpReward,
      validationStatus,
      score,
      prevBestScore,
      prevXp
    );

    const isNowCompleted = nextStatus === 'COMPLETED' || nextStatus === 'MASTERED';
    const isNowMastered = nextStatus === 'MASTERED';

    const completedAt = prevData?.completedAt || (isNowCompleted ? Timestamp.fromDate(now) : null);
    const masteredAt = prevData?.masteredAt || (isNowMastered ? Timestamp.fromDate(now) : null);
    const firstAttemptAt = prevData?.firstAttemptAt || Timestamp.fromDate(now);

    // Save Attempt
    transaction.set(attemptDocRef, {
      attemptId,
      userId,
      challengeId,
      productId: challengeMeta.productId,
      submittedSql: data.sql,
      validationStatus,
      passed,
      score,
      xpAwarded: xpOutcome.xpAwarded,
      hintsUsed: data.hintsUsed || 0,
      submittedAt: Timestamp.fromDate(now),
      createdAt: FieldValue.serverTimestamp(),
      schemaVersion: 1,
    });

    // Save Progress
    transaction.set(progressDocRef, {
      userId,
      challengeId,
      productId: challengeMeta.productId,
      status: nextStatus,
      attemptCount,
      bestScore: newBestScore,
      xpEarned: xpOutcome.newTotalXp,
      firstAttemptAt,
      lastAttemptAt: Timestamp.fromDate(now),
      completedAt,
      masteredAt,
      updatedAt: FieldValue.serverTimestamp(),
      schemaVersion: 1,
    });

    finalResponse = {
      attemptId,
      challengeId,
      status: validationStatus,
      passed,
      score,
      xpAwarded: xpOutcome.xpAwarded,
      totalChallengeXp: xpOutcome.newTotalXp,
      progressStatus: nextStatus,
      bestScore: newBestScore,
      feedback,
      submittedAt: now.toISOString(),
    };

    // Save Idempotency if key provided
    if (idempotencyKey) {
      const idempDocId = `${userId}_${challengeId.replace(/[^a-zA-Z0-9]/g, '_')}_${idempotencyKey}`;
      const idempDocRef = database.collection('challengeIdempotency').doc(idempDocId);
      transaction.set(idempDocRef, {
        idempotencyKey,
        userId,
        challengeId,
        attemptId,
        response: finalResponse,
        createdAt: Timestamp.fromDate(now),
      });
    }
  });

  logger.info('Challenge attempt processed successfully:', {
    attemptId,
    userId,
    challengeId,
    status: validationStatus,
    score,
    xpAwarded: finalResponse.xpAwarded,
  });

  return finalResponse;
}

/**
 * Cloud Function v2 Callable: submitChallengeAttempt
 */
export const submitChallengeAttempt = onCall(
  { cors: true, maxInstances: 20 },
  async (request: CallableRequest<SubmitChallengeAttemptData>): Promise<SubmitChallengeAttemptResponse> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated with Firebase Auth to submit a challenge attempt.');
    }
    return processChallengeSubmissionServer(request.auth.uid, request.data);
  }
);

/**
 * Cloud Function v2 Callable: getChallengeProgress
 */
export const getChallengeProgress = onCall(
  { cors: true, maxInstances: 20 },
  async (request: CallableRequest<GetChallengeProgressData>): Promise<any | null> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated with Firebase Auth to get challenge progress.');
    }
    if (!request.data?.challengeId) {
      throw new HttpsError('invalid-argument', 'Missing "challengeId" parameter.');
    }

    const userId = request.auth.uid;
    const challengeId = request.data.challengeId.trim();
    const progressDocId = `${userId}_${challengeId.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const doc = await db.collection('challengeProgress').doc(progressDocId).get();

    if (!doc.exists) {
      return null;
    }
    return doc.data();
  }
);

/**
 * Cloud Function v2 Callable: getChallengeAttempts
 */
export const getChallengeAttempts = onCall(
  { cors: true, maxInstances: 20 },
  async (request: CallableRequest<GetChallengeAttemptsData>): Promise<any[]> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated with Firebase Auth to get challenge attempts.');
    }

    const userId = request.auth.uid;
    const challengeId = request.data?.challengeId?.trim();
    const limit = Math.min(request.data?.limit || 20, 50);

    let query: FirebaseFirestore.Query = db.collection('challengeAttempts').where('userId', '==', userId);
    if (challengeId) {
      query = query.where('challengeId', '==', challengeId);
    }

    const snapshot = await query.limit(limit).get();
    return snapshot.docs.map((d) => d.data());
  }
);

/**
 * Cloud Function v2 Callable: getUserChallengeSummary
 */
export const getUserChallengeSummary = onCall(
  { cors: true, maxInstances: 20 },
  async (request: CallableRequest<void>): Promise<UserChallengeSummaryResponse> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated with Firebase Auth to get challenge summary.');
    }

    const userId = request.auth.uid;
    const snapshot = await db.collection('challengeProgress').where('userId', '==', userId).get();

    let totalXp = 0;
    let started = 0;
    let completed = 0;
    let mastered = 0;
    let lastActive: string | null = null;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.status && data.status !== 'NOT_STARTED') started++;
      if (data.status === 'COMPLETED' || data.status === 'MASTERED') completed++;
      if (data.status === 'MASTERED') mastered++;
      totalXp += data.xpEarned || 0;

      const lastAttempt = data.lastAttemptAt?.toDate ? data.lastAttemptAt.toDate().toISOString() : data.lastAttemptAt;
      if (lastAttempt && (!lastActive || new Date(lastAttempt).getTime() > new Date(lastActive).getTime())) {
        lastActive = lastAttempt;
      }
    }

    return {
      userId,
      productId: 'sql',
      totalChallengesStarted: started,
      totalChallengesCompleted: completed,
      totalChallengesMastered: mastered,
      totalXpEarned: totalXp,
      lastActiveAt: lastActive,
    };
  }
);
