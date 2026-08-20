'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';
import { EXCEL_WORKSPACE_LIMITS } from '@/lib/excel/workspace/limits';

export default function ExcelDropzone() {
  const { state, processUploadedFile } = useExcelWorkspace();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limits = EXCEL_WORKSPACE_LIMITS[state.userTier] || EXCEL_WORKSPACE_LIMITS.free;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processUploadedFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processUploadedFile(file);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[0.99]'
            : 'border-[#1E293B] hover:border-emerald-500/40 bg-[#0D1117]/60 hover:bg-[#0D1117]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.csv,.tsv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
          <Upload className="w-7 h-7 animate-pulse" />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <h3 className="text-base font-semibold text-white">
            Drag & drop your workbook here, or <span className="text-emerald-400 underline decoration-emerald-500/30">browse files</span>
          </h3>
          <p className="text-xs text-slate-400">
            Supports <span className="text-slate-200 font-mono">.xlsx</span>, <span className="text-slate-200 font-mono">.csv</span>, <span className="text-slate-200 font-mono">.tsv</span>
          </p>
        </div>

        {/* Tier Limits Badge */}
        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400">
          <span>Max: {(limits.maxFileSizeBytes / (1024 * 1024)).toFixed(0)}MB</span>
          <span className="text-white/20">•</span>
          <span>Up to {limits.maxSheets} sheets</span>
          <span className="text-white/20">•</span>
          <span>{limits.maxRowsPerSheet.toLocaleString()} rows/sheet</span>
        </div>
      </div>

      {state.uploadError && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Upload Error</span>
            <span>{state.uploadError}</span>
          </div>
        </div>
      )}
    </div>
  );
}
