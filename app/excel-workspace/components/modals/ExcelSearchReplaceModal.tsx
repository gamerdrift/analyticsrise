'use client';

import React, { useState } from 'react';
import { X, Search, Replace, Check } from 'lucide-react';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';

export default function ExcelSearchReplaceModal() {
  const { state, dispatch } = useExcelWorkspace();
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCount, setMatchCount] = useState<number | null>(null);

  if (!state.isSearchModalOpen) return null;

  const activeSheet = state.workbook?.sheets[state.activeSheetId];

  const handleSearch = () => {
    if (!activeSheet || !searchTerm) return;

    let count = 0;
    for (const [key, cell] of Object.entries(activeSheet.cells)) {
      const val = cell.formula || String(cell.value || '');
      if (val.toLowerCase().includes(searchTerm.toLowerCase())) {
        count++;
      }
    }
    setMatchCount(count);
  };

  const handleReplaceAll = () => {
    if (!activeSheet || !searchTerm) return;

    let replaced = 0;
    for (const [key, cell] of Object.entries(activeSheet.cells)) {
      const [rStr, cStr] = key.split(',');
      const r = parseInt(rStr, 10);
      const c = parseInt(cStr, 10);

      const val = cell.formula || String(cell.value || '');
      if (val.toLowerCase().includes(searchTerm.toLowerCase())) {
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const newVal = val.replace(regex, replaceTerm);

        const isFormula = newVal.startsWith('=');
        const num = Number(newVal);
        const cellValue = isFormula ? '' : !isNaN(num) && newVal.trim() !== '' ? num : newVal;

        dispatch({
          type: 'UPDATE_CELL',
          payload: {
            row: r,
            col: c,
            value: cellValue,
            formula: isFormula ? newVal : undefined,
          },
        });
        replaced++;
      }
    }
    setMatchCount(0);
    alert(`Replaced ${replaced} occurrence(s).`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Find & Replace</h2>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SEARCH_MODAL', payload: false })}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4 text-xs font-mono">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400">Find what:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setMatchCount(null);
              }}
              placeholder="Search term or value..."
              className="bg-[#161B22] border border-[#1E293B] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400">Replace with:</label>
            <input
              type="text"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="Replacement text or value..."
              className="bg-[#161B22] border border-[#1E293B] focus:border-emerald-500/50 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
            />
          </div>

          {matchCount !== null && (
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[11px]">
              Found <span className="text-emerald-400 font-bold">{matchCount}</span> matching cell(s).
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSearch}
              disabled={!searchTerm}
              className="flex-1 py-2 rounded-xl bg-[#161B22] hover:bg-white/5 border border-[#1E293B] text-slate-200 font-semibold disabled:opacity-30 transition-colors"
            >
              Find All
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={!searchTerm}
              className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold disabled:opacity-30 transition-colors shadow-md shadow-emerald-500/10"
            >
              Replace All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
