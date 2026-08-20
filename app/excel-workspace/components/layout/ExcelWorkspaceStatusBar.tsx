'use client';

import React from 'react';
import { ShieldCheck, FunctionSquare, Table2, Layers, Cpu } from 'lucide-react';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';
import { colIndexToLetter } from '@/lib/utils/excel/formulaEvaluator';

export default function ExcelWorkspaceStatusBar() {
  const { state, evaluateCell } = useExcelWorkspace();

  const activeSheet = state.workbook?.sheets[state.activeSheetId];
  const profile = state.profile?.sheetProfiles[state.activeSheetId];

  // Selected cell coordinates
  const selRow = state.selectedCell ? state.selectedCell.row : 0;
  const selCol = state.selectedCell ? state.selectedCell.col : 0;
  const coordStr = `${colIndexToLetter(selCol)}${selRow + 1}`;

  // Evaluate selected cell value
  const selectedCellObj = activeSheet?.cells[`${selRow},${selCol}`];
  const evalValue = activeSheet
    ? evaluateCell(selectedCellObj, activeSheet.cells)
    : null;

  return (
    <footer className="h-9 bg-[#05070B] border-t border-white/10 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none z-20 shrink-0">
      {/* Left: Active Sheet & Dimensions */}
      <div className="flex items-center gap-4">
        {activeSheet ? (
          <>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sheet:</span>
              <span className="text-white font-semibold">{activeSheet.name}</span>
            </div>

            <div className="h-3 w-px bg-white/10 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Table2 className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {profile ? profile.rowCount.toLocaleString() : activeSheet.rows} rows ×{' '}
                {profile ? profile.colCount : activeSheet.cols} cols
              </span>
            </div>

            <div className="h-3 w-px bg-white/10 hidden md:block" />

            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <FunctionSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Formulas: {profile?.formulaCount || 0}</span>
            </div>
          </>
        ) : (
          <span>No workbook loaded</span>
        )}
      </div>

      {/* Center: Selected Cell Info */}
      <div className="hidden lg:flex items-center gap-3 bg-[#0D1117] px-3 py-0.5 rounded-lg border border-[#1E293B]">
        <span className="text-emerald-400 font-bold">{coordStr}</span>
        {selectedCellObj?.formula ? (
          <span className="text-cyan-300 truncate max-w-[200px]">
            {selectedCellObj.formula}
          </span>
        ) : evalValue !== null && evalValue !== undefined ? (
          <span className="text-slate-300 truncate max-w-[200px]">
            {String(evalValue)}
          </span>
        ) : (
          <span className="text-slate-600 italic">Empty</span>
        )}
      </div>

      {/* Right: In-Browser Privacy Guarantee & Local Engine Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">100% In-Browser</span>
        </div>

        <div className="h-3 w-px bg-white/10" />

        <div className="flex items-center gap-1 text-slate-500">
          <Cpu className="w-3 h-3 text-slate-500" />
          <span className="hidden md:inline">Client Engine</span>
        </div>
      </div>
    </footer>
  );
}
