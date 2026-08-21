'use client';

import React, { useState, useEffect } from 'react';
import { FolderOpen, X, Trash2, ArrowRight, Database, Clock, Calendar } from 'lucide-react';
import { usePowerBIWorkspace } from '../../contexts/PowerBIWorkspaceContext';
import { PowerBIProjectSummary } from '@/lib/powerbi/workspace/types';

export default function PowerBIProjectManager() {
  const { state, dispatch, loadProject, deleteProject, listSavedProjects } = usePowerBIWorkspace();
  const [projects, setProjects] = useState<PowerBIProjectSummary[]>([]);

  useEffect(() => {
    if (state.isProjectManagerOpen) {
      setProjects(listSavedProjects());
    }
  }, [state.isProjectManagerOpen, listSavedProjects]);

  if (!state.isProjectManagerOpen) return null;

  const handleDelete = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this saved project?')) {
      deleteProject(projectId);
      setProjects(listSavedProjects());
    }
  };

  const handleLoad = (projectId: string) => {
    loadProject(projectId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl rounded-3xl bg-[#080C14] border border-white/10 shadow-2xl overflow-hidden flex flex-col font-sans max-h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0D1117]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-black font-display text-white tracking-wider uppercase">
                Saved Analytics Projects
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                Locally stored in your browser
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_PROJECT_MANAGER', payload: false })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-3">
          {projects.length === 0 ? (
            <div className="text-center p-8 text-slate-500 text-xs font-mono">
              No saved projects found in browser storage. Click &quot;Save&quot; in the header to save your current model.
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.projectId}
                onClick={() => handleLoad(proj.projectId)}
                className="p-4 rounded-2xl bg-[#0D1117] hover:bg-white/[0.04] border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {proj.projectName}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3 text-amber-400" />
                      {proj.datasetCount} tables
                    </span>
                    <span>·</span>
                    <span>{proj.totalRows.toLocaleString()} rows</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(proj.projectId, e)}
                    className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
