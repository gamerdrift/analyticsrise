import React, { createContext, useReducer, useContext, Dispatch } from 'react';

// ---------- Types ----------
export type VisualType =
  | 'BarChart' | 'ColumnChart' | 'LineChart' | 'AreaChart' | 'ScatterPlot'
  | 'HeatMap' | 'Treemap' | 'Map' | 'BubbleChart' | 'Histogram' | 'BoxPlot'
  | 'PieChart' | 'DonutChart' | 'HighlightTable' | 'TextTable';

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

export interface VisualDef {
  id: string;
  type: VisualType;
  config: Record<string, any>;
  bindings: { table: string; column: string }[];
}

export interface Worksheet {
  id: string;
  name: string;
  shelves: { rows: string[]; columns: string[] };
  marks: VisualDef[];
  filters: any[];
}

export interface DashboardPage {
  id: string;
  name: string;
  worksheets: string[];
}

export interface StoryPoint {
  id: string;
  name: string;
  dashboardPageId: string;
  description: string;
}

export interface TableauStudioState {
  mission: Mission | null;
  dataset: Dataset | null;
  worksheets: Worksheet[];
  dashboards: DashboardPage[];
  storyPoints: StoryPoint[];
  selectedWorksheetId?: string;
  selectedDashboardId?: string;
  selectedStoryPointId?: string;
  selectedVisualId?: string;
  propertiesPane: Record<string, any>;
  status: { autosave: 'idle' | 'saving' | 'saved'; missionProgress?: number; xpEarned?: number };
}

export type TableauStudioAction =
  | { type: 'SET_MISSION'; payload: Mission }
  | { type: 'SET_DATASET'; payload: Dataset }
  | { type: 'ADD_WORKSHEET'; payload: Worksheet }
  | { type: 'UPDATE_WORKSHEET'; payload: Worksheet }
  | { type: 'ADD_DASHBOARD'; payload: DashboardPage }
  | { type: 'ADD_STORY_POINT'; payload: StoryPoint }
  | { type: 'SELECT_VISUAL'; payload: string }
  | { type: 'UPDATE_VISUAL_CONFIG'; payload: { visualId: string; config: Record<string, any> } }
  | { type: 'SET_PROPERTIES'; payload: Record<string, any> }
  | { type: 'SET_STATUS'; payload: Partial<TableauStudioState['status']> };

// ---------- Initial State ----------
const initialState: TableauStudioState = {
  mission: null,
  dataset: null,
  worksheets: [],
  dashboards: [],
  storyPoints: [],
  propertiesPane: {},
  status: { autosave: 'idle' },
};

// ---------- Reducer ----------
function tableauStudioReducer(state: TableauStudioState, action: TableauStudioAction): TableauStudioState {
  switch (action.type) {
    case 'SET_MISSION':
      return { ...state, mission: action.payload };
    case 'SET_DATASET':
      return { ...state, dataset: action.payload };
    case 'ADD_WORKSHEET':
      return { ...state, worksheets: [...state.worksheets, action.payload] };
    case 'UPDATE_WORKSHEET':
      return {
        ...state,
        worksheets: state.worksheets.map(w => (w.id === action.payload.id ? action.payload : w)),
      };
    case 'ADD_DASHBOARD':
      return { ...state, dashboards: [...state.dashboards, action.payload] };
    case 'ADD_STORY_POINT':
      return { ...state, storyPoints: [...state.storyPoints, action.payload] };
    case 'SELECT_VISUAL':
      return { ...state, selectedVisualId: action.payload };
    case 'UPDATE_VISUAL_CONFIG':
      return {
        ...state,
        worksheets: state.worksheets.map(ws => ({
          ...ws,
          marks: ws.marks.map(v => v.id === action.payload.visualId ? { ...v, config: action.payload.config } : v),
        })),
      };
    case 'SET_PROPERTIES':
      return { ...state, propertiesPane: { ...state.propertiesPane, ...action.payload } };
    case 'SET_STATUS':
      return { ...state, status: { ...state.status, ...action.payload } };
    default:
      return state;
  }
}

// ---------- Context ----------
const TableauStudioContext = createContext<{ state: TableauStudioState; dispatch: Dispatch<TableauStudioAction> } | undefined>(undefined);

export const TableauStudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tableauStudioReducer, initialState);
  return (
    <TableauStudioContext.Provider value={{ state, dispatch }}>
      {children}
    </TableauStudioContext.Provider>
  );
};

export const useTableauStudio = () => {
  const ctx = useContext(TableauStudioContext);
  if (!ctx) throw new Error('useTableauStudio must be used within TableauStudioProvider');
  return ctx;
};
