/**
 * Excel Workspace — Centralized Limits & FinOps Configuration
 * Defines strict browser safety limits and entitlement tier thresholds.
 */

import { WorkbookValidationResult } from './types';

export interface ExcelTierLimits {
  maxFileSizeBytes: number;
  maxSheets: number;
  maxRowsPerSheet: number;
  maxColsPerSheet: number;
  maxActiveWorkbooks: number;
  maxSavedProjects: number;
  maxExportRows: number;
}

export const EXCEL_WORKSPACE_LIMITS: Record<'free' | 'pro' | 'enterprise', ExcelTierLimits> = {
  free: {
    maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
    maxSheets: 3,
    maxRowsPerSheet: 20000,
    maxColsPerSheet: 100,
    maxActiveWorkbooks: 1,
    maxSavedProjects: 1,
    maxExportRows: 10000,
  },
  pro: {
    maxFileSizeBytes: 25 * 1024 * 1024, // 25 MB
    maxSheets: 10,
    maxRowsPerSheet: 100000,
    maxColsPerSheet: 250,
    maxActiveWorkbooks: 5,
    maxSavedProjects: 10,
    maxExportRows: 100000,
  },
  enterprise: {
    maxFileSizeBytes: 100 * 1024 * 1024, // 100 MB
    maxSheets: 50,
    maxRowsPerSheet: 500000,
    maxColsPerSheet: 500,
    maxActiveWorkbooks: 25,
    maxSavedProjects: 100,
    maxExportRows: 500000,
  },
};

/**
 * Validate workbook file size before memory ingestion
 */
export function validateWorkbookFileSize(
  fileSizeBytes: number,
  tier: 'free' | 'pro' | 'enterprise' = 'free'
): WorkbookValidationResult {
  const limits = EXCEL_WORKSPACE_LIMITS[tier] || EXCEL_WORKSPACE_LIMITS.free;

  if (fileSizeBytes > limits.maxFileSizeBytes) {
    const sizeMb = (fileSizeBytes / (1024 * 1024)).toFixed(1);
    const limitMb = (limits.maxFileSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds ${tier.toUpperCase()} tier limit of ${limitMb} MB.`,
      requiresUpgrade: tier === 'free',
      limitExceeded: {
        type: 'FILE_SIZE',
        limit: limits.maxFileSizeBytes,
        actual: fileSizeBytes,
      },
    };
  }

  return { valid: true };
}

/**
 * Validate workbook dimensions (sheet count, rows, columns)
 */
export function validateWorkbookDimensions(
  sheetCount: number,
  maxRows: number,
  maxCols: number,
  tier: 'free' | 'pro' | 'enterprise' = 'free'
): WorkbookValidationResult {
  const limits = EXCEL_WORKSPACE_LIMITS[tier] || EXCEL_WORKSPACE_LIMITS.free;

  if (sheetCount > limits.maxSheets) {
    return {
      valid: false,
      error: `Workbook contains ${sheetCount} sheets (Free limit: ${limits.maxSheets} sheets).`,
      requiresUpgrade: tier === 'free',
      limitExceeded: {
        type: 'SHEET_COUNT',
        limit: limits.maxSheets,
        actual: sheetCount,
      },
    };
  }

  if (maxRows > limits.maxRowsPerSheet) {
    return {
      valid: false,
      error: `Sheet row count (${maxRows.toLocaleString()}) exceeds ${tier.toUpperCase()} tier limit of ${limits.maxRowsPerSheet.toLocaleString()} rows.`,
      requiresUpgrade: tier === 'free',
      limitExceeded: {
        type: 'ROW_COUNT',
        limit: limits.maxRowsPerSheet,
        actual: maxRows,
      },
    };
  }

  if (maxCols > limits.maxColsPerSheet) {
    return {
      valid: false,
      error: `Sheet column count (${maxCols}) exceeds limit of ${limits.maxColsPerSheet} columns.`,
      requiresUpgrade: tier === 'free',
      limitExceeded: {
        type: 'COLUMN_COUNT',
        limit: limits.maxColsPerSheet,
        actual: maxCols,
      },
    };
  }

  return { valid: true };
}

/**
 * Validate saved project count for persistence
 */
export function validateExcelProjectLimit(
  currentSavedCount: number,
  tier: 'free' | 'pro' | 'enterprise' = 'free'
): WorkbookValidationResult {
  const limits = EXCEL_WORKSPACE_LIMITS[tier] || EXCEL_WORKSPACE_LIMITS.free;

  if (currentSavedCount >= limits.maxSavedProjects) {
    return {
      valid: false,
      error: `You have reached the ${tier.toUpperCase()} tier limit of ${limits.maxSavedProjects} saved project.`,
      requiresUpgrade: tier === 'free',
      limitExceeded: {
        type: 'PROJECT_COUNT',
        limit: limits.maxSavedProjects,
        actual: currentSavedCount,
      },
    };
  }

  return { valid: true };
}
