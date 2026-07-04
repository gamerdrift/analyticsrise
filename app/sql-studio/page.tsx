import React from 'react';
import SqlStudioProvider from '@/app/sql-studio/contexts/SqlStudioContext';
import LeftPanel from '@/app/sql-studio/components/layout/LeftPanel';
import CenterPanel from '@/app/sql-studio/components/layout/CenterPanel';
import RightPanel from '@/app/sql-studio/components/layout/RightPanel';
import StatusBar from '@/app/sql-studio/components/layout/StatusBar';

export default function SqlStudioPage() {
  return (
    <SqlStudioProvider>
      <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Main three‑panel layout */}
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/4 min-w-[250px] border-r border-gray-700 overflow-y-auto">
            <LeftPanel />
          </div>
          <div className="flex-1 border-r border-gray-700 overflow-y-auto">
            <CenterPanel />
          </div>
          <div className="w-1/4 min-w-[250px] overflow-y-auto">
            <RightPanel />
          </div>
        </div>
        {/* Bottom status bar */}
        <StatusBar />
      </div>
    </SqlStudioProvider>
  );
}
