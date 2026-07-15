"use client";
import React, { createContext, useReducer, Dispatch, ReactNode, useEffect } from 'react';
import { saveNotebook, loadNotebook } from '../services/firestore';
import missionData from '../data/missions/exampleMission.json';

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
  validation: {
    type: string;
    expectedOutput: Array<Record<string, any>>;
  };
  hints: string[];
}

export interface PythonLabState {
  cells: Cell[];
  mission: Mission | null;
  xp: number;
  autosave: boolean;
  validationPassed?: boolean;
  saveInProgress?: boolean;
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
  | { type: 'SET_AUTOSAVE'; payload: boolean }
  | { type: 'SET_VALIDATION_PASSED'; payload: boolean }
  | { type: 'SET_SAVE_IN_PROGRESS'; payload: boolean };

const initialState: PythonLabState = {
  cells: [],
  mission: null,
  xp: 0,
  autosave: true, // enabled by default per user preference
  validationPassed: false,
  saveInProgress: false,
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
    case 'SET_VALIDATION_PASSED':
      return { ...state, validationPassed: action.payload };
    case 'SET_SAVE_IN_PROGRESS':
      return { ...state, saveInProgress: action.payload };
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

  // Load mission on mount
  useEffect(() => {
    dispatch({ type: 'SET_MISSION', payload: missionData as any });
  }, []);

  // Autosave logic (5‑second interval as per user preference)
  useEffect(() => {
    if (!state.autosave) return;
    const interval = setInterval(async () => {
      if (!state.mission) return;
      dispatch({ type: 'SET_SAVE_IN_PROGRESS', payload: true });
      try {
        // Assume user is authenticated and uid is available via Firebase auth
        const uid = (globalThis as any).CURRENT_UID || 'anonymous';
        await saveNotebook(uid, state.mission.id, {
          cells: state.cells,
          xp: state.xp,
          validationPassed: state.validationPassed,
        });
      } finally {
        dispatch({ type: 'SET_SAVE_IN_PROGRESS', payload: false });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [state.autosave, state.cells, state.xp, state.validationPassed, state.mission]);

  // Load existing notebook if any (run once on mount after mission is set)
  useEffect(() => {
    const load = async () => {
      if (!state.mission) return;
      const uid = (globalThis as any).CURRENT_UID || 'anonymous';
      const data = await loadNotebook(uid, state.mission.id);
      if (data) {
        if (data.cells) {
          data.cells.forEach((c: any) => dispatch({ type: 'ADD_CELL', payload: c }));
        }
        if (typeof data.xp === 'number') dispatch({ type: 'INCREMENT_XP', payload: data.xp });
        if (typeof data.validationPassed === 'boolean')
          dispatch({ type: 'SET_VALIDATION_PASSED', payload: data.validationPassed });
      }
    };
    load();
  }, [state.mission]);

  return (
    <PythonLabContext.Provider value={{ state, dispatch }}>
      {children}
    </PythonLabContext.Provider>
  );
};
