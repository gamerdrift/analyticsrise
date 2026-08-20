"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSqlWorkspace } from '../../contexts/SqlWorkspaceContext';
import CsvDropzone from './CsvDropzone';
import { Upload, X, FileSpreadsheet, Sparkles, CheckCircle2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { resetToSampleData } = useSqlWorkspace();

  if (!isOpen) return null;

  const handleLoadSample = () => {
    resetToSampleData();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#090D16] border border-[#00E5FF]/30 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#06080E] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black font-display text-white uppercase tracking-wider">
                  Import Your Dataset
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Analyze your real CSV / TSV data in SQL Workspace
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <CsvDropzone />

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-500 uppercase">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Load Sample Dataset Action */}
            <button
              type="button"
              onClick={handleLoadSample}
              className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-[#00E5FF]/10 border border-white/10 hover:border-[#00E5FF]/30 text-slate-300 hover:text-[#00E5FF] font-mono text-xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-slate-400 group-hover:text-[#00E5FF]" />
                <span className="font-bold">Load Sample Customers Dataset</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 group-hover:text-[#00E5FF]">
                8 rows • Demo
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#06080E] border-t border-white/10 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
