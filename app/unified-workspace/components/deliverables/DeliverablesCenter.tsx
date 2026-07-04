// app/unified-workspace/components/deliverables/DeliverablesCenter.tsx
import React from 'react';
import { useUnifiedWorkspace } from '../../context/UnifiedWorkspaceContext';
import { motion } from 'framer-motion';

const DeliverablesCenter: React.FC = () => {
  const { state } = useUnifiedWorkspace();
  const project = state.project;

  if (!project) return null;

  const allDeliverables = project.phases.flatMap((p) => p.deliverables);

  return (
    <motion.div className="bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl glass-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-lg font-semibold mb-2 text-white">Deliverables</h3>
      <ul className="space-y-2">
        {allDeliverables.map((d) => (
          <li key={d.id} className="flex items-center justify-between text-gray-200">
            <span>{d.title}</span>
            {d.completed ? (
              <span className="text-green-400">✅</span>
            ) : (
              <span className="text-yellow-400">⏳</span>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default DeliverablesCenter;
