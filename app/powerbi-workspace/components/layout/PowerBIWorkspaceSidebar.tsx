'use client';

import React, { useState } from 'react';
import {
  Database,
  Table,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  Key,
  RotateCcw,
} from 'lucide-react';
import { usePowerBIWorkspace } from '../../contexts/PowerBIWorkspaceContext';
import { Dataset, InferredColumnType } from '@/lib/powerbi/workspace/types';

function ColumnTypeIcon({ type }: { type: InferredColumnType }) {
  switch (type) {
    case 'INTEGER':
    case 'DECIMAL':
      return <Hash className="w-3 h-3 text-[#00E5FF] shrink-0" />;
    case 'DATE':
    case 'DATETIME':
      return <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />;
    case 'BOOLEAN':
      return <ToggleLeft className="w-3 h-3 text-purple-400 shrink-0" />;
    default:
      return <Type className="w-3 h-3 text-slate-400 shrink-0" />;
  }
}

export default function PowerBIWorkspaceSidebar() {
  const { state, dispatch, removeDataset, renameDataset, loadStarterData } = usePowerBIWorkspace();
  const [editingDatasetId, setEditingDatasetId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [expandedDatasets, setExpandedDatasets] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedDatasets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartRename = (ds: Dataset, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDatasetId(ds.id);
    setEditName(ds.name);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editName.trim()) {
      renameDataset(id, editName);
    }
    setEditingDatasetId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDatasetId(null);
  };

  const filteredDatasets = state.datasets.filter((ds) => {
    if (!state.searchQuery.trim()) return true;
    const q = state.searchQuery.toLowerCase();
    return (
      ds.name.toLowerCase().includes(q) ||
      ds.headers.some((h) => h.toLowerCase().includes(q))
    );
  });

  return (
    <aside className="w-64 sm:w-72 lg:w-80 h-full border-r border-white/10 bg-[#080C14] flex flex-col shrink-0 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-black font-display text-white uppercase tracking-wider">
              Data Explorer
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
            {state.datasets.length} tables
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            placeholder="Search tables & columns..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0D1117] border border-[#1E293B] focus:border-amber-500/50 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
          />
          {state.searchQuery && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Dataset List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {filteredDatasets.length === 0 ? (
          <div className="text-center p-6 text-slate-500 text-xs font-mono">
            {state.datasets.length === 0 ? (
              <div className="flex flex-col gap-3 items-center">
                <span>No datasets loaded.</span>
                <button
                  type="button"
                  onClick={loadStarterData}
                  className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Load Starter Data</span>
                </button>
              </div>
            ) : (
              <span>No matching tables or columns found.</span>
            )}
          </div>
        ) : (
          filteredDatasets.map((ds) => {
            const isActive = ds.id === state.activeDatasetId;
            const isExpanded = expandedDatasets[ds.id] ?? true;
            const isEditing = editingDatasetId === ds.id;

            return (
              <div
                key={ds.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isActive
                    ? 'bg-[#0D1117] border-amber-500/40 shadow-lg shadow-black/40'
                    : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Dataset Item Header */}
                <div
                  onClick={() => dispatch({ type: 'SET_ACTIVE_DATASET', payload: ds.id })}
                  className="p-3 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(ds.id);
                      }}
                      className="p-0.5 text-slate-500 hover:text-slate-300 transition-colors"
                      title={isExpanded ? 'Collapse columns' : 'Expand columns'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <Table
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />

                    {isEditing ? (
                      <div className="flex items-center gap-1 min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(ds.id, e);
                            if (e.key === 'Escape') setEditingDatasetId(null);
                          }}
                          autoFocus
                          className="w-full px-2 py-0.5 rounded bg-black border border-amber-500/50 text-xs text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => handleSaveRename(ds.id, e)}
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelRename}
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
                          {ds.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {ds.rowCount.toLocaleString()} rows · {ds.colCount} cols
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleStartRename(ds, e)}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200"
                        title="Rename dataset"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDataset(ds.id);
                        }}
                        className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        title="Remove dataset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Column List (Collapsible) */}
                {isExpanded && (
                  <div className="px-3 pb-2 pt-1 border-t border-white/5 bg-black/20 flex flex-col gap-1 text-[11px] font-mono">
                    {ds.columns.map((col) => (
                      <div
                        key={col.id}
                        className="flex items-center justify-between py-0.5 px-2 rounded hover:bg-white/5 text-slate-300 transition-colors"
                        title={`${col.name} (${col.inferredType}) · ${col.distinctCount} unique values`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ColumnTypeIcon type={col.inferredType} />
                          <span className="truncate max-w-[130px]">{col.name}</span>
                          {col.isPotentialKey && (
                            <span title="Potential Primary Key">
                              <Key className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            </span>
                          )}

                        </div>
                        <span className="text-[9px] text-slate-500 uppercase">{col.inferredType}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer Buttons */}
      <div className="p-3 border-t border-white/10 bg-[#05070B] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: true })}
          className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload New Dataset</span>
        </button>

        {state.datasets.length === 0 && (
          <button
            type="button"
            onClick={loadStarterData}
            className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Load Sample Model</span>
          </button>
        )}
      </div>
    </aside>
  );
}
