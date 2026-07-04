// app/excel-studio/components/Toolbar.tsx
import React from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { FiSave, FiUpload, FiDownload, FiUndo, FiRedo } from 'react-icons/fi';

export default function Toolbar() {
  const { dispatch } = useExcelStudio();

  const handleNew = () => {
    const id = `sheet${Date.now()}`;
    dispatch({ type: 'ADD_SHEET', payload: { id, name: `Sheet ${Object.keys(id).length + 1}` } });
  };

  // Placeholder handlers – actual implementation can be expanded
  const handleSave = () => console.log('Save workbook');
  const handleUndo = () => console.log('Undo');
  const handleRedo = () => console.log('Redo');

  return (
    <header className="flex items-center bg-gray-200 dark:bg-gray-800 p-2 space-x-2">
      <button onClick={handleNew} className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded">
        New Sheet
      </button>
      <button onClick={handleSave} className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded" aria-label="Save">
        <FiSave size={18} />
      </button>
      <button onClick={handleUndo} className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded" aria-label="Undo">
        <FiUndo size={18} />
      </button>
      <button onClick={handleRedo} className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded" aria-label="Redo">
        <FiRedo size={18} />
      </button>
    </header>
  );
}
