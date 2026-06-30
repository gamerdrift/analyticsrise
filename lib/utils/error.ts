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
    'message' in err &&
    'name' in err &&
    (err as any).name === 'FirebaseError'
  );
}

/**
 * Map Firebase Auth, Firestore, and Storage errors to user-friendly messages
 * 
 * @param err - Unknown caught error
 * @returns An AppError with a human-readable message and error code
 */
export function handleFirebaseError(err: unknown): AppError {
  if (isFirebaseError(err)) {
    let message = 'An unexpected system error occurred.';
    const code = err.code;

    switch (code) {
      // Firebase Authentication Errors
      case 'auth/user-not-found':
        message = 'No account matches this email address.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account already exists with this email address.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        message = 'Your password is too weak. Please use a stronger password.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'The login window was closed before completion.';
        break;
      case 'auth/requires-recent-login':
        message = 'Security requirement: please log out and log back in to perform this action.';
        break;
      
      // Cloud Firestore Errors
      case 'permission-denied':
        message = 'Access Denied: You do not have permission to read or write this record.';
        break;
      case 'not-found':
        message = 'Resource not found: The database document could not be located.';
        break;
      case 'already-exists':
        message = 'Conflict: The record you are trying to write already exists.';
        break;
      case 'unavailable':
        message = 'Database offline: Connection lost. Check your network link.';
        break;
      case 'cancelled':
        message = 'The transaction was cancelled.';
        break;
      
      // Firebase Storage Errors
      case 'storage/unauthorized':
        message = 'Access Denied: You are not authorized to upload to this location.';
        break;
      case 'storage/canceled':
        message = 'Upload aborted by the client.';
        break;
      case 'storage/quota-exceeded':
        message = 'System quota exceeded. Please contact administrator.';
        break;
      case 'storage/unknown':
        message = 'An unknown file upload error occurred.';
        break;
    }

    return new AppError(message, code, err);
  }

  if (err instanceof Error) {
    return new AppError(err.message, 'system_error', err);
  }

  return new AppError('An unexpected error occurred.', 'unknown', err);
}
