import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';

// Types for cell and mission state
export interface Cell {
  id: string;
  code: string;
  output?: string;
  error?: string;
  executing: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  datasetId: string;
  xpReward: number;
  completed: boolean;
}

export interface PythonLabState {
  cells: Cell[];
  mission: Mission | null;
  xp: number;
  autosave: boolean;
}

export type PythonLabAction =
  | { type: 'ADD_CELL'; payload: Cell }
  | { type: 'UPDATE_CELL_CODE'; payload: { id: string; code: string } }
  | { type: 'SET_CELL_OUTPUT'; payload: { id: string; output: string } }
  | { type: 'SET_CELL_ERROR'; payload: { id: string; error: string } }
  | { type: 'SET_CELL_EXECUTING'; payload: { id: string; executing: boolean } }
  | { type: 'SET_MISSION'; payload: Mission }
  | { type: 'MARK_MISSION_COMPLETED' }
  | { type: 'INCREMENT_XP'; payload: number }
  | { type: 'SET_AUTOSAVE'; payload: boolean };

const initialState: PythonLabState = {
  cells: [],
  mission: null,
  xp: 0,
  autosave: false,
};

function pythonLabReducer(state: PythonLabState, action: PythonLabAction): PythonLabState {
  switch (action.type) {
    case 'ADD_CELL':
      return { ...state, cells: [...state.cells, action.payload] };
    case 'UPDATE_CELL_CODE':
      return {
        ...state,
        cells: state.cells.map((c) => (c.id === action.payload.id ? { ...c, code: action.payload.code } : c)),
      };
    case 'SET_CELL_OUTPUT':
      return {
        ...state,
        cells: state.cells.map((c) => (c.id === action.payload.id ? { ...c, output: action.payload.output, error: undefined } : c)),
      };
    case 'SET_CELL_ERROR':
      return {
        ...state,
        cells: state.cells.map((c) => (c.id === action.payload.id ? { ...c, error: action.payload.error, output: undefined } : c)),
      };
    case 'SET_CELL_EXECUTING':
      return {
        ...state,
        cells: state.cells.map((c) => (c.id === action.payload.id ? { ...c, executing: action.payload.executing } : c)),
      };
    case 'SET_MISSION':
      return { ...state, mission: action.payload };
    case 'MARK_MISSION_COMPLETED':
      if (!state.mission) return state;
      return { ...state, mission: { ...state.mission, completed: true } };
    case 'INCREMENT_XP':
      return { ...state, xp: state.xp + action.payload };
    case 'SET_AUTOSAVE':
      return { ...state, autosave: action.payload };
    default:
      return state;
  }
}

interface PythonLabContextProps {
  state: PythonLabState;
  dispatch: Dispatch<PythonLabAction>;
}

export const PythonLabContext = createContext<PythonLabContextProps | undefined>(undefined);

export const PythonLabProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(pythonLabReducer, initialState);

  return (
    <PythonLabContext.Provider value={{ state, dispatch }}>
      {children}
    </PythonLabContext.Provider>
  );
};
