import { QueryResult, SqlValue } from '../../../types';
import { ValidationOptions } from './types.server';

/**
 * Normalizes SQL values for deterministic equality comparison
 */
export function normalizeSqlValue(val: SqlValue, tolerance?: number): any {
  if (val === null || val === undefined) {
    return null;
  }

  if (typeof val === 'number') {
    if (isNaN(val)) return null;
    if (!isFinite(val)) return val > 0 ? Infinity : -Infinity;

    if (tolerance !== undefined && tolerance > 0) {
      const factor = 1 / tolerance;
      return Math.round(val * factor) / factor;
    }
    // Standardize floating point representation (-0 to 0)
    return Object.is(val, -0) ? 0 : val;
  }

  if (typeof val === 'boolean') {
    return val;
  }

  if (typeof val === 'string') {
    return val.trim();
  }

  return val;
}

/**
 * Builds a column mapping between expected and actual columns (case-insensitive)
 */
export function mapColumnPositions(
  actualCols: string[],
  expectedCols: string[],
  caseSensitive = false
): Map<string, string> {
  const mapping = new Map<string, string>(); // expectedCol -> actualCol

  const actualMap = new Map<string, string>();
  for (const col of actualCols) {
    actualMap.set(caseSensitive ? col : col.toLowerCase(), col);
  }

  for (const expCol of expectedCols) {
    const key = caseSensitive ? expCol : expCol.toLowerCase();
    const actualCol = actualMap.get(key);
    if (actualCol !== undefined) {
      mapping.set(expCol, actualCol);
    }
  }

  return mapping;
}

/**
 * Validates result schema (column presence, count, and ordering if required)
 */
export function compareSchemas(
  actualCols: string[],
  expectedCols: string[],
  options: ValidationOptions = {}
): {
  matched: boolean;
  missingColumns: string[];
  extraColumns: string[];
  internalReason?: string;
} {
  const caseSensitive = options.caseSensitiveColumns ?? false;
  const colOrderMatters = options.columnOrderMatters ?? false;

  const actualSet = new Set(actualCols.map((c) => (caseSensitive ? c : c.toLowerCase())));
  const expectedSet = new Set(expectedCols.map((c) => (caseSensitive ? c : c.toLowerCase())));

  const missingColumns = expectedCols.filter(
    (c) => !actualSet.has(caseSensitive ? c : c.toLowerCase())
  );
  const extraColumns = actualCols.filter(
    (c) => !expectedSet.has(caseSensitive ? c : c.toLowerCase())
  );

  if (missingColumns.length > 0) {
    return {
      matched: false,
      missingColumns,
      extraColumns,
      internalReason: `Missing required columns: ${missingColumns.join(', ')}`,
    };
  }

  if (extraColumns.length > 0 && expectedCols.length > 0 && options.requiredColumns) {
    // If strict column set required
    return {
      matched: false,
      missingColumns,
      extraColumns,
      internalReason: `Unexpected extra columns returned: ${extraColumns.join(', ')}`,
    };
  }

  if (colOrderMatters) {
    if (actualCols.length !== expectedCols.length) {
      return {
        matched: false,
        missingColumns,
        extraColumns,
        internalReason: `Expected ${expectedCols.length} columns, but received ${actualCols.length}`,
      };
    }

    for (let i = 0; i < expectedCols.length; i++) {
      const act = caseSensitive ? actualCols[i] : actualCols[i]?.toLowerCase();
      const exp = caseSensitive ? expectedCols[i] : expectedCols[i]?.toLowerCase();
      if (act !== exp) {
        return {
          matched: false,
          missingColumns,
          extraColumns,
          internalReason: `Column order mismatch at position ${i + 1}: expected '${expectedCols[i]}', got '${actualCols[i]}'`,
        };
      }
    }
  }

  return {
    matched: true,
    missingColumns: [],
    extraColumns: [],
  };
}

/**
 * Compares two results with strict row ordering preserved
 */
export function compareOrderedResults(
  actual: QueryResult,
  expected: QueryResult,
  options: ValidationOptions = {}
): {
  matched: boolean;
  score: number;
  internalReason?: string;
} {
  if (actual.rowCount !== expected.rowCount) {
    return {
      matched: false,
      score: 0,
      internalReason: `Row count mismatch: expected ${expected.rowCount} rows, received ${actual.rowCount} rows`,
    };
  }

  const colMapping = mapColumnPositions(
    actual.columns,
    expected.columns,
    options.caseSensitiveColumns ?? false
  );

  const tolerance = options.numericTolerance;

  for (let i = 0; i < expected.rowCount; i++) {
    const actRow = actual.rowObjects[i] ?? {};
    const expRow = expected.rowObjects[i] ?? {};

    for (const expCol of expected.columns) {
      const actCol = colMapping.get(expCol);
      if (!actCol) {
        return {
          matched: false,
          score: 0,
          internalReason: `Column '${expCol}' not found in actual output`,
        };
      }

      const normAct = normalizeSqlValue(actRow[actCol], tolerance);
      const normExp = normalizeSqlValue(expRow[expCol], tolerance);

      if (!isEqualValue(normAct, normExp, tolerance)) {
        return {
          matched: false,
          score: 0,
          internalReason: `Value mismatch at row ${i + 1}, column '${expCol}': expected '${normExp}', received '${normAct}'`,
        };
      }
    }
  }

  return {
    matched: true,
    score: 100,
  };
}

/**
 * Compares two results as an unordered multiset of rows
 */
export function compareUnorderedResults(
  actual: QueryResult,
  expected: QueryResult,
  options: ValidationOptions = {}
): {
  matched: boolean;
  score: number;
  internalReason?: string;
} {
  if (actual.rowCount !== expected.rowCount) {
    return {
      matched: false,
      score: 0,
      internalReason: `Row count mismatch: expected ${expected.rowCount} rows, received ${actual.rowCount} rows`,
    };
  }

  const colMapping = mapColumnPositions(
    actual.columns,
    expected.columns,
    options.caseSensitiveColumns ?? false
  );
  const tolerance = options.numericTolerance;

  // Generate serialized canonical keys for rows
  const generateRowKey = (row: Record<string, SqlValue>, isActual: boolean): string => {
    return expected.columns
      .map((expCol) => {
        const colName = isActual ? colMapping.get(expCol) || expCol : expCol;
        const normVal = normalizeSqlValue(row[colName], tolerance);
        return `${expCol}:${JSON.stringify(normVal)}`;
      })
      .join('|');
  };

  const expectedCounts = new Map<string, number>();
  for (const row of expected.rowObjects) {
    const key = generateRowKey(row, false);
    expectedCounts.set(key, (expectedCounts.get(key) || 0) + 1);
  }

  const actualCounts = new Map<string, number>();
  for (const row of actual.rowObjects) {
    const key = generateRowKey(row, true);
    actualCounts.set(key, (actualCounts.get(key) || 0) + 1);
  }

  if (expectedCounts.size !== actualCounts.size) {
    return {
      matched: false,
      score: 0,
      internalReason: 'Distinct row distribution mismatch between expected and actual results',
    };
  }

  for (const [key, count] of expectedCounts.entries()) {
    const actCount = actualCounts.get(key) || 0;
    if (actCount !== count) {
      return {
        matched: false,
        score: 0,
        internalReason: `Row frequency mismatch for signature [${key}]: expected ${count}, received ${actCount}`,
      };
    }
  }

  return {
    matched: true,
    score: 100,
  };
}

function isEqualValue(a: any, b: any, tolerance?: number): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;

  if (typeof a === 'number' && typeof b === 'number') {
    if (tolerance !== undefined && tolerance > 0) {
      return Math.abs(a - b) <= tolerance;
    }
    return a === b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a.trim() === b.trim();
  }

  return false;
}
