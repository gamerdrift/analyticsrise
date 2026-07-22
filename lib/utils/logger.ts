/**
 * AnalyticsRise Custom Logger Utility
 * 
 * Structured, environment-aware logger supporting ISO timestamps, log levels,
 * deployment versioning, and category tagging for production telemetry.
 */

export const APP_VERSION = 'v6.1.0-beta';
const isProd = process.env.NODE_ENV === 'production';

export type LogCategory = 
  | 'AUTH' 
  | 'FIRESTORE' 
  | 'NAVIGATION' 
  | 'TELEMETRY' 
  | 'FEEDBACK' 
  | 'SYSTEM';

const CATEGORIES: Set<string> = new Set([
  'AUTH',
  'FIRESTORE',
  'NAVIGATION',
  'TELEMETRY',
  'FEEDBACK',
  'SYSTEM',
]);

function parseArgs(args: unknown[]): { category: LogCategory; message: string; data?: unknown } {
  if (args.length >= 2 && typeof args[0] === 'string' && CATEGORIES.has(args[0])) {
    return {
      category: args[0] as LogCategory,
      message: String(args[1]),
      data: args.length > 2 ? args.slice(2) : undefined,
    };
  }
  return {
    category: 'SYSTEM',
    message: typeof args[0] === 'string' ? args[0] : JSON.stringify(args[0]),
    data: args.length > 1 ? args.slice(1) : undefined,
  };
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (!isProd) {
      const { category, message, data } = parseArgs(args);
      const ts = new Date().toISOString();
      console.log(`⚡ [DEBUG] [${ts}] [${category}]: ${message}`, data !== undefined ? data : '');
    }
  },
  info: (...args: unknown[]) => {
    if (!isProd) {
      const { category, message, data } = parseArgs(args);
      const ts = new Date().toISOString();
      console.info(`ℹ️ [INFO] [${ts}] [${category}]: ${message}`, data !== undefined ? data : '');
    }
  },
  warn: (...args: unknown[]) => {
    const { category, message, data } = parseArgs(args);
    const ts = new Date().toISOString();
    console.warn(`⚠️ [WARN] [${ts}] [${category}]: ${message}`, data !== undefined ? data : '');
  },
  error: (...args: unknown[]) => {
    const { category, message, data } = parseArgs(args);
    const ts = new Date().toISOString();
    console.error(`❌ [ERROR] [${ts}] [${category}]: ${message}`, data !== undefined ? data : '');
  }
};
