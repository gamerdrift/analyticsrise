'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { ExcelStudioProvider, useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import Toolbar from '@/app/excel-studio/components/Toolbar';
import WorkbookTabs from '@/app/excel-studio/components/WorkbookTabs';
import FormulaBar from '@/app/excel-studio/components/FormulaBar';
import NameBox from '@/app/excel-studio/components/NameBox';
import Grid from '@/app/excel-studio/components/Grid';
import MissionSidebar from '@/app/excel-studio/components/MissionSidebar';
import HintsPanel from '@/app/excel-studio/components/HintsPanel';
import ProgressFooter from '@/app/excel-studio/components/ProgressFooter';
import ChartModal from '@/app/excel-studio/components/ChartModal';
import SearchReplaceModal from '@/app/excel-studio/components/SearchReplaceModal';
import ConditionalFormattingModal from '@/app/excel-studio/components/ConditionalFormattingModal';
import DatasetExplorerModal from '@/app/excel-studio/components/DatasetExplorerModal';
import KeyboardShortcutsModal from '@/app/excel-studio/components/KeyboardShortcutsModal';
import ExcelAiMentorDrawer from '@/app/excel-studio/components/ExcelAiMentorDrawer';
import { Bot, Sparkles, HelpCircle } from 'lucide-react';

function ExcelStudioContent() {
  const { dispatch } = useExcelStudio();

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCondFormatOpen, setIsCondFormatOpen] = useState(false);
  const [isDatasetsOpen, setIsDatasetsOpen] = useState(false);
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const triggerAiMentor = () => {
    dispatch({ type: 'TOGGLE_AI_MENTOR', payload: true });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] bg-[#05070B] border border-[#00E5FF]/20 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Excel Ribbon Toolbar */}
      <Toolbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCondFormat={() => setIsCondFormatOpen(true)}
        onOpenDatasets={() => setIsDatasetsOpen(true)}
        onOpenCharts={() => setIsChartsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Formula & Name Box Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#0D1117] border-b border-white/10 z-20">
        <NameBox />
        <FormulaBar />
        <button
          onClick={triggerAiMentor}
          className="px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold hover:bg-[#00E5FF]/20 transition-all flex items-center gap-1.5 shrink-0 shadow-lg"
          title="Ask AI Mentor for Excel Formula help"
        >
          <Bot className="w-4 h-4 text-[#00E5FF]" /> <span className="hidden sm:inline">Ask AI Mentor</span>
        </button>
      </div>

      {/* Main Viewport: Grid & Mission Sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        <Grid />

        {/* Mission Sidebar */}
        <aside className="w-80 sm:w-96 bg-[#0D1117] border-l border-white/10 p-4 overflow-y-auto shrink-0 scrollbar-thin">
          <MissionSidebar />
        </aside>
      </div>

      {/* Hints & Progress Footer */}
      <HintsPanel />
      <ProgressFooter />

      {/* Workbook Tabs Footer */}
      <WorkbookTabs />

      {/* Modals & Drawers */}
      <SearchReplaceModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ConditionalFormattingModal isOpen={isCondFormatOpen} onClose={() => setIsCondFormatOpen(false)} />
      <DatasetExplorerModal isOpen={isDatasetsOpen} onClose={() => setIsDatasetsOpen(false)} />
      <ChartModal isOpen={isChartsOpen} onClose={() => setIsChartsOpen(false)} />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <ExcelAiMentorDrawer />
    </div>
  );
}

export default function ExcelStudioPage() {
  return (
    <DashboardLayout>
      <ExcelStudioProvider>
        <ExcelStudioContent />
      </ExcelStudioProvider>
    </DashboardLayout>
  );
}
