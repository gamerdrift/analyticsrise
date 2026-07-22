"use client";
// app/excel-studio/components/Grid.tsx
import React from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';

const CELL_WIDTH = 100;
const CELL_HEIGHT = 30;

export default function Grid() {
  const { state, dispatch } = useExcelStudio();
  const { sheets, activeSheetId, selectedCell } = state;
  const sheet = sheets[activeSheetId];

  if (!sheet) return null;

  const cellKey = (row: number, col: number) => `${row},${col}`;

  const handleDoubleClick = (row: number, col: number) => {
    const address = { sheetId: activeSheetId, row, col };
    const existing = sheet.cells[cellKey(row, col)];
    const value = existing?.value ?? '';
    const newValue = prompt('Edit cell', String(value));
    if (newValue !== null) {
      dispatch({ type: 'UPDATE_CELL', payload: { address, value: isNaN(Number(newValue)) ? newValue : Number(newValue) } });
    }
  };

  const cols = Array.from({ length: sheet.cols }, (_, i) => i);
  const rows = Array.from({ length: sheet.rows }, (_, i) => i);

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 select-none" role="grid" aria-label="Spreadsheet grid">
      <div className="inline-block min-w-full">
        {/* Header Row */}
        <div className="flex sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
          <div style={{ width: 50, height: CELL_HEIGHT }} className="flex-none border-r border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800" />
          {cols.map((colIdx) => (
            <div
              key={colIdx}
              style={{ width: CELL_WIDTH, height: CELL_HEIGHT }}
              className="flex-none flex items-center justify-center font-bold text-xs border-r border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            >
              {String.fromCharCode(65 + colIdx)}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {rows.map((rowIdx) => (
          <div key={rowIdx} className="flex border-b border-gray-200 dark:border-gray-800">
            {/* Row Header */}
            <div
              style={{ width: 50, height: CELL_HEIGHT }}
              className="flex-none sticky left-0 z-10 flex items-center justify-center font-bold text-xs bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 text-gray-500"
            >
              {rowIdx + 1}
            </div>

            {/* Cells */}
            {cols.map((colIdx) => {
              const key = cellKey(rowIdx, colIdx);
              const cell = sheet.cells[key];
              const isSelected = selectedCell && selectedCell.row === rowIdx && selectedCell.col === colIdx && selectedCell.sheetId === activeSheetId;

              return (
                <div
                  key={colIdx}
                  style={{ width: CELL_WIDTH, height: CELL_HEIGHT }}
                  className={`flex-none flex items-center px-2 text-xs border-r border-gray-200 dark:border-gray-800 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis ${
                    isSelected ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onClick={() => dispatch({ type: 'SELECT_CELL', payload: { address: { sheetId: activeSheetId, row: rowIdx, col: colIdx } } })}
                  onDoubleClick={() => handleDoubleClick(rowIdx, colIdx)}
                  role="gridcell"
                  aria-colindex={colIdx + 1}
                  aria-rowindex={rowIdx + 1}
                >
                  {cell?.value ?? ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
