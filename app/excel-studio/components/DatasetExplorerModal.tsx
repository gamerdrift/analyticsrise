'use client';

import React from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { SAMPLE_DATASETS, SampleDataset } from '@/lib/utils/excel/datasetLibrary';
import { Database, X, ArrowRight, Table } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DatasetExplorerModal({ isOpen, onClose }: Props) {
  const { dispatch } = useExcelStudio();

  if (!isOpen) return null;

  const handleSelectDataset = (datasetId: string) => {
    dispatch({ type: 'LOAD_DATASET', payload: { datasetId } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1117] border border-[#00E5FF]/30 rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-4 font-mono text-xs text-white relative max-h-[85vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-white/10 pb-3 shrink-0">
          <Database className="w-5 h-5 text-[#00E5FF]" />
          <div>
            <span className="font-bold text-sm uppercase tracking-wider text-[#00E5FF]">Enterprise Sample Dataset Library</span>
            <p className="text-[10px] text-slate-400">Load real-world business datasets directly into your worksheet for analysis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1 scrollbar-thin flex-1">
          {SAMPLE_DATASETS.map((ds) => (
            <div
              key={ds.id}
              onClick={() => handleSelectDataset(ds.id)}
              className="bg-[#05070B] border border-slate-800 hover:border-[#00E5FF]/50 p-4 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[9px] text-[#00E5FF] border border-[#00E5FF]/20 font-bold uppercase">
                    {ds.category}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Table className="w-3 h-3" /> {ds.rowsCount} Rows
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-[#00E5FF] transition-colors">{ds.title}</h4>
                <p className="text-slate-400 text-[11px] mt-1 leading-snug">{ds.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[#00E5FF] text-[10px] font-bold group-hover:translate-x-1 transition-transform">
                <span>Load Dataset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
