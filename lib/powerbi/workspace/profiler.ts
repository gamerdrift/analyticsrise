/**
 * AnalyticsRise — Power BI Workspace Dataset Profiler
 * Generates lightweight, browser-safe column profiles, statistical summaries,
 * and educational data quality warnings.
 */

import { Dataset, DatasetProfile, DatasetColumn } from './types';

/**
 * Profiles a single dataset
 */
export function profileDataset(dataset: Dataset): DatasetProfile {
  const qualityWarnings: string[] = [];
  const potentialKeys: string[] = [];

  for (const col of dataset.columns) {
    const nullPct = (col.nullRatio * 100).toFixed(1);

    // 1. Missing Values Warnings
    if (col.nullRatio > 0.8) {
      qualityWarnings.push(
        `Column "${col.name}" is mostly empty (${nullPct}% missing values). Consider verifying if this field is required.`
      );
    } else if (col.nullRatio > 0.2) {
      qualityWarnings.push(
        `Column "${col.name}" contains a notable proportion of missing values (${col.nullCount} nulls, ${nullPct}%).`
      );
    }

    // 2. Potential Primary Key / Identifier Recognition
    if (col.isPotentialKey || (col.nullCount === 0 && col.distinctCount === dataset.rowCount && dataset.rowCount > 0)) {
      potentialKeys.push(col.name);
      qualityWarnings.push(
        `Column "${col.name}" is 100% unique and non-null. This column is an ideal primary key candidate for multi-dataset relationships.`
      );
    }

    // 3. Single Value / Low Cardinality Warning
    if (dataset.rowCount > 10 && col.distinctCount === 1 && col.nullCount === 0) {
      qualityWarnings.push(
        `Column "${col.name}" contains only a single distinct value across all rows.`
      );
    }
  }

  // Check for duplicate header patterns (e.g. Column_1_2)
  const duplicatePatternCols = dataset.columns.filter((c) => /_\d+$/.test(c.name));
  if (duplicatePatternCols.length > 0) {
    qualityWarnings.push(
      `Detected auto-renamed duplicate headers: ${duplicatePatternCols.map((c) => `"${c.name}"`).join(', ')}. Rename them to prevent calculation ambiguity.`
    );
  }

  return {
    datasetId: dataset.id,
    datasetName: dataset.name,
    rowCount: dataset.rowCount,
    colCount: dataset.colCount,
    columns: dataset.columns,
    qualityWarnings,
    potentialKeys,
  };
}

/**
 * Profiles all datasets in a workspace project
 */
export function profileAllDatasets(datasets: Dataset[]): Record<string, DatasetProfile> {
  const profiles: Record<string, DatasetProfile> = {};
  for (const ds of datasets) {
    profiles[ds.id] = profileDataset(ds);
  }
  return profiles;
}
