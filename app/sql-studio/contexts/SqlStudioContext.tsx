"use client";

import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { PublicChallenge } from '@/lib/sql/challenges/types';
import { getPublicChallenge } from '@/lib/sql/challenges/public/registry';

// ----- Types ---------------------------------------------------------------
export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  hints: string[];
  xpReward: number;
}

export interface ExplorerState {
  schemas: string[];
  tables: Record<string, string[]>; // schema -> tables
  columns: Record<string, string[]>; // table -> columns
  selectedSchema?: string;
  selectedTable?: string;
}

export interface EditorState {
  query: string;
}

export interface ResultState {
  rows: any[];
  columns: string[];
  rowCount?: number;
  executionMs?: number;
  validation: {
    passed: boolean;
    hints: string[];
    xpEarned?: number;
  };
}

export interface StatusBarState {
  autosave: 'idle' | 'saving' | 'saved';
  execTimeMs?: number;
  returnedRows?: number;
  missionProgress?: number; // 0‑100
}

export type ResponsiveStudioTab = 'instructions' | 'editor' | 'curriculum';

export interface SqlStudioState {
  activeChallengeId: string;
  activeDatasetId: string;
  activeTab: ResponsiveStudioTab;
  isExecuting: boolean;
  executionError: string | null;
  hintsUsed: number;
  mission: Mission | null;
  explorer: ExplorerState;
  editor: EditorState;
  results: ResultState;
  status: StatusBarState;
}

export type SqlStudioAction =
  | { type: 'SET_ACTIVE_CHALLENGE'; payload: string }
  | { type: 'SET_ACTIVE_DATASET'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: ResponsiveStudioTab }
  | { type: 'SET_HINTS_USED'; payload: number }
  | { type: 'SET_EXECUTING'; payload: boolean }
  | { type: 'SET_EXECUTION_ERROR'; payload: string | null }
  | { type: 'SET_MISSION'; payload: Mission }
  | { type: 'UPDATE_EXPLORER'; payload: Partial<ExplorerState> }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_RESULTS'; payload: ResultState }
  | { type: 'SET_STATUS'; payload: Partial<StatusBarState> };

// Resolve initial starter query from the default challenge
const initialChallengeId = 'sql.select.001';
const initialChallenge: PublicChallenge | undefined = getPublicChallenge(initialChallengeId);

// ----- Initial State -------------------------------------------------------
const initialState: SqlStudioState = {
  activeChallengeId: initialChallengeId,
  activeDatasetId: initialChallenge?.datasetId || 'ecommerce',
  activeTab: 'editor',
  isExecuting: false,
  executionError: null,
  hintsUsed: 0,
  mission: initialChallenge
    ? {
        id: initialChallenge.id,
        title: initialChallenge.title,
        description: initialChallenge.scenario,
        objectives: [initialChallenge.objective],
        hints: initialChallenge.hints.map((h) => h.content),
        xpReward: initialChallenge.xpReward,
      }
    : null,
  explorer: { schemas: [], tables: {}, columns: {} },
  editor: { query: initialChallenge?.starterQuery || 'SELECT * FROM products;' },
  results: { rows: [], columns: [], validation: { passed: false, hints: [] } },
  status: { autosave: 'idle' },
};

// ----- Reducer -------------------------------------------------------------
function sqlStudioReducer(state: SqlStudioState, action: SqlStudioAction): SqlStudioState {
  switch (action.type) {
    case 'SET_ACTIVE_CHALLENGE': {
      const chal = getPublicChallenge(action.payload);
      return {
        ...state,
        activeChallengeId: action.payload,
        activeDatasetId: chal?.datasetId || state.activeDatasetId,
        hintsUsed: 0,
        executionError: null,
        results: { rows: [], columns: [], validation: { passed: false, hints: [] } },
        editor: { query: chal?.starterQuery || state.editor.query },
        mission: chal
          ? {
              id: chal.id,
              title: chal.title,
              description: chal.scenario,
              objectives: [chal.objective],
              hints: chal.hints.map((h) => h.content),
              xpReward: chal.xpReward,
            }
          : state.mission,
      };
    }
    case 'SET_ACTIVE_DATASET':
      return { ...state, activeDatasetId: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_HINTS_USED':
      return { ...state, hintsUsed: action.payload };
    case 'SET_EXECUTING':
      return { ...state, isExecuting: action.payload };
    case 'SET_EXECUTION_ERROR':
      return { ...state, executionError: action.payload };
    case 'SET_MISSION':
      return { ...state, mission: action.payload };
    case 'UPDATE_EXPLORER':
      return { ...state, explorer: { ...state.explorer, ...action.payload } };
    case 'SET_QUERY':
      return { ...state, editor: { ...state.editor, query: action.payload } };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_STATUS':
      return { ...state, status: { ...state.status, ...action.payload } };
    default:
      return state;
  }
}

// ----- Context -------------------------------------------------------------
const SqlStudioContext = createContext<{ state: SqlStudioState; dispatch: Dispatch<SqlStudioAction> } | undefined>(
  undefined
);

export const SqlStudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sqlStudioReducer, initialState);
  return (
    <SqlStudioContext.Provider value={{ state, dispatch }}>
      {children}
    </SqlStudioContext.Provider>
  );
};

export const useSqlStudio = () => {
  const context = useContext(SqlStudioContext);
  if (!context) {
    throw new Error('useSqlStudio must be used within a SqlStudioProvider');
  }
  return context;
};
