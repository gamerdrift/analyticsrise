'use client';

import React from 'react';
import { TableauStudioProvider } from '@/app/tableau-studio/contexts/TableauStudioContext';
import LeftPanel from '@/app/tableau-studio/components/layout/LeftPanel';
import CenterPanel from '@/app/tableau-studio/components/layout/CenterPanel';
import RightPanel from '@/app/tableau-studio/components/layout/RightPanel';
import BottomBar from '@/app/tableau-studio/components/layout/BottomBar';

export default function TableauStudioPage() {
  return (
    <TableauStudioProvider>
      <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
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
        <BottomBar />
      </div>
    </TableauStudioProvider>
  );
}
