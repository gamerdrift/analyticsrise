'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  ParsedWorkbook,
  WorkspaceSheet,
  WorkspaceCell,
  CellAddress,
  CellValue,
  CellFormatting,
  WorkbookProfile,
  ExcelWorkspaceProject,
} from '@/lib/excel/workspace/types';
import { parseCsvToWorkbook } from '@/lib/excel/workspace/csvWorkbookParser';
import { parseXlsxToWorkbook } from '@/lib/excel/workspace/xlsxParser';
import { profileWorkbook } from '@/lib/excel/workspace/workbookProfiler';
import {
  validateWorkbookFileSize,
  validateWorkbookDimensions,
  validateExcelProjectLimit,
  EXCEL_WORKSPACE_LIMITS,
} from '@/lib/excel/workspace/limits';
import { saveExcelProject, loadExcelProject, listExcelProjects } from '@/lib/excel/workspace/projectStorage';
import { evaluateFormula } from '@/lib/utils/excel/formulaEvaluator';
import { AnalyticsService } from '@/lib/services/analytics';
import { useAuth } from '@/lib/hooks/useAuth';


// Built-in sample starter spreadsheet for instant exploration
const STARTER_CSV = `Region,Rep,Product,Units,Unit_Price,Total_Revenue,Date,Status
North,Elena Rostova,Cloud Analytics Suite,140,299.00,41860.00,2026-03-01,Active
West,Marcus Vance,Enterprise Data Lake,85,599.00,50915.00,2026-03-02,Active
South,Sarah Chen,AI Forecasting Engine,210,149.00,31290.00,2026-03-03,Active
East,Alex Rivera,Real-Time BI Dashboard,195,199.00,38805.00,2026-03-04,Active
North,Elena Rostova,Enterprise Data Lake,60,599.00,35940.00,2026-03-05,Active
West,Marcus Vance,Cloud Analytics Suite,115,299.00,34385.00,2026-03-06,Active
South,Sarah Chen,Real-Time BI Dashboard,160,199.00,31840.00,2026-03-07,Active
East,Alex Rivera,AI Forecasting Engine,95,149.00,14155.00,2026-03-08,Active
North,Elena Rostova,AI Forecasting Engine,180,149.00,26820.00,2026-03-09,Active
West,Marcus Vance,Real-Time BI Dashboard,130,199.00,25870.00,2026-03-10,Active`;

export interface SelectionRange {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface ExcelWorkspaceState {
  workbook: ParsedWorkbook | null;
  activeSheetId: string;
  profile: WorkbookProfile | null;
  selectedCell: CellAddress | null;
  selectionRange: SelectionRange | null;
  activeProject: ExcelWorkspaceProject | null;
  userTier: 'free' | 'pro' | 'enterprise';
  isUploading: boolean;
  uploadError: string | null;
  isProfileDrawerOpen: boolean;
  isChartModalOpen: boolean;
  isSearchModalOpen: boolean;
  isProjectManagerOpen: boolean;
  isUploadModalOpen: boolean;
  isUpgradeModalOpen: boolean;
  history: ParsedWorkbook[];
  historyIndex: number;
}

export type ExcelWorkspaceAction =
  | { type: 'SET_WORKBOOK'; payload: ParsedWorkbook }
  | { type: 'SET_ACTIVE_SHEET'; payload: string }
  | { type: 'UPDATE_CELL'; payload: { row: number; col: number; value: CellValue; formula?: string } }
  | { type: 'APPLY_CELL_FORMAT'; payload: { formatting: Partial<CellFormatting> } }
  | { type: 'SELECT_CELL'; payload: CellAddress }
  | { type: 'SELECT_RANGE'; payload: SelectionRange | null }
  | { type: 'SET_ACTIVE_PROJECT'; payload: ExcelWorkspaceProject | null }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_UPLOAD_ERROR'; payload: string | null }
  | { type: 'TOGGLE_PROFILE_DRAWER'; payload?: boolean }
  | { type: 'TOGGLE_CHART_MODAL'; payload?: boolean }
  | { type: 'TOGGLE_SEARCH_MODAL'; payload?: boolean }
  | { type: 'TOGGLE_PROJECT_MANAGER'; payload?: boolean }
  | { type: 'TOGGLE_UPLOAD_MODAL'; payload?: boolean }
  | { type: 'TOGGLE_UPGRADE_MODAL'; payload?: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const initialWorkbook = parseCsvToWorkbook(STARTER_CSV, 'sales_q1_starter.csv', STARTER_CSV.length);
const initialProfile = profileWorkbook(initialWorkbook);

const initialState: ExcelWorkspaceState = {
  workbook: initialWorkbook,
  activeSheetId: initialWorkbook.activeSheetId,
  profile: initialProfile,
  selectedCell: { sheetId: initialWorkbook.activeSheetId, row: 1, col: 0 },
  selectionRange: null,
  activeProject: null,
  userTier: 'free',
  isUploading: false,
  uploadError: null,
  isProfileDrawerOpen: false,
  isChartModalOpen: false,
  isSearchModalOpen: false,
  isProjectManagerOpen: false,
  isUploadModalOpen: false,
  isUpgradeModalOpen: false,
  history: [initialWorkbook],
  historyIndex: 0,
};

function workspaceReducer(state: ExcelWorkspaceState, action: ExcelWorkspaceAction): ExcelWorkspaceState {
  switch (action.type) {
    case 'SET_WORKBOOK': {
      const profile = profileWorkbook(action.payload);
      return {
        ...state,
        workbook: action.payload,
        activeSheetId: action.payload.activeSheetId,
        profile,
        selectedCell: { sheetId: action.payload.activeSheetId, row: 1, col: 0 },
        selectionRange: null,
        history: [action.payload],
        historyIndex: 0,
        uploadError: null,
      };
    }
    case 'SET_ACTIVE_SHEET': {
      if (!state.workbook || !state.workbook.sheets[action.payload]) return state;
      const updatedWb = { ...state.workbook, activeSheetId: action.payload };
      return {
        ...state,
        workbook: updatedWb,
        activeSheetId: action.payload,
        selectedCell: { sheetId: action.payload, row: 0, col: 0 },
        selectionRange: null,
      };
    }
    case 'UPDATE_CELL': {
      if (!state.workbook) return state;
      const currentSheet = state.workbook.sheets[state.activeSheetId];
      if (!currentSheet) return state;

      const { row, col, value, formula } = action.payload;
      const key = `${row},${col}`;
      const existing = currentSheet.cells[key];

      const newCell: WorkspaceCell = {
        address: { sheetId: state.activeSheetId, row, col },
        value,
        formula,
        formatting: existing?.formatting,
      };

      const updatedCells = { ...currentSheet.cells, [key]: newCell };
      const updatedSheet: WorkspaceSheet = { ...currentSheet, cells: updatedCells };
      const updatedSheets = { ...state.workbook.sheets, [state.activeSheetId]: updatedSheet };
      const updatedWb: ParsedWorkbook = { ...state.workbook, sheets: updatedSheets };

      // Push history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(updatedWb);

      return {
        ...state,
        workbook: updatedWb,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    case 'APPLY_CELL_FORMAT': {
      if (!state.workbook || !state.selectedCell) return state;
      const currentSheet = state.workbook.sheets[state.activeSheetId];
      if (!currentSheet) return state;

      const targetCells: CellAddress[] = [];
      if (state.selectionRange) {
        const { startRow, startCol, endRow, endCol } = state.selectionRange;
        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            targetCells.push({ sheetId: state.activeSheetId, row: r, col: c });
          }
        }
      } else {
        targetCells.push(state.selectedCell);
      }

      const updatedCells = { ...currentSheet.cells };
      targetCells.forEach(({ row, col }) => {
        const key = `${row},${col}`;
        const cell = updatedCells[key] || {
          address: { sheetId: state.activeSheetId, row, col },
          value: '',
        };
        updatedCells[key] = {
          ...cell,
          formatting: { ...cell.formatting, ...action.payload.formatting },
        };
      });

      const updatedSheet = { ...currentSheet, cells: updatedCells };
      const updatedWb = {
        ...state.workbook,
        sheets: { ...state.workbook.sheets, [state.activeSheetId]: updatedSheet },
      };

      return { ...state, workbook: updatedWb };
    }
    case 'SELECT_CELL':
      return { ...state, selectedCell: action.payload, selectionRange: null };
    case 'SELECT_RANGE':
      return { ...state, selectionRange: action.payload };
    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProject: action.payload };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'SET_UPLOAD_ERROR':
      return { ...state, uploadError: action.payload };
    case 'TOGGLE_PROFILE_DRAWER':
      return { ...state, isProfileDrawerOpen: action.payload !== undefined ? action.payload : !state.isProfileDrawerOpen };
    case 'TOGGLE_CHART_MODAL':
      return { ...state, isChartModalOpen: action.payload !== undefined ? action.payload : !state.isChartModalOpen };
    case 'TOGGLE_SEARCH_MODAL':
      return { ...state, isSearchModalOpen: action.payload !== undefined ? action.payload : !state.isSearchModalOpen };
    case 'TOGGLE_PROJECT_MANAGER':
      return { ...state, isProjectManagerOpen: action.payload !== undefined ? action.payload : !state.isProjectManagerOpen };
    case 'TOGGLE_UPLOAD_MODAL':
      return { ...state, isUploadModalOpen: action.payload !== undefined ? action.payload : !state.isUploadModalOpen };
    case 'TOGGLE_UPGRADE_MODAL':
      return { ...state, isUpgradeModalOpen: action.payload !== undefined ? action.payload : !state.isUpgradeModalOpen };
    case 'UNDO': {
      if (state.historyIndex > 0) {
        const nextIdx = state.historyIndex - 1;
        const prevWb = state.history[nextIdx];
        return { ...state, workbook: prevWb, historyIndex: nextIdx };
      }
      return state;
    }
    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const nextIdx = state.historyIndex + 1;
        const nextWb = state.history[nextIdx];
        return { ...state, workbook: nextWb, historyIndex: nextIdx };
      }
      return state;
    }
    default:
      return state;
  }
}

interface ExcelWorkspaceContextType {
  state: ExcelWorkspaceState;
  dispatch: React.Dispatch<ExcelWorkspaceAction>;
  processUploadedFile: (file: File) => Promise<boolean>;
  loadStarterWorkbook: () => void;
  saveCurrentProject: (name?: string) => boolean;
  loadSavedProject: (projectId: string) => boolean;
  evaluateCell: (cell: WorkspaceCell | undefined, sheetCells: Record<string, WorkspaceCell>) => CellValue;
}

const ExcelWorkspaceContext = createContext<ExcelWorkspaceContextType | undefined>(undefined);

export function ExcelWorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);
  const { currentUser } = useAuth();
  const uid = currentUser ? currentUser.uid : null;

  useEffect(() => {
    AnalyticsService.logExcelWorkspaceOpened();
  }, []);

  const loadStarterWorkbook = () => {
    const wb = parseCsvToWorkbook(STARTER_CSV, 'sales_q1_starter.csv', STARTER_CSV.length);
    dispatch({ type: 'SET_WORKBOOK', payload: wb });
  };

  const processUploadedFile = async (file: File): Promise<boolean> => {
    dispatch({ type: 'SET_UPLOADING', payload: true });
    dispatch({ type: 'SET_UPLOAD_ERROR', payload: null });
    AnalyticsService.logExcelWorkspaceUploadStarted(file.size);

    // 1. Validate File Size
    const sizeCheck = validateWorkbookFileSize(file.size, state.userTier);
    if (!sizeCheck.valid) {
      dispatch({ type: 'SET_UPLOAD_ERROR', payload: sizeCheck.error || 'File size exceeds tier limit.' });
      AnalyticsService.logExcelWorkspaceDatasetRejected('file_size_exceeded');
      dispatch({ type: 'SET_UPLOADING', payload: false });
      return false;
    }

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let workbook: ParsedWorkbook;

      if (ext === 'xlsx') {
        const buffer = await file.arrayBuffer();
        workbook = await parseXlsxToWorkbook(buffer, file.name, file.size);
      } else if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
        const text = await file.text();
        workbook = parseCsvToWorkbook(text, file.name, file.size);
      } else {
        dispatch({ type: 'SET_UPLOAD_ERROR', payload: `Unsupported format .${ext}. Please upload a .xlsx, .csv, or .tsv file.` });
        AnalyticsService.logExcelWorkspaceDatasetRejected('unsupported_extension');
        dispatch({ type: 'SET_UPLOADING', payload: false });
        return false;
      }

      // 2. Validate Dimensions
      const activeSheet = workbook.sheets[workbook.activeSheetId];
      const dimCheck = validateWorkbookDimensions(
        workbook.sheetOrder.length,
        activeSheet?.rows || 0,
        activeSheet?.cols || 0,
        state.userTier
      );

      if (!dimCheck.valid) {
        dispatch({ type: 'SET_UPLOAD_ERROR', payload: dimCheck.error || 'Workbook dimensions exceed limit.' });
        AnalyticsService.logExcelWorkspaceDatasetRejected('dimensions_exceeded');
        dispatch({ type: 'SET_UPLOADING', payload: false });
        return false;
      }

      dispatch({ type: 'SET_WORKBOOK', payload: workbook });
      dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: false });

      // Create new active project model in state
      const newProject: ExcelWorkspaceProject = {
        projectId: `proj_excel_${Date.now()}`,
        projectName: file.name.replace(/\.[^/.]+$/, '').toUpperCase(),
        fileName: file.name,
        fileSizeBytes: file.size,
        workbook,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1,
      };

      dispatch({ type: 'SET_ACTIVE_PROJECT', payload: newProject });
      saveExcelProject(newProject, uid);

      AnalyticsService.logExcelWorkspaceUploadCompleted(
        file.name,
        workbook.sheetOrder.length,
        activeSheet?.rows || 0,
        activeSheet?.cols || 0
      );

      dispatch({ type: 'SET_UPLOADING', payload: false });
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Failed to parse workbook file.';
      dispatch({ type: 'SET_UPLOAD_ERROR', payload: msg });
      AnalyticsService.logExcelWorkspaceDatasetRejected('parse_error');
      dispatch({ type: 'SET_UPLOADING', payload: false });
      return false;
    }
  };

  const saveCurrentProject = (name?: string): boolean => {
    if (!state.workbook) return false;

    // Check project limit
    const existingList = listExcelProjects(uid);
    const isExisting = state.activeProject && existingList.some((p) => p.projectId === state.activeProject?.projectId);

    if (!isExisting) {
      const limitCheck = validateExcelProjectLimit(existingList.length, state.userTier);
      if (!limitCheck.valid) {
        dispatch({ type: 'TOGGLE_UPGRADE_MODAL', payload: true });
        return false;
      }
    }

    const projectId = state.activeProject?.projectId || `proj_excel_${Date.now()}`;
    const projectName = name || state.activeProject?.projectName || state.workbook.fileName.replace(/\.[^/.]+$/, '').toUpperCase();

    const project: ExcelWorkspaceProject = {
      projectId,
      projectName,
      fileName: state.workbook.fileName,
      fileSizeBytes: state.workbook.fileSizeBytes,
      workbook: state.workbook,
      createdAt: state.activeProject?.createdAt || Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };

    const saved = saveExcelProject(project, uid);
    if (saved) {
      dispatch({ type: 'SET_ACTIVE_PROJECT', payload: project });
      AnalyticsService.logExcelWorkspaceProjectSaved(projectId);
    }
    return saved;
  };

  const loadSavedProject = (projectId: string): boolean => {
    const proj = loadExcelProject(projectId, uid);
    if (proj && proj.workbook) {
      dispatch({ type: 'SET_WORKBOOK', payload: proj.workbook });
      dispatch({ type: 'SET_ACTIVE_PROJECT', payload: proj });
      dispatch({ type: 'TOGGLE_PROJECT_MANAGER', payload: false });
      return true;
    }
    return false;
  };

  const evaluateCell = (
    cell: WorkspaceCell | undefined,
    sheetCells: Record<string, WorkspaceCell>
  ): CellValue => {
    if (!cell) return null;
    if (cell.formula) {
      try {
        const evaluated = evaluateFormula(cell.formula, sheetCells as any);
        return evaluated !== undefined ? evaluated : null;
      } catch {
        return '#ERROR!';
      }
    }
    return cell.value !== undefined ? cell.value : null;
  };

  return (
    <ExcelWorkspaceContext.Provider
      value={{
        state,
        dispatch,
        processUploadedFile,
        loadStarterWorkbook,
        saveCurrentProject,
        loadSavedProject,
        evaluateCell,
      }}
    >
      {children}
    </ExcelWorkspaceContext.Provider>
  );
}

export function useExcelWorkspace() {
  const context = useContext(ExcelWorkspaceContext);
  if (!context) {
    throw new Error('useExcelWorkspace must be used within an ExcelWorkspaceProvider');
  }
  return context;
}
