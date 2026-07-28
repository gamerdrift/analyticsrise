'use client';

import React, { useState } from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { colIndexToLetter, parseCellReference } from '@/lib/utils/excel/formulaEvaluator';

export default function NameBox() {
  const { state, dispatch } = useExcelStudio();
  const { selectedCell, selectionRange, activeSheetId } = state;

  const getDisplayAddress = () => {
    if (selectionRange) {
      const start = `${colIndexToLetter(selectionRange.startCol)}${selectionRange.startRow + 1}`;
      const end = `${colIndexToLetter(selectionRange.endCol)}${selectionRange.endRow + 1}`;
      return `${start}:${end}`;
    }
    if (selectedCell) {
      return `${colIndexToLetter(selectedCell.col)}${selectedCell.row + 1}`;
    }
    return 'A1';
  };

  const [inputVal, setInputVal] = useState(getDisplayAddress());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const ref = parseCellReference(inputVal);
      if (ref) {
        dispatch({
          type: 'SELECT_CELL',
          payload: { address: { sheetId: activeSheetId, row: ref.row, col: ref.col } },
        });
      }
    }
  };

  return (
    <div className="w-24 bg-[#05070B] border border-white/10 rounded-lg px-2.5 py-1 text-center font-mono text-xs font-bold text-[#00E5FF]">
      <input
        type="text"
        value={selectedCell || selectionRange ? getDisplayAddress() : inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent text-center focus:outline-none"
        aria-label="Active cell address box"
      />
    </div>
  );
}
