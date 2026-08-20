/**
 * AnalyticsRise Challenge Validation Engine — Protected Server API
 * Authoritative submission evaluation, comparators, and rule engines.
 * 
 * SECURITY BOUNDARY:
 * This module is isolated to backend services and tests.
 * NEVER import this module in client-facing components.
 */

export * from './types.server';
export * from './executeSubmission.server';
export * from './comparators.server';
export * from './rules.server';
export * from './validateChallenge.server';
