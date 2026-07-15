"use client";
import React from 'react';
import MissionPanel from '../mission/MissionPanel';
import DatasetExplorer from '../dataset/DatasetExplorer';
import DataModelViewer from '../model/DataModelViewer';
import VisualGallery from '../visuals/VisualGallery';

export default function LeftPanel() {
  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <MissionPanel />
      <section>
        <h2 className="text-sm font-medium text-gray-200 mb-2">Dataset Explorer</h2>
        <DatasetExplorer />
      </section>
      <section>
        <h2 className="text-sm font-medium text-gray-200 mb-2">Data Model</h2>
        <DataModelViewer />
      </section>
      <section>
        <h2 className="text-sm font-medium text-gray-200 mb-2">Visual Gallery</h2>
        <VisualGallery />
      </section>
    </div>
  );
}
