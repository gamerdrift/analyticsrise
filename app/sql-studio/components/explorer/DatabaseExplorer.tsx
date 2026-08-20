"use client";

import React, { useState } from 'react';
import { useSqlStudio } from '@/app/sql-studio/contexts/SqlStudioContext';
import { getDataset } from '@/lib/sql/datasets/registry';
import { getUpgradeContext } from '@/lib/entitlements/entitlements';
import UpgradePromptModal from '@/app/components/monetization/UpgradePromptModal';
import { Database, Table, Key, ChevronDown, ChevronRight, Hash, Type, Calendar, ToggleLeft, Upload, Sparkles } from 'lucide-react';

export default function DatabaseExplorer() {
  const { state, dispatch } = useSqlStudio();
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const dataset = getDataset(state.activeDatasetId) || getDataset('ecommerce');
  const customDatasetUpgradeContext = getUpgradeContext('sql.custom_datasets');

  if (!dataset) {
    return (
      <div className="p-3 text-slate-500 font-mono text-xs">
        Dataset unavailable.
      </div>
    );
  }

  const tableNames = Object.keys(dataset.database.tables);

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName) ? prev.filter((t) => t !== tableName) : [...prev, tableName]
    );
  };

  const handleInsertColumn = (colName: string) => {
    const currentQuery = state.editor.query;
    const newQuery = currentQuery.endsWith(' ') || currentQuery.endsWith(',') || currentQuery.length === 0
      ? `${currentQuery}${colName}`
      : `${currentQuery} ${colName}`;
    dispatch({ type: 'SET_QUERY', payload: newQuery });
  };

  const getTypeIcon = (type: string) => {
    const t = String(type || '').toUpperCase();
    if (t.includes('INT') || t.includes('DECIMAL') || t.includes('FLOAT') || t.includes('NUMERIC')) {
      return <Hash className="w-3 h-3 text-[#00E5FF]" />;
    }
    if (t.includes('DATE') || t.includes('TIME')) {
      return <Calendar className="w-3 h-3 text-amber-400" />;
    }
    if (t.includes('BOOL')) {
      return <ToggleLeft className="w-3 h-3 text-purple-400" />;
    }
    return <Type className="w-3 h-3 text-emerald-400" />;
  };

  return (
    <div className="space-y-3">
      {/* Dataset Header */}
      <div className="p-2.5 bg-[#090D16] border border-white/5 rounded-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <Database className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <div className="truncate">
            <div className="text-xs font-mono font-bold text-slate-200 truncate">
              {dataset.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {tableNames.length} tables • {dataset.estimatedRows} rows
            </div>
          </div>
        </div>
      </div>

      {/* Upload Custom Dataset Action (Freemium Value Trigger) */}
      <button
        type="button"
        onClick={() => setIsUpgradeModalOpen(true)}
        className="w-full p-2 rounded-lg bg-white/[0.03] hover:bg-[#00E5FF]/10 border border-white/10 hover:border-[#00E5FF]/40 text-slate-300 hover:text-[#00E5FF] text-[11px] font-mono flex items-center justify-between transition-all group"
      >
        <div className="flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00E5FF]" />
          <span>Upload Custom Dataset</span>
        </div>
        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 group-hover:bg-[#00E5FF]/20 text-slate-400 group-hover:text-[#00E5FF]">
          PRO
        </span>
      </button>

      {/* Upgrade Prompt Modal */}
      <UpgradePromptModal
        isOpen={isUpgradeModalOpen}
        context={customDatasetUpgradeContext}
        onClose={() => setIsUpgradeModalOpen(false)}
      />


      {/* Tables & Columns Tree */}
      <div className="space-y-1.5">
        {tableNames.map((tableName) => {
          const tableDef = dataset.database.tables[tableName];
          const isExpanded = expandedTables.includes(tableName);
          const columns = tableDef.columns || [];

          return (
            <div
              key={tableName}
              className="border border-white/5 bg-[#0A0E17] rounded-lg overflow-hidden"
            >
              {/* Table Row Header */}
              <button
                type="button"
                onClick={() => toggleTable(tableName)}
                className="w-full flex items-center justify-between p-2 text-left hover:bg-white/5 transition-colors text-xs font-mono text-slate-300"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <Table className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold truncate">{tableName}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {columns.length} cols
                </span>
              </button>

              {/* Columns List */}
              {isExpanded && (
                <div className="px-2 pb-2 pt-0 space-y-1 border-t border-white/5 bg-black/20">
                  {columns.map((colMeta) => {
                    const colName = colMeta.name;
                    return (
                      <button
                        key={colName}
                        type="button"
                        onClick={() => handleInsertColumn(colName)}
                        className="w-full flex items-center justify-between py-1 px-2 rounded hover:bg-white/10 text-left text-xs font-mono text-slate-400 hover:text-white transition-colors group"
                        title="Click to insert column into SQL editor"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {getTypeIcon(colMeta.type)}
                          <span className="truncate group-hover:text-[#00E5FF]">{colName}</span>
                          {colMeta.isPrimaryKey && (
                            <span title="Primary Key">
                              <Key className="w-2.5 h-2.5 text-amber-400" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-600 font-mono">
                          {colMeta.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
