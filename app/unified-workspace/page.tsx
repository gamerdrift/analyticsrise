// app/unified-workspace/page.tsx
import React from 'react';
import UnifiedWorkspaceProvider from './context/UnifiedWorkspaceContext';
import ProjectDashboard from './components/dashboard/ProjectDashboard';
import ProjectTimeline from './components/timeline/ProjectTimeline';
import PhaseManager from './components/phase/PhaseManager';
import TaskManager from './components/task/TaskManager';
import DeliverablesCenter from './components/deliverables/DeliverablesCenter';
import DatasetHub from './components/dataset/DatasetHub';
import ProgressTracker from './components/progress/ProgressTracker';
import MentorNotes from './components/mentor/MentorNotes';
import PortfolioExport from './components/portfolio/PortfolioExport';

export default function UnifiedWorkspacePage() {
  return (
    <UnifiedWorkspaceProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Header / Dashboard */}
        <ProjectDashboard />
        {/* Timeline */}
        <ProjectTimeline />
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          <PhaseManager className="flex-1" />
          <TaskManager className="w-64" />
        </div>
        {/* Bottom panels */}
        <div className="grid grid-cols-3 gap-4 p-4">
          <DeliverablesCenter />
          <DatasetHub />
          <ProgressTracker />
        </div>
        <MentorNotes />
        <PortfolioExport />
      </div>
    </UnifiedWorkspaceProvider>
  );
}
