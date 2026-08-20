import { getPublicChallenge } from '../../public/registry';
import { UnlockDecision, UnlockEvaluationContext } from './types.server';
import { evaluateUnlockRule } from './evaluateUnlock.server';
import { buildUnlockContext } from './context.server';

/**
 * Authoritatively evaluates whether a specific challenge is unlocked for a learner
 */
export function evaluateChallengeUnlock(
  userId: string,
  challengeId: string,
  contextOverride?: UnlockEvaluationContext
): UnlockDecision {
  const evaluatedAt = new Date().toISOString();

  // 1. Validate Target Challenge
  const challenge = getPublicChallenge(challengeId);
  if (!challenge) {
    return {
      targetId: challengeId,
      targetType: 'challenge',
      isUnlocked: false,
      status: 'ERROR',
      reasonCode: 'INVALID_TARGET',
      explanation: `Challenge '${challengeId}' was not found.`,
      requirements: [],
      evaluatedAt,
    };
  }

  // 2. Build or obtain evaluation context
  const context = contextOverride || buildUnlockContext(userId, challenge.productId);

  // 3. Evaluate Declarative Unlock Rule
  const ruleOutcome = evaluateUnlockRule(challenge.unlockRules, context);

  // 4. Verify Explicit Prerequisites array if present
  if (challenge.prerequisites && challenge.prerequisites.length > 0) {
    const missingExplicitPrereqs: string[] = [];
    const completedExplicitPrereqs: string[] = [];

    for (const prereqId of challenge.prerequisites) {
      const prog = context.progressMap.get(prereqId);
      const isComplete = prog?.status === 'COMPLETED' || prog?.status === 'MASTERED';
      if (isComplete) {
        completedExplicitPrereqs.push(prereqId);
      } else {
        missingExplicitPrereqs.push(prereqId);
      }
    }

    if (missingExplicitPrereqs.length > 0) {
      return {
        targetId: challengeId,
        targetType: 'challenge',
        isUnlocked: false,
        status: 'LOCKED',
        reasonCode: 'PREREQUISITES_INCOMPLETE',
        explanation: `Complete prerequisite challenges to unlock (${completedExplicitPrereqs.length}/${challenge.prerequisites.length} completed).`,
        requirements: [
          ...ruleOutcome.requirements,
          {
            type: 'PREREQUISITE_CHALLENGES',
            satisfied: false,
            required: challenge.prerequisites,
            completed: completedExplicitPrereqs,
            remaining: missingExplicitPrereqs.length,
            description: `Prerequisites: ${challenge.prerequisites.join(', ')}`,
          },
        ],
        evaluatedAt,
      };
    }
  }

  return {
    targetId: challengeId,
    targetType: 'challenge',
    isUnlocked: ruleOutcome.isUnlocked,
    status: ruleOutcome.status,
    reasonCode: ruleOutcome.reasonCode,
    explanation: ruleOutcome.explanation,
    requirements: ruleOutcome.requirements,
    evaluatedAt,
  };
}
