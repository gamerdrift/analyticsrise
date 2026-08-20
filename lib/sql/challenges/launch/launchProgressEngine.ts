import {
  ChallengeProgressRecord,
  ChallengeAttemptRecord,
  UserChallengeSummary,
  UnlockDecision,
  UserProgressionMap,
  ProgressionMapItem,
  UnlockRequirementResult,
  ChallengeProgressStatus,
} from '../types';
import { SQL_TRACKS, SQL_MODULES } from '../modules';
import { getPublicChallenge, listPublicChallenges } from '../public/registry';

// In-memory fallback cache for SSR, test suites, or environments without localStorage
const memoryProgressStore: Record<string, Record<string, ChallengeProgressRecord>> = {};
const memoryAttemptsStore: Record<string, ChallengeAttemptRecord[]> = {};

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__ar_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets all progress records for a user
 */
export function getAllLaunchProgress(userId: string = 'guest'): Record<string, ChallengeProgressRecord> {
  if (isLocalStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(`ar_sql_progress_${userId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fall through to in-memory store on error
    }
  }

  if (!memoryProgressStore[userId]) {
    memoryProgressStore[userId] = {};
  }
  return memoryProgressStore[userId];
}

/**
 * Gets progress for a specific challenge and user
 */
export function getLaunchProgress(
  userId: string = 'guest',
  challengeId: string
): ChallengeProgressRecord | null {
  const all = getAllLaunchProgress(userId);
  return all[challengeId] || null;
}

/**
 * Saves or updates a user's challenge progress
 */
export function saveLaunchProgress(
  userId: string = 'guest',
  progress: ChallengeProgressRecord
): void {
  const all = getAllLaunchProgress(userId);
  all[progress.challengeId] = progress;

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(`ar_sql_progress_${userId}`, JSON.stringify(all));
    } catch {
      // Storage quota or restriction; fallback to memory
    }
  }

  if (!memoryProgressStore[userId]) {
    memoryProgressStore[userId] = {};
  }
  memoryProgressStore[userId][progress.challengeId] = progress;
}

/**
 * Gets all attempt records for a user
 */
export function getLaunchAttempts(
  userId: string = 'guest',
  challengeId?: string,
  limit: number = 20
): ChallengeAttemptRecord[] {
  let attempts: ChallengeAttemptRecord[] = [];

  if (isLocalStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(`ar_sql_attempts_${userId}`);
      if (raw) {
        attempts = JSON.parse(raw);
      }
    } catch {
      // Fall through to in-memory
    }
  }

  if (attempts.length === 0 && memoryAttemptsStore[userId]) {
    attempts = memoryAttemptsStore[userId];
  }

  if (challengeId) {
    attempts = attempts.filter((a) => a.challengeId === challengeId);
  }

  return attempts.slice(0, Math.min(limit, 50));
}

/**
 * Appends a new attempt record for a user
 */
export function saveLaunchAttempt(
  userId: string = 'guest',
  attempt: ChallengeAttemptRecord
): void {
  const existing = getLaunchAttempts(userId, undefined, 100);
  const updated = [attempt, ...existing].slice(0, 100);

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(`ar_sql_attempts_${userId}`, JSON.stringify(updated));
    } catch {
      // Storage quota; fallback to memory
    }
  }

  memoryAttemptsStore[userId] = updated;
}

/**
 * Evaluates unlock status for a specific challenge in Launch Mode
 */
export function evaluateLaunchUnlock(
  userId: string = 'guest',
  challengeId: string
): UnlockDecision {
  const evaluatedAt = new Date().toISOString();
  const challenge = getPublicChallenge(challengeId);

  if (!challenge) {
    return {
      targetId: challengeId,
      targetType: 'challenge',
      isUnlocked: false,
      status: 'ERROR',
      reasonCode: 'INVALID_TARGET',
      explanation: `Challenge '${challengeId}' does not exist in catalog.`,
      requirements: [],
      evaluatedAt,
    };
  }

  // 1. Always unlocked challenges
  if (challenge.unlockRules.type === 'ALWAYS_UNLOCKED' || challenge.prerequisites.length === 0) {
    return {
      targetId: challengeId,
      targetType: 'challenge',
      isUnlocked: true,
      status: 'UNLOCKED',
      reasonCode: 'ALWAYS_UNLOCKED',
      explanation: 'This introductory challenge is always available to all learners.',
      requirements: [
        {
          type: 'ALWAYS_UNLOCKED',
          satisfied: true,
          description: 'Always unlocked starter challenge',
        },
      ],
      evaluatedAt,
    };
  }

  // 2. Prerequisite challenges check
  const allProgress = getAllLaunchProgress(userId);
  const requirements: UnlockRequirementResult[] = [];
  let allPrereqsCompleted = true;

  for (const prereqId of challenge.prerequisites) {
    const prereqProgress = allProgress[prereqId];
    const isCompleted =
      prereqProgress?.status === 'COMPLETED' || prereqProgress?.status === 'MASTERED';

    if (!isCompleted) {
      allPrereqsCompleted = false;
    }

    const prereqChallenge = getPublicChallenge(prereqId);
    requirements.push({
      type: 'PREREQUISITE_CHALLENGE',
      satisfied: isCompleted,
      required: prereqId,
      completed: isCompleted ? prereqId : undefined,
      description: `Complete "${prereqChallenge?.title || prereqId}"`,
    });
  }

  if (allPrereqsCompleted) {
    return {
      targetId: challengeId,
      targetType: 'challenge',
      isUnlocked: true,
      status: 'UNLOCKED',
      reasonCode: 'PREREQUISITES_COMPLETE',
      explanation: 'All prerequisite challenges have been completed.',
      requirements,
      evaluatedAt,
    };
  }

  return {
    targetId: challengeId,
    targetType: 'challenge',
    isUnlocked: false,
    status: 'LOCKED',
    reasonCode: 'PREREQUISITES_INCOMPLETE',
    explanation: 'Complete preceding challenges in this learning track to unlock this mission.',
    requirements,
    evaluatedAt,
  };
}

/**
 * Builds user challenge summary across all challenges in Launch Mode
 */
export function getLaunchUserSummary(userId: string = 'guest'): UserChallengeSummary {
  const allProgress = getAllLaunchProgress(userId);
  const records = Object.values(allProgress);

  let totalStarted = 0;
  let totalCompleted = 0;
  let totalMastered = 0;
  let totalXp = 0;
  let lastActive: string | null = null;

  for (const rec of records) {
    if (rec.status !== 'NOT_STARTED') totalStarted++;
    if (rec.status === 'COMPLETED' || rec.status === 'MASTERED') totalCompleted++;
    if (rec.status === 'MASTERED') totalMastered++;
    totalXp += rec.xpEarned || 0;

    if (!lastActive || (rec.lastAttemptAt && rec.lastAttemptAt > lastActive)) {
      lastActive = rec.lastAttemptAt;
    }
  }

  return {
    userId,
    productId: 'sql',
    totalChallengesStarted: totalStarted,
    totalChallengesCompleted: totalCompleted,
    totalChallengesMastered: totalMastered,
    totalXpEarned: totalXp,
    lastActiveAt: lastActive,
  };
}

/**
 * Builds full progression map for curriculum display in Launch Mode
 */
export function getLaunchProgressionMap(userId: string = 'guest'): UserProgressionMap {
  const evaluatedAt = new Date().toISOString();
  const allChallenges = listPublicChallenges();
  const allProgress = getAllLaunchProgress(userId);

  const challengeItems: ProgressionMapItem[] = allChallenges.map((chal) => {
    const unlock = evaluateLaunchUnlock(userId, chal.id);
    const prog = allProgress[chal.id];

    return {
      id: chal.id,
      type: 'challenge',
      title: chal.title,
      isUnlocked: unlock.isUnlocked,
      status: unlock.status,
      reasonCode: unlock.reasonCode,
      explanation: unlock.explanation,
      progressStatus: prog?.status || 'NOT_STARTED',
      bestScore: prog?.bestScore || 0,
      xpEarned: prog?.xpEarned || 0,
      requirements: unlock.requirements,
    };
  });

  const moduleItems: ProgressionMapItem[] = SQL_MODULES.map((mod) => {
    const modChallenges = challengeItems.filter((c) => {
      const chal = getPublicChallenge(c.id);
      return chal?.moduleId === mod.id;
    });

    const isUnlocked = modChallenges.some((c) => c.isUnlocked);
    const isCompleted = modChallenges.length > 0 && modChallenges.every((c) => c.progressStatus === 'COMPLETED' || c.progressStatus === 'MASTERED');

    return {
      id: mod.id,
      type: 'module',
      title: mod.title,
      isUnlocked,
      status: isUnlocked ? 'UNLOCKED' : 'LOCKED',
      reasonCode: isUnlocked ? 'ALWAYS_UNLOCKED' : 'PREREQUISITES_INCOMPLETE',
      explanation: isUnlocked ? 'Module accessible' : 'Complete previous modules to unlock',
      progressStatus: isCompleted ? 'COMPLETED' : isUnlocked ? 'IN_PROGRESS' : 'NOT_STARTED',
      requirements: [],
    };
  });

  const trackItems: ProgressionMapItem[] = SQL_TRACKS.map((track) => {
    return {
      id: track.id,
      type: 'track',
      title: track.title,
      isUnlocked: true,
      status: 'UNLOCKED',
      reasonCode: 'ALWAYS_UNLOCKED',
      explanation: 'Track accessible',
      requirements: [],
    };
  });

  const totalChallenges = allChallenges.length;
  const totalUnlocked = challengeItems.filter((c) => c.isUnlocked).length;
  const totalCompleted = challengeItems.filter(
    (c) => c.progressStatus === 'COMPLETED' || c.progressStatus === 'MASTERED'
  ).length;
  const totalMastered = challengeItems.filter((c) => c.progressStatus === 'MASTERED').length;
  const totalXp = challengeItems.reduce((acc, c) => acc + (c.xpEarned || 0), 0);

  return {
    userId,
    productId: 'sql',
    tracks: trackItems,
    modules: moduleItems,
    challenges: challengeItems,
    totalChallenges,
    totalUnlockedChallenges: totalUnlocked,
    totalCompletedChallenges: totalCompleted,
    totalMasteredChallenges: totalMastered,
    totalXpEarned: totalXp,
    evaluatedAt,
  };
}

/**
 * Resets launch storage (useful for tests or explicit learner reset)
 */
export function clearLaunchStorage(userId?: string): void {
  if (userId) {
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(`ar_sql_progress_${userId}`);
        window.localStorage.removeItem(`ar_sql_attempts_${userId}`);
      } catch {}
    }
    delete memoryProgressStore[userId];
    delete memoryAttemptsStore[userId];
  } else {
    if (isLocalStorageAvailable()) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && (k.startsWith('ar_sql_progress_') || k.startsWith('ar_sql_attempts_'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      } catch {}
    }
    for (const k of Object.keys(memoryProgressStore)) {
      delete memoryProgressStore[k];
    }
    for (const k of Object.keys(memoryAttemptsStore)) {
      delete memoryAttemptsStore[k];
    }
  }
}
