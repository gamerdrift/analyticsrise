'use client';

import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Trash2, Calendar, FileSpreadsheet, Plus, Sparkles, Layers } from 'lucide-react';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';
import { listExcelProjects, deleteExcelProject } from '@/lib/excel/workspace/projectStorage';
import { WorkspaceProjectSummary } from '@/lib/excel/workspace/types';
import { EXCEL_WORKSPACE_LIMITS } from '@/lib/excel/workspace/limits';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUpgradeContext } from '@/lib/entitlements/entitlements';
import UpgradePromptModal from '@/app/components/monetization/UpgradePromptModal';


export default function ExcelProjectManagerModal() {
  const { state, dispatch, loadSavedProject } = useExcelWorkspace();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<WorkspaceProjectSummary[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const uid = currentUser ? currentUser.uid : null;
  const limits = EXCEL_WORKSPACE_LIMITS[state.userTier] || EXCEL_WORKSPACE_LIMITS.free;

  const refreshProjects = () => {
    setProjects(listExcelProjects(uid));
  };

  useEffect(() => {
    if (state.isProjectManagerOpen) {
      refreshProjects();
    }
  }, [state.isProjectManagerOpen, uid]);

  if (!state.isProjectManagerOpen) return null;

  const handleDelete = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this saved project?')) {
      deleteExcelProject(projectId, uid);
      refreshProjects();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Saved Projects</h2>
                <p className="text-xs text-slate-400">
                  {projects.length} of {limits.maxSavedProjects} projects used ({state.userTier.toUpperCase()} Tier)
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_PROJECT_MANAGER', payload: false })}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex flex-col gap-3">
            {projects.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
                <FolderOpen className="w-10 h-10 opacity-30 text-slate-400" />
                <span className="text-xs">No saved projects yet.</span>
                <span className="text-[11px] text-slate-600">
                  Click &quot;Save&quot; in the header to save your current workbook analysis.
                </span>
              </div>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.projectId}
                  onClick={() => loadSavedProject(proj.projectId)}
                  className="p-4 rounded-xl bg-[#161B22]/70 hover:bg-[#161B22] border border-[#1E293B] hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {proj.projectName}
                      </span>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 mt-0.5">
                        <span>{proj.fileName}</span>
                        <span>•</span>
                        <span>{proj.sheetCount} {proj.sheetCount === 1 ? 'sheet' : 'sheets'}</span>
                        <span>•</span>
                        <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(proj.projectId, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Pro Upgrade Banner when limit reached */}
            {projects.length >= limits.maxSavedProjects && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Need unlimited projects?</span>
                </div>
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-sm"
                >
                  View Pro
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#1E293B] bg-[#05070B] flex items-center justify-end">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_PROJECT_MANAGER', payload: false })}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <UpgradePromptModal
        isOpen={isUpgradeModalOpen}
        context={getUpgradeContext('excel.custom_upload')}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </>
  );
}

