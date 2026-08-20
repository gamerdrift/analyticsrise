import app from '../firebase/config';
import { getAnalytics, logEvent, setUserId as firebaseSetUserId, setUserProperties as firebaseSetUserProperties } from 'firebase/analytics';
import { logger } from '../utils/logger';

let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;

/**
 * Safely resolve the Firebase Analytics instance on the client.
 * Returns null in server-side environments or non-production modes.
 */
const getAnalyticsSafely = (): ReturnType<typeof getAnalytics> | null => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    if (!analyticsInstance) {
      try {
        analyticsInstance = getAnalytics(app);
      } catch (e) {
        logger.error('Failed to initialize Firebase Analytics:', e);
      }
    }
  }
  return analyticsInstance;
};

/**
 * Analytics Service
 * 
 * Centralized tracking utility that logs telemetry and events. Logs safely fail-over
 * to the logger console utility during local development.
 */
export const AnalyticsService = {
  /**
   * Log an event to Analytics (with custom metadata attributes)
   */
  logCustomEvent(eventName: string, eventParams?: Record<string, unknown>): void {
    const analytics = getAnalyticsSafely();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    } else {
      logger.debug('Analytics Event (Simulated):', eventName, eventParams);
    }
  },

  /**
   * Set the active user ID for cross-session tracking
   */
  setUserId(userId: string | null): void {
    const analytics = getAnalyticsSafely();
    if (analytics) {
      firebaseSetUserId(analytics, userId);
    } else {
      logger.debug('Analytics UserID (Simulated):', userId);
    }
  },

  /**
   * Bind static profile attributes (e.g. current level or role) to the user record
   */
  setUserProperties(properties: Record<string, string | number | boolean | null>): void {
    const analytics = getAnalyticsSafely();
    if (analytics) {
      firebaseSetUserProperties(analytics, properties);
    } else {
      logger.debug('Analytics User Properties (Simulated):', properties);
    }
  },

  // --------------------------------------------------------------------------
  // Learner Lifecycle & Conversion Telemetry Methods (Mission 04)
  // --------------------------------------------------------------------------

  logLearningStarted(trackId: string, source: string = 'homepage'): void {
    this.logCustomEvent('learning_started', { trackId, source, timestamp: Date.now() });
  },

  logStudioOpened(studioId: string): void {
    this.logCustomEvent('studio_opened', { studioId, timestamp: Date.now() });
  },

  logExerciseCompleted(exerciseId: string, durationMs?: number): void {
    this.logCustomEvent('exercise_completed', { exerciseId, durationMs, timestamp: Date.now() });
  },

  logChallengeStarted(challengeId: string, difficulty?: string): void {
    this.logCustomEvent('challenge_started', { challengeId, difficulty, timestamp: Date.now() });
  },

  logChallengeCompleted(challengeId: string, score: number, xpAwarded: number): void {
    this.logCustomEvent('challenge_completed', { challengeId, score, xpAwarded, timestamp: Date.now() });
  },

  logUpgradePromptViewed(featureId: string, productId: string): void {
    this.logCustomEvent('upgrade_prompt_viewed', { featureId, productId, timestamp: Date.now() });
  },

  logUpgradePromptDismissed(featureId: string, productId: string): void {
    this.logCustomEvent('upgrade_prompt_dismissed', { featureId, productId, timestamp: Date.now() });
  },

  logUpgradeInterest(featureId: string, planId: string): void {
    this.logCustomEvent('upgrade_interest', { featureId, planId, timestamp: Date.now() });
  },

  logProductUpgradeExplored(productId: string): void {
    this.logCustomEvent('product_upgrade_explored', { productId, timestamp: Date.now() });
  },

  // --------------------------------------------------------------------------
  // SQL Workspace Telemetry Methods (Mission 05)
  // --------------------------------------------------------------------------

  logWorkspaceOpened(): void {
    this.logCustomEvent('workspace_opened', { timestamp: Date.now() });
  },

  logWorkspaceUploadStarted(fileSize: number): void {
    this.logCustomEvent('workspace_upload_started', { fileSize, timestamp: Date.now() });
  },

  logWorkspaceUploadCompleted(fileName: string, rowCount: number, colCount: number): void {
    this.logCustomEvent('workspace_upload_completed', { fileName, rowCount, colCount, timestamp: Date.now() });
  },

  logWorkspaceDatasetRejected(reason: string): void {
    this.logCustomEvent('workspace_dataset_rejected', { reason, timestamp: Date.now() });
  },

  logWorkspaceQueryRun(rowCount: number, executionMs: number): void {
    this.logCustomEvent('workspace_query_run', { rowCount, executionMs, timestamp: Date.now() });
  },

  logWorkspaceProjectSaved(projectId: string): void {
    this.logCustomEvent('workspace_project_saved', { projectId, timestamp: Date.now() });
  },

  logWorkspaceExported(rowCount: number): void {
    this.logCustomEvent('workspace_exported', { rowCount, timestamp: Date.now() });
  },

  // --------------------------------------------------------------------------
  // Excel Workspace Telemetry Methods (Mission 07)
  // --------------------------------------------------------------------------

  logExcelWorkspaceOpened(): void {
    this.logCustomEvent('excel_workspace_opened', { timestamp: Date.now() });
  },

  logExcelWorkspaceUploadStarted(fileSize: number): void {
    this.logCustomEvent('excel_workspace_upload_started', { fileSize, timestamp: Date.now() });
  },

  logExcelWorkspaceUploadCompleted(fileName: string, sheetCount: number, rowCount: number, colCount: number): void {
    this.logCustomEvent('excel_workspace_upload_completed', { fileName, sheetCount, rowCount, colCount, timestamp: Date.now() });
  },

  logExcelWorkspaceDatasetRejected(reason: string): void {
    this.logCustomEvent('excel_workspace_dataset_rejected', { reason, timestamp: Date.now() });
  },

  logExcelWorkspaceFormulaEvaluated(formula: string): void {
    this.logCustomEvent('excel_workspace_formula_evaluated', { formula, timestamp: Date.now() });
  },

  logExcelWorkspaceProjectSaved(projectId: string): void {
    this.logCustomEvent('excel_workspace_project_saved', { projectId, timestamp: Date.now() });
  },

  logExcelWorkspaceExported(format: string, rowCount: number): void {
    this.logCustomEvent('excel_workspace_exported', { format, rowCount, timestamp: Date.now() });
  },
};

export default AnalyticsService;
