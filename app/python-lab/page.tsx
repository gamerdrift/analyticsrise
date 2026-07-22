'use client';

import React from 'react';
import { PythonLabProvider } from './contexts/PythonLabContext';
import LeftPanel from './components/layout/LeftPanel';
import CenterPanel from './components/layout/CenterPanel';
import RightPanel from './components/layout/RightPanel';
import StatusBar from './components/layout/StatusBar';

export default function PythonLabPage() {
  return (
    <PythonLabProvider>
      <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </div>
        <StatusBar />
      </div>
    </PythonLabProvider>
  );
}
