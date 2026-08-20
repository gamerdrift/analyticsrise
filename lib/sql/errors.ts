import { SQLErrorCode, SQLErrorDetails } from './types';

/**
 * Structured SQL Error class with diagnostic location and pedagogical hints
 */
export class SQLError extends Error implements SQLErrorDetails {
  public code: SQLErrorCode;
  public line?: number;
  public column?: number;
  public hint?: string;

  constructor(details: SQLErrorDetails) {
    super(details.message);
    this.name = 'SQLError';
    this.code = details.code;
    this.line = details.line;
    this.column = details.column;
    this.hint = details.hint;

    // Maintain prototype chain
    Object.setPrototypeOf(this, SQLError.prototype);
  }

  public toJSON(): SQLErrorDetails {
    return {
      code: this.code,
      message: this.message,
      line: this.line,
      column: this.column,
      hint: this.hint,
    };
  }
}
