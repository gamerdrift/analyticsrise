'use client';

import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/app/components/forms/FormControls';
import { Pagination } from '@/app/components/navigation/NavControls';

// Column descriptor for our tables
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  rowsPerPage?: number;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchKey,
  rowsPerPage = 5,
  className,
}: TableProps<T>) {
  // States
  const [filterText, setFilterText] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  // Filter items
  const filteredData = useMemo(() => {
    if (!filterText || !searchKey) return data;
    return data.filter((row) => {
      const val = row[searchKey as string];
      return String(val).toLowerCase().includes(filterText.toLowerCase());
    });
  }, [data, filterText, searchKey]);

  // Sort items
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const valA = a[sortKey as string];
      const valB = b[sortKey as string];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      
      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortKey, sortDirection]);

  // Paginated items
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const totalPages = Math.max(Math.ceil(sortedData.length / rowsPerPage), 1);

  const handleRequestSort = (key: keyof T | string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setPage(1);
  };

  return (
    <div className={twMerge('space-y-4 w-full', className)}>
      {/* Table Action/Filter Row */}
      {searchKey && (
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Input
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-10"
            />
            <Search className="absolute bottom-3.5 left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Render Data Table grid */}
      <div className="overflow-x-auto rounded border border-slate-800 bg-[#0D1117]/60 backdrop-blur-md">
        <table className="w-full text-left font-mono text-xs text-slate-300">
          <thead className="bg-[#05070B] text-slate-500 uppercase text-[9px] tracking-widest border-b border-slate-800">
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key as string}
                    scope="col"
                    className={clsx(
                      'p-4 font-bold select-none',
                      col.sortable && 'cursor-pointer hover:text-white transition-colors'
                    )}
                    onClick={() => col.sortable && handleRequestSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="shrink-0" aria-hidden="true">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3 h-3 text-[#00E5FF]" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-[#00E5FF]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-slate-700" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                  {columns.map((col) => {
                    const value = row[col.key as string];
                    return (
                      <td key={col.key as string} className="p-4 leading-normal">
                        {col.render ? col.render(row) : String(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-500 uppercase tracking-widest text-[10px]">
                  No matching records discovered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component controls */}
      {totalPages > 1 && (
        <div className="pt-4 flex justify-end">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
