"use client";

import React from 'react';
import Link from 'next/link';
import { useSqlWorkspace } from '../../contexts/SqlWorkspaceContext';
import { ArTriangleIcon } from '@/app/components/brand';
import { Terminal, Folder, Upload, BarChart2, ChevronLeft, Sparkles, Code, Table } from 'lucide-react';

interface WorkspaceHeaderProps {
  onOpenProjects: () => void;
  onOpenUpload: () => void;
}

export default function WorkspaceHeader({
  onOpenProjects,
  onOpenUpload,
}: WorkspaceHeaderProps) {
  const { state, dispatch } = useSqlWorkspace();
  const { activeTab, parsedDataset, activeProject } = state;

  return (
    <header className="h-12 bg-[#080C14] border-b border-white/10 flex items-center justify-between px-3 md:px-4 shrink-0 font-sans select-none">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Link
          href="/sql-studio"
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-mono transition-colors group"
          title="Back to SQL Studio"
        >
          <ChevronLeft className="w-4 h-4" />
          <ArTriangleIcon size={18} className="transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline">SQL Studio</span>
        </Link>

        <span className="text-slate-700">/</span>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center">
            <Terminal className="w-3 h-3 text-[#00E5FF]" />
          </div>
          <h1 className="text-xs md:text-sm font-black font-display text-white tracking-wider uppercase">
            SQL WORKSPACE
          </h1>
        </div>

        {activeProject && (
          <span className="hidden md:inline px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 truncate max-w-[160px]">
            {activeProject.projectName}
          </span>
        )}
      </div>

      {/* Responsive View Switcher (< 1024px) */}
      <div className="flex lg:hidden items-center bg-white/5 p-0.5 rounded-lg border border-white/10">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'editor' })}
          className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors ${
            activeTab === 'editor'
              ? 'bg-[#00E5FF] text-black font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-3 h-3" />
          <span>Editor</span>
        </button>

        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'profile' })}
          className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors ${
            activeTab === 'profile'
              ? 'bg-[#00E5FF] text-black font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-3 h-3" />
          <span>Profile</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenProjects}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
        >
          <Folder className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Projects</span>
        </button>

        <button
          type="button"
          onClick={onOpenUpload}
          className="px-3 py-1.5 rounded-lg bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shadow-[#00E5FF]/10"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload CSV</span>
        </button>
      </div>
    </header>
  );
}
