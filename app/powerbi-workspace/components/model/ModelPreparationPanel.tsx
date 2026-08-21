'use client';

import React from 'react';
import {
  Network,
  X,
  Key,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePowerBIWorkspace } from '../../contexts/PowerBIWorkspaceContext';
import { findRelationshipCandidates } from '@/lib/powerbi/workspace/modelHeuristics';
import { profileDataset } from '@/lib/powerbi/workspace/profiler';

export default function ModelPreparationPanel() {
  const { state, dispatch } = usePowerBIWorkspace();
  if (!state.isModelPrepOpen) return null;

  const candidates = findRelationshipCandidates(state.datasets);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-3xl rounded-3xl bg-[#080C14] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-sans">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0D1117]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Network className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-black font-display text-white tracking-wider uppercase">
                Model Readiness & Relationship Candidates
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                Multi-Dataset Semantic Modeling Preparation
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_MODEL_PREP', payload: false })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Status Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col">
              <span className="text-[10px] font-mono uppercase text-slate-500">Loaded Tables</span>
              <span className="text-xl font-bold font-mono text-white mt-1">
                {state.datasets.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col">
              <span className="text-[10px] font-mono uppercase text-slate-500">Primary Key Candidates</span>
              <span className="text-xl font-bold font-mono text-amber-400 mt-1">
                {state.datasets.reduce((acc, d) => acc + profileDataset(d).potentialKeys.length, 0)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col">
              <span className="text-[10px] font-mono uppercase text-slate-500">Relationship Matches</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {candidates.length}
              </span>
            </div>
          </div>

          {/* Table Schemas & Key Summary */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
              1. Discovered Entity Identifiers (Primary Keys)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {state.datasets.map((ds) => {
                const profile = profileDataset(ds);
                return (
                  <div key={ds.id} className="p-3.5 rounded-2xl bg-[#0D1117] border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-amber-400" />
                        {ds.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{ds.rowCount} rows</span>
                    </div>

                    {profile.potentialKeys.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.potentialKeys.map((k) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono flex items-center gap-1"
                          >
                            <Key className="w-2.5 h-2.5" />
                            {k}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic font-mono">
                        No 100% unique primary key column detected.
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discovered Relationship Candidates */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
              2. Candidate Relationships (Deterministic Heuristics)
            </h3>

            {candidates.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/5 text-center text-xs text-slate-400 font-mono">
                No matching primary/foreign key column pairs found across your loaded datasets.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {candidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="p-4 rounded-2xl bg-[#0D1117] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 font-mono text-xs">
                      {/* From Entity */}
                      <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5 text-slate-200">
                        <span className="font-bold text-amber-300">{cand.fromDatasetName}</span>
                        <span className="text-slate-500">.</span>
                        <span>{cand.fromColumn}</span>
                      </div>

                      {/* Direction & Cardinality */}
                      <div className="flex flex-col items-center px-1">
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          {cand.suggestedCardinality}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>

                      {/* To Entity */}
                      <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5 text-slate-200">
                        <span className="font-bold text-cyan-300">{cand.toDatasetName}</span>
                        <span className="text-slate-500">.</span>
                        <span>{cand.toColumn}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="text-[10px] font-mono text-slate-500">Confidence: {(cand.confidence * 100).toFixed(0)}%</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                        Ready
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Educational Notice */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">
              <strong>Modeling Engine Preview:</strong> In the upcoming Modeling phase (Mission 10B), you will be able to visually drag-and-drop to establish active relationships, define cross-filtering directions, and create custom DAX business measures.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0D1117] flex justify-end">
          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_MODEL_PREP', payload: false })}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            Close Model Prep
          </button>
        </div>
      </div>
    </div>
  );
}
