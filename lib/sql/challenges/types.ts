/**
 * AnalyticsRise Challenge & Progression Engine — Domain Types
 * Extensible domain contracts for SQL, Excel, Power BI, and Python learning environments.
 */

export type ProductId = 'sql' | 'excel' | 'powerbi' | 'python';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SkillTag =
  | 'SELECT'
  | 'PROJECTION'
  | 'FILTERING'
  | 'WHERE'
  | 'SORTING'
  | 'ORDER_BY'
  | 'LIMIT'
  | 'AGGREGATION'
  | 'GROUP_BY'
  | 'HAVING'
  | 'JOIN'
  | 'INNER_JOIN'
  | 'LEFT_JOIN'
  | 'SUBQUERY'
  | 'CTE'
  | 'CASE_WHEN'
  | 'WINDOW_FUNCTIONS'
  | 'RANKING'
  | 'DATA_CLEANING'
  | 'ANALYTICAL_INVESTIGATION';

/**
 * Structured progressive hint contract (Phase C5 progressive escalation)
 */
export interface ChallengeHint {
  level: 1 | 2 | 3;
  title?: string;
  content: string;
  costXp?: number;
}

export type UnlockRuleType =
  | 'PREREQUISITE_CHALLENGES'
  | 'XP_THRESHOLD'
  | 'TRACK_COMPLETION'
  | 'ALWAYS_UNLOCKED';

/**
 * Declarative unlock rule definition (consumed in Phase C4)
 */
export interface UnlockRule {
  type: UnlockRuleType;
  prerequisiteChallengeIds?: string[];
  requiredXp?: number;
  requiredModuleId?: string;
}

/**
 * High-level curriculum track
 */
export interface ChallengeTrack {
  id: string;
  productId: ProductId;
  title: string;
  description: string;
  sequence: number;
  difficulty: DifficultyLevel;
  icon?: string;
}

/**
 * Module representing a focused learning unit within a track
 */
export interface ChallengeModule {
  id: string;
  trackId: string;
  productId: ProductId;
  title: string;
  description: string;
  sequence: number;
  difficulty: DifficultyLevel;
  prerequisites?: string[];
  skillsTaught: SkillTag[];
}

/**
 * Client-safe Challenge Model (Safe for public learner client bundles)
 */
export interface PublicChallenge {
  id: string;
  productId: ProductId;
  trackId: string;
  moduleId: string;
  sequence: number;
  title: string;
  difficulty: DifficultyLevel;
  skillTags: SkillTag[];
  prerequisites: string[];
  datasetId: string;
  targetTable?: string;
  objective: string;
  scenario: string;
  instructions: string[];
  starterQuery: string;
  hints: ChallengeHint[];
  xpReward: number;
  masteryThreshold: number;
  unlockRules: UnlockRule;
}

export type ValidationRuleType =
  | 'COLUMN_MATCH'
  | 'EXACT_ROW_COUNT'
  | 'MIN_ROW_COUNT'
  | 'ORDER_MATCH'
  | 'VALUE_CHECK'
  | 'CUSTOM_SQL';

export interface ValidationRuleDefinition {
  type: ValidationRuleType;
  expectedColumns?: string[];
  expectedRowCount?: number;
  minimumRowCount?: number;
  requireOrdering?: boolean;
  orderByColumn?: string;
  gradingRubric?: string;
}

/**
 * Protected Challenge Data (Server-authoritative, never exposed to learner bundles)
 */
export interface ProtectedChallengeData {
  id: string;
  canonicalSolutionSql: string;
  hiddenValidationRules: ValidationRuleDefinition[];
  internalNotes?: string;
}

/**
 * Complete internal Challenge definition uniting public metadata and protected verification
 */
export interface FullChallengeDefinition {
  public: PublicChallenge;
  protected: ProtectedChallengeData;
}

/**
 * Filter options for registry challenge lookup
 */
export interface ChallengeFilter {
  productId?: ProductId;
  trackId?: string;
  moduleId?: string;
  difficulty?: DifficultyLevel;
  skillTag?: SkillTag;
  datasetId?: string;
}

export type ChallengeProgressStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'MASTERED';

export type ChallengeValidationStatus = 'PASS' | 'FAIL' | 'PARTIAL' | 'INVALID' | 'ERROR';

/**
 * Public/Safe Attempt Record representation
 */
export interface ChallengeAttemptRecord {
  attemptId: string;
  userId: string;
  challengeId: string;
  productId: ProductId;
  submittedSql: string;
  validationStatus: ChallengeValidationStatus;
  passed: boolean;
  score: number;
  xpAwarded: number;
  hintsUsed: number;
  executionMetadata: {
    executionMs: number;
    rowCount?: number;
    columnCount?: number;
    error?: string;
  };
  submittedAt: string;
  schemaVersion: number;
}

/**
 * Public/Safe Challenge Progress representation
 */
export interface ChallengeProgressRecord {
  userId: string;
  challengeId: string;
  productId: ProductId;
  status: ChallengeProgressStatus;
  attemptCount: number;
  bestScore: number;
  xpEarned: number;
  firstAttemptAt: string;
  lastAttemptAt: string;
  completedAt: string | null;
  masteredAt: string | null;
  schemaVersion: number;
}

/**
 * Request payload for submitting a challenge attempt
 */
export interface SubmitChallengeAttemptRequest {
  challengeId: string;
  sql: string;
  hintsUsed?: number;
  idempotencyKey?: string;
}

/**
 * Authoritative response returned to the client upon submission
 */
export interface SubmitChallengeAttemptResponse {
  attemptId: string;
  challengeId: string;
  status: ChallengeValidationStatus;
  passed: boolean;
  score: number;
  xpAwarded: number;
  totalChallengeXp: number;
  progressStatus: ChallengeProgressStatus;
  bestScore: number;
  feedback: string;
  validationSummary?: {
    checksTotal: number;
    checksPassed: number;
    schemaMatched: boolean;
    dataMatched: boolean;
    rulesMatched: boolean;
  };
  execution?: {
    executionMs: number;
    rowCount?: number;
    columnCount?: number;
    error?: string;
  };
  submittedAt: string;
}

/**
 * User progress summary across all challenges
 */
export interface UserChallengeSummary {
  userId: string;
  productId: ProductId;
  totalChallengesStarted: number;
  totalChallengesCompleted: number;
  totalChallengesMastered: number;
  totalXpEarned: number;
  lastActiveAt: string | null;
}

