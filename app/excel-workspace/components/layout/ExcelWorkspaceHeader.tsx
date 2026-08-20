'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Upload,
  Save,
  FolderOpen,
  BarChart2,
  Sliders,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Download,
} from 'lucide-react';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';
import { formatWorksheetAsCsv, downloadExportFile } from '@/lib/excel/workspace/exporter';

export default function ExcelWorkspaceHeader() {
  const { state, dispatch, saveCurrentProject } = useExcelWorkspace();

  const handleSave = () => {
    saveCurrentProject();
  };

  const handleExport = () => {
    if (!state.workbook) return;
    const activeSheet = state.workbook.sheets[state.activeSheetId];
    if (!activeSheet) return;

    const csvText = formatWorksheetAsCsv(activeSheet);
    const exportName = `${activeSheet.name.toLowerCase().replace(/\s+/g, '_')}_export.csv`;
    downloadExportFile(csvText, exportName);
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#05070B]/90 backdrop-blur-md px-6 flex items-center justify-between z-30 shrink-0">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group" aria-label="AnalyticsRise Home">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 select-none transition-transform group-hover:scale-105" role="img" aria-label="AnalyticsRise Logo">
            <defs>
              <linearGradient id="arGradSvgHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#4FC3F7" />
              </linearGradient>
              <linearGradient id="arBorderGradSvgHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="50%" stopColor="#4FC3F7" />
                <stop offset="100%" stopColor="#0070F3" />
              </linearGradient>
            </defs>
            <path d="M 50 8 L 93 84 C 94.8 87.2 92.5 91 88.8 91 L 11.2 91 C 7.5 91 5.2 87.2 7.0 84 Z" fill="url(#arGradSvgHeader)" stroke="url(#arBorderGradSvgHeader)" strokeWidth="2.5" />
            <text x="50" y="70" fontFamily="'Orbitron', 'Inter', sans-serif" fontWeight="900" fontSize="38" fill="#05070B" textAnchor="middle" letterSpacing="-2.5">AR</text>
          </svg>
          <span className="font-display font-black text-white text-sm tracking-wider uppercase hidden sm:inline-block">
            Analytics<span className="text-[#00E5FF]">RISE</span>
          </span>
        </Link>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Link href="/excel-studio" className="text-slate-400 hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel Studio</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span>Workspace</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest font-black">
              BYO Data
            </span>
          </span>
        </div>
      </div>

      {/* Active Workbook Indicator & Sheet Switcher */}
      <div className="hidden lg:flex items-center gap-3">
        {state.workbook && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1117] border border-[#1E293B]">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-medium text-white max-w-[180px] truncate">
              {state.workbook.fileName}
            </span>
            <span className="text-[10px] text-slate-500">
              ({state.workbook.sheetOrder.length} {state.workbook.sheetOrder.length === 1 ? 'sheet' : 'sheets'})
            </span>
          </div>
        )}
      </div>

      {/* Actions Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Upload Button */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: true })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1117] hover:bg-[#161B22] border border-[#1E293B] hover:border-emerald-500/40 text-xs font-medium text-slate-200 transition-all shadow-sm"
          title="Upload .xlsx or .csv workbook"
        >
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Projects Manager */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PROJECT_MANAGER', payload: true })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1117] hover:bg-[#161B22] border border-[#1E293B] hover:border-[#00E5FF]/40 text-xs font-medium text-slate-200 transition-all shadow-sm"
          title="Manage saved projects"
        >
          <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Projects</span>
        </button>

        {/* Profiler Drawer Toggle */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PROFILE_DRAWER' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-sm ${
            state.isProfileDrawerOpen
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-[#0D1117] hover:bg-[#161B22] border-[#1E293B] text-slate-200'
          }`}
          title="Toggle Workbook Health & Profiler"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Profile</span>
        </button>

        {/* Save Project Button */}
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          title="Save Workbook Project"
        >
          <Save className="w-3.5 h-3.5 text-black" />
          <span>Save</span>
        </button>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1117] hover:bg-[#161B22] border border-[#1E293B] hover:border-emerald-500/40 text-xs font-medium text-slate-200 transition-all shadow-sm"
          title="Export Active Sheet to CSV"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
}
