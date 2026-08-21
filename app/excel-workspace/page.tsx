'use client';

import React, { useMemo } from 'react';
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
import { AiEvaPanel } from '@/app/components/ai-eva';
import { adaptExcelWorkspaceContext, toCellCoordinate } from '@/lib/ai/eva/context/excelWorkspace';
import { ExcelApprovedSample } from '@/lib/ai/eva/context/types';
import { AiEvaContext } from '@/lib/ai/eva/types';

function ExcelWorkspaceContent() {
  const { state, dispatch } = useExcelWorkspace();

  // Extract user-approved sample when sample sharing is toggled on
  const approvedSample = useMemo<ExcelApprovedSample | undefined>(() => {
    if (!state.isSampleShared || !state.workbook) return undefined;

    const activeSheetId = state.activeSheetId || state.workbook.activeSheetId || state.workbook.sheetOrder[0];
    const activeSheet = state.workbook.sheets[activeSheetId] || Object.values(state.workbook.sheets)[0];
    if (!activeSheet) return undefined;

    let startRow = 0;
    let endRow = Math.min(activeSheet.rows - 1, 9);
    let startCol = 0;
    let endCol = Math.min(activeSheet.cols - 1, 9);

    if (state.selectionRange) {
      startRow = Math.min(state.selectionRange.startRow, state.selectionRange.endRow);
      endRow = Math.min(Math.max(state.selectionRange.startRow, state.selectionRange.endRow), startRow + 9);
      startCol = Math.min(state.selectionRange.startCol, state.selectionRange.endCol);
      endCol = Math.min(Math.max(state.selectionRange.startCol, state.selectionRange.endCol), startCol + 19);
    } else if (state.selectedCell) {
      startRow = state.selectedCell.row;
      endRow = Math.min(activeSheet.rows - 1, startRow + 4);
      startCol = 0;
      endCol = Math.min(activeSheet.cols - 1, 10);
    }

    const sampleHeaders = (activeSheet.headers || []).slice(startCol, endCol + 1);
    const sampleRows: (string | number | boolean | null)[][] = [];

    for (let r = startRow; r <= endRow; r++) {
      const rowData: (string | number | boolean | null)[] = [];
      for (let c = startCol; c <= endCol; c++) {
        const cell = activeSheet.cells[`${r},${c}`];
        rowData.push(cell ? cell.value : null);
      }
      sampleRows.push(rowData);
    }

    const rangeLabel = `${toCellCoordinate(startRow, startCol)}:${toCellCoordinate(endRow, endCol)}`;
    return {
      cellRange: rangeLabel,
      rowCount: sampleRows.length,
      colCount: sampleHeaders.length,
      headers: sampleHeaders,
      rows: sampleRows,
      userApproved: true,
      timestamp: new Date().toISOString(),
    };
  }, [state.isSampleShared, state.workbook, state.activeSheetId, state.selectionRange, state.selectedCell]);

  // Construct privacy-aware AI-EVA context
  const aiContext = useMemo<AiEvaContext>(() => {
    const excelContext = adaptExcelWorkspaceContext(state, approvedSample);
    return {
      product: 'excel-workspace',
      workspaceType: 'excel_workspace',
      excelContext,
      privacyLevel: excelContext?.privacyLevel || 'metadata',
    };
  }, [state, approvedSample]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#05070B] text-[#F5F7FA] font-sans overflow-hidden select-none relative">
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

      {/* AI-EVA Learning & Workspace Companion Panel */}
      <AiEvaPanel
        isOpen={state.isAiEvaOpen}
        onClose={() => dispatch({ type: 'TOGGLE_AI_EVA', payload: false })}
        context={aiContext}
        onToggleShareSample={() => dispatch({ type: 'TOGGLE_SHARE_SAMPLE' })}
        isSampleShared={state.isSampleShared}
        onInsertCodeSnippet={(formula) => {
          if (state.selectedCell) {
            dispatch({
              type: 'UPDATE_CELL',
              payload: {
                row: state.selectedCell.row,
                col: state.selectedCell.col,
                value: formula,
                formula: formula.startsWith('=') ? formula : `=${formula}`,
              },
            });
          }
        }}
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
