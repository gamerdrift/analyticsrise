import React from 'react';
import { useContext } from 'react';
import { PythonLabContext } from '../../contexts/PythonLabContext';

export default function StatusBar() {
  const ctx = useContext(PythonLabContext);
  const { state } = ctx!;
  const { autosave, xp } = state;

  return (
    <div className="h-10 flex items-center justify-between px-4 bg-gray-800/60 border-t border-white/10 text-xs text-gray-300">
      <span>Autosave: {autosave ? 'On' : 'Off'}</span>
      <span>XP: {xp}</span>
      {/* Additional stats like execution time, rows, mission progress can be added later */}
    </div>
  );
}
