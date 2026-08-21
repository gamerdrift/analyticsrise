/**
 * AnalyticsRise — Power BI Workspace Project Storage
 * User-scoped, privacy-first localStorage persistence for multi-dataset analytics models.
 */

import { PowerBIWorkspaceProject, PowerBIProjectSummary } from './types';

const STORAGE_PREFIX = 'ar_powerbi_workspace_';
const INDEX_KEY_SUFFIX = '_index';

/**
 * Returns the scoped storage key prefix for a given user
 */
function getStorageKeyPrefix(userId: string | null): string {
  const uid = userId ? userId.trim() : 'guest';
  return `${STORAGE_PREFIX}${uid}_`;
}

/**
 * Returns the scoped project index key for a given user
 */
function getIndexKey(userId: string | null): string {
  const uid = userId ? userId.trim() : 'guest';
  return `${STORAGE_PREFIX}${uid}${INDEX_KEY_SUFFIX}`;
}

/**
 * Saves a Power BI Workspace project to localStorage
 */
export function savePowerBIProject(
  project: PowerBIWorkspaceProject,
  userId: string | null
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const key = `${getStorageKeyPrefix(userId)}${project.projectId}`;
    localStorage.setItem(key, JSON.stringify(project));

    // Update index
    const indexKey = getIndexKey(userId);
    const existingIndexJson = localStorage.getItem(indexKey);
    const index: PowerBIProjectSummary[] = existingIndexJson ? JSON.parse(existingIndexJson) : [];

    const totalRows = project.datasets.reduce((acc, ds) => acc + ds.rowCount, 0);
    const totalSizeBytes = project.datasets.reduce((acc, ds) => acc + ds.sourceSizeBytes, 0);

    const summary: PowerBIProjectSummary = {
      projectId: project.projectId,
      projectName: project.projectName,
      datasetCount: project.datasets.length,
      totalRows,
      totalSizeBytes,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

    const existingIdx = index.findIndex((p) => p.projectId === project.projectId);
    if (existingIdx >= 0) {
      index[existingIdx] = summary;
    } else {
      index.unshift(summary);
    }

    localStorage.setItem(indexKey, JSON.stringify(index));
    return true;
  } catch (err) {
    console.error('Failed to save Power BI project to localStorage:', err);
    return false;
  }
}

/**
 * Lists all saved Power BI projects for a user
 */
export function listPowerBIProjects(userId: string | null): PowerBIProjectSummary[] {
  if (typeof window === 'undefined') return [];

  try {
    const indexKey = getIndexKey(userId);
    const raw = localStorage.getItem(indexKey);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to list Power BI projects:', err);
    return [];
  }
}

/**
 * Loads a full Power BI project by ID
 */
export function loadPowerBIProject(
  projectId: string,
  userId: string | null
): PowerBIWorkspaceProject | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = `${getStorageKeyPrefix(userId)}${projectId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const project: PowerBIWorkspaceProject = JSON.parse(raw);
    // Sanitize future arrays in case loaded from older schemas
    project.datasets = project.datasets || [];
    project.relationships = project.relationships || [];
    project.measures = project.measures || [];
    project.visuals = project.visuals || [];
    return project;
  } catch (err) {
    console.error(`Failed to load Power BI project ${projectId}:`, err);
    return null;
  }
}

/**
 * Deletes a Power BI project by ID
 */
export function deletePowerBIProject(
  projectId: string,
  userId: string | null
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const key = `${getStorageKeyPrefix(userId)}${projectId}`;
    localStorage.removeItem(key);

    const indexKey = getIndexKey(userId);
    const raw = localStorage.getItem(indexKey);
    if (raw) {
      const index: PowerBIProjectSummary[] = JSON.parse(raw);
      const filtered = index.filter((p) => p.projectId !== projectId);
      localStorage.setItem(indexKey, JSON.stringify(filtered));
    }
    return true;
  } catch (err) {
    console.error(`Failed to delete Power BI project ${projectId}:`, err);
    return false;
  }
}
