import { logger } from './logger';

/**
 * Custom application-level error class
 */
export class AppError extends Error {
  code: string;
  originalError?: unknown;

  constructor(message: string, code = 'unknown', originalError?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.originalError = originalError;
  }
}

interface FirebaseErrorLike {
  code: string;
  message: string;
  name: string;
}

function isFirebaseError(err: unknown): err is FirebaseErrorLike {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'message' in err
  );
}

/**
 * Environment-Aware Firebase Error Handling (Module 1)
 * 
 * Development:
 *  - Displays raw Firebase error codes and detailed messages in the UI.
 *  - Emits verbose console stack traces for developer debugging.
 * 
 * Production:
 *  - Displays friendly user-facing messages without exposing stack traces or implementation details.
 *  - Logs full error diagnostics to internal operational loggers.
 */
export function handleFirebaseError(err: unknown): AppError {
  const isDev = process.env.NODE_ENV !== 'production';

  // Always log detailed diagnostic error to operational logger
  logger.error('AUTH', 'Captured Firebase Error:', err);

  if (isFirebaseError(err)) {
    const code = err.code;
    let friendlyMessage = 'An unexpected error occurred. Please try again or contact support.';

    switch (code) {
      // Firebase Authentication Errors
      case 'auth/user-not-found':
        friendlyMessage = 'No account matches this email address.';
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        friendlyMessage = 'Incorrect email or password. Please check your credentials.';
        break;
      case 'auth/email-already-in-use':
        friendlyMessage = 'An account already exists with this email address.';
        break;
      case 'auth/invalid-email':
        friendlyMessage = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        friendlyMessage = 'Your password is too weak. Please use at least 6 characters.';
        break;
      case 'auth/user-disabled':
        friendlyMessage = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/popup-closed-by-user':
        friendlyMessage = 'The authentication window was closed before completing.';
        break;
      case 'auth/requires-recent-login':
        friendlyMessage = 'For security reasons, please log out and log back in to perform this action.';
        break;
      case 'auth/operation-not-allowed':
        friendlyMessage = 'This authentication method is currently unavailable.';
        break;

      // Cloud Firestore Errors
      case 'permission-denied':
        friendlyMessage = 'Access Denied: You do not have permission to access or modify this resource.';
        break;
      case 'not-found':
        friendlyMessage = 'Resource not found: The requested item could not be located.';
        break;
      case 'already-exists':
        friendlyMessage = 'Conflict: The record you are trying to create already exists.';
        break;
      case 'unavailable':
        friendlyMessage = 'Service temporarily offline. Please check your network connection.';
        break;
      case 'cancelled':
        friendlyMessage = 'The operation was cancelled.';
        break;

      default:
        // In Development, include raw code and message
        if (isDev) {
          friendlyMessage = `[${code}] ${err.message || 'Firebase Operation Failed'}`;
        }
        break;
    }

    // In Development, append code if not already formatted
    const finalMessage = isDev && !friendlyMessage.startsWith('[')
      ? `[${code}] ${friendlyMessage}`
      : friendlyMessage;

    return new AppError(finalMessage, code, err);
  }

  if (err instanceof Error) {
    const devMessage = isDev ? `[SystemError] ${err.message}` : 'An unexpected system error occurred.';
    return new AppError(devMessage, 'system_error', err);
  }

  const fallbackMsg = isDev ? '[UnknownError] Non-Error object thrown.' : 'An unexpected error occurred.';
  return new AppError(fallbackMsg, 'unknown', err);
}
