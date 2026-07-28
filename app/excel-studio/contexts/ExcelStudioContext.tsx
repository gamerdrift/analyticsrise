'use client';

import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { evaluateFormula, shiftFormulaReferences, parseRange, formatCellReference } from '@/lib/utils/excel/formulaEvaluator';
import { parseCSV } from '@/lib/utils/excel/csvManager';
import { SAMPLE_DATASETS, SampleDataset } from '@/lib/utils/excel/datasetLibrary';

export type CellAddress = { sheetId: string; row: number; col: number };
export type CellValue = string | number | null;

export interface CellFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  bgColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  numberFormat?: 'general' | 'currency' | 'percent' | 'decimal' | 'date';
  border?: 'all' | 'outside' | 'top_bottom' | 'thick' | 'none';
}

export interface Cell {
  address: CellAddress;
  value: CellValue;
  formula?: string;
  formatting?: CellFormatting;
}

export interface MergedRange {
  id: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface ConditionalRule {
  id: string;
  type: 'greater' | 'less' | 'equal' | 'contains' | 'color_scale' | 'data_bar';
  value?: string | number;
  targetColor?: string;
}

export interface Sheet {
  id: string;
  name: string;
  rows: number;
  cols: number;
  cells: Record<string, Cell>;
  freezeRows?: number;
  freezeCols?: number;
  hiddenRows?: number[];
  hiddenCols?: number[];
  mergedRanges?: MergedRange[];
  conditionalRules?: ConditionalRule[];
}

export interface SelectionRange {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface ClipboardContent {
  type: 'copy' | 'cut';
  sourceSheetId: string;
  range: SelectionRange;
  cells: Record<string, Cell>;
}

export type ExcelState = {
  sheets: Record<string, Sheet>;
  activeSheetId: string;
  selectedCell: CellAddress | null;
  selectionRange: SelectionRange | null;
  clipboard: ClipboardContent | null;
  history: Array<{ sheets: Record<string, Sheet>; activeSheetId: string }>;
  historyIndex: number;
  lastSavedAt: string | null;
  activeMissionId: string;
  missionProgress: Record<string, { completed: boolean; score: number }>;
  isAiMentorOpen: boolean;
};

export type ExcelAction =
  | { type: 'ADD_SHEET'; payload: { id: string; name: string } }
  | { type: 'REMOVE_SHEET'; payload: { id: string } }
  | { type: 'RENAME_SHEET'; payload: { id: string; name: string } }
  | { type: 'DUPLICATE_SHEET'; payload: { id: string } }
  | { type: 'MOVE_SHEET'; payload: { id: string; direction: 'left' | 'right' } }
  | { type: 'SET_ACTIVE_SHEET'; payload: { id: string } }
  | { type: 'UPDATE_CELL'; payload: { address: CellAddress; value: CellValue; formula?: string; formatting?: CellFormatting } }
  | { type: 'APPLY_FORMATTING'; payload: { formatting: Partial<CellFormatting> } }
  | { type: 'SELECT_CELL'; payload: { address: CellAddress } }
  | { type: 'SELECT_RANGE'; payload: { range: SelectionRange } }
  | { type: 'INSERT_ROW'; payload: { rowIndex: number } }
  | { type: 'DELETE_ROW'; payload: { rowIndex: number } }
  | { type: 'INSERT_COL'; payload: { colIndex: number } }
  | { type: 'DELETE_COL'; payload: { colIndex: number } }
  | { type: 'SET_FREEZE_PANES'; payload: { freezeRows: number; freezeCols: number } }
  | { type: 'TOGGLE_HIDE_ROW'; payload: { rowIndex: number } }
  | { type: 'TOGGLE_HIDE_COL'; payload: { colIndex: number } }
  | { type: 'MERGE_CELLS' }
  | { type: 'UNMERGE_CELLS' }
  | { type: 'ADD_CONDITIONAL_RULE'; payload: { rule: ConditionalRule } }
  | { type: 'CLEAR_CONDITIONAL_RULES' }
  | { type: 'COPY_SELECTION' }
  | { type: 'CUT_SELECTION' }
  | { type: 'PASTE_SELECTION' }
  | { type: 'AUTO_FILL_RANGE'; payload: { targetRange: SelectionRange } }
  | { type: 'SEARCH_AND_REPLACE'; payload: { searchStr: string; replaceStr: string; matchCase: boolean; replaceAll: boolean } }
  | { type: 'IMPORT_CSV'; payload: { csvText: string } }
  | { type: 'LOAD_DATASET'; payload: { datasetId: string } }
  | { type: 'SET_ACTIVE_MISSION'; payload: { missionId: string } }
  | { type: 'COMPLETE_MISSION'; payload: { missionId: string; score: number } }
  | { type: 'TOGGLE_AI_MENTOR'; payload?: boolean }
  | { type: 'LOAD_STATE'; payload: ExcelState }
  | { type: 'RESET_WORKBOOK' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const STORAGE_KEY = 'analyticsrise_excel_workbook_v2';

const INITIAL_STARTER_SHEET = SAMPLE_DATASETS[0];

const DEFAULT_INITIAL_STATE: ExcelState = {
  sheets: {
    sheet1: {
      id: 'sheet1',
      name: 'Sales Analytics',
      rows: 100,
      cols: 26,
      cells: INITIAL_STARTER_SHEET.cells,
      freezeRows: 1,
      freezeCols: 1,
      hiddenRows: [],
      hiddenCols: [],
      mergedRanges: [],
      conditionalRules: [],
    },
    sheet2: {
      id: 'sheet2',
      name: 'Regional Breakdown',
      rows: 100,
      cols: 26,
      cells: {},
      freezeRows: 0,
      freezeCols: 0,
      hiddenRows: [],
      hiddenCols: [],
      mergedRanges: [],
      conditionalRules: [],
    },
  },
  activeSheetId: 'sheet1',
  selectedCell: { sheetId: 'sheet1', row: 0, col: 0 },
  selectionRange: null,
  clipboard: null,
  history: [],
  historyIndex: -1,
  lastSavedAt: null,
  activeMissionId: 'mission_beginner_1',
  missionProgress: {},
  isAiMentorOpen: false,
};

function recordHistory(state: ExcelState): ExcelState {
  const snapshot = {
    sheets: JSON.parse(JSON.stringify(state.sheets)),
    activeSheetId: state.activeSheetId,
  };
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(snapshot);
  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
    lastSavedAt: new Date().toLocaleTimeString(),
  };
}

function excelReducer(state: ExcelState, action: ExcelAction): ExcelState {
  switch (action.type) {
    case 'ADD_SHEET': {
      const { id, name } = action.payload;
      const newSheet: Sheet = {
        id,
        name,
        rows: 100,
        cols: 26,
        cells: {},
        freezeRows: 0,
        freezeCols: 0,
        hiddenRows: [],
        hiddenCols: [],
        mergedRanges: [],
        conditionalRules: [],
      };
      const nextState: ExcelState = {
        ...state,
        sheets: { ...state.sheets, [id]: newSheet },
        activeSheetId: id,
        selectedCell: { sheetId: id, row: 0, col: 0 },
      };
      return recordHistory(nextState);
    }

    case 'REMOVE_SHEET': {
      const { id } = action.payload;
      const sheetKeys = Object.keys(state.sheets);
      if (sheetKeys.length <= 1) return state;
      const newSheets = { ...state.sheets };
      delete newSheets[id];
      const remainingKeys = Object.keys(newSheets);
      const nextActive = remainingKeys[0];
      const nextState: ExcelState = {
        ...state,
        sheets: newSheets,
        activeSheetId: nextActive,
        selectedCell: { sheetId: nextActive, row: 0, col: 0 },
      };
      return recordHistory(nextState);
    }

    case 'RENAME_SHEET': {
      const { id, name } = action.payload;
      const sheet = state.sheets[id];
      if (!sheet) return state;
      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [id]: { ...sheet, name },
        },
      };
      return recordHistory(nextState);
    }

    case 'DUPLICATE_SHEET': {
      const { id } = action.payload;
      const source = state.sheets[id];
      if (!source) return state;
      const newId = `sheet_${Date.now()}`;
      const newSheet: Sheet = {
        ...JSON.parse(JSON.stringify(source)),
        id: newId,
        name: `${source.name} (Copy)`,
      };
      const nextState: ExcelState = {
        ...state,
        sheets: { ...state.sheets, [newId]: newSheet },
        activeSheetId: newId,
      };
      return recordHistory(nextState);
    }

    case 'MOVE_SHEET': {
      const { id, direction } = action.payload;
      const keys = Object.keys(state.sheets);
      const idx = keys.indexOf(id);
      if (idx === -1) return state;
      const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= keys.length) return state;

      const newSheets: Record<string, Sheet> = {};
      const reorderedKeys = [...keys];
      const temp = reorderedKeys[idx];
      reorderedKeys[idx] = reorderedKeys[targetIdx];
      reorderedKeys[targetIdx] = temp;

      reorderedKeys.forEach((k) => {
        newSheets[k] = state.sheets[k];
      });

      return { ...state, sheets: newSheets };
    }

    case 'SET_ACTIVE_SHEET':
      return {
        ...state,
        activeSheetId: action.payload.id,
        selectedCell: { sheetId: action.payload.id, row: 0, col: 0 },
        selectionRange: null,
      };

    case 'UPDATE_CELL': {
      const { address, value, formula, formatting } = action.payload;
      const sheet = state.sheets[address.sheetId];
      if (!sheet) return state;

      const key = `${address.row},${address.col}`;
      const existing = sheet.cells[key] || { address, value: '' };

      const updatedCell: Cell = {
        ...existing,
        address,
        value,
        formula,
        formatting: formatting ? { ...existing.formatting, ...formatting } : existing.formatting,
      };

      const updatedSheet: Sheet = {
        ...sheet,
        cells: { ...sheet.cells, [key]: updatedCell },
      };

      const nextState: ExcelState = {
        ...state,
        sheets: { ...state.sheets, [address.sheetId]: updatedSheet },
      };
      return recordHistory(nextState);
    }

    case 'APPLY_FORMATTING': {
      const { formatting } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const updatedCells = { ...sheet.cells };

      if (state.selectionRange) {
        const { startRow, startCol, endRow, endCol } = state.selectionRange;
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            const key = `${r},${c}`;
            const existing = updatedCells[key] || {
              address: { sheetId: state.activeSheetId, row: r, col: c },
              value: '',
            };
            updatedCells[key] = {
              ...existing,
              formatting: { ...existing.formatting, ...formatting },
            };
          }
        }
      } else if (state.selectedCell) {
        const { row, col } = state.selectedCell;
        const key = `${row},${col}`;
        const existing = updatedCells[key] || {
          address: { sheetId: state.activeSheetId, row, col },
          value: '',
        };
        updatedCells[key] = {
          ...existing,
          formatting: { ...existing.formatting, ...formatting },
        };
      }

      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, cells: updatedCells },
        },
      };
      return recordHistory(nextState);
    }

    case 'SELECT_CELL':
      return {
        ...state,
        selectedCell: action.payload.address,
        selectionRange: null,
      };

    case 'SELECT_RANGE':
      return {
        ...state,
        selectionRange: action.payload.range,
      };

    case 'INSERT_ROW': {
      const { rowIndex } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const newCells: Record<string, Cell> = {};
      for (const [key, cell] of Object.entries(sheet.cells)) {
        const [r, c] = key.split(',').map(Number);
        if (r >= rowIndex) {
          const shiftedRow = r + 1;
          const shiftedKey = `${shiftedRow},${c}`;
          newCells[shiftedKey] = {
            ...cell,
            address: { ...cell.address, row: shiftedRow },
            formula: cell.formula ? shiftFormulaReferences(cell.formula, 1, 0) : undefined,
          };
        } else {
          newCells[key] = cell;
        }
      }

      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, rows: sheet.rows + 1, cells: newCells },
        },
      };
      return recordHistory(nextState);
    }

    case 'DELETE_ROW': {
      const { rowIndex } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const newCells: Record<string, Cell> = {};
      for (const [key, cell] of Object.entries(sheet.cells)) {
        const [r, c] = key.split(',').map(Number);
        if (r === rowIndex) continue;
        if (r > rowIndex) {
          const shiftedRow = r - 1;
          const shiftedKey = `${shiftedRow},${c}`;
          newCells[shiftedKey] = {
            ...cell,
            address: { ...cell.address, row: shiftedRow },
            formula: cell.formula ? shiftFormulaReferences(cell.formula, -1, 0) : undefined,
          };
        } else {
          newCells[key] = cell;
        }
      }

      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, rows: Math.max(10, sheet.rows - 1), cells: newCells },
        },
      };
      return recordHistory(nextState);
    }

    case 'INSERT_COL': {
      const { colIndex } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const newCells: Record<string, Cell> = {};
      for (const [key, cell] of Object.entries(sheet.cells)) {
        const [r, c] = key.split(',').map(Number);
        if (c >= colIndex) {
          const shiftedCol = c + 1;
          const shiftedKey = `${r},${shiftedCol}`;
          newCells[shiftedKey] = {
            ...cell,
            address: { ...cell.address, col: shiftedCol },
            formula: cell.formula ? shiftFormulaReferences(cell.formula, 0, 1) : undefined,
          };
        } else {
          newCells[key] = cell;
        }
      }

      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, cols: sheet.cols + 1, cells: newCells },
        },
      };
      return recordHistory(nextState);
    }

    case 'DELETE_COL': {
      const { colIndex } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const newCells: Record<string, Cell> = {};
      for (const [key, cell] of Object.entries(sheet.cells)) {
        const [r, c] = key.split(',').map(Number);
        if (c === colIndex) continue;
        if (c > colIndex) {
          const shiftedCol = c - 1;
          const shiftedKey = `${r},${shiftedCol}`;
          newCells[shiftedKey] = {
            ...cell,
            address: { ...cell.address, col: shiftedCol },
            formula: cell.formula ? shiftFormulaReferences(cell.formula, 0, -1) : undefined,
          };
        } else {
          newCells[key] = cell;
        }
      }

      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, cols: Math.max(5, sheet.cols - 1), cells: newCells },
        },
      };
      return recordHistory(nextState);
    }

    case 'SET_FREEZE_PANES': {
      const { freezeRows, freezeCols } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;
      return {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, freezeRows, freezeCols },
        },
      };
    }

    case 'TOGGLE_HIDE_ROW': {
      const { rowIndex } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;
      const hidden = new Set(sheet.hiddenRows || []);
      if (hidden.has(rowIndex)) hidden.delete(rowIndex);
      else hidden.add(rowIndex);
      return {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, hiddenRows: Array.from(hidden) },
        },
      };
    }

    case 'TOGGLE_HIDE_COL': {
      const { colIndex } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;
      const hidden = new Set(sheet.hiddenCols || []);
      if (hidden.has(colIndex)) hidden.delete(colIndex);
      else hidden.add(colIndex);
      return {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, hiddenCols: Array.from(hidden) },
        },
      };
    }

    case 'MERGE_CELLS': {
      if (!state.selectionRange) return state;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const { startRow, startCol, endRow, endCol } = state.selectionRange;
      const newMerge: MergedRange = {
        id: `merge_${Date.now()}`,
        startRow: Math.min(startRow, endRow),
        startCol: Math.min(startCol, endCol),
        endRow: Math.max(startRow, endRow),
        endCol: Math.max(startCol, endCol),
      };

      const existing = sheet.mergedRanges || [];
      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, mergedRanges: [...existing, newMerge] },
        },
      };
      return recordHistory(nextState);
    }

    case 'UNMERGE_CELLS': {
      if (!state.selectedCell) return state;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const { row, col } = state.selectedCell;
      const remaining = (sheet.mergedRanges || []).filter(
        (m) => !(row >= m.startRow && row <= m.endRow && col >= m.startCol && col <= m.endCol)
      );

      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, mergedRanges: remaining },
        },
      };
      return recordHistory(nextState);
    }

    case 'ADD_CONDITIONAL_RULE': {
      const { rule } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;
      const rules = sheet.conditionalRules || [];
      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, conditionalRules: [...rules, rule] },
        },
      };
      return recordHistory(nextState);
    }

    case 'CLEAR_CONDITIONAL_RULES': {
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;
      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, conditionalRules: [] },
        },
      };
      return recordHistory(nextState);
    }

    case 'COPY_SELECTION':
    case 'CUT_SELECTION': {
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const range: SelectionRange = state.selectionRange || {
        startRow: state.selectedCell?.row || 0,
        startCol: state.selectedCell?.col || 0,
        endRow: state.selectedCell?.row || 0,
        endCol: state.selectedCell?.col || 0,
      };

      const copiedCells: Record<string, Cell> = {};
      const minRow = Math.min(range.startRow, range.endRow);
      const maxRow = Math.max(range.startRow, range.endRow);
      const minCol = Math.min(range.startCol, range.endCol);
      const maxCol = Math.max(range.startCol, range.endCol);

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const key = `${r},${c}`;
          if (sheet.cells[key]) {
            copiedCells[key] = JSON.parse(JSON.stringify(sheet.cells[key]));
          }
        }
      }

      return {
        ...state,
        clipboard: {
          type: action.type === 'COPY_SELECTION' ? 'copy' : 'cut',
          sourceSheetId: state.activeSheetId,
          range: { startRow: minRow, startCol: minCol, endRow: maxRow, endCol: maxCol },
          cells: copiedCells,
        },
      };
    }

    case 'PASTE_SELECTION': {
      if (!state.clipboard || !state.selectedCell) return state;
      const { clipboard, selectedCell } = state;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const { startRow: srcMinRow, startCol: srcMinCol } = clipboard.range;
      const destRow = selectedCell.row;
      const destCol = selectedCell.col;

      const updatedCells = { ...sheet.cells };

      for (const [srcKey, cell] of Object.entries(clipboard.cells)) {
        const [r, c] = srcKey.split(',').map(Number);
        const rowDelta = destRow - srcMinRow;
        const colDelta = destCol - srcMinCol;
        const targetRow = r + rowDelta;
        const targetCol = c + colDelta;
        const targetKey = `${targetRow},${targetCol}`;

        const newFormula = cell.formula ? shiftFormulaReferences(cell.formula, rowDelta, colDelta) : undefined;

        updatedCells[targetKey] = {
          ...cell,
          address: { sheetId: state.activeSheetId, row: targetRow, col: targetCol },
          formula: newFormula,
        };
      }

      // If cut operation, clear original cells
      if (clipboard.type === 'cut') {
        const srcSheet = state.sheets[clipboard.sourceSheetId];
        if (srcSheet) {
          const srcCells = { ...srcSheet.cells };
          for (const key of Object.keys(clipboard.cells)) {
            delete srcCells[key];
          }
          state.sheets[clipboard.sourceSheetId] = { ...srcSheet, cells: srcCells };
        }
      }

      const nextState: ExcelState = {
        ...state,
        clipboard: null,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, cells: updatedCells },
        },
      };
      return recordHistory(nextState);
    }

    case 'AUTO_FILL_RANGE': {
      const { targetRange } = action.payload;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet || !state.selectedCell) return state;

      const sourceCell = sheet.cells[`${state.selectedCell.row},${state.selectedCell.col}`];
      if (!sourceCell) return state;

      const minRow = Math.min(targetRange.startRow, targetRange.endRow);
      const maxRow = Math.max(targetRange.startRow, targetRange.endRow);
      const minCol = Math.min(targetRange.startCol, targetRange.endCol);
      const maxCol = Math.max(targetRange.startCol, targetRange.endCol);

      const updatedCells = { ...sheet.cells };

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          if (r === state.selectedCell.row && c === state.selectedCell.col) continue;

          const rowDelta = r - state.selectedCell.row;
          const colDelta = c - state.selectedCell.col;
          const key = `${r},${c}`;

          const newFormula = sourceCell.formula
            ? shiftFormulaReferences(sourceCell.formula, rowDelta, colDelta)
            : undefined;

          // Numeric fill increment if basic number
          let newVal = sourceCell.value;
          if (typeof sourceCell.value === 'number' && !sourceCell.formula) {
            newVal = sourceCell.value + (rowDelta !== 0 ? rowDelta : colDelta);
          }

          updatedCells[key] = {
            ...sourceCell,
            address: { sheetId: state.activeSheetId, row: r, col: c },
            value: newVal,
            formula: newFormula,
          };
        }
      }

      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, cells: updatedCells },
        },
      };
      return recordHistory(nextState);
    }

    case 'SEARCH_AND_REPLACE': {
      const { searchStr, replaceStr, matchCase, replaceAll } = action.payload;
      if (!searchStr) return state;
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const updatedCells = { ...sheet.cells };
      let matchesCount = 0;

      for (const [key, cell] of Object.entries(updatedCells)) {
        const valStr = String(cell.formula || cell.value || '');
        const targetStr = matchCase ? valStr : valStr.toLowerCase();
        const query = matchCase ? searchStr : searchStr.toLowerCase();

        if (targetStr.includes(query)) {
          matchesCount++;
          if (cell.formula) {
            const regex = new RegExp(searchStr, matchCase ? 'g' : 'gi');
            cell.formula = cell.formula.replace(regex, replaceStr);
          } else {
            const regex = new RegExp(searchStr, matchCase ? 'g' : 'gi');
            cell.value = String(cell.value || '').replace(regex, replaceStr);
          }
          if (!replaceAll) break; // replace only first match
        }
      }

      if (matchesCount === 0) return state;

      const nextState: ExcelState = {
        ...state,
        sheets: {
          ...state.sheets,
          [state.activeSheetId]: { ...sheet, cells: updatedCells },
        },
      };
      return recordHistory(nextState);
    }

    case 'IMPORT_CSV': {
      const { csvText } = action.payload;
      const { cells, rows, cols } = parseCSV(csvText);
      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const updatedSheet: Sheet = {
        ...sheet,
        rows: Math.max(sheet.rows, rows),
        cols: Math.max(sheet.cols, cols),
        cells,
      };

      const nextState: ExcelState = {
        ...state,
        sheets: { ...state.sheets, [state.activeSheetId]: updatedSheet },
      };
      return recordHistory(nextState);
    }

    case 'LOAD_DATASET': {
      const { datasetId } = action.payload;
      const dataset = SAMPLE_DATASETS.find((d) => d.id === datasetId);
      if (!dataset) return state;

      const sheet = state.sheets[state.activeSheetId];
      if (!sheet) return state;

      const updatedSheet: Sheet = {
        ...sheet,
        name: dataset.title,
        rows: Math.max(sheet.rows, dataset.rowsCount),
        cols: Math.max(sheet.cols, dataset.colsCount),
        cells: dataset.cells,
      };

      const nextState: ExcelState = {
        ...state,
        sheets: { ...state.sheets, [state.activeSheetId]: updatedSheet },
        selectedCell: { sheetId: state.activeSheetId, row: 0, col: 0 },
      };
      return recordHistory(nextState);
    }

    case 'SET_ACTIVE_MISSION':
      return {
        ...state,
        activeMissionId: action.payload.missionId,
      };

    case 'COMPLETE_MISSION': {
      const { missionId, score } = action.payload;
      return {
        ...state,
        missionProgress: {
          ...state.missionProgress,
          [missionId]: { completed: true, score },
        },
      };
    }

    case 'TOGGLE_AI_MENTOR':
      return {
        ...state,
        isAiMentorOpen: action.payload !== undefined ? action.payload : !state.isAiMentorOpen,
      };

    case 'LOAD_STATE':
      return action.payload;

    case 'RESET_WORKBOOK':
      return DEFAULT_INITIAL_STATE;

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const prevIndex = state.historyIndex - 1;
      const snapshot = state.history[prevIndex];
      return {
        ...state,
        sheets: JSON.parse(JSON.stringify(snapshot.sheets)),
        activeSheetId: snapshot.activeSheetId,
        historyIndex: prevIndex,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const nextIndex = state.historyIndex + 1;
      const snapshot = state.history[nextIndex];
      return {
        ...state,
        sheets: JSON.parse(JSON.stringify(snapshot.sheets)),
        activeSheetId: snapshot.activeSheetId,
        historyIndex: nextIndex,
      };
    }

    default:
      return state;
  }
}

const ExcelContext = createContext<{ state: ExcelState; dispatch: React.Dispatch<ExcelAction> } | undefined>(undefined);

export const ExcelStudioProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(excelReducer, DEFAULT_INITIAL_STATE);

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.sheets && parsed.activeSheetId) {
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      }
    } catch (err) {
      console.warn('[ExcelStudio] Failed to load local storage:', err);
    }
  }, []);

  // Autosave every 30 seconds to localStorage
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        if (state.sheets && Object.keys(state.sheets).length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
      } catch (err) {
        console.warn('[ExcelStudio] Failed to autosave:', err);
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [state]);

  // Listen for open AI mentor custom events
  useEffect(() => {
    const handleOpenMentor = () => {
      dispatch({ type: 'TOGGLE_AI_MENTOR', payload: true });
    };
    window.addEventListener('open-ai-mentor', handleOpenMentor);
    return () => window.removeEventListener('open-ai-mentor', handleOpenMentor);
  }, []);

  return <ExcelContext.Provider value={{ state, dispatch }}>{children}</ExcelContext.Provider>;
};

export const useExcelStudio = () => {
  const ctx = useContext(ExcelContext);
  if (!ctx) throw new Error('useExcelStudio must be used within ExcelStudioProvider');
  return ctx;
};
