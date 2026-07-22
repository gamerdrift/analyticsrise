'use client';

import React from 'react';
import { useContext } from 'react';
import { PythonLabContext } from '../../contexts/PythonLabContext';

export default function RightPanel() {
  const ctx = useContext(PythonLabContext);
  const { state } = ctx!;
  const mission = state?.mission;

  return (
    <div className="w-64 flex-shrink-0 bg-gray-900/60 backdrop-blur-lg border-l border-white/10 p-4 overflow-y-auto glass-panel">
      <h2 className="text-sm font-bold uppercase text-gray-400 mb-2">Results & Hints</h2>
      {/* Placeholder for validation feedback, hints, XP */}
      {mission && (
        <div className="space-y-2 text-xs text-gray-200">
          <p className="font-medium">XP Reward: {mission.xpReward}</p>
          <p>Complete the mission to earn XP.</p>
        </div>
      )}
    </div>
  );
}
