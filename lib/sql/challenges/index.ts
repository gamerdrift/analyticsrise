/**
 * AnalyticsRise Challenge & Progression Engine — Public API
 * Exposes client-safe challenge types, modules, tracks, and public registry functions.
 * 
 * ZERO protected data, canonical solutions, or hidden grading rules are exported here.
 */

// Types (Public-safe definitions only)
export type {
  ProductId,
  DifficultyLevel,
  SkillTag,
  ChallengeHint,
  UnlockRuleType,
  UnlockRule,
  ChallengeTrack,
  ChallengeModule,
  PublicChallenge,
  ChallengeFilter,
} from './types';

// Track and Module definitions
export { SQL_TRACKS, SQL_MODULES } from './modules';

// Public Registry Functions
export {
  getPublicChallenge,
  listPublicChallenges,
  getChallengesByModule,
  getChallengesByTrack,
  getChallengesBySkill,
  getChallengesByDataset,
  getNextChallenge,
  getPreviousChallenge,
  getChallengeSequence,
  listTracks,
  getTrackById,
  listModules,
  getModuleById,
} from './public/registry';
