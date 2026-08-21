'use client';

import React from 'react';
import { Database, Lock, ShieldCheck, Network, Layers } from 'lucide-react';
import { usePowerBIWorkspace } from '../../contexts/PowerBIWorkspaceContext';
import { findRelationshipCandidates } from '@/lib/powerbi/workspace/modelHeuristics';

export default function PowerBIWorkspaceStatusBar() {
  const { state, dispatch } = usePowerBIWorkspace();
  const totalRows = state.datasets.reduce((acc, d) => acc + d.rowCount, 0);
  const totalCols = state.datasets.reduce((acc, d) => acc + d.colCount, 0);
  const candidates = findRelationshipCandidates(state.datasets);
  const activeDataset = state.datasets.find((d) => d.id === state.activeDatasetId);

  return (
    <footer className="h-9 border-t border-white/10 bg-[#05070B] px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none shrink-0">
      {/* Left metrics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Database className="w-3 h-3 text-amber-400" />
          <span>
            {state.datasets.length} {state.datasets.length === 1 ? 'Dataset' : 'Datasets'}
          </span>
        </div>

        <div className="h-3 w-px bg-white/10" />

        <span>{totalRows.toLocaleString()} Total Rows</span>

        <div className="h-3 w-px bg-white/10 hidden sm:block" />

        <span className="hidden sm:inline">{totalCols} Total Columns</span>

        {activeDataset && (
          <>
            <div className="h-3 w-px bg-white/10 hidden md:block" />
            <span className="hidden md:inline text-amber-300">
              Active: <strong>{activeDataset.name}</strong> ({activeDataset.rowCount} rows)
            </span>
          </>
        )}
      </div>

      {/* Right status badges */}
      <div className="flex items-center gap-3">
        {/* Model Readiness Indicator */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_MODEL_PREP', payload: true })}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-colors cursor-pointer"
          title="Open Model Preparation Panel"
        >
          <Network className="w-3 h-3" />
          <span>{candidates.length} Candidate Rel</span>
        </button>

        {/* In-Browser Privacy Badge */}
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <Lock className="w-3 h-3" />
          <span className="hidden sm:inline">100% In-Browser Privacy</span>
          <span className="sm:hidden">Local Only</span>
        </div>
      </div>
    </footer>
  );
}
