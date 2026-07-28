'use client';

import React, { useState } from 'react';
import { Application, ApplicationStatus, careerService } from '@/lib/services/careerService';
import { Briefcase, CheckCircle2, Clock, Calendar, ArrowRight, MessageSquare, ChevronRight } from 'lucide-react';

interface ApplicationTrackerProps {
  applications: Application[];
  onUpdateStatus: (appId: string, status: ApplicationStatus, note?: string) => void;
}

export default function ApplicationTracker({ applications, onUpdateStatus }: ApplicationTrackerProps) {
  const pipelineStages: ApplicationStatus[] = [
    'Saved',
    'Applied',
    'Interview',
    'Technical Round',
    'HR Round',
    'Offer',
    'Accepted',
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-white uppercase flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#00E5FF]" /> Candidate Application Tracker Pipeline
          </h2>
          <p className="text-slate-400 text-xs">
            Track your job applications across 8 pipeline stages from bookmark to final offer.
          </p>
        </div>
        <span className="px-3 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 font-bold">
          {applications.length} Active Applications
        </span>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 rounded-2xl border border-white/10 bg-[#0D1117] text-center space-y-3">
          <Clock className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white uppercase">No Applications Tracked Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Apply to analytics roles from the Enterprise Job Grid to initialize your timeline tracker.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStageIdx = pipelineStages.indexOf(app.status);

            return (
              <div key={app.id} className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/90 space-y-6 shadow-xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-base font-bold font-display text-white">{app.jobTitle}</h3>
                    <p className="text-slate-400 text-xs">{app.companyName} • Applied on {app.appliedDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 uppercase">Current Stage:</span>
                    <select
                      value={app.status}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                      className="bg-[#05070B] border border-[#00E5FF]/30 text-[#00E5FF] font-bold rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                    >
                      {pipelineStages.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* 8-Stage Timeline Stepper */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Pipeline Progress:</span>
                  <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
                    {pipelineStages.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIdx && app.status !== 'Rejected';
                      const isCurrent = idx === currentStageIdx && app.status !== 'Rejected';

                      return (
                        <div key={stage} className="flex items-center gap-1 shrink-0">
                          <div
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                              isCurrent
                                ? 'bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/30'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white/5 text-slate-500 border border-white/5'
                            }`}
                          >
                            {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                            {stage}
                          </div>
                          {idx < pipelineStages.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-700" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes Section */}
                {app.notes && (
                  <div className="p-3.5 rounded-xl border border-white/5 bg-[#05070B] text-slate-300 text-xs flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Candidate Log Note</span>
                      <p>{app.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
