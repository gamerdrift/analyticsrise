import React, { createContext, useReducer, useContext, Dispatch } from 'react';

// ----- Types ---------------------------------------------------------------
export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  hints: string[];
  xpReward: number;
  // more fields can be added later
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
  // future: cursor position, selection, etc.
}

export interface ResultState {
  rows: any[];
  columns: string[];
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

export interface SqlStudioState {
  mission: Mission | null;
  explorer: ExplorerState;
  editor: EditorState;
  results: ResultState;
  status: StatusBarState;
}

export type SqlStudioAction =
  | { type: 'SET_MISSION'; payload: Mission }
  | { type: 'UPDATE_EXPLORER'; payload: Partial<ExplorerState> }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_RESULTS'; payload: ResultState }
  | { type: 'SET_STATUS'; payload: Partial<StatusBarState> };

// ----- Initial State -------------------------------------------------------
const initialState: SqlStudioState = {
  mission: null,
  explorer: { schemas: [], tables: {} , columns: {} },
  editor: { query: '' },
  results: { rows: [], columns: [], validation: { passed: false, hints: [] } },
  status: { autosave: 'idle' },
};

// ----- Reducer -------------------------------------------------------------
function sqlStudioReducer(state: SqlStudioState, action: SqlStudioAction): SqlStudioState {
  switch (action.type) {
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
const SqlStudioContext = createContext<{ state: SqlStudioState; dispatch: Dispatch<SqlStudioAction> } | undefined>(undefined);

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
