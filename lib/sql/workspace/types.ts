/**
 * AnalyticsRise SQL Workspace — Core Types & Contracts
 * 
 * Defines metadata, column profiling, type inference, project persistence,
 * and data quality inspection structures for real-world user datasets.
 */

import { DataType, ColumnDef, SqlValue, Row, Database, Table } from '../types';

export type InferredDataType = 'INTEGER' | 'DECIMAL' | 'TEXT' | 'BOOLEAN' | 'DATE' | 'DATETIME';

export interface ColumnProfile {
  name: string;
  originalHeader: string;
  inferredType: InferredDataType;
  engineType: DataType;
  totalCount: number;
  nullCount: number;
  uniqueCount: number;
  sampleValues: string[];
  numericStats?: {
    min: number;
    max: number;
    avg?: number;
    sum?: number;
  };
  warnings?: string[];
}

export interface DatasetQualityReport {
  fileName: string;
  fileSizeBytes: number;
  rowCount: number;
  columnCount: number;
  delimiter: string;
  encoding: string;
  emptyValueCount: number;
  duplicateHeaders: string[];
  mixedTypeColumns: string[];
  truncatedRowsCount: number;
}

export interface ParsedDataset {
  tableName: string;
  originalFileName: string;
  fileSizeBytes: number;
  columns: ColumnDef[];
  profiles: ColumnProfile[];
  qualityReport: DatasetQualityReport;
  rows: Row[];
  database: Database;
}

export interface WorkspaceProjectSummary {
  projectId: string;
  projectName: string;
  tableName: string;
  rawFileName: string;
  rowCount: number;
  columnCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface WorkspaceProject {
  projectId: string;
  projectName: string;
  tableName: string;
  rawFileName: string;
  fileSizeBytes: number;
  schema: ColumnProfile[];
  savedQuery: string;
  lastExecutionMs?: number;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export interface WorkspaceValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  requiresUpgrade?: boolean;
  limitExceeded?: {
    type: 'FILE_SIZE' | 'ROW_COUNT' | 'COLUMN_COUNT' | 'PROJECT_COUNT';
    current: number;
    maxAllowed: number;
  };
}
