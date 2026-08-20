/**
 * AnalyticsRise Challenge Unlock Engine — Protected Server API
 * Authoritative prerequisite evaluations, progression map generation, and cycle detection.
 * 
 * SECURITY BOUNDARY:
 * This module is isolated to backend services and tests.
 * NEVER import this module in client-facing components.
 */

export * from './types.server';
export * from './context.server';
export * from './evaluateUnlock.server';
export * from './unlockChallenge.server';
export * from './unlockModule.server';
export * from './unlockTrack.server';
export * from './progressionMap.server';
export * from './cycleDetection.server';
