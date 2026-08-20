"use client";

import React from 'react';
import { ColumnProfile, DatasetQualityReport } from '@/lib/sql/workspace/types';
import { Hash, Type, Calendar, ToggleLeft, AlertTriangle, CheckCircle2, FileText, Database } from 'lucide-react';

interface DatasetProfileCardProps {
  profiles: ColumnProfile[];
  qualityReport: DatasetQualityReport;
}

export default function DatasetProfileCard({ profiles, qualityReport }: DatasetProfileCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INTEGER':
      case 'DECIMAL':
        return <Hash className="w-3.5 h-3.5 text-[#00E5FF]" />;
      case 'BOOLEAN':
        return <ToggleLeft className="w-3.5 h-3.5 text-purple-400" />;
      case 'DATE':
      case 'DATETIME':
        return <Calendar className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Type className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'INTEGER':
      case 'DECIMAL':
        return 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30';
      case 'BOOLEAN':
        return 'bg-purple-950/50 text-purple-400 border-purple-500/30';
      case 'DATE':
      case 'DATETIME':
        return 'bg-amber-950/50 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Dataset Summary Overview */}
      <div className="p-4 bg-[#080C14] border border-white/10 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Dataset Profile: {qualityReport.fileName}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Delimiter: &quot;{qualityReport.delimiter}&quot;
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="bg-[#05070B] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Rows</span>
            <span className="text-base font-bold font-mono text-white">
              {qualityReport.rowCount.toLocaleString()}
            </span>
          </div>
          <div className="bg-[#05070B] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Columns</span>
            <span className="text-base font-bold font-mono text-[#00E5FF]">
              {qualityReport.columnCount}
            </span>
          </div>
          <div className="bg-[#05070B] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Empty Values</span>
            <span className={`text-base font-bold font-mono ${qualityReport.emptyValueCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {qualityReport.emptyValueCount.toLocaleString()}
            </span>
          </div>
          <div className="bg-[#05070B] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">File Size</span>
            <span className="text-base font-bold font-mono text-slate-300">
              {(qualityReport.fileSizeBytes / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>

        {/* Quality Alerts */}
        {qualityReport.duplicateHeaders.length > 0 && (
          <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Duplicate headers automatically renamed: {qualityReport.duplicateHeaders.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Column Details Grid */}
      <div className="space-y-2 max-h-[450px] overflow-y-auto custom-scrollbar pr-1">
        {profiles.map((col, idx) => (
          <div
            key={idx}
            className="p-3 bg-[#080C14] border border-white/5 hover:border-white/15 rounded-xl space-y-2 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white">
                  {col.name}
                </span>
                {col.originalHeader !== col.name && (
                  <span className="text-[10px] font-mono text-slate-500">
                    (from &quot;{col.originalHeader}&quot;)
                  </span>
                )}
              </div>

              <div className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold flex items-center gap-1 ${getTypeBadgeClass(col.inferredType)}`}>
                {getTypeIcon(col.inferredType)}
                <span>{col.inferredType}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>Distinct: <strong className="text-white">{col.uniqueCount}</strong></span>
              <span>Missing: <strong className={col.nullCount > 0 ? 'text-amber-400' : 'text-slate-300'}>{col.nullCount} ({((col.nullCount / (col.totalCount || 1)) * 100).toFixed(0)}%)</strong></span>
              {col.numericStats && (
                <>
                  <span>Min: <strong className="text-emerald-400">{col.numericStats.min}</strong></span>
                  <span>Max: <strong className="text-emerald-400">{col.numericStats.max}</strong></span>
                  {col.numericStats.avg !== undefined && (
                    <span>Avg: <strong className="text-cyan-400">{col.numericStats.avg.toFixed(2)}</strong></span>
                  )}
                </>
              )}
            </div>

            {/* Sample Values */}
            {col.sampleValues.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase shrink-0">Sample:</span>
                {col.sampleValues.map((sample, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-1.5 py-0.5 bg-[#05070B] border border-white/5 rounded text-[10px] font-mono text-slate-300 shrink-0 truncate max-w-[120px]"
                  >
                    {sample}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
