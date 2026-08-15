/**
 * RevenueRiseAI — Privacy-Conscious Structured Logger
 * Enforces structured telemetry and automatic redaction of sensitive credentials,
 * API tokens, billing data, and PII.
 */

export type LogSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface LogContext {
  subsystem: 'ai_mentor' | 'learning_engine' | 'market_sim' | 'career' | 'auth' | 'entitlements' | 'general';
  action: string;
  userIdMasked?: string;
  durationMs?: number;
  [key: string]: any;
}

// Redaction patterns for secrets and tokens
const SENSITIVE_PATTERNS = [
  /AIza[0-9A-Za-z-_]{35}/gi,                                      // Google API Key
  /sk-[a-zA-Z0-9_-]{20,}/gi,                                       // OpenAI / Anthropic Key
  /rzp_(test|live)_[a-zA-Z0-9]{14,}/gi,                            // Razorpay Keys
  /Bearer\s+[a-zA-Z0-9\-_.]+/gi,                                   // JWT / Bearer
  /"?password"?\s*[:=]\s*["'][^"']+["']/gi,                       // Password
  /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/gi,             // Email PII
];

export function sanitizeLogValue(val: any): any {
  if (typeof val === 'string') {
    let sanitized = val;
    for (const pattern of SENSITIVE_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }
    return sanitized;
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeLogValue);
  }
  if (typeof val === 'object' && val !== null) {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(val)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('secret') ||
        lowerKey.includes('key') ||
        lowerKey.includes('token') ||
        lowerKey.includes('password') ||
        lowerKey.includes('auth') ||
        lowerKey.includes('credential')
      ) {
        sanitizedObj[key] = '[REDACTED_FIELD]';
      } else {
        sanitizedObj[key] = sanitizeLogValue(value);
      }
    }
    return sanitizedObj;
  }
  return val;
}

export function maskUserId(userId?: string | null): string {
  if (!userId) return 'anonymous';
  if (userId.length <= 6) return 'usr_***';
  return `usr_***${userId.slice(-4)}`;
}

export class Logger {
  private subsystem: LogContext['subsystem'];

  constructor(subsystem: LogContext['subsystem'] = 'general') {
    this.subsystem = subsystem;
  }

  private log(severity: LogSeverity, message: string, context: Partial<LogContext> = {}) {
    const timestamp = new Date().toISOString();
    const sanitizedContext = sanitizeLogValue({
      subsystem: this.subsystem,
      ...context,
    });

    const entry = {
      timestamp,
      severity,
      message: sanitizeLogValue(message),
      ...sanitizedContext,
    };

    if (process.env.NODE_ENV === 'test') {
      // Keep test output clean unless explicit debug
      return;
    }

    if (severity === 'ERROR' || severity === 'CRITICAL') {
      console.error(JSON.stringify(entry));
    } else if (severity === 'WARN') {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  public debug(message: string, context?: Partial<LogContext>) {
    this.log('DEBUG', message, context);
  }

  public info(message: string, context?: Partial<LogContext>) {
    this.log('INFO', message, context);
  }

  public warn(message: string, context?: Partial<LogContext>) {
    this.log('WARN', message, context);
  }

  public error(message: string, context?: Partial<LogContext>) {
    this.log('ERROR', message, context);
  }

  public critical(message: string, context?: Partial<LogContext>) {
    this.log('CRITICAL', message, context);
  }
}

export const logger = new Logger('general');
