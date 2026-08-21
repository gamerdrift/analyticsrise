/**
 * AnalyticsRise — Power BI Workspace Domain Types
 * Core contracts for multi-dataset ingestion, column profiling,
 * model preparation readiness, and project persistence.
 */

export type SupportedFileExtension = 'csv' | 'tsv' | 'txt';

export type InferredColumnType =
  | 'TEXT'
  | 'INTEGER'
  | 'DECIMAL'
  | 'BOOLEAN'
  | 'DATE'
  | 'DATETIME'
  | 'EMPTY';

export interface DatasetColumn {
  id: string;
  name: string;
  inferredType: InferredColumnType;
  nullCount: number;
  nullRatio: number;
  distinctCount: number;
  sampleValues: string[];
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
  isPotentialKey?: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  sourceFileName: string;
  sourceSizeBytes: number;
  rowCount: number;
  colCount: number;
  headers: string[];
  rows: (string | number | boolean | null)[][];
  columns: DatasetColumn[];
  createdAt: number;
  updatedAt: number;
}

export interface DatasetProfile {
  datasetId: string;
  datasetName: string;
  rowCount: number;
  colCount: number;
  columns: DatasetColumn[];
  qualityWarnings: string[];
  potentialKeys: string[];
}

export type Cardinality = '1:1' | '1:N' | 'N:1' | 'N:N';
export type CrossFilterDirection = 'single' | 'both';

export interface RelationshipCandidate {
  id: string;
  fromDatasetId: string;
  fromDatasetName: string;
  fromColumn: string;
  toDatasetId: string;
  toDatasetName: string;
  toColumn: string;
  suggestedCardinality: Cardinality;
  confidence: number; // 0.0 to 1.0
  reason: string;
}

export interface Relationship {
  id: string;
  fromDatasetId: string;
  fromColumn: string;
  toDatasetId: string;
  toColumn: string;
  cardinality: Cardinality;
  crossFilterDirection: CrossFilterDirection;
  isActive: boolean;
}

export interface Measure {
  id: string;
  name: string;
  expression: string;
  formatString?: string;
  datasetId?: string;
  description?: string;
}

export interface Visual {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'card' | 'table';
  datasetId?: string;
  config: Record<string, unknown>;
}

export interface PowerBIWorkspaceProject {
  projectId: string;
  projectName: string;
  datasets: Dataset[];
  relationships: Relationship[];
  measures: Measure[];
  visuals: Visual[];
  metadata?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export interface PowerBIProjectSummary {
  projectId: string;
  projectName: string;
  datasetCount: number;
  totalRows: number;
  totalSizeBytes: number;
  createdAt: number;
  updatedAt: number;
}

export interface DatasetValidationResult {
  valid: boolean;
  error?: string;
  requiresUpgrade?: boolean;
  limitExceeded?: {
    type: 'FILE_SIZE' | 'DATASET_COUNT' | 'ROW_COUNT' | 'COLUMN_COUNT' | 'PROJECT_COUNT';
    limit: number;
    current: number;
  };
}
