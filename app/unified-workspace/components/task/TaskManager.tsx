// app/unified-workspace/components/task/TaskManager.tsx
import React from 'react';
import { useUnifiedWorkspace } from '../../context/UnifiedWorkspaceContext';
import { motion } from 'framer-motion';

const TaskManager: React.FC<{ className?: string }> = ({ className }) => {
  const { state, dispatch } = useUnifiedWorkspace();
  const project = state.project;

  if (!project) return <div className="p-4">Loading...</div>;

  const activePhase = project.phases.find((p) => p.status === 'active');
  if (!activePhase) return <div className="p-4">No active phase.</div>;

  // Placeholder: each phase could have a static task list; for demo we show a generic "Complete Phase" button.
  const handleComplete = () => {
    dispatch({
      type: 'UPDATE_PHASE',
      payload: { ...activePhase, status: 'completed' },
    });
  };

  return (
    <motion.div className={className || 'w-64 bg-gray-800/60 backdrop-blur-lg p-4 glass-panel'}
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <h3 className="text-lg font-semibold mb-2 text-white">Tasks – {activePhase.name}</h3>
      <ul className="space-y-2">
        <li className="flex items-center justify-between text-gray-200">
          <span>Finish {activePhase.name} objectives</span>
          <button
            onClick={handleComplete}
            className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded"
          >
            Mark Complete
          </button>
        </li>
      </ul>
    </motion.div>
  );
};

export default TaskManager;
