/**
 * RevenueRiseAI — Centralized Application Error Classes
 * Enforces structured diagnostic error codes, user-safe messages,
 * and HTTP status code mappings across client and server boundaries.
 */

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorDetails {
  code: string;
  userMessage: string;
  statusCode: number;
  severity: ErrorSeverity;
  metadata?: Record<string, any>;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly userMessage: string;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly metadata?: Record<string, any>;
  public readonly timestamp: number;

  constructor(
    message: string,
    details: Partial<ErrorDetails> = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.code = details.code || 'INTERNAL_APP_ERROR';
    this.userMessage = details.userMessage || 'An unexpected application error occurred. Please try again.';
    this.statusCode = details.statusCode || 500;
    this.severity = details.severity || 'medium';
    this.metadata = details.metadata;
    this.timestamp = Date.now();

    // Maintain prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      statusCode: this.statusCode,
      severity: this.severity,
      metadata: this.metadata,
      timestamp: this.timestamp,
    };
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required or token expired.', metadata?: Record<string, any>) {
    super(message, {
      code: 'UNAUTHENTICATED',
      userMessage: 'Please sign in to access this intelligence workspace feature.',
      statusCode: 401,
      severity: 'medium',
      metadata,
    });
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions for requested resource.', metadata?: Record<string, any>) {
    super(message, {
      code: 'UNAUTHORIZED_FEATURE_ACCESS',
      userMessage: 'Your active plan does not include access to this capability. Please upgrade.',
      statusCode: 403,
      severity: 'medium',
      metadata,
    });
    this.name = 'AuthorizationError';
  }
}

export class QuotaExceededError extends AppError {
  constructor(message = 'Monthly query or resource usage limit reached.', metadata?: Record<string, any>) {
    super(message, {
      code: 'QUOTA_EXCEEDED',
      userMessage: 'You have reached your monthly usage limit. Upgrade your plan to continue.',
      statusCode: 429,
      severity: 'medium',
      metadata,
    });
    this.name = 'QuotaExceededError';
  }
}

export class AIProviderError extends AppError {
  constructor(message = 'Upstream AI provider error occurred.', metadata?: Record<string, any>) {
    super(message, {
      code: 'AI_PROVIDER_ERROR',
      userMessage: 'The AI Mentor is experiencing temporary latency. Please retry shortly.',
      statusCode: 502,
      severity: 'high',
      metadata,
    });
    this.name = 'AIProviderError';
  }
}

export class IntegrationError extends AppError {
  constructor(message = 'Integration service boundary communication error.', metadata?: Record<string, any>) {
    super(message, {
      code: 'INTEGRATION_FAULT',
      userMessage: 'Could not synchronize with parent platform services. Please refresh.',
      statusCode: 500,
      severity: 'high',
      metadata,
    });
    this.name = 'IntegrationError';
  }
}

export class ConfigurationError extends AppError {
  constructor(message = 'Invalid or missing platform configuration.', metadata?: Record<string, any>) {
    super(message, {
      code: 'CONFIGURATION_ERROR',
      userMessage: 'Platform environment configuration error.',
      statusCode: 500,
      severity: 'critical',
      metadata,
    });
    this.name = 'ConfigurationError';
  }
}
