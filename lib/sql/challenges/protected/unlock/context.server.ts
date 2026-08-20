import { PUBLIC_CHALLENGES } from '../../public/challenges';
import { SQL_MODULES, SQL_TRACKS } from '../../modules';
import { ChallengeProgressRecord, UserChallengeSummary } from '../progress/types.server';
import { getProgressInMemory, getUserSummaryInMemory } from '../progress/progress.server';
import { UnlockEvaluationContext } from './types.server';
import { ProductId } from '../../types';

/**
 * Builds an efficient in-memory evaluation context for a learner
 */
export function buildUnlockContext(
  userId: string,
  productId: ProductId = 'sql',
  progressOverride?: Map<string, ChallengeProgressRecord>,
  summaryOverride?: UserChallengeSummary
): UnlockEvaluationContext {
  const progressMap = progressOverride || new Map<string, ChallengeProgressRecord>();

  if (!progressOverride) {
    for (const chal of PUBLIC_CHALLENGES) {
      const prog = getProgressInMemory(userId, chal.id);
      if (prog) {
        progressMap.set(chal.id, prog);
      }
    }
  }

  const userSummary = summaryOverride || getUserSummaryInMemory(userId, productId);

  return {
    userId,
    productId,
    progressMap,
    userSummary,
    challenges: PUBLIC_CHALLENGES,
    modules: SQL_MODULES,
    tracks: SQL_TRACKS,
  };
}
