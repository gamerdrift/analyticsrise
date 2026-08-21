'use client';

import React, { useState } from 'react';
import { Dataset, InferredColumnType } from '@/lib/powerbi/workspace/types';
import { ChevronLeft, ChevronRight, Hash, Type, Calendar, ToggleLeft, Key } from 'lucide-react';

interface DatasetTableProps {
  dataset: Dataset;
}

function ColumnTypeBadge({ type }: { type: InferredColumnType }) {
  switch (type) {
    case 'INTEGER':
      return (
        <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono font-bold flex items-center gap-1">
          <Hash className="w-2.5 h-2.5" />
          INT
        </span>
      );
    case 'DECIMAL':
      return (
        <span className="px-1.5 py-0.2 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[9px] font-mono font-bold flex items-center gap-1">
          <Hash className="w-2.5 h-2.5" />
          DEC
        </span>
      );
    case 'DATE':
    case 'DATETIME':
      return (
        <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5" />
          {type}
        </span>
      );
    case 'BOOLEAN':
      return (
        <span className="px-1.5 py-0.2 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[9px] font-mono font-bold flex items-center gap-1">
          <ToggleLeft className="w-2.5 h-2.5" />
          BOOL
        </span>
      );
    default:
      return (
        <span className="px-1.5 py-0.2 rounded bg-slate-500/10 border border-slate-500/30 text-slate-400 text-[9px] font-mono font-bold flex items-center gap-1">
          <Type className="w-2.5 h-2.5" />
          TEXT
        </span>
      );
  }
}

export default function DatasetTable({ dataset }: DatasetTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const totalPages = Math.ceil(dataset.rowCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentRows = dataset.rows.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#05070B]">
      {/* Table Container */}
      <div className="flex-1 overflow-auto border-b border-white/10">
        <table className="w-full text-left border-collapse font-mono text-xs">
          {/* Header */}
          <thead className="sticky top-0 z-10 bg-[#0A0E17] border-b border-[#1E293B] shadow-sm">
            <tr>
              <th className="w-12 py-2.5 px-3 text-[10px] text-slate-500 font-bold border-r border-[#1E293B] text-center shrink-0">
                #
              </th>
              {dataset.columns.map((col) => (
                <th
                  key={col.id}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-200 border-r border-[#1E293B] whitespace-nowrap min-w-[140px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="truncate">{col.name}</span>
                      {col.isPotentialKey && (
                        <span title="Potential Key">
                          <Key className="w-3 h-3 text-amber-400 shrink-0" />
                        </span>
                      )}

                    </div>
                    <ColumnTypeBadge type={col.inferredType} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-white/5">
            {currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={dataset.headers.length + 1}
                  className="py-12 text-center text-slate-500 font-sans"
                >
                  This dataset has no rows.
                </td>
              </tr>
            ) : (
              currentRows.map((row, rowIdx) => {
                const globalRowIdx = startIndex + rowIdx + 1;
                return (
                  <tr
                    key={`row_${globalRowIdx}`}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-2 px-3 text-[10px] text-slate-600 font-mono border-r border-white/5 text-center bg-black/20">
                      {globalRowIdx}
                    </td>
                    {dataset.columns.map((col, colIdx) => {
                      const val = row[colIdx];
                      const isNull = val === null || val === undefined;
                      const isNumber = typeof val === 'number';

                      return (
                        <td
                          key={`cell_${rowIdx}_${colIdx}`}
                          className={`py-2 px-4 border-r border-white/5 whitespace-nowrap ${
                            isNumber ? 'text-right' : 'text-left'
                          }`}
                        >
                          {isNull ? (
                            <span className="text-slate-600 italic text-[10px]">null</span>
                          ) : typeof val === 'boolean' ? (
                            <span className={val ? 'text-purple-400' : 'text-slate-400'}>
                              {val ? 'TRUE' : 'FALSE'}
                            </span>
                          ) : isNumber ? (
                            <span className="text-slate-200">
                              {val.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                            </span>
                          ) : (
                            <span className="text-slate-300">{String(val)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {dataset.rowCount > pageSize && (
        <div className="h-11 px-4 border-t border-white/10 bg-[#080C14] flex items-center justify-between shrink-0 text-xs font-mono text-slate-400">
          <span>
            Showing <strong>{startIndex + 1}</strong> – <strong>{Math.min(startIndex + pageSize, dataset.rowCount)}</strong> of <strong>{dataset.rowCount.toLocaleString()}</strong> rows
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 text-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 text-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
