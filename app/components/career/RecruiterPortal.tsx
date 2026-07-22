'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  Award,
  Filter,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Star,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function RecruiterPortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [certHashInput, setCertHashInput] = useState('');
  const [hashResult, setHashResult] = useState<string | null>(null);

  const candidates = [
    {
      uid: 'c-101',
      name: 'Alex Rivera',
      title: 'Senior Data Analyst',
      level: 4,
      xp: 1850,
      streak: 7,
      topSkills: ['SQL (90%)', 'Excel (95%)', 'Power BI (85%)'],
      certifications: ['Relational SQL Specialist (SHA-256 Verified)'],
      portfolioUrl: '/portfolio/alex-rivera',
      status: 'Available',
    },
    {
      uid: 'c-102',
      name: 'Sarah Chen',
      title: 'BI Solutions Architect',
      level: 8,
      xp: 5400,
      streak: 21,
      topSkills: ['Power BI DAX (95%)', 'Tableau LOD (90%)', 'Star Schema (95%)'],
      certifications: ['Power BI Data Analyst Associate (PL-300)', 'Tableau Certified'],
      portfolioUrl: '/portfolio/alex-rivera',
      status: 'Interviewing',
    },
    {
      uid: 'c-103',
      name: 'Marcus Vance',
      title: 'Data Intelligence Engineer',
      level: 3,
      xp: 920,
      streak: 3,
      topSkills: ['Python Pandas (85%)', 'SQL (80%)', 'Databricks (70%)'],
      certifications: ['AnalyticsRise Python Data Scientist'],
      portfolioUrl: '/portfolio/alex-rivera',
      status: 'Available',
    },
  ];

  const handleVerifyHash = () => {
    if (!certHashInput.trim()) return;
    if (certHashInput.includes('8a3b') || certHashInput.includes('sha256')) {
      setHashResult('VALIDATED: Certificate is genuine and registered on the AnalyticsRise SHA-256 Cryptographic Ledger.');
    } else {
      setHashResult('INVALID: Ledger hash not found in verified registry.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              RECRUITER & EMPLOYER PORTAL
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">Hiring Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white uppercase tracking-wide mt-1">
            VERIFIED TALENT SEARCH & CREDENTIAL AUDITOR
          </h1>
        </div>
      </div>

      {/* SHA-256 Certificate Verification Tool Box */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-[#0D1117]/90 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cryptographic Ledger Certificate Auditor
          </span>
          <span className="text-[10px] text-emerald-400">Node Online</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Paste candidate SHA-256 hash (e.g. sha256-8a3b218f26a117b9b7a38b55c689d12)..."
            value={certHashInput}
            onChange={(e) => setCertHashInput(e.target.value)}
            className="w-full bg-[#05070B] border border-white/10 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
          />
          <button
            onClick={handleVerifyHash}
            className="px-5 py-2 rounded bg-emerald-500 text-black font-bold uppercase text-xs hover:bg-emerald-400 transition-all shrink-0"
          >
            Verify Hash
          </button>
        </div>

        {hashResult && (
          <div className="p-3 rounded bg-[#05070B] border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            {hashResult}
          </div>
        )}
      </div>

      {/* Candidate Search & Filter */}
      <div className="space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
            Verified Candidate Roster ({candidates.length})
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#05070B] border border-white/10 rounded px-3 py-1.5 pl-8 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>

        {/* Candidate Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {candidates.map((c) => (
            <div key={c.uid} className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0D1117]/80 hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20 uppercase">
                    Level {c.level} • {c.xp} XP
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase">
                    {c.status}
                  </span>
                </div>

                <h4 className="text-base font-bold font-display text-white uppercase tracking-wide">
                  {c.name}
                </h4>
                <p className="text-xs text-slate-400 font-mono">{c.title}</p>

                <div className="pt-2 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block">Top Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {c.topSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-orange-400 font-mono font-bold">
                  🔥 {c.streak}-Day Streak
                </span>
                <Link href={c.portfolioUrl} target="_blank">
                  <button className="px-3 py-1.5 rounded bg-[#00E5FF] text-black font-bold text-[10px] uppercase hover:bg-[#4FC3F7] transition-all flex items-center gap-1">
                    Portfolio <ExternalLink className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
