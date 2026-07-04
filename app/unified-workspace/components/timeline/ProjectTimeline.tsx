// app/unified-workspace/components/timeline/ProjectTimeline.tsx
import React from 'react';
import { useUnifiedWorkspace } from '../../context/UnifiedWorkspaceContext';
import { motion } from 'framer-motion';

const timelineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const phaseItem = {
  hidden: { opacity: 0.5 },
  visible: { opacity: 1 },
};

const ProjectTimeline: React.FC = () => {
  const { state, dispatch } = useUnifiedWorkspace();
  const project = state.project;

  if (!project) return null;

  const handleSelect = (phaseId: string) => {
    // Could dispatch an action to set active phase; placeholder for now
    console.log('Select phase', phaseId);
  };

  return (
    <motion.div
      className="flex justify-center gap-4 p-4 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-b-xl glass-panel"
      variants={timelineVariants}
      initial="hidden"
      animate="visible"
    >
      {project.phases.map((phase) => (
        <motion.div
          key={phase.id}
          className={`px-4 py-2 rounded cursor-pointer ${phase.status === 'completed' ? 'bg-green-600' : phase.status === 'active' ? 'bg-indigo-600' : 'bg-gray-600'} `}
          variants={phaseItem}
          onClick={() => handleSelect(phase.id)}
        >
          {phase.name}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectTimeline;
