import { ProtectedChallengeData, FullChallengeDefinition } from '../types';
import { PUBLIC_CHALLENGES } from '../public/challenges';
import { SQL_TRACKS, SQL_MODULES } from '../modules';
import { PROTECTED_CHALLENGES } from './challenges.server';
import { listDatasets } from '../../datasets';

export * from './validation/index.server';
export * from './progress/index.server';

/**
 * Server-Authoritative Challenge Registry
 * Provides access to canonical SQL solutions and hidden verification definitions.
 * 
 * SECURITY BOUNDARY:
 * This registry MUST ONLY be imported in backend services, evaluation pipelines,
 * and test suites. It must never be exposed to learner-facing code.
 */

/**
 * Retrieves protected solution data for a challenge by ID
 */
export function getProtectedChallenge(id: string): ProtectedChallengeData | undefined {
  return PROTECTED_CHALLENGES[id];
}

/**
 * Retrieves the complete challenge definition (public metadata + protected solution)
 */
export function getFullChallenge(id: string): FullChallengeDefinition | undefined {
  const pub = PUBLIC_CHALLENGES.find((c) => c.id === id);
  const prot = PROTECTED_CHALLENGES[id];

  if (!pub || !prot) return undefined;

  return {
    public: pub,
    protected: prot,
  };
}

/**
 * Lists all full challenge definitions
 */
export function listFullChallenges(): FullChallengeDefinition[] {
  return PUBLIC_CHALLENGES.map((pub) => ({
    public: pub,
    protected: PROTECTED_CHALLENGES[pub.id] ?? {
      id: pub.id,
      canonicalSolutionSql: '',
      hiddenValidationRules: [],
    },
  }));
}

/**
 * Validates the full relational and referential integrity of the challenge catalog
 */
export function validateChallengeIntegrity(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const trackIds = new Set(SQL_TRACKS.map((t) => t.id));
  const moduleIds = new Set(SQL_MODULES.map((m) => m.id));
  const challengeIds = new Set<string>();
  const availableDatasets = new Set(listDatasets().map((d) => d.id.toLowerCase()));

  // 1. Verify Modules refer to existing Tracks
  for (const mod of SQL_MODULES) {
    if (!trackIds.has(mod.trackId)) {
      errors.push(`Module '${mod.id}' references non-existent track '${mod.trackId}'`);
    }
    if (mod.prerequisites) {
      for (const reqMod of mod.prerequisites) {
        if (!moduleIds.has(reqMod)) {
          errors.push(`Module '${mod.id}' references non-existent prerequisite module '${reqMod}'`);
        }
      }
    }
  }

  // 2. Verify Challenges
  for (const chal of PUBLIC_CHALLENGES) {
    // Unique ID
    if (challengeIds.has(chal.id)) {
      errors.push(`Duplicate challenge ID detected: '${chal.id}'`);
    }
    challengeIds.add(chal.id);

    // Track reference
    if (!trackIds.has(chal.trackId)) {
      errors.push(`Challenge '${chal.id}' references non-existent track '${chal.trackId}'`);
    }

    // Module reference
    if (!moduleIds.has(chal.moduleId)) {
      errors.push(`Challenge '${chal.id}' references non-existent module '${chal.moduleId}'`);
    }

    // Dataset reference
    if (!availableDatasets.has(chal.datasetId.toLowerCase())) {
      errors.push(`Challenge '${chal.id}' references non-existent dataset '${chal.datasetId}'`);
    }

    // Protected data pairing
    if (!PROTECTED_CHALLENGES[chal.id]) {
      errors.push(`Challenge '${chal.id}' is missing corresponding protected server definition`);
    } else {
      const prot = PROTECTED_CHALLENGES[chal.id];
      if (!prot.canonicalSolutionSql || prot.canonicalSolutionSql.trim().length === 0) {
        errors.push(`Challenge '${chal.id}' has empty canonical solution SQL`);
      }
    }

    // Prerequisites reference existing challenges
    for (const prereqId of chal.prerequisites) {
      const exists = PUBLIC_CHALLENGES.some((c) => c.id === prereqId);
      if (!exists) {
        errors.push(`Challenge '${chal.id}' references non-existent prerequisite '${prereqId}'`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
