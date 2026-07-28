'use client';

import React, { useState } from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { Plus, X, Copy, ChevronLeft, ChevronRight, Info, FileSpreadsheet } from 'lucide-react';

export default function WorkbookTabs() {
  const { state, dispatch } = useExcelStudio();
  const { sheets, activeSheetId, lastSavedAt } = state;

  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showMetadata, setShowMetadata] = useState(false);

  const handleAddSheet = () => {
    const newId = `sheet_${Date.now()}`;
    const count = Object.keys(sheets).length + 1;
    dispatch({
      type: 'ADD_SHEET',
      payload: { id: newId, name: `Sheet${count}` },
    });
  };

  const handleStartRename = (id: string, name: string) => {
    setEditingSheetId(id);
    setRenameValue(name);
  };

  const handleCommitRename = (id: string) => {
    if (renameValue.trim()) {
      dispatch({ type: 'RENAME_SHEET', payload: { id, name: renameValue.trim() } });
    }
    setEditingSheetId(null);
  };

  // Calculate workbook metadata stats
  const sheetList = Object.values(sheets);
  const totalSheets = sheetList.length;
  let totalPopulatedCells = 0;
  let totalFormulas = 0;

  sheetList.forEach((s) => {
    Object.values(s.cells).forEach((c) => {
      if (c.value !== '' && c.value !== null) totalPopulatedCells++;
      if (c.formula) totalFormulas++;
    });
  });

  return (
    <div className="bg-[#0D1117] border-t border-[#00E5FF]/20 px-3 py-1.5 flex items-center justify-between select-none font-mono text-xs z-20">
      {/* Worksheet Tabs list */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin max-w-[70vw]">
        {sheetList.map((s, idx) => {
          const isActive = s.id === activeSheetId;
          const isEditing = editingSheetId === s.id;

          return (
            <div
              key={s.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_SHEET', payload: { id: s.id } })}
              onDoubleClick={() => handleStartRename(s.id, s.name)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer transition-all border-t-2 ${
                isActive
                  ? 'bg-[#05070B] text-[#00E5FF] border-[#00E5FF] font-bold shadow-md'
                  : 'bg-[#161B22] text-slate-400 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleCommitRename(s.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommitRename(s.id)}
                  className="bg-[#0D1117] text-[#00E5FF] px-1 py-0.5 border border-[#00E5FF] rounded focus:outline-none text-xs w-24"
                  autoFocus
                />
              ) : (
                <span>{s.name}</span>
              )}

              {/* Move / Duplicate / Delete Actions on Hover */}
              <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'MOVE_SHEET', payload: { id: s.id, direction: 'left' } }); }}
                  className="p-0.5 hover:text-[#00E5FF]"
                  title="Move Sheet Left"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'MOVE_SHEET', payload: { id: s.id, direction: 'right' } }); }}
                  className="p-0.5 hover:text-[#00E5FF]"
                  title="Move Sheet Right"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DUPLICATE_SHEET', payload: { id: s.id } }); }}
                  className="p-0.5 hover:text-[#00E5FF]"
                  title="Duplicate Worksheet"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {sheetList.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REMOVE_SHEET', payload: { id: s.id } }); }}
                    className="p-0.5 hover:text-rose-400"
                    title="Delete Worksheet"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Sheet Button */}
        <button
          onClick={handleAddSheet}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 text-[#00E5FF] transition-colors ml-1"
          title="Add New Worksheet"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Metadata Stats Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="text-slate-400 hover:text-[#00E5FF] flex items-center gap-1 text-[11px] font-semibold"
          title="View Workbook Metadata"
        >
          <Info className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Workbook Info</span>
        </button>

        {lastSavedAt && (
          <span className="text-[10px] text-emerald-400 font-mono hidden md:inline">
            AutoSaved: {lastSavedAt}
          </span>
        )}
      </div>

      {/* Metadata Drawer Popup */}
      {showMetadata && (
        <div className="fixed bottom-12 right-4 bg-[#0D1117] border border-[#00E5FF]/30 rounded-xl p-4 shadow-2xl z-50 w-64 space-y-2 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-[#00E5FF] uppercase">Workbook Telemetry</span>
            <button onClick={() => setShowMetadata(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Total Worksheets:</span> <span className="font-bold text-white">{totalSheets}</span>
            </div>
            <div className="flex justify-between">
              <span>Populated Cells:</span> <span className="font-bold text-white">{totalPopulatedCells}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Formulas:</span> <span className="font-bold text-[#00E5FF]">{totalFormulas}</span>
            </div>
            <div className="flex justify-between">
              <span>Cloud Status:</span> <span className="font-bold text-emerald-400">Synchronized</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
