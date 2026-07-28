'use client';

import React from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { ArrowRight } from 'lucide-react';

/**
 * DatasetExplorer – a lightweight sidebar that lists all available worksheets (datasets)
 * and allows the user to quickly switch between them. It also displays a brief
 * overview of the active sheet (row/column count). The component follows the
 * dark‑mode, glass‑morphism aesthetic used throughout the app.
 */
export default function DatasetExplorer() {
  const { state, dispatch } = useExcelStudio();
  const { sheets, activeSheetId } = state;

  const handleSelect = (id: string) => {
    dispatch({ type: 'SET_ACTIVE_SHEET', payload: { id } });
  };

  const sheetEntries = Object.entries(sheets);

  return (
    <aside className="w-64 bg-[#0D1117] border-r border-[#00E5FF]/20 p-4 overflow-y-auto scrollbar-thin">
      <h2 className="text-lg font-semibold text-[#00E5FF] mb-3 flex items-center gap-1">
        <ArrowRight className="w-4 h-4" /> Datasets
      </h2>
      <ul className="space-y-2">
        {sheetEntries.map(([id, sheet]) => (
          <li
            key={id}
            className={`p-2 rounded cursor-pointer transition-colors flex justify-between items-center ${
              id === activeSheetId
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold'
                : 'text-slate-400 hover:bg-[#00E5FF]/10 hover:text-white'
            }`}
            onClick={() => handleSelect(id)}
          >
            <span>{sheet.name}</span>
            <span className="text-xs opacity-70">{sheet.rows}×{sheet.cols}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
