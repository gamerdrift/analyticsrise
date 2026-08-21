'use client';

import React from 'react';
import { Terminal, AlertCircle, FileCode, Database, FileSpreadsheet, Table, ShieldCheck, CheckSquare } from 'lucide-react';
import { AiEvaContext } from '@/lib/ai/eva/types';

interface AiEvaContextBadgeProps {
  context?: AiEvaContext;
  className?: string;
}

export function AiEvaContextBadge({ context, className = '' }: AiEvaContextBadgeProps) {
  if (!context) return null;

  const isExcel = context.product === 'excel-workspace' || context.product === 'excel-studio';
  const excel = context.excelContext;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 text-[10px] font-mono ${className}`}>
      {/* Product Tag */}
      <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] font-bold flex items-center gap-1">
        {isExcel ? (
          <>
            <FileSpreadsheet className="w-2.5 h-2.5" />
            <span>Excel Workspace</span>
          </>
        ) : (
          <>
            <Terminal className="w-2.5 h-2.5" />
            <span>{context.product === 'sql-studio' ? 'SQL Studio' : context.product}</span>
          </>
        )}
      </span>

      {/* SQL Specific: Schema / Table Tag */}
      {!isExcel && context.activeSchema && (
        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">
          <Database className="w-2.5 h-2.5 text-slate-400" />
          {context.activeSchema}
          {context.activeTable ? `.${context.activeTable}` : ''}
        </span>
      )}

      {/* SQL Specific: Error Attached */}
      {!isExcel && context.sqlError && (
        <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
          Error Attached
        </span>
      )}

      {/* SQL Specific: Query Attached */}
      {!isExcel && context.currentQuery && (
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
          <FileCode className="w-2.5 h-2.5 text-emerald-400" />
          Editor Query Attached
        </span>
      )}

      {/* Excel Specific: Workbook & Sheet */}
      {isExcel && excel && (
        <>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1 truncate max-w-[140px]" title={excel.workbookName}>
            <FileSpreadsheet className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <span className="truncate">{excel.workbookName}</span>
          </span>

          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">
            <Table className="w-2.5 h-2.5 text-slate-400" />
            {excel.activeSheetName}
          </span>

          {excel.activeFormula?.cellAddress && (
            <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] font-bold flex items-center gap-1">
              Cell: {excel.activeFormula.cellAddress}
            </span>
          )}

          {excel.activeFormula?.errorState && (
            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
              {excel.activeFormula.errorState}
            </span>
          )}

          {excel.activeFormula?.formulaText && !excel.activeFormula.errorState && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
              <FileCode className="w-2.5 h-2.5 text-emerald-400" />
              Formula Attached
            </span>
          )}

          {excel.approvedSample?.userApproved && (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1">
              <CheckSquare className="w-2.5 h-2.5 text-amber-400" />
              Sample: {excel.approvedSample.cellRange}
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default AiEvaContextBadge;
