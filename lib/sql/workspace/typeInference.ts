/**
 * AnalyticsRise SQL Workspace — Conservative Type Inference Engine
 * 
 * Inspects column values deterministically and assigns SQL data types
 * without destroying or corrupting input records.
 */

import { InferredDataType } from './types';
import { DataType } from '../types';

const INT_REGEX = /^-?\d+$/;
const DECIMAL_REGEX = /^-?\d+\.\d+$/;
const BOOLEAN_REGEX = /^(true|false|yes|no|t|f)$/i;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const US_DATE_REGEX = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
const ISO_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/i;

/**
 * Check if a single string matches a specific logical type
 */
export function inferValueType(val: string): InferredDataType | 'NULL' {
  const trimmed = val.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'nan' || trimmed.toLowerCase() === 'none') {
    return 'NULL';
  }

  if (INT_REGEX.test(trimmed)) {
    return 'INTEGER';
  }

  if (DECIMAL_REGEX.test(trimmed)) {
    return 'DECIMAL';
  }

  if (BOOLEAN_REGEX.test(trimmed)) {
    return 'BOOLEAN';
  }

  if (ISO_DATE_REGEX.test(trimmed) || US_DATE_REGEX.test(trimmed)) {
    return 'DATE';
  }

  if (ISO_DATETIME_REGEX.test(trimmed)) {
    return 'DATETIME';
  }

  return 'TEXT';
}

/**
 * Infer the aggregate column type across all row values.
 * Conservative rule: if types clash (e.g. some numbers, some words), fallback to TEXT.
 */
export function inferColumnType(values: string[]): {
  inferredType: InferredDataType;
  engineType: DataType;
  isMixed: boolean;
} {
  let hasInt = false;
  let hasDecimal = false;
  let hasBoolean = false;
  let hasDate = false;
  let hasDateTime = false;
  let hasText = false;
  let nonNullCount = 0;

  for (const v of values) {
    const t = inferValueType(v);
    if (t === 'NULL') continue;

    nonNullCount++;
    if (t === 'INTEGER') hasInt = true;
    else if (t === 'DECIMAL') hasDecimal = true;
    else if (t === 'BOOLEAN') hasBoolean = true;
    else if (t === 'DATE') hasDate = true;
    else if (t === 'DATETIME') hasDateTime = true;
    else if (t === 'TEXT') hasText = true;
  }

  if (nonNullCount === 0) {
    return { inferredType: 'TEXT', engineType: 'TEXT', isMixed: false };
  }

  if (hasText) {
    return { inferredType: 'TEXT', engineType: 'TEXT', isMixed: hasInt || hasDecimal || hasBoolean || hasDate };
  }

  if (hasDateTime) {
    const isMixed = hasInt || hasDecimal || hasBoolean;
    return { inferredType: isMixed ? 'TEXT' : 'DATETIME', engineType: 'DATE', isMixed };
  }

  if (hasDate) {
    const isMixed = hasInt || hasDecimal || hasBoolean;
    return { inferredType: isMixed ? 'TEXT' : 'DATE', engineType: 'DATE', isMixed };
  }

  if (hasDecimal && !hasBoolean) {
    return { inferredType: 'DECIMAL', engineType: 'DECIMAL', isMixed: false };
  }

  if (hasInt && !hasBoolean) {
    return { inferredType: 'INTEGER', engineType: 'INTEGER', isMixed: false };
  }

  if (hasBoolean && !hasInt && !hasDecimal) {
    return { inferredType: 'BOOLEAN', engineType: 'BOOLEAN', isMixed: false };
  }

  // Mixed fallback
  return { inferredType: 'TEXT', engineType: 'TEXT', isMixed: true };
}

/**
 * Cast a raw string value to the appropriate runtime SQL engine type
 */
export function castValueToEngineType(val: string, engineType: DataType): any {
  const trimmed = val.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'nan') {
    return null;
  }

  switch (engineType) {
    case 'INTEGER': {
      const parsed = parseInt(trimmed, 10);
      return isNaN(parsed) ? null : parsed;
    }
    case 'DECIMAL': {
      const parsed = parseFloat(trimmed);
      return isNaN(parsed) ? null : parsed;
    }
    case 'BOOLEAN': {
      const lower = trimmed.toLowerCase();
      if (lower === 'true' || lower === 'yes' || lower === 't' || lower === '1') return true;
      if (lower === 'false' || lower === 'no' || lower === 'f' || lower === '0') return false;
      return null;
    }
    case 'DATE':
    case 'TEXT':
    default:
      return trimmed;
  }
}
