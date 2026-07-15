"use client";
// app/excel-studio/components/FormulaBar.tsx
import React, { useState, useEffect } from 'react';
import { useExcelStudio, CellAddress } from '@/app/excel-studio/contexts/ExcelStudioContext';

export default function FormulaBar() {
  const { state, dispatch } = useExcelStudio();
  const { selectedCell, sheets, activeSheetId } = state;
  const sheet = sheets[activeSheetId];

  const cell = selectedCell ? sheet.cells[`${selectedCell.row},${selectedCell.col}`] : null;
  const [input, setInput] = useState<string>(cell?.formula ?? cell?.value?.toString() ?? '');

  useEffect(() => {
    if (cell) {
      setInput(cell.formula ?? cell.value?.toString() ?? '');
    }
  }, [cell]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedCell) {
      const address: CellAddress = { ...selectedCell };
      const isFormula = input.startsWith('=');
      const formula = isFormula ? input.slice(1) : undefined;
      const value = isFormula ? '' : isNaN(Number(input)) ? input : Number(input);
      dispatch({ type: 'UPDATE_CELL', payload: { address, value, formula } });
    }
  };

  return (
    <input
      type="text"
      className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      placeholder="Enter value or formula (e.g., =SUM(A1:A5))"
      value={input}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      aria-label="Formula bar"
    />
  );
}
