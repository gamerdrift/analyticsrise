"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listProjects, deleteProject } from '@/lib/sql/workspace/projectStorage';
import { WorkspaceProjectSummary } from '@/lib/sql/workspace/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSqlWorkspace } from '../../contexts/SqlWorkspaceContext';
import { Folder, Trash2, ArrowRight, X, Plus, Sparkles, Database } from 'lucide-react';
import { WORKSPACE_LIMITS, validateProjectLimit } from '@/lib/sql/workspace/limits';
import { getUpgradeContext } from '@/lib/entitlements/entitlements';
import UpgradePromptModal from '@/app/components/monetization/UpgradePromptModal';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewProject: () => void;
}

export default function ProjectManagerModal({
  isOpen,
  onClose,
  onNewProject,
}: ProjectManagerModalProps) {
  const { currentUser } = useAuth();
  const { loadSavedProject, state } = useSqlWorkspace();
  const [projects, setProjects] = useState<WorkspaceProjectSummary[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const uid = currentUser ? currentUser.uid : null;
  const limits = WORKSPACE_LIMITS[state.userTier] || WORKSPACE_LIMITS.free;


  const refreshProjects = () => {
    setProjects(listProjects(uid));
  };

  useEffect(() => {
    if (isOpen) {
      refreshProjects();
    }
  }, [isOpen, uid]);

  if (!isOpen) return null;

  const handleSelectProject = (projectId: string) => {
    const success = loadSavedProject(projectId);
    if (success) {
      onClose();
    }
  };

  const handleDelete = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProject(projectId, uid);
    refreshProjects();
  };

  const handleCreateNewClick = () => {
    const limitCheck = validateProjectLimit(projects.length, state.userTier);
    if (!limitCheck.valid) {
      setIsUpgradeModalOpen(true);
      return;
    }
    onNewProject();
    onClose();
  };

  const upgradeContext = getUpgradeContext('sql.custom_datasets');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#090D16] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#06080E] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black font-display text-white uppercase tracking-wider">
                  Workspace Projects
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {projects.length} / {limits.maxSavedProjects} saved projects ({state.userTier.toUpperCase()} Plan)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Project List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2.5 custom-scrollbar bg-[#090D16]">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs space-y-2">
                <Database className="w-8 h-8 text-slate-700 mx-auto" />
                <p>No saved projects yet.</p>
                <p className="text-[11px] text-slate-600">
                  Upload a dataset to create your first workspace project.
                </p>
              </div>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.projectId}
                  onClick={() => handleSelectProject(proj.projectId)}
                  className="p-3.5 bg-[#0C101A] hover:bg-white/[0.04] border border-white/5 hover:border-[#00E5FF]/40 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="truncate">
                    <div className="text-xs font-mono font-bold text-white group-hover:text-[#00E5FF] transition-colors truncate">
                      {proj.projectName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                      Table: <code>{proj.tableName}</code> • {proj.rowCount.toLocaleString()} rows • {new Date(proj.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(proj.projectId, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-[#00E5FF]/20 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-[#06080E] border-t border-white/10 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={handleCreateNewClick}
              className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#00B8CC] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-[#00E5FF]/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>

      <UpgradePromptModal
        isOpen={isUpgradeModalOpen}
        context={upgradeContext}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </AnimatePresence>
  );
}
