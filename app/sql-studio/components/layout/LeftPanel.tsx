import React from 'react';
import MissionPanel from '@/app/sql-studio/components/mission/MissionPanel';
import DatabaseExplorer from '@/app/sql-studio/components/explorer/DatabaseExplorer';

export default function LeftPanel() {
  return (
    <div className="p-4 space-y-6">
      {/* Mission Details */}
      <MissionPanel />
      {/* Database Explorer */}
      <div className="mt-4">
        <h2 className="text-sm font-medium text-gray-200 mb-2">Database Explorer</h2>
        <DatabaseExplorer />
      </div>
      {/* Placeholder sections for future panels */}
      <section className="mt-4">
        <h2 className="text-sm font-medium text-gray-200 mb-2">Table Relationships</h2>
        <div className="text-gray-400 text-xs">(Coming soon)</div>
      </section>
      <section className="mt-4">
        <h2 className="text-sm font-medium text-gray-200 mb-2">Dataset Information</h2>
        <div className="text-gray-400 text-xs">(Coming soon)</div>
      </section>
    </div>
  );
}
