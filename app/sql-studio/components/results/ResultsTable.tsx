"use client";

import React, { useState } from 'react';
import { useSqlStudio } from '@/app/sql-studio/contexts/SqlStudioContext';
import { AlertCircle, Clock, Database, CheckCircle2 } from 'lucide-react';

export default function ResultsTable() {
  const { state } = useSqlStudio();
  const { results, isExecuting, executionError } = state;
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 50;

  if (isExecuting) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-[#07090E] border border-white/5 rounded-lg p-6 text-slate-400">
        <div className="w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-mono text-slate-300">Executing SQL query in-browser engine...</span>
      </div>
    );
  }

  if (executionError) {
    return (
      <div className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 font-mono text-xs rounded-lg flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <div className="font-bold text-rose-400 uppercase tracking-wide">SQL Execution Error</div>
          <div className="text-slate-300">{executionError}</div>
        </div>
      </div>
    );
  }

  const columns = results.columns || [];
  const rows = results.rows || [];
  const totalRows = results.rowCount ?? rows.length;
  const executionMs = results.executionMs;

  if (columns.length === 0 && rows.length === 0) {
    return (
      <div className="h-44 flex flex-col items-center justify-center text-slate-500 bg-[#07090E] border border-white/5 rounded-lg gap-2">
        <Database className="w-8 h-8 text-slate-700" />
        <span className="text-xs font-mono">Console Idle. Click &quot;Run Query&quot; (Ctrl+Enter) to preview dataset output.</span>
      </div>
    );
  }

  const paginatedRows = rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const totalPages = Math.ceil(rows.length / pageSize);

  return (
    <div className="bg-[#07090E] border border-white/10 rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header telemetry */}
      <div className="h-9 bg-[#0C0F16] border-b border-white/10 flex items-center justify-between px-4 text-xs font-mono text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
          </span>
          <span>
            {totalRows} {totalRows === 1 ? 'row' : 'rows'} returned
          </span>
        </div>
        {executionMs !== undefined && (
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-[#00E5FF]" />
            <span>{executionMs.toFixed(1)} ms</span>
          </div>
        )}
      </div>

      {/* Table Matrix */}
      <div className="flex-1 overflow-auto max-h-72">
        <table className="w-full text-left font-mono text-xs text-slate-300 border-collapse">
          <thead className="sticky top-0 bg-[#0F1420] border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider z-10">
            <tr>
              <th className="py-2 px-3 border-r border-white/5 w-12 text-center text-slate-600 font-normal">#</th>
              {columns.map((col, idx) => (
                <th key={idx} className="py-2 px-4 border-r border-white/5 font-bold text-slate-200">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-slate-500">
                  Query returned 0 rows.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 border-r border-white/5 text-center text-slate-600 text-[10px]">
                    {currentPage * pageSize + rIdx + 1}
                  </td>
                  {columns.map((col, cIdx) => {
                    const cellVal = Array.isArray(row) ? row[cIdx] : row[col];
                    const isNull = cellVal === null || cellVal === undefined;
                    return (
                      <td key={cIdx} className="py-2 px-4 border-r border-white/5 whitespace-nowrap">
                        {isNull ? (
                          <span className="text-slate-600 italic">NULL</span>
                        ) : typeof cellVal === 'boolean' ? (
                          <span className={cellVal ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {String(cellVal)}
                          </span>
                        ) : (
                          String(cellVal)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer if > 50 rows */}
      {totalPages > 1 && (
        <div className="h-8 bg-[#0C0F16] border-t border-white/10 flex items-center justify-between px-4 text-xs font-mono text-slate-400 shrink-0">
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              className="px-2 py-0.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded text-[10px]"
            >
              Prev
            </button>
            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              className="px-2 py-0.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded text-[10px]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
