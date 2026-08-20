/**
 * AnalyticsRise Attempt & Progress Engine — Protected Server API
 * Authoritative submission processing, attempt persistence, progressive XP, and mastery.
 * 
 * SECURITY BOUNDARY:
 * This module is isolated to backend services and tests.
 * NEVER import this module in client-facing components.
 */

export * from './types.server';
export * from './xp.server';
export * from './mastery.server';
export * from './attempts.server';
export * from './progress.server';
export * from './submitAttempt.server';
