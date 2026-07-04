import React from 'react';
import PowerBIStudioProvider from '@/app/powerbi-studio/contexts/PowerBIStudioContext';
import LeftPanel from '@/app/powerbi-studio/components/layout/LeftPanel';
import CenterPanel from '@/app/powerbi-studio/components/layout/CenterPanel';
import RightPanel from '@/app/powerbi-studio/components/layout/RightPanel';
import BottomBar from '@/app/powerbi-studio/components/layout/BottomBar';

export default function PowerBIStudioPage() {
  return (
    <PowerBIStudioProvider>
      <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Main panels */}
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
        <BottomBar />
      </div>
    </PowerBIStudioProvider>
  );
}
