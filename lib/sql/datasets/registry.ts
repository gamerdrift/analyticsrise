import {
  DatasetDefinition,
  DatasetSummary,
  DatasetSchemaSummary,
  TableSchemaSummary,
} from './types';
import { createEcommerceDataset } from './ecommerce';
import { createSaasDataset } from './saas';
import { createHrDataset } from './hr';
import { createFinanceDataset } from './finance';

// Factory registry mapping dataset IDs to their constructor factories
const DATASET_FACTORIES: Record<string, () => DatasetDefinition> = {
  ecommerce: createEcommerceDataset,
  saas: createSaasDataset,
  hr: createHrDataset,
  finance: createFinanceDataset,
};

// In-memory cache for instantiated datasets
const datasetCache: Map<string, DatasetDefinition> = new Map();

/**
 * Retrieves an instantiated DatasetDefinition by its ID
 */
export function getDataset(id: string): DatasetDefinition | undefined {
  const normalizedId = id.toLowerCase().trim();

  if (datasetCache.has(normalizedId)) {
    return datasetCache.get(normalizedId);
  }

  const factory = DATASET_FACTORIES[normalizedId];
  if (!factory) {
    return undefined;
  }

  const dataset = factory();
  datasetCache.set(normalizedId, dataset);
  return dataset;
}

/**
 * Lists metadata summaries of all available datasets in the registry
 */
export function listDatasets(): DatasetSummary[] {
  const datasetIds = Object.keys(DATASET_FACTORIES);

  return datasetIds.map((id) => {
    const dataset = getDataset(id)!;
    const tableKeys = Object.keys(dataset.database.tables);
    const totalRows = tableKeys.reduce(
      (acc, tName) => acc + dataset.database.tables[tName].rows.length,
      0
    );

    return {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      category: dataset.category,
      difficulty: dataset.difficulty,
      tableCount: tableKeys.length,
      totalRows,
      tags: dataset.tags,
      learningObjectives: dataset.learningObjectives,
    };
  });
}

/**
 * Returns detailed schema metadata and relationships for a dataset
 */
export function getDatasetSchema(id: string): DatasetSchemaSummary | undefined {
  const dataset = getDataset(id);
  if (!dataset) return undefined;

  const tables: Record<string, TableSchemaSummary> = {};

  for (const [tableName, table] of Object.entries(dataset.database.tables)) {
    tables[tableName] = {
      name: table.name,
      description: `Relational table ${table.name} in ${dataset.name}`,
      rowCount: table.rows.length,
      columns: table.columns,
    };
  }

  return {
    id: dataset.id,
    name: dataset.name,
    tables,
    relationships: dataset.relationships,
  };
}

/**
 * Clears the in-memory dataset cache (useful for testing)
 */
export function clearDatasetCache(): void {
  datasetCache.clear();
}
