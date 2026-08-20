/**
 * Excel Workspace — Project Local Storage Persistence
 * Manages user-scoped localStorage persistence for workbooks.
 */

import { ExcelWorkspaceProject, WorkspaceProjectSummary } from './types';

const STORAGE_PREFIX = 'ar_excel_workspace_';
const INDEX_KEY_SUFFIX = '_index';

/**
 * Get user storage prefix
 */
function getStorageKeyPrefix(userId: string | null): string {
  const uid = userId ? userId.trim() : 'guest';
  return `${STORAGE_PREFIX}${uid}_`;
}

/**
 * Get user project index key
 */
function getIndexKey(userId: string | null): string {
  const uid = userId ? userId.trim() : 'guest';
  return `${STORAGE_PREFIX}${uid}${INDEX_KEY_SUFFIX}`;
}

/**
 * Save an Excel Workspace project to localStorage
 */
export function saveExcelProject(
  project: ExcelWorkspaceProject,
  userId: string | null
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const key = `${getStorageKeyPrefix(userId)}${project.projectId}`;
    localStorage.setItem(key, JSON.stringify(project));

    // Update index
    const indexKey = getIndexKey(userId);
    const existingIndexJson = localStorage.getItem(indexKey);
    const index: WorkspaceProjectSummary[] = existingIndexJson ? JSON.parse(existingIndexJson) : [];

    const summary: WorkspaceProjectSummary = {
      projectId: project.projectId,
      projectName: project.projectName,
      fileName: project.fileName,
      fileSizeBytes: project.fileSizeBytes,
      sheetCount: project.workbook.sheetOrder.length,
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
    console.error('Failed to save Excel project to localStorage:', err);
    return false;
  }
}

/**
 * List all saved projects for the user
 */
export function listExcelProjects(userId: string | null): WorkspaceProjectSummary[] {
  if (typeof window === 'undefined') return [];

  try {
    const indexKey = getIndexKey(userId);
    const raw = localStorage.getItem(indexKey);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to list Excel projects:', err);
    return [];
  }
}

/**
 * Load a single project by ID
 */
export function loadExcelProject(
  projectId: string,
  userId: string | null
): ExcelWorkspaceProject | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = `${getStorageKeyPrefix(userId)}${projectId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error(`Failed to load Excel project ${projectId}:`, err);
    return null;
  }
}

/**
 * Delete a project by ID
 */
export function deleteExcelProject(
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
      const index: WorkspaceProjectSummary[] = JSON.parse(raw);
      const filtered = index.filter((p) => p.projectId !== projectId);
      localStorage.setItem(indexKey, JSON.stringify(filtered));
    }
    return true;
  } catch (err) {
    console.error(`Failed to delete Excel project ${projectId}:`, err);
    return false;
  }
}
