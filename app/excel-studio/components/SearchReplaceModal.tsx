'use client';

import React, { useState } from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { Search, X, Replace, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchReplaceModal({ isOpen, onClose }: Props) {
  const { dispatch } = useExcelStudio();
  const [searchStr, setSearchStr] = useState('');
  const [replaceStr, setReplaceStr] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleReplaceNext = () => {
    if (!searchStr) return;
    dispatch({
      type: 'SEARCH_AND_REPLACE',
      payload: { searchStr, replaceStr, matchCase, replaceAll: false },
    });
    setStatusMsg(`Replaced match for "${searchStr}"`);
  };

  const handleReplaceAll = () => {
    if (!searchStr) return;
    dispatch({
      type: 'SEARCH_AND_REPLACE',
      payload: { searchStr, replaceStr, matchCase, replaceAll: true },
    });
    setStatusMsg(`Replaced all occurrences of "${searchStr}"`);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1117] border border-[#00E5FF]/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 font-mono text-xs text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Search className="w-5 h-5 text-[#00E5FF]" />
          <span className="font-bold text-sm uppercase tracking-wider text-[#00E5FF]">Search & Replace</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-slate-400 mb-1">Find what:</label>
            <input
              type="text"
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value)}
              placeholder="e.g. Enterprise"
              className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Replace with:</label>
            <input
              type="text"
              value={replaceStr}
              onChange={(e) => setReplaceStr(e.target.value)}
              placeholder="e.g. Strategic Accounts"
              className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="matchCase"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="accent-[#00E5FF]"
            />
            <label htmlFor="matchCase" className="text-slate-300 cursor-pointer">
              Match case exactly
            </label>
          </div>

          {statusMsg && <p className="text-[#00E5FF] text-[11px] font-bold">{statusMsg}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
          <button
            onClick={handleReplaceNext}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Find & Replace Next
          </button>
          <button
            onClick={handleReplaceAll}
            className="px-4 py-2 rounded-lg bg-[#00E5FF] text-black font-bold hover:bg-[#4FC3F7] transition-colors flex items-center gap-1.5"
          >
            <Replace className="w-4 h-4" /> Replace All
          </button>
        </div>
      </div>
    </div>
  );
}
