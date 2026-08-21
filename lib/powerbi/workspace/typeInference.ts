/**
 * AnalyticsRise — Power BI Workspace Type Inference System
 * Deterministic, conservative in-browser data type inference.
 */

import { InferredColumnType } from './types';

const INT_REGEX = /^-?\d+$/;
const DECIMAL_REGEX = /^-?(\d*\.\d+|\d+\.\d*|\d+)$/;
const CURRENCY_REGEX = /^\$?\s?-?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/;
const PERCENT_REGEX = /^-?\d+(\.\d+)?%$/;
const ISO_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/i;
const DATE_REGEX = /^(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4})$/;
const BOOLEAN_VALUES = new Set(['true', 'false', '1', '0', 'yes', 'no', 't', 'f', 'y', 'n']);

/**
 * Checks if a value is considered empty / null
 */
export function isValueEmpty(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string') {
    const trimmed = val.trim().toLowerCase();
    return (
      trimmed === '' ||
      trimmed === 'null' ||
      trimmed === 'undefined' ||
      trimmed === 'nan' ||
      trimmed === 'n/a' ||
      trimmed === 'none' ||
      trimmed === '-'
    );
  }
  return false;
}

/**
 * Detects the data type of an individual cell value
 */
export function inferCellType(val: unknown): InferredColumnType {
  if (isValueEmpty(val)) return 'EMPTY';

  if (typeof val === 'boolean') return 'BOOLEAN';
  if (typeof val === 'number') {
    return Number.isInteger(val) ? 'INTEGER' : 'DECIMAL';
  }

  const str = String(val).trim();

  // Boolean check
  if (BOOLEAN_VALUES.has(str.toLowerCase())) {
    return 'BOOLEAN';
  }

  // Integer check
  if (INT_REGEX.test(str)) {
    return 'INTEGER';
  }

  // Decimal / Currency / Percent check
  if (DECIMAL_REGEX.test(str) || CURRENCY_REGEX.test(str) || PERCENT_REGEX.test(str)) {
    return 'DECIMAL';
  }

  // Datetime check
  if (ISO_DATETIME_REGEX.test(str)) {
    return 'DATETIME';
  }

  // Date check
  if (DATE_REGEX.test(str)) {
    const parsed = Date.parse(str);
    if (!isNaN(parsed)) return 'DATE';
  }

  return 'TEXT';
}

/**
 * Infers the column type across an array of sample/full cell values
 */
export function inferColumnType(values: unknown[]): InferredColumnType {
  const nonEmpties = values.filter((v) => !isValueEmpty(v));

  if (nonEmpties.length === 0) return 'EMPTY';

  let hasInt = false;
  let hasDecimal = false;
  let hasBool = false;
  let hasDate = false;
  let hasDateTime = false;
  let hasText = false;

  for (const v of nonEmpties) {
    const t = inferCellType(v);
    if (t === 'INTEGER') hasInt = true;
    else if (t === 'DECIMAL') hasDecimal = true;
    else if (t === 'BOOLEAN') hasBool = true;
    else if (t === 'DATETIME') hasDateTime = true;
    else if (t === 'DATE') hasDate = true;
    else hasText = true;
  }

  if (hasText) return 'TEXT';

  // Mixed date and datetime -> DATETIME
  if (hasDateTime && (hasDate || !hasDate) && !hasInt && !hasDecimal && !hasBool) {
    return 'DATETIME';
  }
  if (hasDate && !hasDateTime && !hasInt && !hasDecimal && !hasBool) {
    return 'DATE';
  }

  // Mixed integer and decimal -> DECIMAL
  if ((hasDecimal || hasInt) && !hasBool && !hasDate && !hasDateTime) {
    return hasDecimal ? 'DECIMAL' : 'INTEGER';
  }

  if (hasBool && !hasInt && !hasDecimal && !hasDate && !hasDateTime) {
    return 'BOOLEAN';
  }

  return 'TEXT';
}
