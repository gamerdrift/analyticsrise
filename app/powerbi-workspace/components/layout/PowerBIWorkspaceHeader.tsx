'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Upload,
  FolderOpen,
  Save,
  Sliders,
  Network,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ArTriangleIcon } from '@/app/components/brand';
import { usePowerBIWorkspace } from '../../contexts/PowerBIWorkspaceContext';
import { findRelationshipCandidates } from '@/lib/powerbi/workspace/modelHeuristics';

export default function PowerBIWorkspaceHeader() {
  const { state, dispatch, saveCurrentProject, loadStarterData } = usePowerBIWorkspace();
  const candidates = findRelationshipCandidates(state.datasets);

  const handleSave = () => {
    saveCurrentProject();
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#05070B]/90 backdrop-blur-md px-6 flex items-center justify-between z-30 shrink-0 select-none">
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
          <Link
            href="/simulators/powerbi"
            className="text-slate-400 hover:text-[#00E5FF] transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Power BI Studio</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-amber-400 font-semibold flex items-center gap-1.5">
            <span>Workspace</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-widest font-black">
              Multi-Dataset
            </span>
          </span>
        </div>
      </div>

      {/* Project Status */}
      <div className="hidden lg:flex items-center gap-3 font-mono text-xs text-slate-400">
        <span className="px-2.5 py-1 rounded-xl bg-[#0D1117] border border-[#1E293B] text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{state.activeProject ? state.activeProject.projectName : 'Unsaved Model Project'}</span>
          <span className="text-[10px] text-slate-500">
            ({state.datasets.length} {state.datasets.length === 1 ? 'dataset' : 'datasets'})
          </span>
        </span>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Upload Dataset Button */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_UPLOAD_MODAL', payload: true })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1117] hover:bg-[#161B22] border border-[#1E293B] hover:border-amber-500/40 text-xs font-medium text-slate-200 transition-all shadow-sm cursor-pointer"
          title="Upload .csv, .tsv, or .txt dataset"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Add Dataset</span>
        </button>

        {/* Model Preparation Button */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_MODEL_PREP' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-sm cursor-pointer relative ${
            state.isModelPrepOpen
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-[#0D1117] hover:bg-[#161B22] border-[#1E293B] text-slate-200'
          }`}
          title="Inspect Semantic Relationships & Keys"
        >
          <Network className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Model Prep</span>
          {candidates.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
              {candidates.length}
            </span>
          )}
        </button>

        {/* Profiler Drawer Toggle */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_PROFILE_DRAWER' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-sm cursor-pointer ${
            state.isProfileDrawerOpen
              ? 'bg-[#00E5FF]/20 border-[#00E5FF]/50 text-[#00E5FF]'
              : 'bg-[#0D1117] hover:bg-[#161B22] border-[#1E293B] text-slate-200'
          }`}
          title="Toggle Dataset Profiler & Quality Warnings"
        >
          <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="hidden md:inline">Profile</span>
        </button>

        {/* Projects Manager */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_PROJECT_MANAGER', payload: true })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1117] hover:bg-[#161B22] border border-[#1E293B] hover:border-[#00E5FF]/40 text-xs font-medium text-slate-200 transition-all shadow-sm cursor-pointer"
          title="Manage saved projects"
        >
          <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Projects</span>
        </button>

        {/* Save Project Button */}
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          title="Save Workspace Project to Browser Storage"
        >
          <Save className="w-3.5 h-3.5 text-black" />
          <span>Save</span>
        </button>
      </div>
    </header>
  );
}
