import {
  PublicChallenge,
  ChallengeFilter,
  ChallengeTrack,
  ChallengeModule,
  ProductId,
  SkillTag,
} from '../types';
import { SQL_TRACKS, SQL_MODULES } from '../modules';
import { PUBLIC_CHALLENGES } from './challenges';

// In-memory index maps for O(1) retrieval
const challengeMap = new Map<string, PublicChallenge>();
PUBLIC_CHALLENGES.forEach((c) => challengeMap.set(c.id, c));

const trackMap = new Map<string, ChallengeTrack>();
SQL_TRACKS.forEach((t) => trackMap.set(t.id, t));

const moduleMap = new Map<string, ChallengeModule>();
SQL_MODULES.forEach((m) => moduleMap.set(m.id, m));

/**
 * Retrieves a client-safe challenge by its unique ID
 */
export function getPublicChallenge(id: string): PublicChallenge | undefined {
  return challengeMap.get(id);
}

/**
 * Lists all client-safe challenges matching optional filters
 */
export function listPublicChallenges(filter?: ChallengeFilter): PublicChallenge[] {
  let results = [...PUBLIC_CHALLENGES];

  if (!filter) return results;

  if (filter.productId) {
    results = results.filter((c) => c.productId === filter.productId);
  }
  if (filter.trackId) {
    results = results.filter((c) => c.trackId === filter.trackId);
  }
  if (filter.moduleId) {
    results = results.filter((c) => c.moduleId === filter.moduleId);
  }
  if (filter.difficulty) {
    results = results.filter((c) => c.difficulty === filter.difficulty);
  }
  if (filter.skillTag) {
    results = results.filter((c) => c.skillTags.includes(filter.skillTag!));
  }
  if (filter.datasetId) {
    results = results.filter((c) => c.datasetId.toLowerCase() === filter.datasetId!.toLowerCase());
  }

  return results;
}

/**
 * Retrieves all challenges for a specific module in deterministic sequence order
 */
export function getChallengesByModule(moduleId: string): PublicChallenge[] {
  return PUBLIC_CHALLENGES.filter((c) => c.moduleId === moduleId).sort(
    (a, b) => a.sequence - b.sequence
  );
}

/**
 * Retrieves all challenges for a specific track in sequence order
 */
export function getChallengesByTrack(trackId: string): PublicChallenge[] {
  return PUBLIC_CHALLENGES.filter((c) => c.trackId === trackId).sort((a, b) => {
    if (a.moduleId !== b.moduleId) {
      const modA = moduleMap.get(a.moduleId)?.sequence ?? 0;
      const modB = moduleMap.get(b.moduleId)?.sequence ?? 0;
      return modA - modB;
    }
    return a.sequence - b.sequence;
  });
}

/**
 * Retrieves all challenges that train a specific skill tag
 */
export function getChallengesBySkill(skill: SkillTag): PublicChallenge[] {
  return PUBLIC_CHALLENGES.filter((c) => c.skillTags.includes(skill));
}

/**
 * Retrieves all challenges utilizing a given dataset
 */
export function getChallengesByDataset(datasetId: string): PublicChallenge[] {
  const normId = datasetId.toLowerCase();
  return PUBLIC_CHALLENGES.filter((c) => c.datasetId.toLowerCase() === normId);
}

/**
 * Resolves the next challenge in sequence across the global curriculum
 */
export function getNextChallenge(currentId: string): PublicChallenge | undefined {
  const current = challengeMap.get(currentId);
  if (!current) return undefined;

  // First try next in same module
  const sameModule = getChallengesByModule(current.moduleId);
  const nextInMod = sameModule.find((c) => c.sequence === current.sequence + 1);
  if (nextInMod) return nextInMod;

  // Next try first challenge in next module in same track
  const currentMod = moduleMap.get(current.moduleId);
  if (currentMod) {
    const modulesInTrack = SQL_MODULES.filter((m) => m.trackId === currentMod.trackId).sort(
      (a, b) => a.sequence - b.sequence
    );
    const nextMod = modulesInTrack.find((m) => m.sequence === currentMod.sequence + 1);
    if (nextMod) {
      const inNextMod = getChallengesByModule(nextMod.id);
      if (inNextMod.length > 0) return inNextMod[0];
    }
  }

  // Next try first challenge in next track
  const currentTrack = currentMod ? trackMap.get(currentMod.trackId) : undefined;
  if (currentTrack) {
    const nextTrack = SQL_TRACKS.find((t) => t.sequence === currentTrack.sequence + 1);
    if (nextTrack) {
      const inNextTrack = getChallengesByTrack(nextTrack.id);
      if (inNextTrack.length > 0) return inNextTrack[0];
    }
  }

  return undefined;
}

/**
 * Resolves the previous challenge in sequence
 */
export function getPreviousChallenge(currentId: string): PublicChallenge | undefined {
  const current = challengeMap.get(currentId);
  if (!current) return undefined;

  // Try previous in same module
  const sameModule = getChallengesByModule(current.moduleId);
  const prevInMod = sameModule.find((c) => c.sequence === current.sequence - 1);
  if (prevInMod) return prevInMod;

  // Try last challenge in previous module in same track
  const currentMod = moduleMap.get(current.moduleId);
  if (currentMod) {
    const modulesInTrack = SQL_MODULES.filter((m) => m.trackId === currentMod.trackId).sort(
      (a, b) => a.sequence - b.sequence
    );
    const prevMod = modulesInTrack.find((m) => m.sequence === currentMod.sequence - 1);
    if (prevMod) {
      const inPrevMod = getChallengesByModule(prevMod.id);
      if (inPrevMod.length > 0) return inPrevMod[inPrevMod.length - 1];
    }
  }

  return undefined;
}

/**
 * Retrieves the complete sequential challenge array for a module
 */
export function getChallengeSequence(moduleId: string): PublicChallenge[] {
  return getChallengesByModule(moduleId);
}

/**
 * Lists all tracks for a product
 */
export function listTracks(productId: ProductId = 'sql'): ChallengeTrack[] {
  return SQL_TRACKS.filter((t) => t.productId === productId).sort((a, b) => a.sequence - b.sequence);
}

/**
 * Retrieves track metadata by ID
 */
export function getTrackById(id: string): ChallengeTrack | undefined {
  return trackMap.get(id);
}

/**
 * Lists modules, optionally filtered by track ID
 */
export function listModules(trackId?: string): ChallengeModule[] {
  if (trackId) {
    return SQL_MODULES.filter((m) => m.trackId === trackId).sort((a, b) => a.sequence - b.sequence);
  }
  return [...SQL_MODULES].sort((a, b) => a.sequence - b.sequence);
}

/**
 * Retrieves module metadata by ID
 */
export function getModuleById(id: string): ChallengeModule | undefined {
  return moduleMap.get(id);
}
