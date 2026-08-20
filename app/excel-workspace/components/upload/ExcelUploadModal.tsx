'use client';

import React from 'react';
import { X, FileSpreadsheet, Sparkles, ShieldCheck, Database, ArrowRight } from 'lucide-react';
import ExcelDropzone from './ExcelDropzone';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';

const SAMPLE_WORKBOOKS = [
  {
    id: 'sales_performance',
    title: 'Q1 Global Sales Performance',
    description: 'Regional sales breakdown with units, product prices, and calculated revenue.',
    rows: 10,
    cols: 8,
  },
  {
    id: 'financial_model',
    title: 'SaaS Monthly Cohort Analysis',
    description: 'Customer churn, MRR cohorts, and lifetime value projections.',
    rows: 12,
    cols: 6,
  },
];

export default function ExcelUploadModal() {
  const { state, dispatch, loadStarterWorkbook } = useExcelWorkspace();

  if (!state.isUploadModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Open Workbook</h2>
              <p className="text-xs text-slate-400">Import an existing .xlsx or .csv spreadsheet to explore and analyze</p>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: false })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Dropzone */}
          <ExcelDropzone />

          {/* Privacy Guarantee Banner */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div>
              <span className="font-semibold text-white">100% In-Browser Privacy Guarantee</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Your workbook is parsed and calculated completely in your local browser memory. No spreadsheet data is ever sent to external cloud servers or AI APIs.
              </p>
            </div>
          </div>

          {/* Quick Starter Templates */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Or start with a sample dataset:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_WORKBOOKS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    loadStarterWorkbook();
                    dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: false });
                  }}
                  className="flex flex-col text-left p-3.5 rounded-xl bg-[#161B22]/60 hover:bg-[#161B22] border border-[#1E293B] hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {sample.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{sample.description}</p>
                  <span className="text-[10px] font-mono text-slate-500 mt-2">
                    {sample.rows} rows • {sample.cols} cols
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1E293B] bg-[#05070B] flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            XLS files are planned for a future release.
          </span>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: false })}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
