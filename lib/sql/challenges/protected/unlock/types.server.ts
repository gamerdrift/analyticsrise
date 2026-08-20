import { ChallengeProgressRecord, UserChallengeSummary } from '../progress/types.server';
import { PublicChallenge, ChallengeModule, ChallengeTrack, ProductId } from '../../types';

export type UnlockStatus = 'UNLOCKED' | 'LOCKED' | 'ERROR';

export type UnlockReasonCode =
  | 'ALWAYS_UNLOCKED'
  | 'PREREQUISITES_COMPLETE'
  | 'PREREQUISITES_INCOMPLETE'
  | 'XP_REQUIREMENT_MET'
  | 'XP_REQUIREMENT_NOT_MET'
  | 'TRACK_COMPLETE'
  | 'TRACK_INCOMPLETE'
  | 'MODULE_COMPLETE'
  | 'MODULE_INCOMPLETE'
  | 'UNKNOWN_RULE'
  | 'INVALID_TARGET'
  | 'INSUFFICIENT_DATA';

export interface UnlockRequirementResult {
  type: string;
  satisfied: boolean;
  required?: string[] | number | string;
  completed?: string[] | number | string;
  remaining?: number;
  description: string;
}

export interface UnlockDecision {
  targetId: string;
  targetType: 'challenge' | 'module' | 'track';
  isUnlocked: boolean;
  status: UnlockStatus;
  reasonCode: UnlockReasonCode;
  explanation: string;
  requirements: UnlockRequirementResult[];
  evaluatedAt: string;
}

export interface UnlockEvaluationContext {
  userId: string;
  productId: ProductId;
  progressMap: Map<string, ChallengeProgressRecord>;
  userSummary?: UserChallengeSummary;
  challenges: PublicChallenge[];
  modules: ChallengeModule[];
  tracks: ChallengeTrack[];
}

export interface ProgressionMapItem {
  id: string;
  type: 'challenge' | 'module' | 'track';
  title: string;
  isUnlocked: boolean;
  status: UnlockStatus;
  reasonCode: UnlockReasonCode;
  explanation: string;
  progressStatus?: string; // 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED'
  bestScore?: number;
  xpEarned?: number;
  requirements: UnlockRequirementResult[];
}

export interface UserProgressionMap {
  userId: string;
  productId: ProductId;
  tracks: ProgressionMapItem[];
  modules: ProgressionMapItem[];
  challenges: ProgressionMapItem[];
  totalChallenges: number;
  totalUnlockedChallenges: number;
  totalCompletedChallenges: number;
  totalMasteredChallenges: number;
  totalXpEarned: number;
  evaluatedAt: string;
}
