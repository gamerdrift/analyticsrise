/**
 * AnalyticsRise — AI-EVA Workspace Context & Privacy Contracts
 */

export type AiEvaWorkspaceType =
  | 'sql_studio'
  | 'sql_workspace'
  | 'excel_studio'
  | 'excel_workspace'
  | 'powerbi_studio'
  | 'powerbi_workspace'
  | 'academy';

export type AiEvaPrivacyLevel = 'metadata' | 'approved_sample' | 'formula';

export interface ExcelColumnSummary {
  name: string;
  inferredType: string;
  nullCount?: number;
  nullRatio?: number;
  distinctCount?: number;
  sampleValues?: string[];
}

export interface ExcelDataQualitySummary {
  warningCount: number;
  warnings: string[];
  totalNullRatio: number;
  hasMixedTypes: boolean;
  hasDuplicateHeaders: boolean;
}

export interface ExcelFormulaContext {
  cellAddress: string;
  formulaText: string;
  errorState?: string;
  referencedCoordinates?: string[];
}

export interface ExcelApprovedSample {
  cellRange: string;
  rowCount: number;
  colCount: number;
  headers: string[];
  rows: (string | number | boolean | null)[][];
  userApproved: boolean;
  timestamp: string;
}

export interface ExcelWorkspaceContextData {
  workbookName: string;
  sheetCount: number;
  sheetNames: string[];
  activeSheetName: string;
  rowCount: number;
  colCount: number;
  columns: ExcelColumnSummary[];
  dataQuality?: ExcelDataQualitySummary;
  activeFormula?: ExcelFormulaContext;
  approvedSample?: ExcelApprovedSample;
  privacyLevel: AiEvaPrivacyLevel;
}

export interface PowerBIDatasetSummary {
  id: string;
  name: string;
  rowCount: number;
  colCount: number;
  columns: {
    name: string;
    inferredType: string;
    nullCount?: number;
    nullRatio?: number;
    distinctCount?: number;
    sampleValues?: string[];
  }[];
  suggestedKeys?: string[];
}

export interface PowerBIRelationshipCandidateSummary {
  fromDataset: string;
  fromColumn: string;
  toDataset: string;
  toColumn: string;
  cardinality: string;
  confidence: number;
}

export interface PowerBIWorkspaceContextData {
  workspaceType: 'powerbi_workspace';
  datasetCount: number;
  datasets: PowerBIDatasetSummary[];
  activeDatasetId?: string;
  qualityWarnings: string[];
  suggestedRelationships: PowerBIRelationshipCandidateSummary[];
  privacyLevel: 'metadata';
}

export interface AiEvaWorkspaceContext {
  workspaceType: AiEvaWorkspaceType;
  metadata: Record<string, unknown>;
  excelContext?: ExcelWorkspaceContextData;
  powerbiContext?: PowerBIWorkspaceContextData;
  activeContext?: Record<string, unknown>;
  userApprovedData?: unknown;
  privacyLevel: AiEvaPrivacyLevel;
}
