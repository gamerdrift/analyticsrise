// app/excel-studio/components/NameBox.tsx
import React from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';

export default function NameBox() {
  const { state } = useExcelStudio();
  const { selectedCell } = state;

  const getColumnLetter = (col: number) => String.fromCharCode(65 + col);
  const address = selectedCell ? `${getColumnLetter(selectedCell.col)}${selectedCell.row + 1}` : '';

  return (
    <div className="w-24 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" aria-label="Cell address">
      {address}
    </div>
  );
}
