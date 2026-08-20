/**
 * AnalyticsRise SQL Workspace — Local Browser Project Persistence
 * 
 * Manages user-isolated workspace project storage using browser localStorage.
 * Completely client-side, zero cross-user leakage, and free-tier compatible.
 */

import { WorkspaceProject, WorkspaceProjectSummary } from './types';

function getIndexKey(uid?: string | null): string {
  const scope = uid ? uid.trim() : 'guest';
  return `ar_sql_workspace_index_${scope}`;
}

function getProjectKey(projectId: string, uid?: string | null): string {
  const scope = uid ? uid.trim() : 'guest';
  return `ar_sql_workspace_${scope}_${projectId}`;
}

/**
 * List all saved workspace project summaries for the current user
 */
export function listProjects(uid?: string | null): WorkspaceProjectSummary[] {
  if (typeof window === 'undefined') return [];

  try {
    const rawIndex = localStorage.getItem(getIndexKey(uid));
    if (!rawIndex) return [];
    const parsed = JSON.parse(rawIndex);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to load workspace projects index:', err);
    return [];
  }
}

/**
 * Load a full workspace project by ID
 */
export function loadProject(
  projectId: string,
  uid?: string | null
): WorkspaceProject | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(getProjectKey(projectId, uid));
    if (!raw) return null;
    return JSON.parse(raw) as WorkspaceProject;
  } catch (err) {
    console.warn(`Failed to load workspace project ${projectId}:`, err);
    return null;
  }
}

/**
 * Save or update a workspace project
 */
export function saveProject(
  project: WorkspaceProject,
  uid?: string | null
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const projectKey = getProjectKey(project.projectId, uid);
    localStorage.setItem(projectKey, JSON.stringify(project));

    // Update index summary
    const indexKey = getIndexKey(uid);
    const summaries = listProjects(uid);
    const existingIdx = summaries.findIndex((s) => s.projectId === project.projectId);

    const summary: WorkspaceProjectSummary = {
      projectId: project.projectId,
      projectName: project.projectName,
      tableName: project.tableName,
      rawFileName: project.rawFileName,
      rowCount: project.schema.length > 0 ? project.schema[0].totalCount : 0,
      columnCount: project.schema.length,
      createdAt: project.createdAt,
      updatedAt: Date.now(),
    };

    if (existingIdx >= 0) {
      summaries[existingIdx] = summary;
    } else {
      summaries.unshift(summary);
    }

    localStorage.setItem(indexKey, JSON.stringify(summaries));
    return true;
  } catch (err) {
    console.warn(`Failed to save workspace project ${project.projectId}:`, err);
    return false;
  }
}

/**
 * Delete a workspace project
 */
export function deleteProject(
  projectId: string,
  uid?: string | null
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const projectKey = getProjectKey(projectId, uid);
    localStorage.removeItem(projectKey);

    const indexKey = getIndexKey(uid);
    const summaries = listProjects(uid).filter((s) => s.projectId !== projectId);
    localStorage.setItem(indexKey, JSON.stringify(summaries));
    return true;
  } catch (err) {
    console.warn(`Failed to delete workspace project ${projectId}:`, err);
    return false;
  }
}
