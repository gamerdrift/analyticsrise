/**
 * Excel Workspace — Types & Interfaces
 * Core domain contracts for in-browser workbook ingestion, cell models,
 * profiling, project persistence, and export workflows.
 */

export type SupportedExcelExtension = 'xlsx' | 'csv' | 'tsv' | 'txt';

export interface CellAddress {
  sheetId: string;
  row: number; // 0-indexed
  col: number; // 0-indexed
}

export type CellValue = string | number | boolean | null;

export interface CellFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  bgColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  numberFormat?: 'general' | 'currency' | 'percent' | 'decimal' | 'date';
}

export interface WorkspaceCell {
  address: CellAddress;
  value: CellValue;
  formula?: string;
  formatting?: CellFormatting;
}

export interface WorkspaceSheet {
  id: string;
  name: string;
  rows: number;
  cols: number;
  cells: Record<string, WorkspaceCell>; // key: `${row},${col}`
  headers: string[];
}

export interface ParsedWorkbook {
  fileName: string;
  fileSizeBytes: number;
  sheets: Record<string, WorkspaceSheet>;
  sheetOrder: string[]; // array of sheet IDs
  activeSheetId: string;
  createdAt: number;
}

export interface ColumnDataSummary {
  colIndex: number;
  header: string;
  inferredType: 'INTEGER' | 'DECIMAL' | 'TEXT' | 'BOOLEAN' | 'DATE' | 'EMPTY';
  nonEmptyCount: number;
  nullCount: number;
  nullRatio: number;
  uniqueCount: number;
  sampleValues: string[];
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
}

export interface WorksheetProfile {
  sheetId: string;
  sheetName: string;
  rowCount: number;
  colCount: number;
  populatedCellCount: number;
  formulaCount: number;
  columns: ColumnDataSummary[];
  duplicateHeaders: string[];
  blankColumns: number[];
  estimatedMemoryBytes: number;
}

export interface WorkbookProfile {
  fileName: string;
  fileSizeBytes: number;
  sheetCount: number;
  totalCellCount: number;
  totalFormulaCount: number;
  sheetProfiles: Record<string, WorksheetProfile>;
  qualityWarnings: string[];
}

export interface WorkspaceProjectSummary {
  projectId: string;
  projectName: string;
  fileName: string;
  fileSizeBytes: number;
  sheetCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface ExcelWorkspaceProject {
  projectId: string;
  projectName: string;
  fileName: string;
  fileSizeBytes: number;
  workbook: ParsedWorkbook;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export interface WorkbookValidationResult {
  valid: boolean;
  error?: string;
  requiresUpgrade?: boolean;
  limitExceeded?: {
    type: 'FILE_SIZE' | 'SHEET_COUNT' | 'ROW_COUNT' | 'COLUMN_COUNT' | 'PROJECT_COUNT';
    limit: number;
    actual: number;
  };
}
