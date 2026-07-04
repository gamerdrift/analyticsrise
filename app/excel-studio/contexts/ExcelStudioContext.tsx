// app/excel-studio/contexts/ExcelStudioContext.tsx
import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// Types for cell data
export type CellAddress = { sheetId: string; row: number; col: number };
export type CellValue = string | number | null;
export type Cell = { address: CellAddress; value: CellValue; formula?: string };

export type Sheet = {
  id: string;
  name: string;
  rows: number;
  cols: number;
  cells: Record<string, Cell>; // key = `${row},${col}`
};

export type ExcelState = {
  sheets: Record<string, Sheet>;
  activeSheetId: string;
  selectedCell: CellAddress | null;
};

export type ExcelAction =
  | { type: 'ADD_SHEET'; payload: { id: string; name: string } }
  | { type: 'SET_ACTIVE_SHEET'; payload: { id: string } }
  | { type: 'UPDATE_CELL'; payload: { address: CellAddress; value: CellValue; formula?: string } }
  | { type: 'SELECT_CELL'; payload: { address: CellAddress } };

const ExcelContext = createContext<{ state: ExcelState; dispatch: React.Dispatch<ExcelAction> } | undefined>(undefined);

function excelReducer(state: ExcelState, action: ExcelAction): ExcelState {
  switch (action.type) {
    case 'ADD_SHEET': {
      const { id, name } = action.payload;
      const newSheet: Sheet = { id, name, rows: 100, cols: 26, cells: {} };
      return {
        ...state,
        sheets: { ...state.sheets, [id]: newSheet },
        activeSheetId: id,
      };
    }
    case 'SET_ACTIVE_SHEET':
      return { ...state, activeSheetId: action.payload.id };
    case 'UPDATE_CELL': {
      const { address, value, formula } = action.payload;
      const sheet = state.sheets[address.sheetId];
      if (!sheet) return state;
      const key = `${address.row},${address.col}`;
      const updatedCell: Cell = { address, value, formula };
      return {
        ...state,
        sheets: {
          ...state.sheets,
          [address.sheetId]: {
            ...sheet,
            cells: { ...sheet.cells, [key]: updatedCell },
          },
        },
      };
    }
    case 'SELECT_CELL':
      return { ...state, selectedCell: action.payload.address };
    default:
      return state;
  }
}

export const ExcelStudioProvider = ({ children }: { children: ReactNode }) => {
  const initialState: ExcelState = {
    sheets: {
      sheet1: { id: 'sheet1', name: 'Sheet1', rows: 100, cols: 26, cells: {} },
    },
    activeSheetId: 'sheet1',
    selectedCell: null,
  };
  const [state, dispatch] = useReducer(excelReducer, initialState);

  return <ExcelContext.Provider value={{ state, dispatch }}>{children}</ExcelContext.Provider>;
};

export const useExcelStudio = () => {
  const ctx = useContext(ExcelContext);
  if (!ctx) throw new Error('useExcelStudio must be used within ExcelStudioProvider');
  return ctx;
};
