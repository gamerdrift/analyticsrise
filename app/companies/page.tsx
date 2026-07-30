'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, ArrowRight, Users, Briefcase, ChevronRight } from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { CompanyService } from '@/lib/services/companyService';

export default function VerifiedCompanyDirectoryPage() {
  const companies = CompanyService.getCompanies();

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Building2 className="w-3.5 h-3.5" /> VERIFIED EMPLOYER DIRECTORY
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              Hiring Tech & Analytics Employers
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore verified company tech stacks, benefits, hiring telemetry, and open analytics opportunities.
            </p>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {companies.map((comp) => (
            <div
              key={comp.id}
              className="p-8 rounded-3xl bg-[#0D1117] border border-white/10 hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={comp.logoUrl}
                      alt={comp.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                        {comp.name}
                        {comp.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                      </h3>
                      <span className="text-xs text-[#00E5FF] font-mono">{comp.industry}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase font-mono">
                    {comp.openPositionsCount} Open Jobs
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{comp.overview}</p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {comp.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Avg Salary: {comp.hiringStats.avgSalary}</span>
                <Link
                  href={`/companies/${comp.id}`}
                  className="text-[#00E5FF] font-bold hover:underline flex items-center gap-1"
                >
                  View Profile <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
