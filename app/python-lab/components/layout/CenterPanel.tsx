"use client";
import React, { useContext, useState, useEffect } from 'react';
import { PythonLabContext } from '../../contexts/PythonLabContext';
import { v4 as uuidv4 } from 'uuid';
import { executeCell } from '../../services/pythonEngine';

export default function CenterPanel() {
  const ctx = useContext(PythonLabContext);
  const { state, dispatch } = ctx!;

  // Ensure at least one cell exists
  useEffect(() => {
    if (state.cells.length === 0) {
      const newCell = { id: uuidv4(), code: '# Write your Python code here', executing: false };
      dispatch({ type: 'ADD_CELL', payload: newCell });
    }
  }, []);

  const handleRun = async (cellId: string, code: string) => {
    dispatch({ type: 'SET_CELL_EXECUTING', payload: { id: cellId, executing: true } });
    try {
      const output = await executeCell(code);
      dispatch({ type: 'SET_CELL_OUTPUT', payload: { id: cellId, output } });
    } catch (e: any) {
      dispatch({ type: 'SET_CELL_ERROR', payload: { id: cellId, error: e.message } });
    } finally {
      dispatch({ type: 'SET_CELL_EXECUTING', payload: { id: cellId, executing: false } });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 glass-panel">
      {state.cells.map((cell) => (
        <div key={cell.id} className="mb-6">
          <textarea
            className="w-full h-32 p-2 bg-gray-800 text-gray-100 font-mono rounded" 
            value={cell.code}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_CELL_CODE', payload: { id: cell.id, code: e.target.value } })
            }
          />
          <div className="flex items-center mt-2 space-x-2">
            <button
              onClick={() => handleRun(cell.id, cell.code)}
              disabled={cell.executing}
              className="px-4 py-1 bg-[#00E5FF] text-black rounded hover:bg-[#00B8CC] disabled:opacity-50"
            >
              {cell.executing ? 'Running...' : 'Run'}
            </button>
            {cell.output && (
              <pre className="bg-gray-900 text-green-400 p-2 rounded flex-1 overflow-auto">
                {cell.output}
              </pre>
            )}
            {cell.error && (
              <pre className="bg-gray-900 text-red-400 p-2 rounded flex-1 overflow-auto">
                {cell.error}
              </pre>
            )}
          </div>
        </div>
      ))}
      {/* Add new cell button */}
      <button
        onClick={() => {
          const newCell = { id: uuidv4(), code: '# New cell', executing: false };
          dispatch({ type: 'ADD_CELL', payload: newCell });
        }}
        className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
      >
        + Add Cell
      </button>
    </div>
  );
}
