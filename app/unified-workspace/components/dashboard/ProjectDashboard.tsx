// app/unified-workspace/components/dashboard/ProjectDashboard.tsx
import React from 'react';
import { useUnifiedWorkspace } from '../../context/UnifiedWorkspaceContext';

const ProjectDashboard: React.FC = () => {
  const { state } = useUnifiedWorkspace();
  const project = state.project;

  if (!project) return <div className="p-4">Loading project...</div>;

  const completedPhases = project.phases.filter(p => p.status === 'completed').length;
  const totalPhases = project.phases.length;
  const progress = Math.round((completedPhases / totalPhases) * 100);

  return (
    <div className="p-4 bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-lg glass-panel">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-sm text-gray-300">Industry: {project.industry}</p>
      <div className="mt-2 flex items-center space-x-4">
        <span className="text-lg">XP Earned: {project.xpEarned}</span>
        <span className="text-lg">Progress: {progress}%</span>
        <span className="text-lg">Estimated Hours: {project.estimatedHours}</span>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-gray-700 rounded">
          <div className="h-full bg-green-500 rounded" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
