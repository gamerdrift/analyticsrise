'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { CompanyService } from '@/lib/services/companyService';

interface CompanyDetailClientProps {
  companyId: string;
}

export default function CompanyDetailClient({ companyId }: CompanyDetailClientProps) {
  const company = CompanyService.getCompanyById(companyId);

  if (!company) return null;

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto w-full space-y-8">
        {/* Company Header Banner */}
        <div className="p-8 rounded-3xl bg-[#0D1117] border border-[#00E5FF]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#4FC3F7] p-1 shrink-0">
              <div className="w-full h-full bg-[#0D1117] rounded-xl flex items-center justify-center font-bold text-white font-mono text-xl">
                {company.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white">{company.name}</h1>
                {company.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED EMPLOYER
                  </span>
                )}
              </div>
              <p className="text-xs text-[#00E5FF] font-mono">{company.industry}</p>
              <p className="text-xs text-slate-400 mt-2 max-w-xl">{company.overview}</p>
            </div>
          </div>

          <Link href="/get-hired">
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center gap-2 cursor-pointer">
              View {company.openPositionsCount} Open Jobs <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Telemetry Stats & Tech Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Hired This Year</span>
            <strong className="text-3xl font-display font-black text-white font-mono">
              {company.hiringStats.totalHiredThisYear} Engineers
            </strong>
          </div>
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Average Compensation</span>
            <strong className="text-3xl font-display font-black text-emerald-400 font-mono">
              {company.hiringStats.avgSalary}
            </strong>
          </div>
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Remote Telemetry</span>
            <strong className="text-3xl font-display font-black text-[#00E5FF] font-mono">
              {company.hiringStats.remotePercentage}% Remote
            </strong>
          </div>
        </div>

        {/* Benefits & Employee Testimonial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Benefits & Perks</h3>
            <div className="space-y-2 text-xs">
              {company.benefits.map((b, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">Verified Employee Spotlight</h3>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                &ldquo;{company.employeeTestimonial.quote}&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 text-xs">
              <strong className="text-white block">{company.employeeTestimonial.author}</strong>
              <span className="text-slate-400 text-[11px] font-mono">{company.employeeTestimonial.role}</span>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
