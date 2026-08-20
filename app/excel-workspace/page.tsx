'use client';

import React from 'react';
import { ExcelWorkspaceProvider, useExcelWorkspace } from './contexts/ExcelWorkspaceContext';
import ExcelWorkspaceHeader from './components/layout/ExcelWorkspaceHeader';
import ExcelWorkspaceStatusBar from './components/layout/ExcelWorkspaceStatusBar';
import WorkspaceToolbar from './components/toolbar/WorkspaceToolbar';
import WorkspaceGrid from './components/grid/WorkspaceGrid';
import WorkbookProfileDrawer from './components/profiler/WorkbookProfileDrawer';
import ExcelUploadModal from './components/upload/ExcelUploadModal';
import ExcelChartModal from './components/modals/ExcelChartModal';
import ExcelProjectManagerModal from './components/modals/ExcelProjectManagerModal';
import ExcelSearchReplaceModal from './components/modals/ExcelSearchReplaceModal';
import ExcelPrivacyNoticeBanner from './components/privacy/ExcelPrivacyNoticeBanner';
import UpgradePromptModal from '../components/monetization/UpgradePromptModal';
import { getUpgradeContext } from '@/lib/entitlements/entitlements';

function ExcelWorkspaceContent() {
  const { state, dispatch } = useExcelWorkspace();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#05070B] text-[#F5F7FA] font-sans overflow-hidden select-none">
      {/* Header */}
      <ExcelWorkspaceHeader />

      {/* In-Browser Privacy Banner */}
      <ExcelPrivacyNoticeBanner />

      {/* Toolbar */}
      <WorkspaceToolbar />

      {/* Main Workspace: Grid + Profiler Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <WorkspaceGrid />
        <WorkbookProfileDrawer />
      </div>

      {/* Status Bar */}
      <ExcelWorkspaceStatusBar />

      {/* Modals */}
      <ExcelUploadModal />
      <ExcelChartModal />
      <ExcelProjectManagerModal />
      <ExcelSearchReplaceModal />

      {/* Freemium Upgrade Modal */}
      <UpgradePromptModal
        isOpen={state.isUpgradeModalOpen}
        context={getUpgradeContext('excel.custom_upload')}
        onClose={() => dispatch({ type: 'TOGGLE_UPGRADE_MODAL', payload: false })}
      />
    </div>

  );
}


export default function ExcelWorkspacePage() {
  return (
    <ExcelWorkspaceProvider>
      <ExcelWorkspaceContent />
    </ExcelWorkspaceProvider>
  );
}
