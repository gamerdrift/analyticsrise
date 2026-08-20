'use client';

import React from 'react';
import {
  Sliders,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Layers,
  FunctionSquare,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  Info,
} from 'lucide-react';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';

export default function WorkbookProfileDrawer() {
  const { state, dispatch } = useExcelWorkspace();

  if (!state.isProfileDrawerOpen) return null;

  const profile = state.profile;
  const activeSheetProfile = profile?.sheetProfiles[state.activeSheetId];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INTEGER':
      case 'DECIMAL':
        return <Hash className="w-3.5 h-3.5 text-emerald-400" />;
      case 'TEXT':
        return <Type className="w-3.5 h-3.5 text-cyan-400" />;
      case 'DATE':
        return <Calendar className="w-3.5 h-3.5 text-amber-400" />;
      case 'BOOLEAN':
        return <ToggleLeft className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <aside className="w-80 lg:w-96 border-l border-white/10 bg-[#0D1117] flex flex-col h-full z-20 shrink-0 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Workbook Profiler</h3>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PROFILE_DRAWER', payload: false })}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Overview Stats */}
        {profile && (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#161B22] border border-[#1E293B]">
              <span className="text-slate-500 block text-[10px]">TOTAL SHEETS</span>
              <span className="text-base font-bold text-white mt-0.5 block">{profile.sheetCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#161B22] border border-[#1E293B]">
              <span className="text-slate-500 block text-[10px]">FORMULAS</span>
              <span className="text-base font-bold text-cyan-400 mt-0.5 block">{profile.totalFormulaCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#161B22] border border-[#1E293B]">
              <span className="text-slate-500 block text-[10px]">POPULATED CELLS</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">{profile.totalCellCount.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#161B22] border border-[#1E293B]">
              <span className="text-slate-500 block text-[10px]">FILE SIZE</span>
              <span className="text-base font-bold text-slate-300 mt-0.5 block">{(profile.fileSizeBytes / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        )}

        {/* Quality Alerts */}
        {profile && profile.qualityWarnings.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Data Quality Warnings</span>
            </h4>
            <div className="flex flex-col gap-1.5">
              {profile.qualityWarnings.map((warn, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                  {warn}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Sheet Column Summary */}
        {activeSheetProfile && (
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Columns in &quot;{activeSheetProfile.sheetName}&quot;</span>
            </h4>

            <div className="flex flex-col gap-2">
              {activeSheetProfile.columns.map((col) => (
                <div
                  key={col.colIndex}
                  className="p-3 rounded-xl bg-[#161B22]/70 border border-[#1E293B] flex flex-col gap-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(col.inferredType)}
                      <span className="font-semibold text-white truncate max-w-[140px]">{col.header}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10">
                      {col.inferredType}
                    </span>
                  </div>

                  {/* Null Ratio & Unique count */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Filled: {col.nonEmptyCount}</span>
                    <span>Distinct: {col.uniqueCount}</span>
                  </div>

                  {/* Numeric Stats if present */}
                  {col.sum !== undefined && (
                    <div className="pt-2 border-t border-white/5 grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400">
                      <div>Min: <span className="text-slate-200">{col.min}</span></div>
                      <div>Max: <span className="text-slate-200">{col.max}</span></div>
                      <div>Avg: <span className="text-emerald-400">{col.avg}</span></div>
                    </div>
                  )}

                  {/* Sample Preview */}
                  {col.sampleValues.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {col.sampleValues.map((val, vIdx) => (
                        <span
                          key={vIdx}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-slate-400 border border-white/5 truncate max-w-[100px]"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
