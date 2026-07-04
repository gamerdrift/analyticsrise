import React, { useContext } from 'react';
import { PythonLabContext } from '../../contexts/PythonLabContext';

export default function LeftPanel() {
  const ctx = useContext(PythonLabContext);
  const state = ctx?.state;
  const mission = state?.mission;

  return (
    <div className="w-64 flex-shrink-0 bg-gray-900/60 backdrop-blur-lg border-r border-white/10 p-4 overflow-y-auto glass-panel">
      <h2 className="text-sm font-bold uppercase text-gray-400 mb-2">Mission</h2>
      {mission ? (
        <div className="space-y-2 text-xs text-gray-200">
          <p className="font-medium">{mission.title}</p>
          <p>{mission.description}</p>
        </div>
      ) : (
        <p className="text-gray-500">No mission loaded</p>
      )}
      <hr className="border-gray-700 my-4" />
      <h3 className="text-sm font-bold uppercase text-gray-400 mb-2">Variables</h3>
      <ul className="text-xs text-gray-300 space-y-1">
        {state?.cells
          .filter((c) => c.output)
          .map((c) => (
            <li key={c.id}>Cell {c.id}</li>
          ))}
      </ul>
    </div>
  );
}
