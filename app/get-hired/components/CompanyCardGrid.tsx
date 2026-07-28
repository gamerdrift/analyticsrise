'use client';

import React from 'react';
import { Company } from '@/lib/services/careerService';
import { Building2, MapPin, Users, Globe, ExternalLink, ShieldCheck } from 'lucide-react';

interface CompanyCardGridProps {
  companies: Company[];
}

export default function CompanyCardGrid({ companies }: CompanyCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
      {companies.map((comp) => (
        <div
          key={comp.id}
          className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/90 hover:border-[#00E5FF]/40 transition-all space-y-4 shadow-xl relative overflow-hidden group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={comp.logo} alt={comp.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
              <div>
                <h3 className="text-base font-bold font-display text-white group-hover:text-[#00E5FF] transition-colors">
                  {comp.name}
                </h3>
                <p className="text-[11px] text-slate-400">{comp.industry}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              {comp.hiringStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{comp.headquarters}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{comp.size}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
              <span className="text-white font-bold">{comp.totalOpenJobs} Open Analytics Roles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <a href={comp.website} target="_blank" rel="noreferrer" className="hover:text-[#00E5FF] underline truncate">
                {comp.website.replace('https://', '')}
              </a>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Technologies Used:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {comp.technologies.map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[10px]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Company Perks & Benefits:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {comp.benefits.map((b) => (
                <span key={b} className="px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 text-[10px]">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <a
            href={comp.website}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00E5FF] hover:text-black font-bold transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
          >
            View Career Portal <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ))}
    </div>
  );
}
