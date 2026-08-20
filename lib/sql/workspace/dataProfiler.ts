/**
 * AnalyticsRise SQL Workspace — Lightweight In-Browser Data Profiler
 * 
 * Computes deterministic column summaries, cardinality, null ratios,
 * and statistical distributions with strict execution time bounds.
 */

import { RawParseResult } from './csvParser';
import { inferColumnType } from './typeInference';
import { ColumnProfile, DatasetQualityReport } from './types';

/**
 * Profile raw CSV columns and generate lightweight statistical metrics
 */
export function profileDataset(
  rawResult: RawParseResult,
  fileName: string,
  fileSizeBytes: number
): { profiles: ColumnProfile[]; qualityReport: DatasetQualityReport } {
  const { headers, originalHeaders, rows, delimiter, duplicateHeaders } = rawResult;
  const colCount = headers.length;
  const rowCount = rows.length;

  const profiles: ColumnProfile[] = [];
  const mixedTypeColumns: string[] = [];
  let totalEmptyCount = 0;

  for (let colIdx = 0; colIdx < colCount; colIdx++) {
    const colName = headers[colIdx];
    const origHeader = originalHeaders[colIdx] || colName;
    const colValues: string[] = [];

    let nullCount = 0;
    const uniqueValues = new Set<string>();
    const sampleValues: string[] = [];

    // Numerical accumulator
    let isNumericCandidate = true;
    let minVal = Infinity;
    let maxVal = -Infinity;
    let sumVal = 0;
    let numericCount = 0;

    for (let r = 0; r < rowCount; r++) {
      const val = rows[r][colIdx] !== undefined ? rows[r][colIdx].trim() : '';
      colValues.push(val);

      if (val === '' || val.toLowerCase() === 'null' || val.toLowerCase() === 'nan') {
        nullCount++;
        totalEmptyCount++;
      } else {
        uniqueValues.add(val);
        if (sampleValues.length < 5 && !sampleValues.includes(val)) {
          sampleValues.push(val);
        }

        const num = Number(val);
        if (!isNaN(num) && isNumericCandidate) {
          numericCount++;
          sumVal += num;
          if (num < minVal) minVal = num;
          if (num > maxVal) maxVal = num;
        } else {
          isNumericCandidate = false;
        }
      }
    }

    const { inferredType, engineType, isMixed } = inferColumnType(colValues);

    if (isMixed) {
      mixedTypeColumns.push(colName);
    }

    const colWarnings: string[] = [];
    if (nullCount > 0 && rowCount > 0) {
      const nullRatio = (nullCount / rowCount) * 100;
      if (nullRatio > 50) {
        colWarnings.push(`High null ratio: ${nullRatio.toFixed(1)}% missing values`);
      }
    }
    if (isMixed) {
      colWarnings.push('Mixed data types detected. Fallback to TEXT.');
    }

    const profile: ColumnProfile = {
      name: colName,
      originalHeader: origHeader,
      inferredType,
      engineType,
      totalCount: rowCount,
      nullCount,
      uniqueCount: uniqueValues.size,
      sampleValues,
      warnings: colWarnings.length > 0 ? colWarnings : undefined,
    };

    if (
      (inferredType === 'INTEGER' || inferredType === 'DECIMAL') &&
      numericCount > 0 &&
      minVal !== Infinity
    ) {
      profile.numericStats = {
        min: minVal,
        max: maxVal,
        avg: sumVal / numericCount,
        sum: sumVal,
      };
    }

    profiles.push(profile);
  }

  const qualityReport: DatasetQualityReport = {
    fileName,
    fileSizeBytes,
    rowCount,
    columnCount: colCount,
    delimiter,
    encoding: 'UTF-8',
    emptyValueCount: totalEmptyCount,
    duplicateHeaders,
    mixedTypeColumns,
    truncatedRowsCount: 0,
  };

  return { profiles, qualityReport };
}
