import { SQL_TRACKS } from '../../modules';
import { UnlockDecision, UnlockEvaluationContext } from './types.server';
import { buildUnlockContext } from './context.server';

/**
 * Authoritatively evaluates whether a curriculum track is unlocked for a learner
 */
export function evaluateTrackUnlock(
  userId: string,
  trackId: string,
  contextOverride?: UnlockEvaluationContext
): UnlockDecision {
  const evaluatedAt = new Date().toISOString();

  // 1. Resolve Track Definition
  const trackDef = SQL_TRACKS.find((t) => t.id === trackId);
  if (!trackDef) {
    return {
      targetId: trackId,
      targetType: 'track',
      isUnlocked: false,
      status: 'ERROR',
      reasonCode: 'INVALID_TARGET',
      explanation: `Track '${trackId}' was not found.`,
      requirements: [],
      evaluatedAt,
    };
  }

  // 2. Foundational track (sequence = 1) is always unlocked
  if (trackDef.sequence === 1) {
    return {
      targetId: trackId,
      targetType: 'track',
      isUnlocked: true,
      status: 'UNLOCKED',
      reasonCode: 'ALWAYS_UNLOCKED',
      explanation: 'Foundational track is available immediately to all learners.',
      requirements: [
        {
          type: 'ALWAYS_UNLOCKED',
          satisfied: true,
          description: 'Foundational curriculum track.',
        },
      ],
      evaluatedAt,
    };
  }

  // 3. Build or obtain evaluation context
  const context = contextOverride || buildUnlockContext(userId, trackDef.productId);

  // 4. Sequential Track Progression: Verify previous track completion
  const previousTrack = SQL_TRACKS.find((t) => t.sequence === trackDef.sequence - 1);
  if (!previousTrack) {
    return {
      targetId: trackId,
      targetType: 'track',
      isUnlocked: true,
      status: 'UNLOCKED',
      reasonCode: 'ALWAYS_UNLOCKED',
      explanation: 'Track is available.',
      requirements: [],
      evaluatedAt,
    };
  }

  // Find all challenges belonging to the previous track
  const prevTrackChallenges = context.challenges.filter((c) => c.trackId === previousTrack.id);

  if (prevTrackChallenges.length === 0) {
    // If no challenges authored yet in previous track, unlock next track
    return {
      targetId: trackId,
      targetType: 'track',
      isUnlocked: true,
      status: 'UNLOCKED',
      reasonCode: 'TRACK_COMPLETE',
      explanation: `Prerequisite track '${previousTrack.title}' requirements satisfied.`,
      requirements: [],
      evaluatedAt,
    };
  }

  const completedPrevChallenges = prevTrackChallenges.filter((c) => {
    const prog = context.progressMap.get(c.id);
    return prog?.status === 'COMPLETED' || prog?.status === 'MASTERED';
  });

  const isPrevTrackComplete = completedPrevChallenges.length === prevTrackChallenges.length;

  return {
    targetId: trackId,
    targetType: 'track',
    isUnlocked: isPrevTrackComplete,
    status: isPrevTrackComplete ? 'UNLOCKED' : 'LOCKED',
    reasonCode: isPrevTrackComplete ? 'TRACK_COMPLETE' : 'TRACK_INCOMPLETE',
    explanation: isPrevTrackComplete
      ? `Prerequisite track '${previousTrack.title}' is complete.`
      : `Complete all challenges in '${previousTrack.title}' to unlock (${completedPrevChallenges.length}/${prevTrackChallenges.length} completed).`,
    requirements: [
      {
        type: 'TRACK_COMPLETION',
        satisfied: isPrevTrackComplete,
        required: prevTrackChallenges.length,
        completed: completedPrevChallenges.length,
        remaining: prevTrackChallenges.length - completedPrevChallenges.length,
        description: `Requires completion of track '${previousTrack.title}'`,
      },
    ],
    evaluatedAt,
  };
}
