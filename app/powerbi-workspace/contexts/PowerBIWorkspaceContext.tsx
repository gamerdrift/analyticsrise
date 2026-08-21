'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import {
  Dataset,
  DatasetProfile,
  PowerBIWorkspaceProject,
  PowerBIProjectSummary,
} from '@/lib/powerbi/workspace/types';
import {
  parseDatasetFile,
} from '@/lib/powerbi/workspace/csvParser';
import {
  profileDataset,
  profileAllDatasets,
} from '@/lib/powerbi/workspace/profiler';
import {
  savePowerBIProject,
  listPowerBIProjects,
  loadPowerBIProject,
  deletePowerBIProject,
} from '@/lib/powerbi/workspace/projectStorage';
import {
  getStarterDatasets,
} from '@/lib/powerbi/workspace/starterData';
import {
  validateDatasetUpload,
  validateDatasetDimensions,
} from '@/lib/powerbi/workspace/limits';
import { FeatureId } from '@/lib/entitlements/types';
import { AnalyticsService } from '@/lib/services/analytics';
import { useAuth } from '@/lib/hooks/useAuth';

export interface PowerBIWorkspaceState {
  datasets: Dataset[];
  activeDatasetId: string | null;
  profiles: Record<string, DatasetProfile>;
  activeProject: PowerBIWorkspaceProject | null;
  isProfileDrawerOpen: boolean;
  isModelPrepOpen: boolean;
  isUploadModalOpen: boolean;
  isProjectManagerOpen: boolean;
  isUpgradeModalOpen: boolean;
  upgradeFeatureId: FeatureId;
  searchQuery: string;
  userTier: 'free' | 'pro' | 'enterprise';
  isUploading: boolean;
  uploadError: string | null;
}

export type PowerBIWorkspaceAction =
  | { type: 'SET_DATASETS'; payload: Dataset[] }
  | { type: 'ADD_DATASET'; payload: Dataset }
  | { type: 'REMOVE_DATASET'; payload: string }
  | { type: 'RENAME_DATASET'; payload: { id: string; name: string } }
  | { type: 'SET_ACTIVE_DATASET'; payload: string | null }
  | { type: 'SET_PROJECT'; payload: PowerBIWorkspaceProject | null }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_UPLOAD_ERROR'; payload: string | null }
  | { type: 'TOGGLE_PROFILE_DRAWER'; payload?: boolean }
  | { type: 'TOGGLE_MODEL_PREP'; payload?: boolean }
  | { type: 'TOGGLE_UPLOAD_MODAL'; payload?: boolean }
  | { type: 'TOGGLE_PROJECT_MANAGER'; payload?: boolean }
  | { type: 'TOGGLE_UPGRADE_MODAL'; payload: { isOpen: boolean; featureId?: FeatureId } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'RESET_TO_STARTER' };

const initialDatasets = getStarterDatasets();
const initialProfiles = profileAllDatasets(initialDatasets);

const initialState: PowerBIWorkspaceState = {
  datasets: initialDatasets,
  activeDatasetId: initialDatasets[0]?.id || null,
  profiles: initialProfiles,
  activeProject: null,
  isProfileDrawerOpen: false,
  isModelPrepOpen: false,
  isUploadModalOpen: false,
  isProjectManagerOpen: false,
  isUpgradeModalOpen: false,
  upgradeFeatureId: 'powerbi.multiple_datasets',
  searchQuery: '',
  userTier: 'free',
  isUploading: false,
  uploadError: null,
};

function workspaceReducer(
  state: PowerBIWorkspaceState,
  action: PowerBIWorkspaceAction
): PowerBIWorkspaceState {
  switch (action.type) {
    case 'SET_DATASETS': {
      const profiles = profileAllDatasets(action.payload);
      return {
        ...state,
        datasets: action.payload,
        profiles,
        activeDatasetId: action.payload.length > 0 ? (action.payload.some((d) => d.id === state.activeDatasetId) ? state.activeDatasetId : action.payload[0].id) : null,
      };
    }
    case 'ADD_DATASET': {
      const newDatasets = [...state.datasets, action.payload];
      const newProfile = profileDataset(action.payload);
      return {
        ...state,
        datasets: newDatasets,
        profiles: { ...state.profiles, [action.payload.id]: newProfile },
        activeDatasetId: action.payload.id,
        uploadError: null,
      };
    }
    case 'REMOVE_DATASET': {
      const filtered = state.datasets.filter((d) => d.id !== action.payload);
      const remainingProfiles = { ...state.profiles };
      delete remainingProfiles[action.payload];
      return {
        ...state,
        datasets: filtered,
        profiles: remainingProfiles,
        activeDatasetId: filtered.length > 0 ? filtered[0].id : null,
      };
    }
    case 'RENAME_DATASET': {
      const updated = state.datasets.map((d) =>
        d.id === action.payload.id ? { ...d, name: action.payload.name, updatedAt: Date.now() } : d
      );
      const profiles = profileAllDatasets(updated);
      return {
        ...state,
        datasets: updated,
        profiles,
      };
    }
    case 'SET_ACTIVE_DATASET':
      return { ...state, activeDatasetId: action.payload };
    case 'SET_PROJECT':
      if (action.payload) {
        const profiles = profileAllDatasets(action.payload.datasets);
        return {
          ...state,
          activeProject: action.payload,
          datasets: action.payload.datasets,
          profiles,
          activeDatasetId: action.payload.datasets[0]?.id || null,
        };
      }
      return { ...state, activeProject: null };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'SET_UPLOAD_ERROR':
      return { ...state, uploadError: action.payload };
    case 'TOGGLE_PROFILE_DRAWER':
      return {
        ...state,
        isProfileDrawerOpen: action.payload !== undefined ? action.payload : !state.isProfileDrawerOpen,
      };
    case 'TOGGLE_MODEL_PREP':
      return {
        ...state,
        isModelPrepOpen: action.payload !== undefined ? action.payload : !state.isModelPrepOpen,
      };
    case 'TOGGLE_UPLOAD_MODAL':
      return {
        ...state,
        isUploadModalOpen: action.payload !== undefined ? action.payload : !state.isUploadModalOpen,
      };
    case 'TOGGLE_PROJECT_MANAGER':
      return {
        ...state,
        isProjectManagerOpen: action.payload !== undefined ? action.payload : !state.isProjectManagerOpen,
      };
    case 'TOGGLE_UPGRADE_MODAL':
      return {
        ...state,
        isUpgradeModalOpen: action.payload.isOpen,
        upgradeFeatureId: action.payload.featureId || state.upgradeFeatureId,
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'RESET_TO_STARTER': {
      const starter = getStarterDatasets();
      const profiles = profileAllDatasets(starter);
      return {
        ...state,
        datasets: starter,
        profiles,
        activeDatasetId: starter[0]?.id || null,
        activeProject: null,
      };
    }
    default:
      return state;
  }
}

interface PowerBIWorkspaceContextValue {
  state: PowerBIWorkspaceState;
  dispatch: React.Dispatch<PowerBIWorkspaceAction>;
  uploadDatasetFile: (file: File) => Promise<boolean>;
  removeDataset: (datasetId: string) => void;
  renameDataset: (datasetId: string, newName: string) => void;
  saveCurrentProject: (name?: string) => boolean;
  loadProject: (projectId: string) => boolean;
  deleteProject: (projectId: string) => boolean;
  listSavedProjects: () => PowerBIProjectSummary[];
  loadStarterData: () => void;
}

const PowerBIWorkspaceContext = createContext<PowerBIWorkspaceContextValue | undefined>(undefined);

export function PowerBIWorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);
  const { currentUser, userProfile } = useAuth();
  const userId = currentUser?.uid || null;
  const isPro = (userProfile as any)?.tier === 'pro' || (userProfile as any)?.tier === 'enterprise';
  const tier: 'free' | 'pro' | 'enterprise' = isPro ? 'pro' : 'free';

  // Telemetry on mount
  useEffect(() => {
    const totalRows = state.datasets.reduce((acc, d) => acc + d.rowCount, 0);
    const rowBucket = totalRows < 1000 ? '<1k' : totalRows < 10000 ? '1k-10k' : '10k+';
    AnalyticsService.logPowerBIWorkspaceOpened({
      datasetCount: state.datasets.length,
      totalRowsBucket: rowBucket,
    });
  }, []);

  const uploadDatasetFile = useCallback(
    async (file: File): Promise<boolean> => {
      dispatch({ type: 'SET_UPLOADING', payload: true });
      dispatch({ type: 'SET_UPLOAD_ERROR', payload: null });

      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const sizeBucket = file.size < 1024 * 1024 ? '<1MB' : file.size < 5 * 1024 * 1024 ? '1-5MB' : '>5MB';

      AnalyticsService.logPowerBIWorkspaceUploadStarted({
        fileSizeBucket: sizeBucket,
        extension: ext,
      });

      // 1. Upload limits validation
      const preVal = validateDatasetUpload(file.size, state.datasets.length, tier);
      if (!preVal.valid) {
        dispatch({ type: 'SET_UPLOADING', payload: false });
        dispatch({ type: 'SET_UPLOAD_ERROR', payload: preVal.error || 'Upload validation failed.' });
        AnalyticsService.logPowerBIWorkspaceDatasetRejected({ reason: preVal.limitExceeded?.type || 'file_size' });
        if (preVal.requiresUpgrade) {
          dispatch({
            type: 'TOGGLE_UPGRADE_MODAL',
            payload: { isOpen: true, featureId: preVal.limitExceeded?.type === 'DATASET_COUNT' ? 'powerbi.multiple_datasets' : 'powerbi.custom_datasets' },
          });
        }
        return false;
      }

      try {
        const text = await file.text();
        const dataset = parseDatasetFile(text, file.name, file.size);

        // 2. Dimension limits validation
        const dimVal = validateDatasetDimensions(dataset.rowCount, dataset.colCount, tier);
        if (!dimVal.valid) {
          dispatch({ type: 'SET_UPLOADING', payload: false });
          dispatch({ type: 'SET_UPLOAD_ERROR', payload: dimVal.error || 'Dataset dimension limit exceeded.' });
          AnalyticsService.logPowerBIWorkspaceDatasetRejected({ reason: dimVal.limitExceeded?.type || 'dimensions' });
          if (dimVal.requiresUpgrade) {
            dispatch({
              type: 'TOGGLE_UPGRADE_MODAL',
              payload: { isOpen: true, featureId: 'powerbi.custom_datasets' },
            });
          }
          return false;
        }

        dispatch({ type: 'ADD_DATASET', payload: dataset });
        dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: false });

        const rowBucket = dataset.rowCount < 100 ? '<100' : dataset.rowCount < 1000 ? '100-1k' : '>1k';
        const colBucket = dataset.colCount < 10 ? '<10' : dataset.colCount < 30 ? '10-30' : '>30';

        AnalyticsService.logPowerBIWorkspaceUploadCompleted({
          rowBucket,
          colBucket,
          extension: ext,
        });

        return true;
      } catch (err: any) {
        dispatch({ type: 'SET_UPLOAD_ERROR', payload: `Failed to parse file: ${err.message || 'Unknown error'}` });
        return false;
      } finally {
        dispatch({ type: 'SET_UPLOADING', payload: false });
      }
    },
    [state.datasets.length, tier]
  );

  const removeDataset = useCallback(
    (datasetId: string) => {
      dispatch({ type: 'REMOVE_DATASET', payload: datasetId });
      AnalyticsService.logPowerBIWorkspaceDatasetRemoved({
        remainingCount: state.datasets.length - 1,
      });
    },
    [state.datasets.length]
  );

  const renameDataset = useCallback((datasetId: string, newName: string) => {
    dispatch({ type: 'RENAME_DATASET', payload: { id: datasetId, name: newName.trim() || 'Untitled' } });
  }, []);

  const saveCurrentProject = useCallback(
    (customName?: string): boolean => {
      const projectName =
        customName ||
        state.activeProject?.projectName ||
        `Analytics Model (${new Date().toLocaleDateString()})`;

      const projectId = state.activeProject?.projectId || `proj_${Date.now()}`;

      const project: PowerBIWorkspaceProject = {
        projectId,
        projectName,
        datasets: state.datasets,
        relationships: state.activeProject?.relationships || [],
        measures: state.activeProject?.measures || [],
        visuals: state.activeProject?.visuals || [],
        createdAt: state.activeProject?.createdAt || Date.now(),
        updatedAt: Date.now(),
        version: (state.activeProject?.version || 0) + 1,
      };

      const ok = savePowerBIProject(project, userId);
      if (ok) {
        dispatch({ type: 'SET_PROJECT', payload: project });
        AnalyticsService.logPowerBIWorkspaceProjectSaved({
          projectId,
          datasetCount: state.datasets.length,
        });
      }
      return ok;
    },
    [state.activeProject, state.datasets, userId]
  );

  const loadProject = useCallback(
    (projectId: string): boolean => {
      const project = loadPowerBIProject(projectId, userId);
      if (project) {
        dispatch({ type: 'SET_PROJECT', payload: project });
        dispatch({ type: 'TOGGLE_PROJECT_MANAGER', payload: false });
        AnalyticsService.logPowerBIWorkspaceProjectLoaded({
          projectId,
          datasetCount: project.datasets.length,
        });
        return true;
      }
      return false;
    },
    [userId]
  );

  const deleteProject = useCallback(
    (projectId: string): boolean => {
      return deletePowerBIProject(projectId, userId);
    },
    [userId]
  );

  const listSavedProjects = useCallback((): PowerBIProjectSummary[] => {
    return listPowerBIProjects(userId);
  }, [userId]);

  const loadStarterData = useCallback(() => {
    dispatch({ type: 'RESET_TO_STARTER' });
  }, []);

  return (
    <PowerBIWorkspaceContext.Provider
      value={{
        state,
        dispatch,
        uploadDatasetFile,
        removeDataset,
        renameDataset,
        saveCurrentProject,
        loadProject,
        deleteProject,
        listSavedProjects,
        loadStarterData,
      }}
    >
      {children}
    </PowerBIWorkspaceContext.Provider>
  );
}

export function usePowerBIWorkspace(): PowerBIWorkspaceContextValue {
  const context = useContext(PowerBIWorkspaceContext);
  if (!context) {
    throw new Error('usePowerBIWorkspace must be used within a PowerBIWorkspaceProvider');
  }
  return context;
}
