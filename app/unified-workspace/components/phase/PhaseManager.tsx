// app/unified-workspace/components/phase/PhaseManager.tsx
import React, { useEffect } from 'react';
import { useUnifiedWorkspace } from '../../context/UnifiedWorkspaceContext';
import { getSimulatorComponent } from '../../services/simulatorBridge';
import { motion } from 'framer-motion';

const PhaseManager: React.FC<{ className?: string }> = ({ className }) => {
  const { state, dispatch } = useUnifiedWorkspace();
  const project = state.project;

  const activePhase = project?.phases.find((p) => p.status === 'active');

  // When a phase becomes active, we could auto‑unlock the next one after completion.
  useEffect(() => {
    if (activePhase?.status === 'completed') {
      // Unlock next locked phase (simple sequential logic)
      const next = project?.phases.find((p) => p.status === 'locked');
      if (next) {
        dispatch({
          type: 'UPDATE_PHASE',
          payload: { ...next, status: 'active' },
        });
      }
    }
  }, [activePhase?.status]);

  if (!activePhase) return <div className="p-4">All phases completed or none active.</div>;

  const Simulator = getSimulatorComponent(activePhase.simulator);

  return (
    <motion.div className={className || 'flex-1 overflow-auto p-4 glass-panel'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-2 text-white">{activePhase.name} Phase</h2>
      <Simulator />
    </motion.div>
  );
};

export default PhaseManager;
