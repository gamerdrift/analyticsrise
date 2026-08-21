'use client';

import React from 'react';
import { Upload, X } from 'lucide-react';
import { usePowerBIWorkspace } from '../../contexts/PowerBIWorkspaceContext';
import PowerBIDropzone from './PowerBIDropzone';

export default function PowerBIUploadModal() {
  const { state, dispatch } = usePowerBIWorkspace();
  if (!state.isUploadModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg rounded-3xl bg-[#080C14] border border-white/10 shadow-2xl overflow-hidden flex flex-col font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0D1117]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Upload className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-black font-display text-white tracking-wider uppercase">
                Add Dataset to Model
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                Supports CSV, TSV, and TXT files
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: false })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <PowerBIDropzone />
        </div>
      </div>
    </div>
  );
}
