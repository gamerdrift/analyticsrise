import { PublicChallenge, ChallengeModule, ChallengeTrack } from '../../types';
import { PUBLIC_CHALLENGES } from '../../public/challenges';
import { SQL_MODULES, SQL_TRACKS } from '../../modules';

export interface CycleValidationResult {
  hasCycle: boolean;
  cyclePaths: string[][];
  errors: string[];
}

/**
 * Validates that the curriculum prerequisite graph is a Directed Acyclic Graph (DAG)
 * and contains no circular dependencies.
 */
export function detectCurriculumCycles(
  challenges: PublicChallenge[] = PUBLIC_CHALLENGES,
  modules: ChallengeModule[] = SQL_MODULES,
  tracks: ChallengeTrack[] = SQL_TRACKS
): CycleValidationResult {
  const cyclePaths: string[][] = [];
  const errors: string[] = [];

  // Helper for DFS cycle detection
  function detectCyclesInAdjacencyList(
    adjList: Map<string, string[]>,
    category: string
  ): void {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const currentPath: string[] = [];

    function dfs(node: string): void {
      visited.add(node);
      recStack.add(node);
      currentPath.push(node);

      const neighbors = adjList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        } else if (recStack.has(neighbor)) {
          // Cycle found!
          const cycleStartIndex = currentPath.indexOf(neighbor);
          const cycle = currentPath.slice(cycleStartIndex).concat(neighbor);
          cyclePaths.push(cycle);
          errors.push(`Circular dependency detected in ${category}: ${cycle.join(' -> ')}`);
        }
      }

      currentPath.pop();
      recStack.delete(node);
    }

    for (const node of adjList.keys()) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }
  }

  // 1. Build Challenge Prerequisite Adjacency List
  const challengeAdj = new Map<string, string[]>();
  for (const c of challenges) {
    const prereqs = new Set<string>();
    if (c.prerequisites) {
      for (const p of c.prerequisites) prereqs.add(p);
    }
    if (c.unlockRules?.type === 'PREREQUISITE_CHALLENGES' && c.unlockRules.prerequisiteChallengeIds) {
      for (const p of c.unlockRules.prerequisiteChallengeIds) prereqs.add(p);
    }
    challengeAdj.set(c.id, Array.from(prereqs));
  }
  detectCyclesInAdjacencyList(challengeAdj, 'Challenge Prerequisites');

  // 2. Build Module Prerequisite Adjacency List
  const moduleAdj = new Map<string, string[]>();
  for (const m of modules) {
    moduleAdj.set(m.id, m.prerequisites || []);
  }
  detectCyclesInAdjacencyList(moduleAdj, 'Module Prerequisites');

  return {
    hasCycle: cyclePaths.length > 0,
    cyclePaths,
    errors,
  };
}
