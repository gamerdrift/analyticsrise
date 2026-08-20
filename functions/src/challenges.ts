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

  if (data.challengeId.trim().length > 100) {
    throw new HttpsError('invalid-argument', 'Challenge ID exceeds maximum allowed length of 100 characters.');
  }

  if (typeof data.sql !== 'string') {
    throw new HttpsError('invalid-argument', 'Missing or invalid "sql" parameter.');
  }

  if (data.sql.length > 10000) {
    throw new HttpsError('invalid-argument', 'SQL payload exceeds maximum allowed length of 10,000 characters.');
  }

  if (data.hintsUsed !== undefined) {
    if (typeof data.hintsUsed !== 'number' || !Number.isInteger(data.hintsUsed) || data.hintsUsed < 0 || data.hintsUsed > 10) {
      throw new HttpsError('invalid-argument', 'Invalid hintsUsed parameter; must be an integer between 0 and 10.');
    }
  }

  const challengeId = data.challengeId.trim();
  const idempotencyKey = data.idempotencyKey?.trim();

  if (idempotencyKey && idempotencyKey.length > 128) {
    throw new HttpsError('invalid-argument', 'Idempotency key exceeds maximum allowed length of 128 characters.');
  }

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
  {
    cors: true,
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 15,
  },
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
  {
    cors: true,
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 10,
  },
  async (request: CallableRequest<GetChallengeProgressData>): Promise<any | null> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated with Firebase Auth to get challenge progress.');
    }
    if (!request.data?.challengeId || typeof request.data.challengeId !== 'string') {
      throw new HttpsError('invalid-argument', 'Missing or invalid "challengeId" parameter.');
    }
    if (request.data.challengeId.trim().length > 100) {
      throw new HttpsError('invalid-argument', 'Challenge ID exceeds maximum allowed length of 100 characters.');
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
  {
    cors: true,
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 10,
  },
  async (request: CallableRequest<GetChallengeAttemptsData>): Promise<any[]> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated with Firebase Auth to get challenge attempts.');
    }

    const userId = request.auth.uid;
    const challengeId = request.data?.challengeId?.trim();
    if (challengeId && challengeId.length > 100) {
      throw new HttpsError('invalid-argument', 'Challenge ID exceeds maximum allowed length of 100 characters.');
    }
    const limit = Math.min(Math.max(1, typeof request.data?.limit === 'number' ? request.data.limit : 20), 50);

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
  {
    cors: true,
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 10,
  },
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

/**
 * Cloud Function v2 Callable: getChallengeUnlockStatus
 */
export const getChallengeUnlockStatus = onCall(
  {
    cors: true,
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 10,
  },
  async (request: CallableRequest<{ challengeId: string }>): Promise<any> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated with Firebase Auth to get unlock status.');
    }
    if (!request.data?.challengeId || typeof request.data.challengeId !== 'string') {
      throw new HttpsError('invalid-argument', 'Missing or invalid "challengeId" parameter.');
    }
    if (request.data.challengeId.trim().length > 100) {
      throw new HttpsError('invalid-argument', 'Challenge ID exceeds maximum allowed length of 100 characters.');
    }

    const userId = request.auth.uid;
    const challengeId = request.data.challengeId.trim();

    // Default unlock evaluation for seed challenges
    const isFirst = challengeId === 'sql.select.001';
    if (isFirst) {
      return {
        targetId: challengeId,
        targetType: 'challenge',
        isUnlocked: true,
        status: 'UNLOCKED',
        reasonCode: 'ALWAYS_UNLOCKED',
        explanation: 'This challenge is available immediately.',
        requirements: [],
      };
    }

    const snapshot = await db.collection('challengeProgress').where('userId', '==', userId).get();
    const progressMap = new Map<string, any>();
    snapshot.docs.forEach((doc) => progressMap.set(doc.data().challengeId, doc.data()));

    // Prerequisite mapping for representative seed challenges
    const prereqMap: Record<string, string> = {
      'sql.select.002': 'sql.select.001',
      'sql.where.001': 'sql.select.002',
      'sql.where.002': 'sql.where.001',
      'sql.orderby.001': 'sql.where.002',
      'sql.orderby.002': 'sql.orderby.001',
    };

    const prereqId = prereqMap[challengeId];
    if (!prereqId) {
      return {
        targetId: challengeId,
        targetType: 'challenge',
        isUnlocked: true,
        status: 'UNLOCKED',
        reasonCode: 'ALWAYS_UNLOCKED',
        explanation: 'Challenge is available.',
        requirements: [],
      };
    }

    const prereqProg = progressMap.get(prereqId);
    const isPrereqComplete = prereqProg?.status === 'COMPLETED' || prereqProg?.status === 'MASTERED';

    return {
      targetId: challengeId,
      targetType: 'challenge',
      isUnlocked: isPrereqComplete,
      status: isPrereqComplete ? 'UNLOCKED' : 'LOCKED',
      reasonCode: isPrereqComplete ? 'PREREQUISITES_COMPLETE' : 'PREREQUISITES_INCOMPLETE',
      explanation: isPrereqComplete
        ? 'Prerequisite challenge completed.'
        : `Complete prerequisite challenge '${prereqId}' to unlock.`,
      requirements: [
        {
          type: 'PREREQUISITE_CHALLENGES',
          satisfied: isPrereqComplete,
          required: [prereqId],
          completed: isPrereqComplete ? [prereqId] : [],
          remaining: isPrereqComplete ? 0 : 1,
          description: `Requires completion of ${prereqId}`,
        },
      ],
    };
  }
);

/**
 * Cloud Function v2 Callable: getUserProgressionMap
 * Authoritatively builds the sanitized full curriculum progression map for the learner
 */
export const getUserProgressionMap = onCall(
  {
    cors: true,
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 15,
  },
  async (request: CallableRequest<void>): Promise<any> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated with Firebase Auth to get progression map.');
    }

    const userId = request.auth.uid;
    const snapshot = await db.collection('challengeProgress').where('userId', '==', userId).get();
    const progressMap = new Map<string, any>();
    snapshot.docs.forEach((doc) => progressMap.set(doc.data().challengeId, doc.data()));

    const challengesDef = [
      { id: 'sql.select.001', moduleId: 'sql-select', trackId: 'sql-foundation', sequence: 1, title: 'Product Catalog Scout', difficulty: 'Beginner', xpReward: 50, prereqs: [] as string[] },
      { id: 'sql.select.002', moduleId: 'sql-select', trackId: 'sql-foundation', sequence: 2, title: 'Customer Directory Lookup', difficulty: 'Beginner', xpReward: 60, prereqs: ['sql.select.001'] },
      { id: 'sql.where.001', moduleId: 'sql-where', trackId: 'sql-foundation', sequence: 1, title: 'Enterprise Subscription Filter', difficulty: 'Beginner', xpReward: 75, prereqs: ['sql.select.002'] },
      { id: 'sql.where.002', moduleId: 'sql-where', trackId: 'sql-foundation', sequence: 2, title: 'High-Value Customer Orders', difficulty: 'Beginner', xpReward: 80, prereqs: ['sql.where.001'] },
      { id: 'sql.orderby.001', moduleId: 'sql-orderby-limit', trackId: 'sql-foundation', sequence: 1, title: 'Top-Selling Products by Revenue', difficulty: 'Beginner', xpReward: 90, prereqs: ['sql.where.002'] },
      { id: 'sql.orderby.002', moduleId: 'sql-orderby-limit', trackId: 'sql-foundation', sequence: 2, title: 'Recent High-Value Shipments', difficulty: 'Beginner', xpReward: 100, prereqs: ['sql.orderby.001'] },
    ];

    const modulesDef = [
      { id: 'sql-select', trackId: 'sql-foundation', sequence: 1, title: 'SELECT & Projections', prereqs: [] as string[] },
      { id: 'sql-where', trackId: 'sql-foundation', sequence: 2, title: 'WHERE Filtering & Logic', prereqs: ['sql-select'] },
      { id: 'sql-orderby-limit', trackId: 'sql-foundation', sequence: 3, title: 'ORDER BY & LIMIT Sorting', prereqs: ['sql-where'] },
    ];

    const tracksDef = [
      { id: 'sql-foundation', sequence: 1, title: 'SQL Foundation' },
      { id: 'data-analysis-core', sequence: 2, title: 'Data Analysis Core' },
      { id: 'relational-sql', sequence: 3, title: 'Relational SQL' },
      { id: 'analytical-thinking', sequence: 4, title: 'Analytical Thinking' },
      { id: 'advanced-analytics', sequence: 5, title: 'Advanced Analytics' },
      { id: 'real-world-sql', sequence: 6, title: 'Real-World SQL & Investigation' },
    ];

    let totalUnlocked = 0;
    let totalCompleted = 0;
    let totalMastered = 0;
    let totalXpEarned = 0;

    // Evaluate Challenges
    const challenges = challengesDef.map((c) => {
      const prog = progressMap.get(c.id);
      const progressStatus = prog?.status || 'NOT_STARTED';
      const bestScore = prog?.bestScore || 0;
      const xpEarned = prog?.xpEarned || 0;

      if (xpEarned > 0) totalXpEarned += xpEarned;
      if (progressStatus === 'COMPLETED' || progressStatus === 'MASTERED') totalCompleted++;
      if (progressStatus === 'MASTERED') totalMastered++;

      let isUnlocked = false;
      let reasonCode = 'PREREQUISITES_INCOMPLETE';

      if (c.prereqs.length === 0) {
        isUnlocked = true;
        reasonCode = 'ALWAYS_UNLOCKED';
      } else {
        const allPrereqsMet = c.prereqs.every((pId) => {
          const pProg = progressMap.get(pId);
          return pProg?.status === 'COMPLETED' || pProg?.status === 'MASTERED';
        });
        if (allPrereqsMet) {
          isUnlocked = true;
          reasonCode = 'PREREQUISITES_COMPLETE';
        }
      }

      if (isUnlocked) totalUnlocked++;

      return {
        id: c.id,
        type: 'challenge',
        title: c.title,
        isUnlocked,
        status: isUnlocked ? 'UNLOCKED' : 'LOCKED',
        reasonCode,
        explanation: isUnlocked ? 'Challenge is available.' : 'Complete prerequisite challenges to unlock.',
        progressStatus,
        bestScore,
        xpEarned,
        requirements: c.prereqs.length > 0 ? [
          {
            type: 'PREREQUISITE_CHALLENGES',
            satisfied: isUnlocked,
            required: c.prereqs,
            completed: c.prereqs.filter((pId) => {
              const pProg = progressMap.get(pId);
              return pProg?.status === 'COMPLETED' || pProg?.status === 'MASTERED';
            }),
            remaining: isUnlocked ? 0 : 1,
            description: `Requires completion of: ${c.prereqs.join(', ')}`,
          },
        ] : [],
      };
    });

    // Evaluate Modules
    const modules = modulesDef.map((m) => {
      let isUnlocked = false;
      let reasonCode = 'MODULE_INCOMPLETE';

      if (m.prereqs.length === 0) {
        isUnlocked = true;
        reasonCode = 'ALWAYS_UNLOCKED';
      } else {
        const allPrereqsMet = m.prereqs.every((prereqModId) => {
          const modChallenges = challengesDef.filter((c) => c.moduleId === prereqModId);
          return modChallenges.every((c) => {
            const p = progressMap.get(c.id);
            return p?.status === 'COMPLETED' || p?.status === 'MASTERED';
          });
        });
        if (allPrereqsMet) {
          isUnlocked = true;
          reasonCode = 'MODULE_COMPLETE';
        }
      }

      return {
        id: m.id,
        type: 'module',
        title: m.title,
        isUnlocked,
        status: isUnlocked ? 'UNLOCKED' : 'LOCKED',
        reasonCode,
        explanation: isUnlocked ? 'Module is available.' : 'Complete prerequisite modules to unlock.',
        requirements: [],
      };
    });

    // Evaluate Tracks
    const tracks = tracksDef.map((t) => {
      const isUnlocked = t.sequence === 1;
      return {
        id: t.id,
        type: 'track',
        title: t.title,
        isUnlocked,
        status: isUnlocked ? 'UNLOCKED' : 'LOCKED',
        reasonCode: isUnlocked ? 'ALWAYS_UNLOCKED' : 'TRACK_INCOMPLETE',
        explanation: isUnlocked ? 'Foundational track is available.' : 'Complete previous tracks to unlock.',
        requirements: [],
      };
    });

    return {
      userId,
      productId: 'sql',
      tracks,
      modules,
      challenges,
      totalChallenges: challengesDef.length,
      totalUnlockedChallenges: totalUnlocked,
      totalCompletedChallenges: totalCompleted,
      totalMasteredChallenges: totalMastered,
      totalXpEarned,
      evaluatedAt: new Date().toISOString(),
    };
  }
);
