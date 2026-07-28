'use client';

import React from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { ExcelStudioProvider } from '@/app/excel-studio/contexts/ExcelStudioContext';
import Toolbar from '@/app/excel-studio/components/Toolbar';
import WorkbookTabs from '@/app/excel-studio/components/WorkbookTabs';
import FormulaBar from '@/app/excel-studio/components/FormulaBar';
import NameBox from '@/app/excel-studio/components/NameBox';
import Grid from '@/app/excel-studio/components/Grid';
import MissionSidebar from '@/app/excel-studio/components/MissionSidebar';
import { Bot } from 'lucide-react';

function ExcelSimulatorContent() {
  const triggerAiMentor = () => {
    window.dispatchEvent(new CustomEvent('open-ai-mentor'));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#05070B] border border-[#00E5FF]/20 rounded-2xl overflow-hidden shadow-2xl">
      {/* Excel Ribbon Toolbar */}
      <Toolbar />

      {/* Formula & Name Box Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#0D1117] border-b border-white/10 z-20">
        <NameBox />
        <FormulaBar />
        <button
          onClick={triggerAiMentor}
          className="px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold hover:bg-[#00E5FF]/20 transition-all flex items-center gap-1.5 shrink-0"
          title="Ask AI Mentor for Excel Formula help"
        >
          <Bot className="w-4 h-4" /> <span className="hidden sm:inline">Ask AI Mentor</span>
        </button>
      </div>

      {/* Main Viewport: Grid & Sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        <Grid />

        {/* Mission Sidebar */}
        <aside className="w-80 sm:w-96 bg-[#0D1117] border-l border-white/10 p-4 overflow-y-auto shrink-0 scrollbar-thin">
          <MissionSidebar />
        </aside>
      </div>

      {/* Workbook Tabs Footer */}
      <WorkbookTabs />
    </div>
  );
}

export default function ExcelSimulatorPage() {
  return (
    <DashboardLayout>
      <ExcelStudioProvider>
        <ExcelSimulatorContent />
      </ExcelStudioProvider>
    </DashboardLayout>
  );
}
