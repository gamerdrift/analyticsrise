/**
 * AnalyticsRise SQL Workspace — In-Memory SQL Table & Database Generator
 * 
 * Synthesizes parsed CSV rows and inferred column schemas into in-memory
 * relational Database and Table structures for immediate execution by the SQL engine.
 */

import { Database, Table, ColumnDef, Row } from '../types';
import { RawParseResult } from './csvParser';
import { ColumnProfile, DatasetQualityReport, ParsedDataset } from './types';
import { castValueToEngineType } from './typeInference';

/**
 * Sanitize a filename into a clean, valid SQL table identifier
 */
export function sanitizeTableName(fileName: string): string {
  // Remove file extension
  const baseName = fileName.replace(/\.[^/.]+$/, '');

  let cleaned = baseName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  if (/^[0-9]/.test(cleaned)) {
    cleaned = `tbl_${cleaned}`;
  }

  return cleaned || 'user_data';
}

/**
 * Build an in-memory SQL Database and Table from parsed CSV rows and profiles
 */
export function generateSqlTable(
  rawResult: RawParseResult,
  profiles: ColumnProfile[],
  qualityReport: DatasetQualityReport,
  fileName: string,
  fileSizeBytes: number
): ParsedDataset {
  const tableName = sanitizeTableName(fileName);
  const { headers, rows: rawRows } = rawResult;

  // 1. Build Column Definitions
  const columns: ColumnDef[] = profiles.map((p) => ({
    name: p.name,
    type: p.engineType,
    nullable: p.nullCount > 0,
    description: `Imported from ${p.originalHeader} (${p.inferredType})`,
  }));

  // 2. Cast and materialize Row objects
  const materializedRows: Row[] = [];

  for (let r = 0; r < rawRows.length; r++) {
    const rawRow = rawRows[r];
    const rowObj: Row = {};

    for (let c = 0; c < headers.length; c++) {
      const colName = headers[c];
      const engineType = profiles[c] ? profiles[c].engineType : 'TEXT';
      const rawVal = rawRow[c] !== undefined ? rawRow[c] : '';
      rowObj[colName] = castValueToEngineType(rawVal, engineType);
    }

    materializedRows.push(rowObj);
  }

  // 3. Create Table representation
  const table: Table = {
    name: tableName,
    columns,
    rows: materializedRows,
  };

  // 4. Create Database representation
  const database: Database = {
    name: 'workspace_db',
    tables: {
      [tableName]: table,
    },
  };

  return {
    tableName,
    originalFileName: fileName,
    fileSizeBytes,
    columns,
    profiles,
    qualityReport,
    rows: materializedRows,
    database,
  };
}
