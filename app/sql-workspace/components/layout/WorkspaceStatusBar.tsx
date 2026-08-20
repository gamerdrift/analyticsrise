"use client";

import React from 'react';
import { useSqlWorkspace } from '../../contexts/SqlWorkspaceContext';
import { Database, ShieldCheck, Clock, Layers } from 'lucide-react';
import { WORKSPACE_LIMITS } from '@/lib/sql/workspace/limits';

export default function WorkspaceStatusBar() {
  const { state } = useSqlWorkspace();
  const dataset = state.parsedDataset;
  const limits = WORKSPACE_LIMITS[state.userTier] || WORKSPACE_LIMITS.free;

  const rowCount = dataset ? dataset.rows.length : 0;
  const colCount = dataset ? dataset.columns.length : 0;

  return (
    <footer className="h-7 bg-[#06080E] border-t border-white/10 flex items-center justify-between px-3 md:px-4 text-[10px] font-mono text-slate-500 shrink-0 select-none">
      {/* Left: Active Dataset */}
      <div className="flex items-center gap-3 truncate">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Database className="w-3 h-3 text-[#00E5FF]" />
          <span className="truncate">
            Table: <strong>{dataset?.tableName || 'None'}</strong> ({rowCount.toLocaleString()} rows, {colCount} cols)
          </span>
        </div>

        <span className="text-slate-700 hidden sm:inline">•</span>

        <span className="hidden sm:inline text-slate-400">
          Limit: {rowCount.toLocaleString()} / {limits.maxRows.toLocaleString()} max rows
        </span>
      </div>

      {/* Right: Engine & Security */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Local Engine Mode</span>
        </div>

        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 uppercase font-bold">
          {state.userTier} Tier
        </span>
      </div>
    </footer>
  );
}
