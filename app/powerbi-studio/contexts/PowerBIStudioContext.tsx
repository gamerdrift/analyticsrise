"use client";
import React, { createContext, useReducer, useContext, Dispatch } from 'react';

// ---------- Types ----------
export type VisualType =
  | 'BarChart' | 'ColumnChart' | 'LineChart' | 'PieChart' | 'DonutChart'
  | 'Table' | 'Matrix' | 'Card' | 'KPICard' | 'Gauge' | 'Map' | 'ScatterPlot' | 'Treemap' | 'Waterfall';

export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  hints: string[];
  xpReward: number;
}

export interface Column {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  columns: Column[];
  rows: any[];
}

export interface Dataset {
  id: string;
  name: string;
  tables: Record<string, Table>;
}

export interface VisualDefinition {
  id: string;
  type: VisualType;
  config: Record<string, any>;
  bindings: { table: string; column: string }[]; // simple binding model
}

export interface CanvasPage {
  id: string;
  name: string;
  visuals: VisualDefinition[];
}

export interface PowerBIStudioState {
  mission: Mission | null;
  dataset: Dataset | null;
  dataModel: { relationships: any[] };
  canvas: CanvasPage[];
  selectedVisualId?: string;
  propertiesPane: Record<string, any>;
  status: {
    autosave: 'idle' | 'saving' | 'saved';
    missionProgress?: number;
    xpEarned?: number;
    execTimeMs?: number;
  };
}

export type PowerBIStudioAction =
  | { type: 'SET_MISSION'; payload: Mission }
  | { type: 'SET_DATASET'; payload: Dataset }
  | { type: 'ADD_CANVAS_PAGE'; payload: CanvasPage }
  | { type: 'UPDATE_CANVAS'; payload: CanvasPage[] }
  | { type: 'SELECT_VISUAL'; payload: string }
  | { type: 'UPDATE_VISUAL_CONFIG'; payload: { visualId: string; config: Record<string, any> } }
  | { type: 'SET_STATUS'; payload: Partial<PowerBIStudioState['status']> };

// ---------- Initial State ----------
const initialState: PowerBIStudioState = {
  mission: null,
  dataset: null,
  dataModel: { relationships: [] },
  canvas: [],
  propertiesPane: {},
  status: { autosave: 'idle' },
};

// ---------- Reducer ----------
function powerBIStudioReducer(state: PowerBIStudioState, action: PowerBIStudioAction): PowerBIStudioState {
  switch (action.type) {
    case 'SET_MISSION':
      return { ...state, mission: action.payload };
    case 'SET_DATASET':
      return { ...state, dataset: action.payload };
    case 'ADD_CANVAS_PAGE':
      return { ...state, canvas: [...state.canvas, action.payload] };
    case 'UPDATE_CANVAS':
      return { ...state, canvas: action.payload };
    case 'SELECT_VISUAL':
      return { ...state, selectedVisualId: action.payload };
    case 'UPDATE_VISUAL_CONFIG':
      return {
        ...state,
        canvas: state.canvas.map(page => ({
          ...page,
          visuals: page.visuals.map(v => v.id === action.payload.visualId ? { ...v, config: action.payload.config } : v),
        })),
      };
    case 'SET_STATUS':
      return { ...state, status: { ...state.status, ...action.payload } };
    default:
      return state;
  }
}

// ---------- Context ----------
const PowerBIStudioContext = createContext<{ state: PowerBIStudioState; dispatch: Dispatch<PowerBIStudioAction> } | undefined>(undefined);

export const PowerBIStudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(powerBIStudioReducer, initialState);
  return (
    <PowerBIStudioContext.Provider value={{ state, dispatch }}>
      {children}
    </PowerBIStudioContext.Provider>
  );
};

export const usePowerBIStudio = () => {
  const ctx = useContext(PowerBIStudioContext);
  if (!ctx) throw new Error('usePowerBIStudio must be used within PowerBIStudioProvider');
  return ctx;
};
