"use client";

import React, { useState, useEffect } from 'react';
import { SqlStudioProvider, useSqlStudio, ResponsiveStudioTab } from '@/app/sql-studio/contexts/SqlStudioContext';
import LeftPanel from '@/app/sql-studio/components/layout/LeftPanel';
import CenterPanel from '@/app/sql-studio/components/layout/CenterPanel';
import RightPanel from '@/app/sql-studio/components/layout/RightPanel';
import StatusBar from '@/app/sql-studio/components/layout/StatusBar';
import SqlConceptGuideModal from '@/app/sql-studio/components/concept/SqlConceptGuideModal';
import Link from 'next/link';
import { Terminal, Target, Code, BookOpen, ChevronLeft, HelpCircle, Sparkles } from 'lucide-react';
import { ArTriangleIcon } from '@/app/components/brand';
import { AnalyticsService } from '@/lib/services/analytics';

function SqlStudioWorkbench() {
  const { state, dispatch } = useSqlStudio();
  const { activeTab } = state;
  const [isConceptGuideOpen, setIsConceptGuideOpen] = useState(false);

  useEffect(() => {
    AnalyticsService.logStudioOpened('sql');
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#05070B] text-white font-sans overflow-hidden select-none">
      {/* Top Studio Navbar */}
      <header className="h-12 bg-[#080C14] border-b border-white/10 flex items-center justify-between px-3 md:px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-mono transition-colors group"
            aria-label="AnalyticsRise Home"
          >
            <ChevronLeft className="w-4 h-4" />
            <ArTriangleIcon size={18} className="transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">AnalyticsRise</span>
          </Link>
          <span className="text-slate-700">/</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center">
              <Terminal className="w-3 h-3 text-[#00E5FF]" />
            </div>
            <h1 className="text-xs md:text-sm font-black font-display text-white tracking-wider uppercase">
              SQL STUDIO
            </h1>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Tab Switcher (< 1024px) */}
        <div className="flex lg:hidden items-center bg-white/5 p-0.5 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'instructions' })}
            className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors ${
              activeTab === 'instructions'
                ? 'bg-[#00E5FF] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3 h-3" />
            <span>Mission</span>
          </button>
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
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'curriculum' })}
            className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors ${
              activeTab === 'curriculum'
                ? 'bg-[#00E5FF] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Tracks</span>
          </button>
        </div>

        {/* Top Right Live Telemetry / Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/sql-workspace"
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00E5FF]/15 border border-white/10 hover:border-[#00E5FF]/40 text-slate-200 hover:text-[#00E5FF] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            title="Analyze your own CSV data"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden sm:inline">SQL Workspace</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-[#00E5FF]/20 text-[#00E5FF]">NEW</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsConceptGuideOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shadow-[#00E5FF]/10"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Concept Guide</span>
          </button>

          <span className="hidden sm:inline text-[10px] font-mono text-slate-500 uppercase tracking-widest border-l border-white/10 pl-3">
            In-Browser Sandbox
          </span>
        </div>

      </header>

      {/* SQL Concept Guide Modal */}
      <SqlConceptGuideModal
        isOpen={isConceptGuideOpen}
        onClose={() => setIsConceptGuideOpen(false)}
      />


      {/* Main Studio Viewport */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Desktop always visible, Mobile conditionally visible */}
        <section
          aria-label="Challenge Instructions and Database Explorer"
          className={`${
            activeTab === 'instructions' ? 'flex' : 'hidden'
          } lg:flex w-full lg:w-80 xl:w-96 border-r border-white/10 shrink-0 overflow-hidden`}
        >
          <LeftPanel />
        </section>

        {/* Center Panel: Desktop always visible, Mobile conditionally visible */}
        <section
          aria-label="SQL Editor and Query Results Workbench"
          className={`${
            activeTab === 'editor' ? 'flex' : 'hidden'
          } lg:flex flex-1 border-r border-white/10 shrink-0 overflow-hidden`}
        >
          <CenterPanel />
        </section>

        {/* Right Panel: Desktop always visible, Mobile conditionally visible */}
        <section
          aria-label="Curriculum Progression Map"
          className={`${
            activeTab === 'curriculum' ? 'flex' : 'hidden'
          } lg:flex w-full lg:w-72 xl:w-80 shrink-0 overflow-hidden`}
        >
          <RightPanel />
        </section>
      </main>

      {/* Bottom Status Bar */}
      <StatusBar />
    </div>
  );
}

export default function SqlStudioPage() {
  return (
    <SqlStudioProvider>
      <SqlStudioWorkbench />
    </SqlStudioProvider>
  );
}
