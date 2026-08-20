import { SQL_MODULES } from '../../modules';
import { UnlockDecision, UnlockEvaluationContext } from './types.server';
import { buildUnlockContext } from './context.server';
import { evaluateTrackUnlock } from './unlockTrack.server';

/**
 * Authoritatively evaluates whether a curriculum module is unlocked for a learner
 */
export function evaluateModuleUnlock(
  userId: string,
  moduleId: string,
  contextOverride?: UnlockEvaluationContext
): UnlockDecision {
  const evaluatedAt = new Date().toISOString();

  // 1. Resolve Module Definition
  const moduleDef = SQL_MODULES.find((m) => m.id === moduleId);
  if (!moduleDef) {
    return {
      targetId: moduleId,
      targetType: 'module',
      isUnlocked: false,
      status: 'ERROR',
      reasonCode: 'INVALID_TARGET',
      explanation: `Module '${moduleId}' was not found.`,
      requirements: [],
      evaluatedAt,
    };
  }

  // 2. Build or obtain evaluation context
  const context = contextOverride || buildUnlockContext(userId, moduleDef.productId);

  // 3. Verify Parent Track Unlock
  const trackDecision = evaluateTrackUnlock(userId, moduleDef.trackId, context);
  if (!trackDecision.isUnlocked) {
    return {
      targetId: moduleId,
      targetType: 'module',
      isUnlocked: false,
      status: 'LOCKED',
      reasonCode: 'TRACK_INCOMPLETE',
      explanation: `Parent track '${moduleDef.trackId}' is locked. Complete previous tracks to unlock this module.`,
      requirements: trackDecision.requirements,
      evaluatedAt,
    };
  }

  // 4. Evaluate Module Prerequisites
  const prerequisites = moduleDef.prerequisites || [];
  if (prerequisites.length === 0) {
    return {
      targetId: moduleId,
      targetType: 'module',
      isUnlocked: true,
      status: 'UNLOCKED',
      reasonCode: 'ALWAYS_UNLOCKED',
      explanation: 'Module is available immediately in this track.',
      requirements: [],
      evaluatedAt,
    };
  }

  const completedModules: string[] = [];
  const incompleteModules: string[] = [];

  for (const prereqModId of prerequisites) {
    // Find all challenges in the prerequisite module
    const prereqChallenges = context.challenges.filter((c) => c.moduleId === prereqModId);

    if (prereqChallenges.length === 0) {
      // If no challenges defined for that module yet, treat as satisfied
      completedModules.push(prereqModId);
      continue;
    }

    const completedCount = prereqChallenges.filter((c) => {
      const prog = context.progressMap.get(c.id);
      return prog?.status === 'COMPLETED' || prog?.status === 'MASTERED';
    }).length;

    if (completedCount === prereqChallenges.length) {
      completedModules.push(prereqModId);
    } else {
      incompleteModules.push(prereqModId);
    }
  }

  const allModulesComplete = incompleteModules.length === 0;

  return {
    targetId: moduleId,
    targetType: 'module',
    isUnlocked: allModulesComplete,
    status: allModulesComplete ? 'UNLOCKED' : 'LOCKED',
    reasonCode: allModulesComplete ? 'MODULE_COMPLETE' : 'MODULE_INCOMPLETE',
    explanation: allModulesComplete
      ? 'All prerequisite modules have been completed.'
      : `Complete prerequisite module(s): ${incompleteModules.join(', ')} (${completedModules.length}/${prerequisites.length} complete).`,
    requirements: [
      {
        type: 'MODULE_PREREQUISITES',
        satisfied: allModulesComplete,
        required: prerequisites,
        completed: completedModules,
        remaining: incompleteModules.length,
        description: `Prerequisite modules: ${prerequisites.join(', ')}`,
      },
    ],
    evaluatedAt,
  };
}
