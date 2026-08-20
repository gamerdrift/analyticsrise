/**
 * AnalyticsRise SQL Workspace — Centralized Limits Configuration
 * 
 * Defines strict browser-safe and FinOps tier limits across Free, Pro,
 * and Enterprise modes. No paid gateway dependency is introduced.
 */

import { ProductTier } from '@/lib/entitlements/types';
import { WorkspaceValidationResult } from './types';

export interface WorkspaceTierLimits {
  tier: ProductTier;
  maxFileSizeBytes: number;
  maxFileSizeLabel: string;
  maxRows: number;
  maxColumns: number;
  maxActiveDatasets: number;
  maxSavedProjects: number;
  maxExportRows: number;
  maxDisplayRows: number;
}

export const WORKSPACE_LIMITS: Record<ProductTier, WorkspaceTierLimits> = {
  free: {
    tier: 'free',
    maxFileSizeBytes: 2 * 1024 * 1024, // 2 MB
    maxFileSizeLabel: '2 MB',
    maxRows: 25000,
    maxColumns: 50,
    maxActiveDatasets: 1,
    maxSavedProjects: 1,
    maxExportRows: 10000,
    maxDisplayRows: 1000,
  },
  pro: {
    tier: 'pro',
    maxFileSizeBytes: 25 * 1024 * 1024, // 25 MB
    maxFileSizeLabel: '25 MB',
    maxRows: 250000,
    maxColumns: 100,
    maxActiveDatasets: 5,
    maxSavedProjects: 10,
    maxExportRows: 100000,
    maxDisplayRows: 5000,
  },
  enterprise: {
    tier: 'enterprise',
    maxFileSizeBytes: 100 * 1024 * 1024, // 100 MB
    maxFileSizeLabel: '100 MB',
    maxRows: 1000000,
    maxColumns: 250,
    maxActiveDatasets: 25,
    maxSavedProjects: 100,
    maxExportRows: 500000,
    maxDisplayRows: 10000,
  },
};

/**
 * Validate upload file size against tier limit
 */
export function validateFileSize(
  fileSizeBytes: number,
  tier: ProductTier = 'free'
): WorkspaceValidationResult {
  const limits = WORKSPACE_LIMITS[tier] || WORKSPACE_LIMITS.free;

  if (fileSizeBytes > limits.maxFileSizeBytes) {
    const sizeInMb = (fileSizeBytes / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      requiresUpgrade: true,
      error: `File size (${sizeInMb} MB) exceeds the ${limits.tier.toUpperCase()} limit of ${limits.maxFileSizeLabel}.`,
      limitExceeded: {
        type: 'FILE_SIZE',
        current: fileSizeBytes,
        maxAllowed: limits.maxFileSizeBytes,
      },
    };
  }

  return { valid: true };
}

/**
 * Validate parsed dataset dimensions (rows, columns)
 */
export function validateDatasetDimensions(
  rowCount: number,
  columnCount: number,
  tier: ProductTier = 'free'
): WorkspaceValidationResult {
  const limits = WORKSPACE_LIMITS[tier] || WORKSPACE_LIMITS.free;

  if (columnCount > limits.maxColumns) {
    return {
      valid: false,
      requiresUpgrade: true,
      error: `Dataset has ${columnCount} columns, which exceeds the limit of ${limits.maxColumns} columns.`,
      limitExceeded: {
        type: 'COLUMN_COUNT',
        current: columnCount,
        maxAllowed: limits.maxColumns,
      },
    };
  }

  if (rowCount > limits.maxRows) {
    return {
      valid: false,
      requiresUpgrade: true,
      error: `Dataset contains ${rowCount.toLocaleString()} rows, which exceeds the ${limits.tier.toUpperCase()} limit of ${limits.maxRows.toLocaleString()} rows.`,
      limitExceeded: {
        type: 'ROW_COUNT',
        current: rowCount,
        maxAllowed: limits.maxRows,
      },
    };
  }

  return { valid: true };
}

/**
 * Validate project creation count limit
 */
export function validateProjectLimit(
  currentProjectCount: number,
  tier: ProductTier = 'free'
): WorkspaceValidationResult {
  const limits = WORKSPACE_LIMITS[tier] || WORKSPACE_LIMITS.free;

  if (currentProjectCount >= limits.maxSavedProjects) {
    return {
      valid: false,
      requiresUpgrade: true,
      error: `You have reached the maximum of ${limits.maxSavedProjects} saved project(s) on the ${limits.tier.toUpperCase()} plan.`,
      limitExceeded: {
        type: 'PROJECT_COUNT',
        current: currentProjectCount,
        maxAllowed: limits.maxSavedProjects,
      },
    };
  }

  return { valid: true };
}
