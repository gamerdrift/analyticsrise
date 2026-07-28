'use client';

import React, { useState } from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { exportToCSV, exportToTSV, exportToPDF } from '@/lib/utils/excel/exportManager';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Trash2,
  Lock,
  EyeOff,
  Combine,
  Search,
  Palette,
  Database,
  BarChart2,
  FileSpreadsheet,
  Download,
  Bot,
  Undo2,
  Redo2,
  Keyboard,
  Sparkles,
} from 'lucide-react';

interface Props {
  onOpenSearch: () => void;
  onOpenCondFormat: () => void;
  onOpenDatasets: () => void;
  onOpenCharts: () => void;
  onOpenShortcuts: () => void;
}

export default function Toolbar({
  onOpenSearch,
  onOpenCondFormat,
  onOpenDatasets,
  onOpenCharts,
  onOpenShortcuts,
}: Props) {
  const { state, dispatch } = useExcelStudio();
  const { activeSheetId, sheets, selectedCell, selectionRange } = state;
  const sheet = sheets[activeSheetId];

  const activeCellObj = selectedCell && sheet ? sheet.cells[`${selectedCell.row},${selectedCell.col}`] : null;

  const handleApplyFormatting = (formatting: Parameters<typeof dispatch>[0] extends { type: 'APPLY_FORMATTING'; payload: { formatting: infer F } } ? F : never) => {
    dispatch({ type: 'APPLY_FORMATTING', payload: { formatting } });
  };

  const handleNumberFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleApplyFormatting({ numberFormat: e.target.value as any });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleApplyFormatting({ fontFamily: e.target.value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleApplyFormatting({ fontSize: parseInt(e.target.value, 10) });
  };

  return (
    <div className="flex flex-col bg-[#0D1117] border-b border-[#00E5FF]/20 select-none z-20 font-mono text-xs">
      {/* Top Ribbon Row */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-[#05070B] overflow-x-auto scrollbar-thin">
        {/* Undo / Redo & File */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Dataset Explorer Button */}
          <button
            onClick={onOpenDatasets}
            className="px-2.5 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 font-bold transition-all flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" /> Sample Datasets
          </button>
        </div>

        {/* Action Group: Search, Conditional Formatting, Charts, Shortcuts */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="px-2 py-1 rounded hover:bg-white/10 text-slate-300 flex items-center gap-1"
            title="Search & Replace (Ctrl+F)"
          >
            <Search className="w-3.5 h-3.5 text-[#00E5FF]" /> Search & Replace
          </button>

          <button
            onClick={onOpenCondFormat}
            className="px-2 py-1 rounded hover:bg-white/10 text-slate-300 flex items-center gap-1"
            title="Conditional Formatting"
          >
            <Palette className="w-3.5 h-3.5 text-[#00E5FF]" /> Formatting Rules
          </button>

          <button
            onClick={onOpenCharts}
            className="px-2.5 py-1 rounded bg-[#00E5FF] text-black font-bold hover:bg-[#4FC3F7] transition-all flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" /> Visualizations
          </button>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1 bg-[#161B22] px-2 py-1 rounded border border-slate-700">
            <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
            <button
              onClick={() => sheet && exportToCSV(sheet, `${sheet.name}.csv`)}
              className="text-slate-300 hover:text-white text-[10px] font-bold uppercase"
            >
              CSV
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => sheet && exportToTSV(sheet, `${sheet.name}.tsv`)}
              className="text-slate-300 hover:text-white text-[10px] font-bold uppercase"
            >
              TSV
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => sheet && exportToPDF(sheet, `Excel Studio - ${sheet.name}`)}
              className="text-[#00E5FF] hover:underline text-[10px] font-bold uppercase"
            >
              PDF
            </button>
          </div>

          <button
            onClick={onOpenShortcuts}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formatting & Controls Ribbon Row */}
      <div className="flex items-center gap-3 px-3 py-2 overflow-x-auto scrollbar-thin">
        {/* Font Family & Size */}
        <div className="flex items-center gap-1.5">
          <select
            value={activeCellObj?.formatting?.fontFamily || 'Inter'}
            onChange={handleFontFamilyChange}
            className="bg-[#05070B] border border-slate-700 rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>

          <select
            value={activeCellObj?.formatting?.fontSize || 12}
            onChange={handleFontSizeChange}
            className="bg-[#05070B] border border-slate-700 rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#00E5FF]"
          >
            {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Text Styles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleApplyFormatting({ bold: !activeCellObj?.formatting?.bold })}
            className={`p-1.5 rounded transition-colors ${
              activeCellObj?.formatting?.bold ? 'bg-[#00E5FF] text-black font-bold' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleApplyFormatting({ italic: !activeCellObj?.formatting?.italic })}
            className={`p-1.5 rounded transition-colors ${
              activeCellObj?.formatting?.italic ? 'bg-[#00E5FF] text-black font-bold' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleApplyFormatting({ underline: !activeCellObj?.formatting?.underline })}
            className={`p-1.5 rounded transition-colors ${
              activeCellObj?.formatting?.underline ? 'bg-[#00E5FF] text-black font-bold' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Colors */}
        <div className="flex items-center gap-2">
          {/* Fill Color */}
          <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white text-[11px]">
            <span>Fill:</span>
            <input
              type="color"
              value={activeCellObj?.formatting?.bgColor || '#161B22'}
              onChange={(e) => handleApplyFormatting({ bgColor: e.target.value })}
              className="w-5 h-5 rounded border-none bg-transparent cursor-pointer"
            />
          </label>

          {/* Text Color */}
          <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white text-[11px]">
            <span>Text:</span>
            <input
              type="color"
              value={activeCellObj?.formatting?.fontColor || '#00E5FF'}
              onChange={(e) => handleApplyFormatting({ fontColor: e.target.value })}
              className="w-5 h-5 rounded border-none bg-transparent cursor-pointer"
            />
          </label>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleApplyFormatting({ textAlign: 'left' })}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleApplyFormatting({ textAlign: 'center' })}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleApplyFormatting({ textAlign: 'right' })}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => dispatch({ type: 'MERGE_CELLS' })}
            className="px-2 py-1 rounded hover:bg-white/10 text-slate-300 flex items-center gap-1"
            title="Merge & Center"
          >
            <Combine className="w-3.5 h-3.5 text-[#00E5FF]" /> Merge
          </button>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Number Format Selector */}
        <div>
          <select
            value={activeCellObj?.formatting?.numberFormat || 'general'}
            onChange={handleNumberFormatChange}
            className="bg-[#05070B] border border-slate-700 rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="general">General</option>
            <option value="currency">Currency ($)</option>
            <option value="percent">Percentage (%)</option>
            <option value="decimal">Decimal (.00)</option>
            <option value="date">Date (YYYY-MM-DD)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
