'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FunctionSquare, Check, X } from 'lucide-react';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';
import { colIndexToLetter, letterToColIndex } from '@/lib/utils/excel/formulaEvaluator';
import { CellFormatting } from '@/lib/excel/workspace/types';

const VISIBLE_ROWS = 60;
const VISIBLE_COLS = 26;

export default function WorkspaceGrid() {
  const { state, dispatch, evaluateCell } = useExcelWorkspace();
  const activeSheet = state.workbook?.sheets[state.activeSheetId];

  const selectedCell = state.selectedCell || { sheetId: state.activeSheetId, row: 1, col: 0 };
  const currentCellKey = `${selectedCell.row},${selectedCell.col}`;
  const currentCell = activeSheet?.cells[currentCellKey];

  // Formula bar state
  const [formulaInput, setFormulaInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const formulaInputRef = useRef<HTMLInputElement>(null);

  // Synchronize formula input with selected cell
  useEffect(() => {
    if (currentCell) {
      setFormulaInput(currentCell.formula || (currentCell.value !== null && currentCell.value !== undefined ? String(currentCell.value) : ''));
    } else {
      setFormulaInput('');
    }
    setIsEditing(false);
  }, [selectedCell.row, selectedCell.col, state.activeSheetId, currentCell]);

  const commitEdit = (val: string) => {
    const isFormula = val.startsWith('=');
    const num = Number(val);
    const cellValue = isFormula ? '' : !isNaN(num) && val.trim() !== '' ? num : val;

    dispatch({
      type: 'UPDATE_CELL',
      payload: {
        row: selectedCell.row,
        col: selectedCell.col,
        value: cellValue,
        formula: isFormula ? val : undefined,
      },
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        commitEdit(editValue);
        // Move down
        dispatch({
          type: 'SELECT_CELL',
          payload: { sheetId: state.activeSheetId, row: selectedCell.row + 1, col: selectedCell.col },
        });
      } else if (e.key === 'Escape') {
        setIsEditing(false);
      }
      return;
    }

    if (e.key === 'ArrowUp' && selectedCell.row > 0) {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', payload: { sheetId: state.activeSheetId, row: selectedCell.row - 1, col: selectedCell.col } });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', payload: { sheetId: state.activeSheetId, row: selectedCell.row + 1, col: selectedCell.col } });
    } else if (e.key === 'ArrowLeft' && selectedCell.col > 0) {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', payload: { sheetId: state.activeSheetId, row: selectedCell.row, col: selectedCell.col - 1 } });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', payload: { sheetId: state.activeSheetId, row: selectedCell.row, col: selectedCell.col + 1 } });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(true);
      setEditValue(currentCell?.formula || (currentCell?.value !== null && currentCell?.value !== undefined ? String(currentCell.value) : ''));
    } else if (e.key === 'Tab') {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', payload: { sheetId: state.activeSheetId, row: selectedCell.row, col: selectedCell.col + 1 } });
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setIsEditing(true);
      setEditValue(e.key);
    }
  };

  // Format cell value for display
  const formatCellValue = (val: any, formatting?: CellFormatting): string => {
    if (val === null || val === undefined || val === '') return '';
    if (formatting?.numberFormat === 'currency' && typeof val === 'number') {
      return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (formatting?.numberFormat === 'percent' && typeof val === 'number') {
      return `${(val * 100).toFixed(1)}%`;
    }
    return String(val);
  };

  const totalRows = Math.max(VISIBLE_ROWS, activeSheet?.rows || 100);
  const totalCols = Math.max(VISIBLE_COLS, activeSheet?.cols || 26);

  const coordStr = `${colIndexToLetter(selectedCell.col)}${selectedCell.row + 1}`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#05070B] focus:outline-none" tabIndex={0} onKeyDown={handleKeyDown}>
      {/* Formula Bar */}
      <div className="h-10 border-b border-white/10 bg-[#0D1117] px-4 flex items-center gap-3 shrink-0 text-xs font-mono">
        {/* NameBox */}
        <div className="w-20 px-2.5 py-1 rounded bg-[#161B22] border border-[#1E293B] text-emerald-400 font-bold text-center select-none">
          {coordStr}
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Function Icon */}
        <div className="text-slate-500 flex items-center">
          <FunctionSquare className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Formula Input */}
        <input
          ref={formulaInputRef}
          type="text"
          value={formulaInput}
          onChange={(e) => setFormulaInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitEdit(formulaInput);
              formulaInputRef.current?.blur();
            }
          }}
          placeholder="Enter a value or formula (e.g. =SUM(A1:A10))"
          className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-slate-600 text-xs"
        />

        {/* Commit/Cancel for formula bar */}
        {formulaInput !== (currentCell?.formula || String(currentCell?.value || '')) && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => commitEdit(formulaInput)}
              className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              title="Apply (Enter)"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFormulaInput(currentCell?.formula || String(currentCell?.value || ''))}
              className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Spreadsheet Grid Container */}
      <div className="flex-1 overflow-auto relative select-none">
        <table className="border-collapse table-fixed text-xs font-mono text-slate-300 min-w-full">
          {/* Column Header Row */}
          <thead>
            <tr className="sticky top-0 z-20 bg-[#0D1117] shadow-sm">
              <th className="w-12 min-w-[48px] h-7 bg-[#090D14] border-b border-r border-[#1E293B] text-[10px] text-slate-500 font-bold sticky left-0 z-30">
                #
              </th>
              {Array.from({ length: totalCols }).map((_, cIdx) => {
                const colLetter = colIndexToLetter(cIdx);
                const isColSelected = selectedCell.col === cIdx;
                return (
                  <th
                    key={cIdx}
                    className={`w-32 min-w-[128px] h-7 border-b border-r border-[#1E293B] text-[11px] font-bold transition-colors ${
                      isColSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#0D1117] text-slate-400'
                    }`}
                  >
                    {colLetter}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Data Rows */}
          <tbody>
            {Array.from({ length: totalRows }).map((_, rIdx) => {
              const isRowSelected = selectedCell.row === rIdx;
              return (
                <tr key={rIdx} className="hover:bg-white/[0.01]">
                  {/* Row Number Header */}
                  <td
                    className={`h-7 text-center border-b border-r border-[#1E293B] text-[10px] font-bold sticky left-0 z-10 select-none ${
                      isRowSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#090D14] text-slate-500'
                    }`}
                  >
                    {rIdx + 1}
                  </td>

                  {/* Row Cells */}
                  {Array.from({ length: totalCols }).map((_, cIdx) => {
                    const isCellSelected = selectedCell.row === rIdx && selectedCell.col === cIdx;
                    const cellKey = `${rIdx},${cIdx}`;
                    const cell = activeSheet?.cells[cellKey];
                    const evaluatedVal = activeSheet ? evaluateCell(cell, activeSheet.cells) : null;
                    const displayVal = formatCellValue(evaluatedVal, cell?.formatting);

                    const isHeaderRow = rIdx === 0;
                    const fmt = cell?.formatting || {};

                    return (
                      <td
                        key={cIdx}
                        onClick={() => {
                          dispatch({
                            type: 'SELECT_CELL',
                            payload: { sheetId: state.activeSheetId, row: rIdx, col: cIdx },
                          });
                        }}
                        onDoubleClick={() => {
                          setIsEditing(true);
                          setEditValue(cell?.formula || (cell?.value !== null && cell?.value !== undefined ? String(cell.value) : ''));
                        }}
                        className={`h-7 px-2 border-b border-r border-[#1E293B]/70 truncate relative transition-all ${
                          isCellSelected
                            ? 'bg-emerald-500/10 ring-2 ring-emerald-400 ring-inset z-10 text-white'
                            : isHeaderRow
                            ? 'bg-[#111722]/60 text-slate-100 font-semibold'
                            : 'text-slate-300'
                        } ${fmt.bold ? 'font-bold' : ''} ${fmt.italic ? 'italic' : ''} ${
                          fmt.textAlign === 'center'
                            ? 'text-center'
                            : fmt.textAlign === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {isCellSelected && isEditing ? (
                          <input
                            ref={editInputRef}
                            autoFocus
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => commitEdit(editValue)}
                            className="absolute inset-0 w-full h-full px-2 bg-[#0D1117] text-white border-2 border-emerald-400 focus:outline-none text-xs font-mono"
                          />
                        ) : (
                          <span>{displayVal}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
