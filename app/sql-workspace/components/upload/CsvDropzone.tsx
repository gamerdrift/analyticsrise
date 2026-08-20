"use client";

import React, { useRef, useState } from 'react';
import { useSqlWorkspace } from '../../contexts/SqlWorkspaceContext';
import { Upload, FileText, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { WORKSPACE_LIMITS } from '@/lib/sql/workspace/limits';

export default function CsvDropzone() {
  const { state, processUploadedFile } = useSqlWorkspace();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const limits = WORKSPACE_LIMITS[state.userTier] || WORKSPACE_LIMITS.free;

  const handleFile = async (file: File) => {
    if (!file) return;
    await processUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#00E5FF] bg-[#00E5FF]/10 scale-[1.01]'
            : 'border-white/15 hover:border-[#00E5FF]/50 bg-[#080C14] hover:bg-[#0C101A]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
            <Upload className="w-5 h-5" />
          </div>

          <div className="font-display font-bold text-white text-xs uppercase tracking-wider">
            {state.isUploading ? 'Parsing Dataset...' : 'Drop CSV here or click to browse'}
          </div>

          <p className="text-[11px] font-mono text-slate-400 max-w-xs">
            Supports CSV/TSV up to {limits.maxFileSizeLabel} ({limits.maxRows.toLocaleString()} rows).
          </p>

          <div className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Private In-Browser Processing</span>
          </div>
        </div>
      </div>

      {state.uploadError && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono rounded-lg flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{state.uploadError}</span>
        </div>
      )}
    </div>
  );
}
