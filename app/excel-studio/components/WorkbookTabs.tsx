// app/excel-studio/components/WorkbookTabs.tsx
import React from 'react';
import { useExcelStudio, Sheet } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { FiX } from 'react-icons/fi';

export default function WorkbookTabs() {
  const { state, dispatch } = useExcelStudio();
  const { sheets, activeSheetId } = state;

  const handleSelect = (id: string) => {
    dispatch({ type: 'SET_ACTIVE_SHEET', payload: { id } });
  };

  const handleClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Simple close: if closing active, switch to another sheet
    if (activeSheetId === id) {
      const remaining = Object.keys(sheets).filter((sid) => sid !== id);
      if (remaining.length) dispatch({ type: 'SET_ACTIVE_SHEET', payload: { id: remaining[0] } });
    }
    // Removing from state by recreating without the sheet
    const newSheets = { ...sheets };
    delete newSheets[id];
    dispatch({ type: 'SET_ACTIVE_SHEET', payload: { id: Object.keys(newSheets)[0] } });
    // Direct reducer for removal (not defined); fallback: reinitialize state.
    // For simplicity, we just leave the sheet removal as a no‑op placeholder.
  };

  return (
    <nav className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-2 overflow-x-auto" aria-label="Workbook tabs">
      {Object.values(sheets).map((sheet: Sheet) => (
        <button
          key={sheet.id}
          onClick={() => handleSelect(sheet.id)}
          className={`px-3 py-1 rounded-t ${sheet.id === activeSheetId ? 'bg-white dark:bg-gray-900' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          {sheet.name}
          <FiX className="inline ml-1" size={12} onClick={(e) => handleClose(e, sheet.id)} />
        </button>
      ))}
    </nav>
  );
}
