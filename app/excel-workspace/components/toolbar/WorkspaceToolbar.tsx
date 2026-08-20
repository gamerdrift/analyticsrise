'use client';

import React from 'react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  Search,
  BarChart2,
  FunctionSquare,
  Plus,
  Trash2,
} from 'lucide-react';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';
import { colIndexToLetter } from '@/lib/utils/excel/formulaEvaluator';

export default function WorkspaceToolbar() {
  const { state, dispatch } = useExcelWorkspace();

  const activeSheet = state.workbook?.sheets[state.activeSheetId];
  const selectedCell = state.selectedCell;
  const currentCell = activeSheet && selectedCell
    ? activeSheet.cells[`${selectedCell.row},${selectedCell.col}`]
    : undefined;

  const currentFormatting = currentCell?.formatting || {};

  const toggleBold = () => {
    dispatch({
      type: 'APPLY_CELL_FORMAT',
      payload: { formatting: { bold: !currentFormatting.bold } },
    });
  };

  const toggleItalic = () => {
    dispatch({
      type: 'APPLY_CELL_FORMAT',
      payload: { formatting: { italic: !currentFormatting.italic } },
    });
  };

  const toggleUnderline = () => {
    dispatch({
      type: 'APPLY_CELL_FORMAT',
      payload: { formatting: { underline: !currentFormatting.underline } },
    });
  };

  const setAlign = (align: 'left' | 'center' | 'right') => {
    dispatch({
      type: 'APPLY_CELL_FORMAT',
      payload: { formatting: { textAlign: align } },
    });
  };

  const setNumberFormat = (format: 'general' | 'currency' | 'percent' | 'decimal' | 'date') => {
    dispatch({
      type: 'APPLY_CELL_FORMAT',
      payload: { formatting: { numberFormat: format } },
    });
  };

  const insertFormula = (fnName: string) => {
    if (!selectedCell) return;
    const colLetter = colIndexToLetter(selectedCell.col);
    const formula = `=${fnName}(${colLetter}1:${colLetter}${selectedCell.row})`;
    dispatch({
      type: 'UPDATE_CELL',
      payload: {
        row: selectedCell.row,
        col: selectedCell.col,
        value: '',
        formula,
      },
    });
  };

  return (
    <div className="bg-[#0D1117] border-b border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-10 shrink-0">
      {/* Left: Formatting & Controls */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* History Controls */}
        <div className="flex items-center gap-0.5 border-r border-[#1E293B] pr-2 mr-1">
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.historyIndex <= 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.historyIndex >= state.history.length - 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Style Controls */}
        <div className="flex items-center gap-0.5 border-r border-[#1E293B] pr-2 mr-1">
          <button
            onClick={toggleBold}
            className={`p-1.5 rounded-lg transition-colors ${
              currentFormatting.bold ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleItalic}
            className={`p-1.5 rounded-lg transition-colors ${
              currentFormatting.italic ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleUnderline}
            className={`p-1.5 rounded-lg transition-colors ${
              currentFormatting.underline ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignment Controls */}
        <div className="hidden sm:flex items-center gap-0.5 border-r border-[#1E293B] pr-2 mr-1">
          <button
            onClick={() => setAlign('left')}
            className={`p-1.5 rounded-lg transition-colors ${
              currentFormatting.textAlign === 'left' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAlign('center')}
            className={`p-1.5 rounded-lg transition-colors ${
              currentFormatting.textAlign === 'center' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAlign('right')}
            className={`p-1.5 rounded-lg transition-colors ${
              currentFormatting.textAlign === 'right' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Number Format Pills */}
        <div className="hidden md:flex items-center gap-1 border-r border-[#1E293B] pr-2 mr-1 font-mono text-[11px]">
          <button
            onClick={() => setNumberFormat('currency')}
            className="px-2 py-1 rounded-lg bg-[#161B22] hover:bg-white/5 text-slate-300 border border-[#1E293B] flex items-center gap-1"
            title="Currency Format"
          >
            <DollarSign className="w-3 h-3 text-emerald-400" />
            <span>$</span>
          </button>
          <button
            onClick={() => setNumberFormat('percent')}
            className="px-2 py-1 rounded-lg bg-[#161B22] hover:bg-white/5 text-slate-300 border border-[#1E293B] flex items-center gap-1"
            title="Percent Format"
          >
            <Percent className="w-3 h-3 text-cyan-400" />
            <span>%</span>
          </button>
        </div>

        {/* Quick Formulas */}
        <div className="hidden xl:flex items-center gap-1 border-r border-[#1E293B] pr-2 mr-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Formulas:</span>
          {['SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN'].map((fn) => (
            <button
              key={fn}
              onClick={() => insertFormula(fn)}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#161B22] hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/30 border border-[#1E293B] text-slate-400 transition-colors"
            >
              ={fn}
            </button>
          ))}
        </div>

        {/* Modals Triggers */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CHART_MODAL', payload: true })}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#161B22] hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-[#1E293B] text-slate-300 hover:text-cyan-300 transition-colors"
            title="Create Visual Chart from Selection"
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Chart</span>
          </button>

          <button
            onClick={() => dispatch({ type: 'TOGGLE_SEARCH_MODAL', payload: true })}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#161B22] hover:bg-white/5 border border-[#1E293B] text-slate-300 transition-colors"
            title="Search & Replace (Ctrl+F)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Find</span>
          </button>
        </div>
      </div>

      {/* Right: Sheets Switcher Bar */}
      {state.workbook && state.workbook.sheetOrder.length > 1 && (
        <div className="flex items-center gap-1 bg-[#161B22] p-0.5 rounded-xl border border-[#1E293B]">
          {state.workbook.sheetOrder.map((sheetId) => {
            const sheet = state.workbook?.sheets[sheetId];
            if (!sheet) return null;
            const isActive = sheetId === state.activeSheetId;
            return (
              <button
                key={sheetId}
                onClick={() => dispatch({ type: 'SET_ACTIVE_SHEET', payload: sheetId })}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {sheet.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
