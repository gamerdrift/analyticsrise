"use client";

import React, { useState, useEffect } from 'react';
import {
  SqlWorkspaceProvider,
  useSqlWorkspace,
} from './contexts/SqlWorkspaceContext';
import WorkspaceHeader from './components/layout/WorkspaceHeader';
import WorkspaceStatusBar from './components/layout/WorkspaceStatusBar';
import PrivacyNoticeBanner from './components/project/PrivacyNoticeBanner';
import WorkspaceExplorer from './components/explorer/WorkspaceExplorer';
import WorkspaceEditor from './components/editor/WorkspaceEditor';
import WorkspaceResults from './components/results/WorkspaceResults';
import DatasetProfileCard from './components/upload/DatasetProfileCard';
import UploadModal from './components/upload/UploadModal';
import ProjectManagerModal from './components/project/ProjectManagerModal';
import { AnalyticsService } from '@/lib/services/analytics';
import { BarChart2, Code, Database, Sparkles } from 'lucide-react';

function SqlWorkspaceWorkbench() {
  const { state, dispatch } = useSqlWorkspace();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [centerView, setCenterView] = useState<'editor' | 'profile'>('editor');

  useEffect(() => {
    AnalyticsService.logWorkspaceOpened();
  }, []);

  const dataset = state.parsedDataset;

  return (
    <div className="flex flex-col h-screen bg-[#05070B] text-white font-sans overflow-hidden select-none">
      {/* Top Header */}
      <WorkspaceHeader
        onOpenProjects={() => setIsProjectsModalOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
      />

      {/* Privacy Notice Banner */}
      <PrivacyNoticeBanner />

      {/* Main Workspace Body */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Schema Explorer */}
        <aside className="w-64 lg:w-72 bg-[#080C14] border-r border-white/10 flex flex-col shrink-0 overflow-y-auto custom-scrollbar hidden md:flex">
          <div className="p-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
              Database Schema
            </span>
            <button
              type="button"
              onClick={() => setCenterView(centerView === 'editor' ? 'profile' : 'editor')}
              className="text-[10px] font-mono text-[#00E5FF] hover:text-white uppercase font-bold flex items-center gap-1 transition-colors"
            >
              <BarChart2 className="w-3 h-3" />
              <span>{centerView === 'editor' ? 'View Profile' : 'View Editor'}</span>
            </button>
          </div>

          <WorkspaceExplorer onOpenUploadModal={() => setIsUploadModalOpen(true)} />
        </aside>

        {/* Center/Right Workbench Viewport */}
        <section className="flex-1 flex flex-col overflow-hidden p-3 gap-3 bg-[#05070B]">
          {centerView === 'profile' && dataset ? (
            <div className="flex-1 bg-[#07090E] border border-white/10 rounded-xl p-4 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <h2 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  Dataset Profiler & Health Audit
                </h2>
                <button
                  type="button"
                  onClick={() => setCenterView('editor')}
                  className="px-3 py-1 rounded-lg bg-[#00E5FF] text-black font-mono font-bold text-xs uppercase"
                >
                  Return to Query Editor
                </button>
              </div>
              <DatasetProfileCard
                profiles={dataset.profiles}
                qualityReport={dataset.qualityReport}
              />
            </div>
          ) : (
            <>
              {/* Top Half: SQL Editor */}
              <div className="flex-1 min-h-[200px]">
                <WorkspaceEditor />
              </div>

              {/* Bottom Half: Query Results Console */}
              <div className="flex-1 min-h-[220px]">
                <WorkspaceResults />
              </div>
            </>
          )}
        </section>
      </main>

      {/* Status Bar */}
      <WorkspaceStatusBar />

      {/* Upload CSV Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Saved Projects Modal */}
      <ProjectManagerModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        onNewProject={() => setIsUploadModalOpen(true)}
      />
    </div>
  );
}

export default function SqlWorkspacePage() {
  return (
    <SqlWorkspaceProvider>
      <SqlWorkspaceWorkbench />
    </SqlWorkspaceProvider>
  );
}
