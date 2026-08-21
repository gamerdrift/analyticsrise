'use client';

import React from 'react';
import {
  PowerBIWorkspaceProvider,
  usePowerBIWorkspace,
} from './contexts/PowerBIWorkspaceContext';
import PowerBIWorkspaceHeader from './components/layout/PowerBIWorkspaceHeader';
import PowerBIWorkspaceSidebar from './components/layout/PowerBIWorkspaceSidebar';
import PowerBIWorkspaceStatusBar from './components/layout/PowerBIWorkspaceStatusBar';
import DatasetPreview from './components/datasets/DatasetPreview';
import DatasetProfileDrawer from './components/profiler/DatasetProfileDrawer';
import ModelPreparationPanel from './components/model/ModelPreparationPanel';
import PowerBIUploadModal from './components/upload/PowerBIUploadModal';
import PowerBIProjectManager from './components/projects/PowerBIProjectManager';
import PowerBIPrivacyNotice from './components/privacy/PowerBIPrivacyNotice';
import UpgradePromptModal from '../components/monetization/UpgradePromptModal';
import { getUpgradeContext } from '@/lib/entitlements/entitlements';

function PowerBIWorkspaceContent() {
  const { state, dispatch } = usePowerBIWorkspace();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#05070B] text-[#F5F7FA] font-sans overflow-hidden select-none relative">
      {/* Top Header */}
      <PowerBIWorkspaceHeader />

      {/* 100% In-Browser Privacy Banner */}
      <PowerBIPrivacyNotice />

      {/* Main Multi-Dataset Workbench */}
      <div className="flex-1 flex overflow-hidden relative">
        <PowerBIWorkspaceSidebar />
        <DatasetPreview />
        <DatasetProfileDrawer />
      </div>

      {/* Bottom Status Bar */}
      <PowerBIWorkspaceStatusBar />

      {/* Modals & Dialogs */}
      <PowerBIUploadModal />
      <ModelPreparationPanel />
      <PowerBIProjectManager />

      {/* Freemium Upgrade Modal */}
      <UpgradePromptModal
        isOpen={state.isUpgradeModalOpen}
        context={getUpgradeContext(state.upgradeFeatureId)}
        onClose={() => dispatch({ type: 'TOGGLE_UPGRADE_MODAL', payload: { isOpen: false } })}
      />
    </div>
  );
}

export default function PowerBIWorkspacePage() {
  return (
    <PowerBIWorkspaceProvider>
      <PowerBIWorkspaceContent />
    </PowerBIWorkspaceProvider>
  );
}
