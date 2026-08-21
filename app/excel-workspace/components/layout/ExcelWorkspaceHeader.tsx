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
import { ArTriangleIcon } from '@/app/components/brand';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';
import { formatWorksheetAsCsv, downloadExportFile } from '@/lib/excel/workspace/exporter';
import { AiEvaLauncher } from '@/app/components/ai-eva';


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
          <ArTriangleIcon size={28} className="transition-transform group-hover:scale-105" />
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

        {/* AI-EVA Learning & Workspace Companion Launcher */}
        <AiEvaLauncher
          isOpen={state.isAiEvaOpen}
          onToggle={() => dispatch({ type: 'TOGGLE_AI_EVA' })}
          hasErrorContext={Boolean(state.profile && state.profile.qualityWarnings.length > 0)}
        />


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
