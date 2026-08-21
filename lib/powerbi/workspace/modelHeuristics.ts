/**
 * AnalyticsRise — Power BI Workspace Semantic Model Heuristics
 * Analyzes multi-dataset schemas to detect primary keys, foreign keys,
 * and candidate relationships for model preparation.
 */

import { Dataset, RelationshipCandidate, Cardinality } from './types';

/**
 * Normalizes a column name for fuzzy relationship matching
 * e.g. "Customer ID", "customer_id", "customerId" -> "customerid"
 */
export function normalizeKeyName(name: string): string {
  return name.toLowerCase().replace(/[\s_\-]/g, '');
}

/**
 * Discovers candidate relationships across all loaded datasets
 */
export function findRelationshipCandidates(datasets: Dataset[]): RelationshipCandidate[] {
  if (datasets.length < 2) return [];

  const candidates: RelationshipCandidate[] = [];
  const candidateKeys = new Set<string>();

  for (let i = 0; i < datasets.length; i++) {
    const dsA = datasets[i];

    for (let j = 0; j < datasets.length; j++) {
      if (i === j) continue;
      const dsB = datasets[j];

      // Examine columns in dsA and dsB
      for (const colA of dsA.columns) {
        const normA = normalizeKeyName(colA.name);

        for (const colB of dsB.columns) {
          const normB = normalizeKeyName(colB.name);

          let isMatch = false;
          let confidence = 0;
          let matchReason = '';

          // Exact column name match (e.g. customer_id == customer_id)
          if (normA === normB && (normA.includes('id') || normA.includes('key') || normA.includes('code') || colA.isPotentialKey || colB.isPotentialKey)) {
            isMatch = true;
            confidence = 0.95;
            matchReason = `Exact key name match: "${colA.name}"`;
          }
          // Name with table prefix (e.g. Customers.id matching Orders.customer_id)
          else if (
            (normB === `${normalizeKeyName(dsA.name)}id` || normB === `${normalizeKeyName(dsA.name)}key`) &&
            (normA === 'id' || normA === 'key' || colA.isPotentialKey)
          ) {
            isMatch = true;
            confidence = 0.85;
            matchReason = `Entity key match: "${dsA.name}.${colA.name}" matches foreign key "${dsB.name}.${colB.name}"`;
          }

          if (isMatch) {
            const pairKey = [dsA.id, colA.name, dsB.id, colB.name].sort().join('::');
            if (candidateKeys.has(pairKey)) continue;
            candidateKeys.add(pairKey);

            // Determine suggested cardinality
            const aIsUnique = colA.isPotentialKey || (colA.nullCount === 0 && colA.distinctCount === dsA.rowCount);
            const bIsUnique = colB.isPotentialKey || (colB.nullCount === 0 && colB.distinctCount === dsB.rowCount);

            let suggestedCardinality: Cardinality = '1:N';
            if (aIsUnique && bIsUnique) {
              suggestedCardinality = '1:1';
            } else if (aIsUnique && !bIsUnique) {
              suggestedCardinality = '1:N';
            } else if (!aIsUnique && bIsUnique) {
              suggestedCardinality = 'N:1';
            } else {
              suggestedCardinality = 'N:N';
            }

            candidates.push({
              id: `rel_${dsA.id}_${colA.name}_${dsB.id}_${colB.name}`,
              fromDatasetId: dsA.id,
              fromDatasetName: dsA.name,
              fromColumn: colA.name,
              toDatasetId: dsB.id,
              toDatasetName: dsB.name,
              toColumn: colB.name,
              suggestedCardinality,
              confidence,
              reason: matchReason,
            });
          }
        }
      }
    }
  }

  return candidates.sort((a, b) => b.confidence - a.confidence);
}
