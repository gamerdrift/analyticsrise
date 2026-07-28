'use client';

import React from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HintsPanel() {
  const { state } = useExcelStudio();
  const { selectedCell, sheets, activeSheetId } = state;
  const sheet = sheets[activeSheetId];

  const activeCellKey = selectedCell ? `${selectedCell.row},${selectedCell.col}` : null;
  const activeCellObj = activeCellKey && sheet ? sheet.cells[activeCellKey] : null;

  return (
    <div className="bg-[#0A0D12] border-t border-white/5 px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-300">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-[#00E5FF] shrink-0" />
        <span className="text-[#00E5FF] font-bold">Pro Tip:</span>
        <span className="text-slate-300">
          {activeCellObj?.formula
            ? `Formula ${activeCellObj.formula} evaluated in cell. Press F2 to edit.`
            : 'Type = in any cell to open formula autocomplete. Use Ctrl+C / Ctrl+V for relative copy & paste.'}
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
        <Sparkles className="w-3.5 h-3.5" /> <span>Sprint 7.0 Engine Active</span>
      </div>
    </div>
  );
}
