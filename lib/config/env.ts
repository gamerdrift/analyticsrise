/**
 * RevenueRiseAI — Centralized Environment Configuration & Validation
 * Strictly segregates browser-safe (NEXT_PUBLIC_*) variables from server-only secrets.
 */

import { ConfigurationError } from '@/lib/errors';

export type AppEnvironment = 'development' | 'test' | 'staging' | 'production';

export interface ClientEnv {
  appUrl: string;
  apiUrl: string;
  firebaseProjectId?: string;
  firebaseAuthDomain?: string;
  firebaseApiKey?: string;
  isSimulatorsEnabled: boolean;
  isCertificationsEnabled: boolean;
}

export interface ServerEnv {
  nodeEnv: AppEnvironment;
  geminiApiKey?: string;
  claudeApiKey?: string;
  openaiApiKey?: string;
  certificateSigningSecret?: string;
}

export function getAppEnvironment(): AppEnvironment {
  const env = process.env.NODE_ENV;
  if (env === 'production') return 'production';
  if (env === 'test') return 'test';
  return 'development';
}

/**
 * Returns sanitized, client-safe environment variables
 */
export function getClientConfig(): ClientEnv {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    isSimulatorsEnabled: process.env.NEXT_PUBLIC_ENABLE_SIMULATORS === 'true',
    isCertificationsEnabled: process.env.NEXT_PUBLIC_ENABLE_CERTIFICATIONS === 'true',
  };
}

/**
 * Server-only configuration resolver. Throws ConfigurationError if called in browser.
 */
export function getServerConfig(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new ConfigurationError('Illegal access: getServerConfig() must never be invoked in browser runtime.');
  }

  return {
    nodeEnv: getAppEnvironment(),
    geminiApiKey: process.env.GEMINI_API_KEY,
    claudeApiKey: process.env.CLAUDE_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    certificateSigningSecret: process.env.CERTIFICATE_SIGNING_SECRET,
  };
}
