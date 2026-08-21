/**
 * AnalyticsRise — Power BI Workspace Limits & Tier Configuration
 * Centralized governance for dataset counts, file sizes, dimensions, and project limits.
 */

import { DatasetValidationResult } from './types';

export interface PowerBITierLimits {
  maxFileSizeBytes: number;
  maxDatasets: number;
  maxRowsPerDataset: number;
  maxColumnsPerDataset: number;
  maxSavedProjects: number;
}

export const POWERBI_WORKSPACE_LIMITS: Record<'free' | 'pro' | 'enterprise', PowerBITierLimits> = {
  free: {
    maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
    maxDatasets: 3,
    maxRowsPerDataset: 25_000,
    maxColumnsPerDataset: 100,
    maxSavedProjects: 1,
  },
  pro: {
    maxFileSizeBytes: 25 * 1024 * 1024, // 25 MB
    maxDatasets: 10,
    maxRowsPerDataset: 100_000,
    maxColumnsPerDataset: 250,
    maxSavedProjects: 10,
  },
  enterprise: {
    maxFileSizeBytes: 100 * 1024 * 1024, // 100 MB
    maxDatasets: 50,
    maxRowsPerDataset: 500_000,
    maxColumnsPerDataset: 500,
    maxSavedProjects: 100,
  },
};

/**
 * Validates a file before parsing
 */
export function validateDatasetUpload(
  fileSize: number,
  currentDatasetCount: number,
  tier: 'free' | 'pro' | 'enterprise' = 'free'
): DatasetValidationResult {
  const limits = POWERBI_WORKSPACE_LIMITS[tier] || POWERBI_WORKSPACE_LIMITS.free;

  // 1. File Size Check
  if (fileSize > limits.maxFileSizeBytes) {
    const sizeMb = (fileSize / (1024 * 1024)).toFixed(1);
    const limitMb = limits.maxFileSizeBytes / (1024 * 1024);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds the ${tier.toUpperCase()} limit of ${limitMb} MB.`,
      requiresUpgrade: tier === 'free',
      limitExceeded: {
        type: 'FILE_SIZE',
        limit: limits.maxFileSizeBytes,
        current: fileSize,
      },
    };
  }

  // 2. Dataset Count Check
  if (currentDatasetCount >= limits.maxDatasets) {
    return {
      valid: false,
      error: `Workspace already contains ${currentDatasetCount} datasets. The ${tier.toUpperCase()} limit is ${limits.maxDatasets}.`,
      requiresUpgrade: tier === 'free',
      limitExceeded: {
        type: 'DATASET_COUNT',
        limit: limits.maxDatasets,
        current: currentDatasetCount,
      },
    };
  }

  return { valid: true };
}

/**
 * Validates dataset dimensions after parsing
 */
export function validateDatasetDimensions(
  rowCount: number,
  colCount: number,
  tier: 'free' | 'pro' | 'enterprise' = 'free'
): DatasetValidationResult {
  const limits = POWERBI_WORKSPACE_LIMITS[tier] || POWERBI_WORKSPACE_LIMITS.free;

  if (rowCount > limits.maxRowsPerDataset) {
    return {
      valid: false,
      error: `Dataset row count (${rowCount.toLocaleString()}) exceeds the ${tier.toUpperCase()} limit of ${limits.maxRowsPerDataset.toLocaleString()} rows.`,
      requiresUpgrade: tier === 'free',
      limitExceeded: {
        type: 'ROW_COUNT',
        limit: limits.maxRowsPerDataset,
        current: rowCount,
      },
    };
  }

  if (colCount > limits.maxColumnsPerDataset) {
    return {
      valid: false,
      error: `Dataset column count (${colCount}) exceeds the ${tier.toUpperCase()} limit of ${limits.maxColumnsPerDataset} columns.`,
      requiresUpgrade: tier === 'free',
      limitExceeded: {
        type: 'COLUMN_COUNT',
        limit: limits.maxColumnsPerDataset,
        current: colCount,
      },
    };
  }

  return { valid: true };
}
