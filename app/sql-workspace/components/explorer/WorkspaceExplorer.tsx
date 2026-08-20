"use client";

import React, { useState } from 'react';
import { useSqlWorkspace } from '../../contexts/SqlWorkspaceContext';
import { Database, Table, Key, ChevronDown, ChevronRight, Hash, Type, Calendar, ToggleLeft, Sparkles, Play, Upload } from 'lucide-react';

interface WorkspaceExplorerProps {
  onOpenUploadModal?: () => void;
}

export default function WorkspaceExplorer({ onOpenUploadModal }: WorkspaceExplorerProps) {
  const { state, dispatch } = useSqlWorkspace();
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  const dataset = state.parsedDataset;
  if (!dataset) {
    return (
      <div className="p-4 text-center text-slate-500 font-mono text-xs">
        No dataset loaded.
      </div>
    );
  }

  const tableName = dataset.tableName;
  const columns = dataset.profiles;

  const handleInsertColumn = (colName: string) => {
    const currentQuery = state.query;
    const newQuery =
      currentQuery.endsWith(' ') || currentQuery.endsWith(',') || currentQuery.length === 0
        ? `${currentQuery}${colName}`
        : `${currentQuery} ${colName}`;
    dispatch({ type: 'SET_QUERY', payload: newQuery });
  };

  const handleApplyTemplate = (templateSql: string) => {
    dispatch({ type: 'SET_QUERY', payload: templateSql });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INTEGER':
      case 'DECIMAL':
        return <Hash className="w-3 h-3 text-[#00E5FF]" />;
      case 'BOOLEAN':
        return <ToggleLeft className="w-3 h-3 text-purple-400" />;
      case 'DATE':
      case 'DATETIME':
        return <Calendar className="w-3 h-3 text-amber-400" />;
      default:
        return <Type className="w-3 h-3 text-emerald-400" />;
    }
  };

  // Generate starter queries based on the table
  const starterSelect = `SELECT *\nFROM ${tableName}\nLIMIT 10;`;
  const firstCol = columns[0]?.name || 'id';
  const numericCol = columns.find((c) => c.inferredType === 'INTEGER' || c.inferredType === 'DECIMAL')?.name;
  const categoryCol = columns.find((c) => c.inferredType === 'TEXT' && c.name !== firstCol)?.name || columns[1]?.name || firstCol;

  const starterAggregate = numericCol
    ? `SELECT ${categoryCol}, COUNT(*) AS total_count, AVG(${numericCol}) AS avg_metric\nFROM ${tableName}\nGROUP BY ${categoryCol}\nORDER BY avg_metric DESC;`
    : `SELECT ${categoryCol}, COUNT(*) AS total_count\nFROM ${tableName}\nGROUP BY ${categoryCol}\nORDER BY total_count DESC;`;

  return (
    <div className="space-y-4 p-3 font-mono text-xs">
      {/* Table Item */}
      <div className="bg-[#080C14] border border-white/10 rounded-xl overflow-hidden">
        <div
          onClick={() => setIsTableExpanded(!isTableExpanded)}
          className="p-3 bg-[#0C101A] flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors select-none"
        >
          <div className="flex items-center gap-2 truncate">
            {isTableExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <Table className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
            <span className="font-bold text-white truncate">{tableName}</span>
          </div>

          <span className="text-[10px] text-slate-500 shrink-0">
            {dataset.rows.length.toLocaleString()} rows
          </span>
        </div>

        {isTableExpanded && (
          <div className="p-2 space-y-1 bg-[#06080E] border-t border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
            {columns.map((col) => (
              <button
                key={col.name}
                type="button"
                onClick={() => handleInsertColumn(col.name)}
                className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-slate-300 hover:text-white transition-colors group"
                title={`Click to insert "${col.name}" into editor`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getTypeIcon(col.inferredType)}
                  <span className="truncate group-hover:text-[#00E5FF]">{col.name}</span>
                </div>
                <span className="text-[9px] text-slate-500 uppercase">{col.inferredType}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Query Blueprints / Starters */}
      <div className="p-3 bg-[#080C14] border border-white/10 rounded-xl space-y-2">
        <span className="text-[10px] uppercase text-slate-400 font-bold block tracking-wider">
          Starter Query Blueprints:
        </span>

        <button
          type="button"
          onClick={() => handleApplyTemplate(starterSelect)}
          className="w-full text-left p-2 rounded-lg bg-white/[0.03] hover:bg-[#00E5FF]/10 border border-white/5 hover:border-[#00E5FF]/30 text-slate-300 hover:text-[#00E5FF] transition-all flex items-center justify-between"
        >
          <span className="truncate">1. Preview Top 10 Rows</span>
          <Play className="w-3 h-3 text-[#00E5FF]" />
        </button>

        <button
          type="button"
          onClick={() => handleApplyTemplate(starterAggregate)}
          className="w-full text-left p-2 rounded-lg bg-white/[0.03] hover:bg-[#00E5FF]/10 border border-white/5 hover:border-[#00E5FF]/30 text-slate-300 hover:text-[#00E5FF] transition-all flex items-center justify-between"
        >
          <span className="truncate">2. Group By & Summary</span>
          <Play className="w-3 h-3 text-[#00E5FF]" />
        </button>
      </div>

      {/* Upload New CSV Action */}
      {onOpenUploadModal && (
        <button
          type="button"
          onClick={onOpenUploadModal}
          className="w-full p-2.5 rounded-xl border border-white/10 hover:border-[#00E5FF]/40 bg-white/5 hover:bg-[#00E5FF]/10 text-slate-300 hover:text-[#00E5FF] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Another CSV</span>
        </button>
      )}
    </div>
  );
}
