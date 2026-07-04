import React from 'react';
import MissionPanel from '@/app/tableau-studio/components/mission/MissionPanel';
import DataSourceManager from '@/app/tableau-studio/components/datasource/DataSourceManager';
import WorksheetList from '@/app/tableau-studio/components/worksheet/WorksheetList';
import DashboardPages from '@/app/tableau-studio/components/dashboard/DashboardPages';
import StoryPages from '@/app/tableau-studio/components/story/StoryPages';

export default function LeftPanel() {
  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <MissionPanel />
      <section>
        <h2 className="text-sm font-medium text-gray-200 mb-2">Data Sources</h2>
        <DataSourceManager />
      </section>
      <section>
        <h2 className="text-sm font-medium text-gray-200 mb-2">Worksheets</h2>
        <WorksheetList />
      </section>
      <section>
        <h2 className="text-sm font-medium text-gray-200 mb-2">Dashboard Pages</h2>
        <DashboardPages />
      </section>
      <section>
        <h2 className="text-sm font-medium text-gray-200 mb-2">Story Pages</h2>
        <StoryPages />
      </section>
    </div>
  );
}
