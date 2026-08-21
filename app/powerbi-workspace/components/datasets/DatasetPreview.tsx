'use client';

import React, { useState } from 'react';
import {
  Table,
  Columns,
  ShieldCheck,
  AlertTriangle,
  Upload,
  RotateCcw,
  Key,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePowerBIWorkspace } from '../../contexts/PowerBIWorkspaceContext';
import DatasetTable from './DatasetTable';
import { profileDataset } from '@/lib/powerbi/workspace/profiler';

type PreviewTab = 'grid' | 'schema' | 'quality';

export default function DatasetPreview() {
  const { state, dispatch, loadStarterData } = usePowerBIWorkspace();
  const [activeTab, setActiveTab] = useState<PreviewTab>('grid');

  const activeDataset = state.datasets.find((d) => d.id === state.activeDatasetId);

  // Guided Empty State
  if (!activeDataset || state.datasets.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#05070B] overflow-y-auto select-none">
        <div className="max-w-md flex flex-col items-center p-8 rounded-3xl bg-[#0D1117]/80 border border-white/10 shadow-2xl shadow-black/80">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/10">
            <Layers className="w-8 h-8 text-amber-400" />
          </div>

          <h2 className="text-xl font-black font-display text-white tracking-wider uppercase mb-2">
            Build Your Analytics Model
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
            Bring your own datasets into AnalyticsRise to explore schemas, profile columns, and prepare multi-table semantic models.
          </p>

          <div className="w-full text-left p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2.5 mb-6 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                1
              </span>
              <span>Upload your data (.csv, .tsv, .txt)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-bold flex items-center justify-center">
                2
              </span>
              <span>Understand inferred column types</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center justify-center">
                3
              </span>
              <span>Check data quality & potential keys</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center justify-center">
                4
              </span>
              <span>Prepare multi-table relationships</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              type="button"
              onClick={() => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: true })}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Dataset</span>
            </button>
            <button
              type="button"
              onClick={loadStarterData}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Sample Model</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profile = profileDataset(activeDataset);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#05070B]">
      {/* Top Dataset Banner */}
      <div className="p-4 border-b border-white/10 bg-[#080C14] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Table className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">{activeDataset.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                {activeDataset.sourceFileName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
              <span>{activeDataset.rowCount.toLocaleString()} rows</span>
              <span>·</span>
              <span>{activeDataset.colCount} columns</span>
              <span>·</span>
              <span>{(activeDataset.sourceSizeBytes / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[#0D1117] border border-[#1E293B]">
          <button
            type="button"
            onClick={() => setActiveTab('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'grid'
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Data Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Schema ({activeDataset.columns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quality')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer relative ${
              activeTab === 'quality'
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quality Warnings</span>
            {profile.qualityWarnings.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'grid' && <DatasetTable dataset={activeDataset} />}

        {activeTab === 'schema' && (
          <div className="flex-1 overflow-auto p-6 bg-[#05070B]">
            <div className="max-w-5xl mx-auto flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Column Definitions & Statistics</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Deterministic type inference and distribution metrics across all {activeDataset.rowCount.toLocaleString()} rows.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0A0E17]">
                <table className="w-full text-left font-mono text-xs divide-y divide-white/10">
                  <thead className="bg-[#0D1117] text-[10px] text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Column Name</th>
                      <th className="py-3 px-4">Inferred Type</th>
                      <th className="py-3 px-4 text-right">Unique Values</th>
                      <th className="py-3 px-4 text-right">Missing (Null)</th>
                      <th className="py-3 px-4">Numeric Summary / Range</th>
                      <th className="py-3 px-4">Sample Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeDataset.columns.map((col) => (
                      <tr key={col.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 text-white font-semibold flex items-center gap-2">
                          <span>{col.name}</span>
                          {col.isPotentialKey && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] flex items-center gap-1 font-bold">
                              <Key className="w-2.5 h-2.5" />
                              KEY
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px]">
                            {col.inferredType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-300">
                          {col.distinctCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {col.nullCount > 0 ? (
                            <span className="text-amber-400">
                              {col.nullCount} ({(col.nullRatio * 100).toFixed(1)}%)
                            </span>
                          ) : (
                            <span className="text-emerald-400">0 (0%)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {col.min !== undefined && col.max !== undefined ? (
                            <span>
                              Min: {col.min.toLocaleString()} · Max: {col.max.toLocaleString()} · Avg: {col.avg}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[200px]">
                          {col.sampleValues.join(', ') || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="flex-1 overflow-auto p-6 bg-[#05070B]">
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-bold text-white">Data Quality & Profiling Insights</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Educational data hygiene warnings detected by the in-browser profiler.
                </p>
              </div>

              {profile.qualityWarnings.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-xs">
                  <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-400" />
                  <div>
                    <h3 className="font-bold">No Critical Schema Warnings</h3>
                    <p className="text-emerald-400/80 text-[11px] mt-0.5">
                      All columns appear unique, non-empty, and properly formatted for modeling.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {profile.qualityWarnings.map((warn, i) => {
                    const isKeyNotice = warn.includes('ideal primary key');
                    return (
                      <div
                        key={`warn_${i}`}
                        className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
                          isKeyNotice
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-[#0D1117] border-white/10 text-slate-300'
                        }`}
                      >
                        {isKeyNotice ? (
                          <Key className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed font-sans">{warn}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
