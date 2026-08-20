import { ChallengeProgressStatus } from './types.server';
import { ValidationStatus } from '../validation/types.server';

export interface MasteryDeterminationResult {
  status: ChallengeProgressStatus;
  isCompleted: boolean;
  isMastered: boolean;
  completedAt: string | null;
  masteredAt: string | null;
}

/**
 * Determines the authoritative lifecycle status and completion/mastery timestamps
 * 
 * Non-Regression Invariant:
 * - 'MASTERED' status never regresses to 'COMPLETED', 'IN_PROGRESS', or 'NOT_STARTED'.
 * - 'COMPLETED' status never regresses to 'IN_PROGRESS' or 'NOT_STARTED'.
 */
export function determineProgressStatus(
  currentStatus: ChallengeProgressStatus,
  validationStatus: ValidationStatus,
  passed: boolean,
  score: number,
  masteryThreshold: number,
  existingCompletedAt: string | null = null,
  existingMasteredAt: string | null = null,
  timestamp: string = new Date().toISOString()
): MasteryDeterminationResult {
  const threshold = masteryThreshold > 0 ? masteryThreshold : 100;

  // 1. If already MASTERED, retain MASTERED status and original timestamps
  if (currentStatus === 'MASTERED') {
    return {
      status: 'MASTERED',
      isCompleted: true,
      isMastered: true,
      completedAt: existingCompletedAt || timestamp,
      masteredAt: existingMasteredAt || timestamp,
    };
  }

  // 2. Check if current attempt achieves MASTERY
  const qualifiesForMastery = (passed || score >= 100) && score >= threshold;

  if (qualifiesForMastery) {
    return {
      status: 'MASTERED',
      isCompleted: true,
      isMastered: true,
      completedAt: existingCompletedAt || timestamp,
      masteredAt: existingMasteredAt || timestamp,
    };
  }

  // 3. If already COMPLETED, retain COMPLETED status (or upgrade if mastery met above)
  if (currentStatus === 'COMPLETED') {
    return {
      status: 'COMPLETED',
      isCompleted: true,
      isMastered: false,
      completedAt: existingCompletedAt || timestamp,
      masteredAt: null,
    };
  }

  // 4. Check if current attempt completes the challenge
  if (passed || score >= 100) {
    return {
      status: 'COMPLETED',
      isCompleted: true,
      isMastered: false,
      completedAt: existingCompletedAt || timestamp,
      masteredAt: null,
    };
  }

  // 5. Otherwise, if attempt was made, mark IN_PROGRESS
  return {
    status: 'IN_PROGRESS',
    isCompleted: false,
    isMastered: false,
    completedAt: null,
    masteredAt: null,
  };
}
