/**
 * AnalyticsRise — Power BI Workspace AI-EVA Privacy Context Adapter
 * Produces privacy-safe schema metadata and relationship heuristics
 * for AI-EVA without exposing raw dataset records.
 */

import { Dataset } from './types';
import { findRelationshipCandidates } from './modelHeuristics';
import { profileDataset } from './profiler';

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

/**
 * Adapts live Power BI Workspace state into a privacy-safe AI-EVA metadata payload
 */
export function adaptPowerBIWorkspaceContext(
  datasets: Dataset[],
  activeDatasetId?: string
): PowerBIWorkspaceContextData {
  const datasetSummaries: PowerBIDatasetSummary[] = datasets.map((ds) => {
    const profile = profileDataset(ds);
    return {
      id: ds.id,
      name: ds.name,
      rowCount: ds.rowCount,
      colCount: ds.colCount,
      columns: ds.columns.map((c) => ({
        name: c.name,
        inferredType: c.inferredType,
        nullCount: c.nullCount,
        nullRatio: c.nullRatio,
        distinctCount: c.distinctCount,
        sampleValues: c.sampleValues.slice(0, 3),
      })),
      suggestedKeys: profile.potentialKeys,
    };
  });

  const candidates = findRelationshipCandidates(datasets);
  const relationshipSummaries: PowerBIRelationshipCandidateSummary[] = candidates.map((c) => ({
    fromDataset: c.fromDatasetName,
    fromColumn: c.fromColumn,
    toDataset: c.toDatasetName,
    toColumn: c.toColumn,
    cardinality: c.suggestedCardinality,
    confidence: c.confidence,
  }));

  const allWarnings = datasets.flatMap((ds) => profileDataset(ds).qualityWarnings);

  return {
    workspaceType: 'powerbi_workspace',
    datasetCount: datasets.length,
    datasets: datasetSummaries,
    activeDatasetId,
    qualityWarnings: allWarnings.slice(0, 15),
    suggestedRelationships: relationshipSummaries,
    privacyLevel: 'metadata',
  };
}
