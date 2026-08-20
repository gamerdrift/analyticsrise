"use client";

import React from 'react';
import { SqlStudioProvider, useSqlStudio, ResponsiveStudioTab } from '@/app/sql-studio/contexts/SqlStudioContext';
import LeftPanel from '@/app/sql-studio/components/layout/LeftPanel';
import CenterPanel from '@/app/sql-studio/components/layout/CenterPanel';
import RightPanel from '@/app/sql-studio/components/layout/RightPanel';
import StatusBar from '@/app/sql-studio/components/layout/StatusBar';
import Link from 'next/link';
import { Terminal, Target, Code, BookOpen, ChevronLeft } from 'lucide-react';
import { ArTriangleIcon } from '@/app/components/brand';

function SqlStudioWorkbench() {
  const { state, dispatch } = useSqlStudio();
  const { activeTab } = state;

  return (
    <div className="flex flex-col h-screen bg-[#05070B] text-white font-sans overflow-hidden select-none">
      {/* Top Studio Navbar */}
      <header className="h-12 bg-[#080C14] border-b border-white/10 flex items-center justify-between px-3 md:px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-mono transition-colors group"
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

        {/* Top Right Live Telemetry / Links */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Stage 2C Challenge Engine
          </span>
        </div>
      </header>

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
