"use client";

import React from 'react';
import CurriculumMap from '@/app/sql-studio/components/curriculum/CurriculumMap';

export default function RightPanel() {
  return (
    <div className="flex flex-col h-full bg-[#080B12] overflow-hidden">
      {/* Top Header */}
      <div className="p-3 border-b border-white/10 bg-[#06080E] shrink-0">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          Learning Track Progression
        </h3>
      </div>

      {/* Curriculum View */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <CurriculumMap />
      </div>
    </div>
  );
}
