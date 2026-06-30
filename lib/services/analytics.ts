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
  }
};
export default AnalyticsService;
