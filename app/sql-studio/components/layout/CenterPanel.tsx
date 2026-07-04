import React from 'react';
import SqlEditor from '@/app/sql-studio/components/editor/SqlEditor';
import { useSqlStudio } from '@/app/sql-studio/contexts/SqlStudioContext';

export default function CenterPanel() {
  const { state, dispatch } = useSqlStudio();

  const runQuery = async () => {
    if (!state.editor.query.trim()) return;
    dispatch({ type: 'SET_STATUS', payload: { autosave: 'saving' } });
    // Placeholder: call sqlEngine service (to be implemented)
    // For now we just simulate a delay
    const start = performance.now();
    setTimeout(() => {
      const fakeRows = [];
      dispatch({ type: 'SET_RESULTS', payload: { rows: fakeRows, columns: [], validation: { passed: true, hints: [] } } });
      dispatch({ type: 'SET_STATUS', payload: { autosave: 'saved', execTimeMs: performance.now() - start, returnedRows: fakeRows.length } });
    }, 300);
  };

  const resetQuery = () => {
    dispatch({ type: 'SET_QUERY', payload: '' });
    dispatch({ type: 'SET_RESULTS', payload: { rows: [], columns: [], validation: { passed: false, hints: [] } } });
  };

  const formatQuery = () => {
    // Future: integrate sql-formatter library
    // For now, just trim whitespace
    const formatted = state.editor.query.replace(/\s+/g, ' ').trim();
    dispatch({ type: 'SET_QUERY', payload: formatted });
  };

  return (
    <div className="p-4 flex flex-col h-full gap-2">
      <div className="flex gap-2 mb-2">
        <button onClick={runQuery} className="px-4 py-1 bg-[#00E5FF] hover:bg-[#00B8CC] text-black rounded transition-colors">
          Run Query
        </button>
        <button onClick={resetQuery} className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
          Reset Query
        </button>
        <button onClick={formatQuery} className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
          Format Query
        </button>
      </div>
      <SqlEditor />
    </div>
  );
}
