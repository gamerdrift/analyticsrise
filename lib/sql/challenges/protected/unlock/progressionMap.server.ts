import { ProductId } from '../../types';
import {
  UserProgressionMap,
  ProgressionMapItem,
  UnlockEvaluationContext,
} from './types.server';
import { buildUnlockContext } from './context.server';
import { evaluateTrackUnlock } from './unlockTrack.server';
import { evaluateModuleUnlock } from './unlockModule.server';
import { evaluateChallengeUnlock } from './unlockChallenge.server';

/**
 * Builds an authoritative, sanitized progression map for a learner across all curriculum tiers
 */
export function getUserProgressionMap(
  userId: string,
  productId: ProductId = 'sql',
  contextOverride?: UnlockEvaluationContext
): UserProgressionMap {
  const evaluatedAt = new Date().toISOString();
  const context = contextOverride || buildUnlockContext(userId, productId);

  // 1. Evaluate Tracks
  const trackItems: ProgressionMapItem[] = context.tracks
    .filter((t) => t.productId === productId)
    .sort((a, b) => a.sequence - b.sequence)
    .map((track) => {
      const decision = evaluateTrackUnlock(userId, track.id, context);
      return {
        id: track.id,
        type: 'track',
        title: track.title,
        isUnlocked: decision.isUnlocked,
        status: decision.status,
        reasonCode: decision.reasonCode,
        explanation: decision.explanation,
        requirements: decision.requirements,
      };
    });

  // 2. Evaluate Modules
  const moduleItems: ProgressionMapItem[] = context.modules
    .filter((m) => m.productId === productId)
    .sort((a, b) => a.sequence - b.sequence)
    .map((mod) => {
      const decision = evaluateModuleUnlock(userId, mod.id, context);
      return {
        id: mod.id,
        type: 'module',
        title: mod.title,
        isUnlocked: decision.isUnlocked,
        status: decision.status,
        reasonCode: decision.reasonCode,
        explanation: decision.explanation,
        requirements: decision.requirements,
      };
    });

  // 3. Evaluate Challenges
  let totalUnlocked = 0;
  let totalCompleted = 0;
  let totalMastered = 0;

  const challengeItems: ProgressionMapItem[] = context.challenges
    .filter((c) => c.productId === productId)
    .sort((a, b) => a.sequence - b.sequence)
    .map((challenge) => {
      const decision = evaluateChallengeUnlock(userId, challenge.id, context);
      const progress = context.progressMap.get(challenge.id);

      const progressStatus = progress?.status || 'NOT_STARTED';
      const bestScore = progress?.bestScore || 0;
      const xpEarned = progress?.xpEarned || 0;

      if (decision.isUnlocked) totalUnlocked++;
      if (progressStatus === 'COMPLETED' || progressStatus === 'MASTERED') totalCompleted++;
      if (progressStatus === 'MASTERED') totalMastered++;

      return {
        id: challenge.id,
        type: 'challenge',
        title: challenge.title,
        isUnlocked: decision.isUnlocked,
        status: decision.status,
        reasonCode: decision.reasonCode,
        explanation: decision.explanation,
        progressStatus,
        bestScore,
        xpEarned,
        requirements: decision.requirements,
      };
    });

  const totalXpEarned = context.userSummary?.totalXpEarned ?? 
    Array.from(context.progressMap.values()).reduce((sum, p) => sum + (p.xpEarned || 0), 0);

  return {
    userId,
    productId,
    tracks: trackItems,
    modules: moduleItems,
    challenges: challengeItems,
    totalChallenges: challengeItems.length,
    totalUnlockedChallenges: totalUnlocked,
    totalCompletedChallenges: totalCompleted,
    totalMasteredChallenges: totalMastered,
    totalXpEarned,
    evaluatedAt,
  };
}
