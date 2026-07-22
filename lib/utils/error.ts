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
 * Robust, Transparent Firebase Error Handler
 * 
 * Extracts exact error codes, messages, and stack traces.
 * Ensures diagnostic detail is NEVER obfuscated by generic system errors.
 */
export function handleFirebaseError(err: unknown): AppError {
  console.error('[Firebase Diagnostic Error Log]:', err);
  logger.error('AUTH', 'Captured Firebase Auth Exception:', err);

  if (isFirebaseError(err)) {
    const code = err.code;
    let explanation = '';

    switch (code) {
      case 'auth/user-not-found':
        explanation = 'No user account found matching this email.';
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        explanation = 'Incorrect email or password. Please verify your credentials.';
        break;
      case 'auth/email-already-in-use':
        explanation = 'An account already exists with this email address.';
        break;
      case 'auth/invalid-email':
        explanation = 'Please provide a valid email address.';
        break;
      case 'auth/weak-password':
        explanation = 'Password should be at least 6 characters long.';
        break;
      case 'auth/user-disabled':
        explanation = 'This user account has been disabled. Please contact support.';
        break;
      case 'auth/operation-not-allowed':
        explanation = 'Email/Password sign-in is disabled in Firebase console.';
        break;
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid':
        explanation = 'Firebase API Key is invalid or expired.';
        break;
      case 'auth/network-request-failed':
        explanation = 'Network error. Please check your internet connection.';
        break;
      case 'permission-denied':
        explanation = 'Firestore write permission denied by security rules.';
        break;
      default:
        explanation = err.message || 'Firebase operation failed.';
        break;
    }

    const formattedMessage = `[${code}] ${explanation}`;
    return new AppError(formattedMessage, code, err);
  }

  if (err instanceof Error) {
    return new AppError(`[SystemError] ${err.message}`, 'system_error', err);
  }

  return new AppError(`[UnknownError] ${String(err)}`, 'unknown', err);
}
