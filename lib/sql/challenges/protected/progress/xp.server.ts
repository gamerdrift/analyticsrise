import { ValidationStatus } from '../validation/types.server';

export interface XpCalculationResult {
  xpAwarded: number; // Incremental XP for this attempt
  newTotalXp: number; // New cumulative XP for this challenge
  previousTotalXp: number;
  maxChallengeXp: number;
}

/**
 * Calculates incremental and cumulative XP deterministically, preventing XP farming
 * 
 * Rules:
 * 1. XP is only awarded when a learner achieves a new best progression state.
 * 2. Total cumulative XP earned for a challenge cannot exceed `challengeXpReward`.
 * 3. Submissions with validation status 'INVALID', 'ERROR', or 'FAIL' award 0 XP.
 * 4. Submissions with repeated identical or lower scores award 0 additional XP.
 */
export function calculateIncrementalXp(
  challengeXpReward: number,
  validationStatus: ValidationStatus,
  score: number,
  previousBestScore: number,
  previousXpEarned: number
): XpCalculationResult {
  const maxChallengeXp = Math.max(0, challengeXpReward);
  const prevXp = Math.max(0, Math.min(previousXpEarned, maxChallengeXp));

  // Non-qualifying statuses award 0 XP
  if (validationStatus === 'INVALID' || validationStatus === 'ERROR' || validationStatus === 'FAIL' || score <= 0) {
    return {
      xpAwarded: 0,
      newTotalXp: prevXp,
      previousTotalXp: prevXp,
      maxChallengeXp,
    };
  }

  // Calculate new best score
  const newBestScore = Math.min(100, Math.max(previousBestScore, score));

  // Determine eligible total XP for this best score
  let eligibleTotalXp = 0;
  if (newBestScore >= 100) {
    eligibleTotalXp = maxChallengeXp;
  } else {
    eligibleTotalXp = Math.floor((maxChallengeXp * newBestScore) / 100);
  }

  // Calculate incremental award (only positive delta beyond what was already earned)
  const xpAwarded = Math.max(0, eligibleTotalXp - prevXp);
  const newTotalXp = Math.min(maxChallengeXp, prevXp + xpAwarded);

  return {
    xpAwarded,
    newTotalXp,
    previousTotalXp: prevXp,
    maxChallengeXp,
  };
}
