'use client';

import React from 'react';
import { Job } from '@/lib/services/careerService';
import { X, MapPin, Briefcase, DollarSign, Calendar, ExternalLink, Bookmark, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

interface JobDetailDrawerProps {
  job: Job | null;
  isOpen: boolean;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (jobId: string) => void;
  onApply: (job: Job) => void;
}

export default function JobDetailDrawer({ job, isOpen, isSaved, onClose, onToggleSave, onApply }: JobDetailDrawerProps) {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-end font-mono text-xs">
      <div className="w-full max-w-2xl bg-[#0D1117] border-l border-[#00E5FF]/40 h-full overflow-y-auto p-8 space-y-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Company Header */}
        <div className="flex items-start gap-4 pt-2">
          <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg" />
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-bold uppercase border border-[#00E5FF]/20">
              Source: {job.source}
            </span>
            <h2 className="text-2xl font-bold font-display text-white">{job.title}</h2>
            <p className="text-sm font-semibold text-slate-300">{job.companyName} • {job.department}</p>
          </div>
        </div>

        {/* Quick Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-white/10 bg-[#05070B]">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Location</span>
            <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Work Type</span>
            <span className="text-xs font-bold text-emerald-400 mt-0.5 block">{job.workType}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Salary Range</span>
            <span className="text-xs font-bold text-[#00E5FF] mt-0.5 block">
              {job.currency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Visa Sponsorship</span>
            <span className="text-xs font-bold text-white mt-0.5 block">
              {job.visaSponsorship ? 'Available' : 'No'}
            </span>
          </div>
        </div>

        {/* Job Overview Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
            Role Overview
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed">{job.description}</p>
        </div>

        {/* Key Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
              Key Responsibilities
            </h3>
            <ul className="space-y-1.5 text-slate-300 text-xs list-disc pl-4">
              {job.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Qualifications & Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
              Qualifications & Requirements
            </h3>
            <ul className="space-y-1.5 text-slate-300 text-xs list-disc pl-4">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Skills & Tech Stack */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
            Required Skills & Tech Stack
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {job.requiredSkills.map((sk) => (
              <span key={sk} className="px-2.5 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-xs font-bold">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Corporate Perks & Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
              Perks & Employee Benefits
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {job.benefits.map((b) => (
                <span key={b} className="px-2.5 py-1 rounded bg-white/5 text-slate-300 border border-white/5 text-xs">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recruiter Contact Info */}
        {job.recruiterName && (
          <div className="p-4 rounded-xl border border-white/10 bg-[#05070B] space-y-1 text-slate-400 text-xs">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Hiring Manager / Recruiter</span>
            <p className="text-white font-bold">{job.recruiterName}</p>
            {job.recruiterEmail && (
              <a href={`mailto:${job.recruiterEmail}`} className="text-[#00E5FF] hover:underline inline-flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {job.recruiterEmail}
              </a>
            )}
          </div>
        )}

        {/* Bottom CTA Bar */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/10 sticky bottom-0 bg-[#0D1117] py-4">
          <button
            onClick={() => onToggleSave(job.id)}
            className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${
              isSaved ? 'bg-amber-400/20 text-amber-400 border-amber-400/40' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" /> {isSaved ? 'Saved' : 'Save Job'}
          </button>
          <button
            onClick={() => onApply(job)}
            className="flex-1 py-3 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#4FC3F7] transition-all flex items-center justify-center gap-2 text-xs shadow-xl shadow-[#00E5FF]/20"
          >
            Apply Now <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
