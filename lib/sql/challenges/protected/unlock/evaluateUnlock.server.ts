import { UnlockRule } from '../../types';
import {
  UnlockStatus,
  UnlockReasonCode,
  UnlockRequirementResult,
  UnlockEvaluationContext,
} from './types.server';

export interface UnlockRuleEvaluationOutcome {
  isUnlocked: boolean;
  status: UnlockStatus;
  reasonCode: UnlockReasonCode;
  explanation: string;
  requirements: UnlockRequirementResult[];
}

/**
 * Authoritatively evaluates declarative unlock rules against learner progress
 * 
 * Architectural Rules:
 * 1. Default Deny: If rule is unknown, malformed, or missing, it fails closed (LOCKED).
 * 2. Deterministic: Pure function evaluated from authoritative context.
 * 3. Mastery counts as completion: Both 'COMPLETED' and 'MASTERED' satisfy prerequisite requirements.
 */
export function evaluateUnlockRule(
  rule: UnlockRule | undefined | null,
  context: UnlockEvaluationContext
): UnlockRuleEvaluationOutcome {
  // Default Deny: Missing or invalid rule definition
  if (!rule || typeof rule !== 'object' || !rule.type) {
    return {
      isUnlocked: false,
      status: 'LOCKED',
      reasonCode: 'UNKNOWN_RULE',
      explanation: 'Content is locked because unlock criteria could not be verified.',
      requirements: [
        {
          type: 'UNKNOWN_RULE',
          satisfied: false,
          description: 'Valid unlock rule definition is required.',
        },
      ],
    };
  }

  switch (rule.type) {
    case 'ALWAYS_UNLOCKED': {
      return {
        isUnlocked: true,
        status: 'UNLOCKED',
        reasonCode: 'ALWAYS_UNLOCKED',
        explanation: 'This content is available immediately.',
        requirements: [
          {
            type: 'ALWAYS_UNLOCKED',
            satisfied: true,
            description: 'No prerequisites required.',
          },
        ],
      };
    }

    case 'PREREQUISITE_CHALLENGES': {
      const requiredPrereqs = rule.prerequisiteChallengeIds || [];
      if (requiredPrereqs.length === 0) {
        return {
          isUnlocked: true,
          status: 'UNLOCKED',
          reasonCode: 'ALWAYS_UNLOCKED',
          explanation: 'No prerequisite challenges are required.',
          requirements: [],
        };
      }

      const completed: string[] = [];
      const missing: string[] = [];

      for (const reqId of requiredPrereqs) {
        const progress = context.progressMap.get(reqId);
        const isComplete = progress?.status === 'COMPLETED' || progress?.status === 'MASTERED';
        if (isComplete) {
          completed.push(reqId);
        } else {
          missing.push(reqId);
        }
      }

      const allSatisfied = missing.length === 0;

      return {
        isUnlocked: allSatisfied,
        status: allSatisfied ? 'UNLOCKED' : 'LOCKED',
        reasonCode: allSatisfied ? 'PREREQUISITES_COMPLETE' : 'PREREQUISITES_INCOMPLETE',
        explanation: allSatisfied
          ? 'All prerequisite challenges have been completed.'
          : `Complete all prerequisite challenges to unlock (${completed.length}/${requiredPrereqs.length} completed).`,
        requirements: [
          {
            type: 'PREREQUISITE_CHALLENGES',
            satisfied: allSatisfied,
            required: requiredPrereqs,
            completed,
            remaining: missing.length,
            description: `Requires completion of: ${requiredPrereqs.join(', ')}`,
          },
        ],
      };
    }

    case 'XP_THRESHOLD': {
      const requiredXp = rule.requiredXp ?? 0;
      let currentXp = context.userSummary?.totalXpEarned;

      if (currentXp === undefined) {
        currentXp = Array.from(context.progressMap.values()).reduce(
          (sum, p) => sum + (p.xpEarned || 0),
          0
        );
      }

      const satisfied = currentXp >= requiredXp;
      const remaining = Math.max(0, requiredXp - currentXp);

      return {
        isUnlocked: satisfied,
        status: satisfied ? 'UNLOCKED' : 'LOCKED',
        reasonCode: satisfied ? 'XP_REQUIREMENT_MET' : 'XP_REQUIREMENT_NOT_MET',
        explanation: satisfied
          ? `XP requirement of ${requiredXp} XP has been satisfied (${currentXp} XP earned).`
          : `Earn ${remaining} more XP to unlock this challenge (${currentXp}/${requiredXp} XP).`,
        requirements: [
          {
            type: 'XP_THRESHOLD',
            satisfied,
            required: requiredXp,
            completed: currentXp,
            remaining,
            description: `Requires ${requiredXp} total XP`,
          },
        ],
      };
    }

    case 'TRACK_COMPLETION': {
      const targetTrackId = rule.requiredModuleId; // Using identifier field
      if (!targetTrackId) {
        return {
          isUnlocked: false,
          status: 'LOCKED',
          reasonCode: 'TRACK_INCOMPLETE',
          explanation: 'Track prerequisite is incomplete.',
          requirements: [
            {
              type: 'TRACK_COMPLETION',
              satisfied: false,
              description: 'Target track must be completed.',
            },
          ],
        };
      }

      // Find all challenges belonging to the required track
      const trackChallenges = context.challenges.filter((c) => c.trackId === targetTrackId);
      if (trackChallenges.length === 0) {
        return {
          isUnlocked: true,
          status: 'UNLOCKED',
          reasonCode: 'TRACK_COMPLETE',
          explanation: 'Prerequisite track has no challenge requirements.',
          requirements: [],
        };
      }

      const completedChallenges = trackChallenges.filter((c) => {
        const prog = context.progressMap.get(c.id);
        return prog?.status === 'COMPLETED' || prog?.status === 'MASTERED';
      });

      const allTrackCompleted = completedChallenges.length === trackChallenges.length;

      return {
        isUnlocked: allTrackCompleted,
        status: allTrackCompleted ? 'UNLOCKED' : 'LOCKED',
        reasonCode: allTrackCompleted ? 'TRACK_COMPLETE' : 'TRACK_INCOMPLETE',
        explanation: allTrackCompleted
          ? 'Prerequisite track is fully completed.'
          : `Complete all challenges in prerequisite track '${targetTrackId}' (${completedChallenges.length}/${trackChallenges.length} completed).`,
        requirements: [
          {
            type: 'TRACK_COMPLETION',
            satisfied: allTrackCompleted,
            required: trackChallenges.length,
            completed: completedChallenges.length,
            remaining: trackChallenges.length - completedChallenges.length,
            description: `Requires completion of track '${targetTrackId}'`,
          },
        ],
      };
    }

    default: {
      return {
        isUnlocked: false,
        status: 'LOCKED',
        reasonCode: 'UNKNOWN_RULE',
        explanation: 'Unrecognized unlock rule type. Content remains locked.',
        requirements: [
          {
            type: 'UNKNOWN_RULE',
            satisfied: false,
            description: 'Unknown unlock rule configuration.',
          },
        ],
      };
    }
  }
}
