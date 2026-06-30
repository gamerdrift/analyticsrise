/**
 * AnalyticsRise Custom Logger Utility
 * 
 * Automatically filters debug and info logs in production mode to minimize console noise
 * and protect diagnostic detail, while ensuring critical warnings and errors are captured.
 */

const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  debug: (...args: unknown[]) => {
    if (!isProd) {
      console.log('⚡ [DEBUG]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (!isProd) {
      console.info('ℹ️ [INFO]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    // Warnings are kept in production for operational health checks
    console.warn('⚠️ [WARN]', ...args);
  },
  error: (...args: unknown[]) => {
    // Errors are always logged in all environments
    console.error('❌ [ERROR]', ...args);
  }
};
