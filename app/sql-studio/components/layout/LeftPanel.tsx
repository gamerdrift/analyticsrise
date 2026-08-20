"use client";

import React, { useState } from 'react';
import MissionPanel from '@/app/sql-studio/components/mission/MissionPanel';
import DatabaseExplorer from '@/app/sql-studio/components/explorer/DatabaseExplorer';
import { Target, Database } from 'lucide-react';

export default function LeftPanel() {
  const [activeTab, setActiveTab] = useState<'mission' | 'schema'>('mission');

  return (
    <div className="flex flex-col h-full bg-[#080B12] overflow-hidden">
      {/* Top Tabs */}
      <div className="flex border-b border-white/10 shrink-0 bg-[#06080E]">
        <button
          type="button"
          onClick={() => setActiveTab('mission')}
          className={`flex-1 py-2.5 px-3 text-xs font-mono font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'mission'
              ? 'border-[#00E5FF] text-[#00E5FF] bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          Challenge
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`flex-1 py-2.5 px-3 text-xs font-mono font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'schema'
              ? 'border-[#00E5FF] text-[#00E5FF] bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          Schema
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'mission' ? <MissionPanel /> : <DatabaseExplorer />}
      </div>
    </div>
  );
}
