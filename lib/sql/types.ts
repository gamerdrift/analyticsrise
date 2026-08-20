/**
 * AnalyticsRise SQL Engine — Core Types
 * Pure TypeScript AST & In-Memory Relational Engine
 */

export type DataType = 'INTEGER' | 'DECIMAL' | 'TEXT' | 'BOOLEAN' | 'DATE' | 'NULL' | 'UNKNOWN';

export interface ColumnDef {
  name: string;
  type: DataType;
  nullable?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  foreignTable?: string;
  foreignColumn?: string;
  description?: string;
}

export type SqlValue = string | number | boolean | null | undefined;

export type Row = Record<string, SqlValue>;

export interface Table {
  name: string;
  columns: ColumnDef[];
  rows: Row[];
}

export interface Database {
  name: string;
  tables: Record<string, Table>;
}

export interface QueryResult {
  columns: string[];
  rows: SqlValue[][];
  rowObjects: Record<string, SqlValue>[];
  rowCount: number;
  executionMs: number;
  warnings: string[];
}

export type SQLErrorCode =
  | 'SYNTAX_ERROR'
  | 'TABLE_NOT_FOUND'
  | 'COLUMN_NOT_FOUND'
  | 'AMBIGUOUS_COLUMN'
  | 'INVALID_TYPE'
  | 'INVALID_FUNCTION'
  | 'INVALID_GROUP_BY'
  | 'INVALID_JOIN'
  | 'INVALID_LIMIT'
  | 'UNSUPPORTED_FEATURE'
  | 'RUNTIME_ERROR';

export interface SQLErrorDetails {
  code: SQLErrorCode;
  message: string;
  line?: number;
  column?: number;
  hint?: string;
}
