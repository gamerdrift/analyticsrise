"use client";

import React, { useState } from 'react';
import { useSqlWorkspace } from '../../contexts/SqlWorkspaceContext';
import { formatQueryResultAsCsv, downloadCsvFile } from '@/lib/sql/workspace/exporter';
import { AnalyticsService } from '@/lib/services/analytics';
import { WORKSPACE_LIMITS } from '@/lib/sql/workspace/limits';
import { Download, CheckCircle2, Clock, Database, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

export default function WorkspaceResults() {
  const { state } = useSqlWorkspace();
  const { results, isExecuting } = state;
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 50;

  const limits = WORKSPACE_LIMITS[state.userTier] || WORKSPACE_LIMITS.free;

  const handleExportCsv = () => {
    if (!results || results.rows.length === 0) return;
    const csvContent = formatQueryResultAsCsv(results, limits.maxExportRows);
    const fileName = `${state.parsedDataset?.tableName || 'query'}_results_${Date.now()}.csv`;
    downloadCsvFile(csvContent, fileName);
    AnalyticsService.logWorkspaceExported(Math.min(results.rows.length, limits.maxExportRows));
  };

  if (isExecuting) {
    return (
      <div className="h-full min-h-[220px] bg-[#07090E] border border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin mb-3" />
        <span>Evaluating SQL query in-browser engine...</span>
      </div>
    );
  }

  const columns = results.columns || [];
  const rows = results.rows || [];
  const totalRows = results.rowCount ?? rows.length;
  const executionMs = results.executionMs;

  if (columns.length === 0 && rows.length === 0) {
    return (
      <div className="h-full min-h-[220px] bg-[#07090E] border border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-500 font-mono text-xs p-6 text-center">
        <Database className="w-8 h-8 text-slate-700 mb-2" />
        <span className="text-slate-400 font-bold mb-1">Results Console Ready</span>
        <span>Run your query or select a blueprint on the left to see output data.</span>
      </div>
    );
  }

  const totalPages = Math.ceil(rows.length / pageSize);
  const paginatedRows = rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="flex flex-col h-full bg-[#07090E] border border-white/10 rounded-xl overflow-hidden shadow-lg">
      {/* Results Header / Telemetry */}
      <div className="h-11 bg-[#0A0E18] border-b border-white/10 flex items-center justify-between px-3 md:px-4 shrink-0 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{totalRows.toLocaleString()} {totalRows === 1 ? 'row' : 'rows'}</span>
          </span>

          {executionMs !== undefined && (
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-[#00E5FF]" />
              <span>{executionMs.toFixed(1)} ms</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={totalRows === 0}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00E5FF]/15 border border-white/10 hover:border-[#00E5FF]/40 text-slate-200 hover:text-[#00E5FF] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Results Table Area */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-[#05070B]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-[#0A0D16] border-b border-white/10 sticky top-0 z-10">
              <th className="py-2.5 px-3 text-[10px] uppercase text-slate-500 font-bold w-12 text-right border-r border-white/5">
                #
              </th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="py-2.5 px-3 text-[10px] uppercase text-slate-300 font-bold tracking-wider whitespace-nowrap border-r border-white/5 last:border-r-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, rIdx) => {
              const actualRowIndex = currentPage * pageSize + rIdx + 1;
              return (
                <tr
                  key={rIdx}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="py-2 px-3 text-slate-600 text-right font-mono border-r border-white/5 select-none text-[11px]">
                    {actualRowIndex}
                  </td>
                  {columns.map((_, cIdx) => {
                    const val = row[cIdx];
                    const isNull = val === null || val === undefined;
                    return (
                      <td
                        key={cIdx}
                        className={`py-2 px-3 border-r border-white/5 last:border-r-0 whitespace-nowrap text-[11px] ${
                          isNull
                            ? 'text-slate-600 italic'
                            : typeof val === 'number'
                            ? 'text-[#00E5FF]'
                            : typeof val === 'boolean'
                            ? 'text-purple-400'
                            : 'text-slate-200'
                        }`}
                      >
                        {isNull ? 'NULL' : String(val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="h-10 bg-[#080C14] border-t border-white/10 flex items-center justify-between px-4 text-xs font-mono text-slate-400 shrink-0">
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
