"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  ParsedDataset,
  WorkspaceProject,
  ColumnProfile,
} from '@/lib/sql/workspace/types';
import { QueryResult } from '@/lib/sql/types';
import { executeSql } from '@/lib/sql/engine';
import { parseCsvText } from '@/lib/sql/workspace/csvParser';

import { profileDataset } from '@/lib/sql/workspace/dataProfiler';
import { generateSqlTable } from '@/lib/sql/workspace/tableGenerator';
import {
  validateFileSize,
  validateDatasetDimensions,
} from '@/lib/sql/workspace/limits';
import {
  saveProject,
  loadProject,
  listProjects,
} from '@/lib/sql/workspace/projectStorage';
import { useAuth } from '@/lib/hooks/useAuth';
import { AnalyticsService } from '@/lib/services/analytics';
import { ProductTier } from '@/lib/entitlements/types';

export type WorkspaceTab = 'editor' | 'profile' | 'projects';

export interface SqlWorkspaceState {
  activeProject: WorkspaceProject | null;
  parsedDataset: ParsedDataset | null;
  query: string;
  results: QueryResult;
  isExecuting: boolean;
  executionError: string | null;
  isUploading: boolean;
  uploadError: string | null;
  activeTab: WorkspaceTab;
  userTier: ProductTier;
}

export type SqlWorkspaceAction =
  | { type: 'SET_ACTIVE_PROJECT'; payload: WorkspaceProject | null }
  | { type: 'SET_PARSED_DATASET'; payload: ParsedDataset | null }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_RESULTS'; payload: QueryResult }
  | { type: 'SET_EXECUTING'; payload: boolean }
  | { type: 'SET_EXECUTION_ERROR'; payload: string | null }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_UPLOAD_ERROR'; payload: string | null }
  | { type: 'SET_ACTIVE_TAB'; payload: WorkspaceTab }
  | { type: 'RESET_WORKSPACE' };

const initialQueryResult: QueryResult = {
  columns: [],
  rows: [],
  rowObjects: [],
  rowCount: 0,
  executionMs: 0,
  warnings: [],
};

const initialState: SqlWorkspaceState = {
  activeProject: null,
  parsedDataset: null,
  query: '',
  results: initialQueryResult,
  isExecuting: false,
  executionError: null,
  isUploading: false,
  uploadError: null,
  activeTab: 'editor',
  userTier: 'free',
};

function workspaceReducer(
  state: SqlWorkspaceState,
  action: SqlWorkspaceAction
): SqlWorkspaceState {
  switch (action.type) {
    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProject: action.payload };
    case 'SET_PARSED_DATASET':
      return {
        ...state,
        parsedDataset: action.payload,
        uploadError: null,
      };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        isExecuting: false,
        executionError: null,
      };
    case 'SET_EXECUTING':
      return { ...state, isExecuting: action.payload };
    case 'SET_EXECUTION_ERROR':
      return {
        ...state,
        executionError: action.payload,
        isExecuting: false,
      };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'SET_UPLOAD_ERROR':
      return {
        ...state,
        uploadError: action.payload,
        isUploading: false,
      };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'RESET_WORKSPACE':
      return {
        ...initialState,
        activeTab: state.activeTab,
        userTier: state.userTier,
      };
    default:
      return state;
  }
}

interface SqlWorkspaceContextValue {
  state: SqlWorkspaceState;
  dispatch: React.Dispatch<SqlWorkspaceAction>;
  processUploadedFile: (file: File) => Promise<boolean>;
  runWorkspaceQuery: () => void;
  saveCurrentProject: (projectName?: string) => boolean;
  loadSavedProject: (projectId: string) => boolean;
  resetToSampleData: () => void;
}

const SqlWorkspaceContext = createContext<SqlWorkspaceContextValue | undefined>(undefined);

// Sample starter dataset for immediate play
const SAMPLE_CSV = `customer_id,name,email,signup_date,country,total_spend
101,Aarav Sharma,aarav@example.in,2024-01-15,India,12450.00
102,Emma Watson,emma.w@example.com,2024-02-10,United Kingdom,8900.50
103,Kenji Sato,kenji@example.jp,2024-03-01,Japan,15300.00
104,Elena Rostova,elena@example.org,2024-03-12,Germany,6400.00
105,Marcus Vance,marcus@example.us,2024-04-05,United States,22100.75
106,Priya Patel,priya@example.in,2024-04-18,India,18500.00
107,Lucas Silva,lucas@example.br,2024-05-02,Brazil,7200.25
108,Chloe Dubois,chloe@example.fr,2024-05-19,France,9850.00`;

export function SqlWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);
  const { currentUser } = useAuth();
  const uid = currentUser ? currentUser.uid : null;

  // Initialize with sample starter dataset on mount if none loaded
  useEffect(() => {
    loadStarterSample();
  }, []);

  const loadStarterSample = () => {
    try {
      const rawResult = parseCsvText(SAMPLE_CSV);
      const { profiles, qualityReport } = profileDataset(rawResult, 'customers_sample.csv', SAMPLE_CSV.length);
      const parsed = generateSqlTable(rawResult, profiles, qualityReport, 'customers_sample.csv', SAMPLE_CSV.length);

      const starterQuery = `-- Welcome to SQL Workspace!\n-- Query your uploaded data with full SQL AST capabilities.\n\nSELECT country, COUNT(*) AS customer_count, AVG(total_spend) AS avg_spend\nFROM ${parsed.tableName}\nGROUP BY country\nORDER BY avg_spend DESC;`;

      dispatch({ type: 'SET_PARSED_DATASET', payload: parsed });
      dispatch({ type: 'SET_QUERY', payload: starterQuery });

      // Run initial starter query
      const initialRes = executeSql(starterQuery, parsed.database);
      dispatch({ type: 'SET_RESULTS', payload: initialRes });
    } catch (err) {
      console.warn('Failed to load starter sample:', err);
    }
  };

  const processUploadedFile = async (file: File): Promise<boolean> => {
    dispatch({ type: 'SET_UPLOADING', payload: true });
    dispatch({ type: 'SET_UPLOAD_ERROR', payload: null });
    AnalyticsService.logWorkspaceUploadStarted(file.size);

    // 1. Validate File Size
    const sizeCheck = validateFileSize(file.size, state.userTier);
    if (!sizeCheck.valid) {
      dispatch({ type: 'SET_UPLOAD_ERROR', payload: sizeCheck.error || 'File size exceeds limit.' });
      AnalyticsService.logWorkspaceDatasetRejected('file_size_exceeded');
      return false;
    }

    try {
      const text = await file.text();
      const rawResult = parseCsvText(text);

      if (rawResult.headers.length === 0 || rawResult.rows.length === 0) {
        dispatch({ type: 'SET_UPLOAD_ERROR', payload: 'The uploaded file is empty or missing data rows.' });
        AnalyticsService.logWorkspaceDatasetRejected('empty_file');
        return false;
      }

      // 2. Validate Dimensions
      const dimCheck = validateDatasetDimensions(rawResult.rows.length, rawResult.headers.length, state.userTier);
      if (!dimCheck.valid) {
        dispatch({ type: 'SET_UPLOAD_ERROR', payload: dimCheck.error || 'Dataset dimensions exceed limit.' });
        AnalyticsService.logWorkspaceDatasetRejected('dimensions_exceeded');
        return false;
      }

      // 3. Profile & Generate Table
      const { profiles, qualityReport } = profileDataset(rawResult, file.name, file.size);
      const parsed = generateSqlTable(rawResult, profiles, qualityReport, file.name, file.size);

      // 4. Set Initial Starter Query for the new table
      const initialQuery = `SELECT *\nFROM ${parsed.tableName}\nLIMIT 10;`;

      dispatch({ type: 'SET_PARSED_DATASET', payload: parsed });
      dispatch({ type: 'SET_QUERY', payload: initialQuery });

      // Run initial query
      const queryRes = executeSql(initialQuery, parsed.database);
      dispatch({ type: 'SET_RESULTS', payload: queryRes });

      // Automatically create a new active project model in state
      const newProject: WorkspaceProject = {
        projectId: `proj_${Date.now()}`,
        projectName: parsed.tableName.replace(/_/g, ' ').toUpperCase(),
        tableName: parsed.tableName,
        rawFileName: file.name,
        fileSizeBytes: file.size,
        schema: profiles,
        savedQuery: initialQuery,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1,
      };

      dispatch({ type: 'SET_ACTIVE_PROJECT', payload: newProject });
      saveProject(newProject, uid);

      AnalyticsService.logWorkspaceUploadCompleted(file.name, rawResult.rows.length, rawResult.headers.length);
      dispatch({ type: 'SET_UPLOADING', payload: false });
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Failed to parse CSV file.';
      dispatch({ type: 'SET_UPLOAD_ERROR', payload: msg });
      AnalyticsService.logWorkspaceDatasetRejected('parse_error');
      return false;
    }
  };

  const runWorkspaceQuery = () => {
    if (!state.parsedDataset) {
      dispatch({ type: 'SET_EXECUTION_ERROR', payload: 'No dataset loaded. Upload a CSV file first.' });
      return;
    }

    if (!state.query.trim()) {
      dispatch({ type: 'SET_EXECUTION_ERROR', payload: 'Please enter a SQL query.' });
      return;
    }

    dispatch({ type: 'SET_EXECUTING', payload: true });
    dispatch({ type: 'SET_EXECUTION_ERROR', payload: null });

    try {
      const res = executeSql(state.query, state.parsedDataset.database);
      dispatch({ type: 'SET_RESULTS', payload: res });
      AnalyticsService.logWorkspaceQueryRun(res.rowCount, res.executionMs);
    } catch (err: any) {
      const errorMsg = err?.message || 'SQL execution failed.';
      dispatch({ type: 'SET_EXECUTION_ERROR', payload: errorMsg });
    }
  };


  const saveCurrentProject = (name?: string): boolean => {
    if (!state.parsedDataset) return false;

    const projectId = state.activeProject ? state.activeProject.projectId : `proj_${Date.now()}`;
    const projectName = name || (state.activeProject ? state.activeProject.projectName : state.parsedDataset.tableName);

    const project: WorkspaceProject = {
      projectId,
      projectName,
      tableName: state.parsedDataset.tableName,
      rawFileName: state.parsedDataset.originalFileName,
      fileSizeBytes: state.parsedDataset.fileSizeBytes,
      schema: state.parsedDataset.profiles,
      savedQuery: state.query,
      lastExecutionMs: state.results.executionMs,
      createdAt: state.activeProject ? state.activeProject.createdAt : Date.now(),
      updatedAt: Date.now(),
      version: (state.activeProject?.version || 0) + 1,
    };

    const success = saveProject(project, uid);
    if (success) {
      dispatch({ type: 'SET_ACTIVE_PROJECT', payload: project });
      AnalyticsService.logWorkspaceProjectSaved(projectId);
    }
    return success;
  };

  const loadSavedProject = (projectId: string): boolean => {
    const project = loadProject(projectId, uid);
    if (!project) return false;

    dispatch({ type: 'SET_ACTIVE_PROJECT', payload: project });
    dispatch({ type: 'SET_QUERY', payload: project.savedQuery || '' });
    return true;
  };

  const resetToSampleData = () => {
    loadStarterSample();
  };

  return (
    <SqlWorkspaceContext.Provider
      value={{
        state,
        dispatch,
        processUploadedFile,
        runWorkspaceQuery,
        saveCurrentProject,
        loadSavedProject,
        resetToSampleData,
      }}
    >
      {children}
    </SqlWorkspaceContext.Provider>
  );
}

export function useSqlWorkspace() {
  const context = useContext(SqlWorkspaceContext);
  if (!context) {
    throw new Error('useSqlWorkspace must be used within a SqlWorkspaceProvider');
  }
  return context;
}
