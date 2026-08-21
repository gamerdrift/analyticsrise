'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { usePowerBIWorkspace } from '../../contexts/PowerBIWorkspaceContext';
import { POWERBI_WORKSPACE_LIMITS } from '@/lib/powerbi/workspace/limits';

export default function PowerBIDropzone() {
  const { state, uploadDatasetFile } = usePowerBIWorkspace();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limits = POWERBI_WORKSPACE_LIMITS[state.userTier] || POWERBI_WORKSPACE_LIMITS.free;
  const maxMb = limits.maxFileSizeBytes / (1024 * 1024);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadDatasetFile(files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadDatasetFile(files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-3xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer select-none ${
          isDragOver
            ? 'border-amber-400 bg-amber-500/10 scale-[0.99]'
            : 'border-white/10 hover:border-amber-500/40 bg-black/40 hover:bg-[#0D1117]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
          {state.isUploading ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
        </div>

        <h3 className="text-sm font-bold text-white mb-1">
          {state.isUploading ? 'Parsing & Profiling Dataset...' : 'Choose or drag a dataset file here'}
        </h3>
        <p className="text-xs text-slate-400 font-mono mb-4">
          Supports <strong>.csv</strong>, <strong>.tsv</strong>, or <strong>.txt</strong> files up to {maxMb} MB
        </p>

        <button
          type="button"
          disabled={state.isUploading}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 pointer-events-none"
        >
          Browse Files
        </button>
      </div>

      {/* Error display */}
      {state.uploadError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{state.uploadError}</span>
        </div>
      )}

      {/* Privacy guarantee */}
      <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-[11px] leading-relaxed">
          <strong>100% In-Browser Privacy:</strong> Your dataset is parsed directly in your browser. No files or rows are ever uploaded to cloud servers.
        </span>
      </div>
    </div>
  );
}
