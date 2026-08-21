'use client';

import React from 'react';
import {
  Sliders,
  X,
  ShieldCheck,
  AlertTriangle,
  Database,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  Key,
} from 'lucide-react';
import { usePowerBIWorkspace } from '../../contexts/PowerBIWorkspaceContext';
import { profileDataset } from '@/lib/powerbi/workspace/profiler';
import { InferredColumnType } from '@/lib/powerbi/workspace/types';

function ColumnTypeIcon({ type }: { type: InferredColumnType }) {
  switch (type) {
    case 'INTEGER':
    case 'DECIMAL':
      return <Hash className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />;
    case 'DATE':
    case 'DATETIME':
      return <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    case 'BOOLEAN':
      return <ToggleLeft className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    default:
      return <Type className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  }
}

export default function DatasetProfileDrawer() {
  const { state, dispatch } = usePowerBIWorkspace();
  if (!state.isProfileDrawerOpen) return null;

  const activeDataset = state.datasets.find((d) => d.id === state.activeDatasetId) || state.datasets[0];
  const profile = activeDataset ? profileDataset(activeDataset) : null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] md:w-[460px] bg-[#080C14] border-l border-white/10 shadow-2xl flex flex-col font-sans select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <header className="h-14 border-b border-white/10 bg-[#0D1117] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
            <Sliders className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div>
            <h2 className="text-xs font-black font-display text-white tracking-wider uppercase">
              Dataset Profiler
            </h2>
            <span className="text-[10px] font-mono text-slate-400">
              {activeDataset ? activeDataset.name : 'No table selected'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_PROFILE_DRAWER', payload: false })}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {!activeDataset || !profile ? (
          <div className="text-center p-8 text-slate-500 text-xs font-mono">
            No dataset available to profile.
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase">Rows</span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {profile.rowCount.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0D1117] border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase">Columns</span>
                <span className="text-sm font-bold text-white mt-0.5">{profile.colCount}</span>
              </div>
            </div>

            {/* Quality Warnings */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Quality Findings ({profile.qualityWarnings.length})
              </span>

              {profile.qualityWarnings.length === 0 ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No data hygiene issues found.</span>
                </div>
              ) : (
                profile.qualityWarnings.map((w, idx) => (
                  <div
                    key={`pw_${idx}`}
                    className="p-3 rounded-xl bg-black/40 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2 leading-relaxed"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))
              )}
            </div>

            {/* Column Breakdown */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Column Metrics
              </span>

              <div className="flex flex-col gap-2">
                {profile.columns.map((col) => (
                  <div
                    key={col.id}
                    className="p-3 rounded-xl bg-[#0D1117] border border-white/5 flex flex-col gap-1.5 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-white font-semibold">
                        <ColumnTypeIcon type={col.inferredType} />
                        <span className="truncate max-w-[160px]">{col.name}</span>
                        {col.isPotentialKey && (
                          <span title="Primary Key">
                            <Key className="w-3 h-3 text-amber-400 shrink-0" />
                          </span>
                        )}

                      </div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                        {col.inferredType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-white/5">
                      <div>
                        <span>Nulls: </span>
                        <strong className={col.nullCount > 0 ? 'text-amber-400' : 'text-slate-300'}>
                          {col.nullCount} ({(col.nullRatio * 100).toFixed(0)}%)
                        </strong>
                      </div>
                      <div>
                        <span>Unique: </span>
                        <strong className="text-slate-300">{col.distinctCount}</strong>
                      </div>
                    </div>

                    {col.min !== undefined && col.max !== undefined && (
                      <div className="text-[10px] text-slate-500 pt-1">
                        Min: {col.min} · Max: {col.max} · Avg: {col.avg}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
