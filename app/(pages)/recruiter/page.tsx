'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bookmark,
  Mail,
  ShieldCheck,
  Award,
  Zap,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Briefcase,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';

interface CandidateProfile {
  id: string;
  username: string;
  name: string;
  roleTitle: string;
  location: string;
  readinessScore: number;
  xpTotal: number;
  skills: string[];
  certifications: string[];
  avatarUrl: string;
  saved: boolean;
}

export default function RecruiterDiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [minReadiness, setMinReadiness] = useState<number>(75);

  const [candidates, setCandidates] = useState<CandidateProfile[]>([
    {
      id: 'cand_1',
      username: 'alex-rivera',
      name: 'Alex Rivera',
      roleTitle: 'Senior Data Analyst',
      location: 'San Francisco, CA (Remote)',
      readinessScore: 92,
      xpTotal: 1450,
      skills: ['SQL Window Functions', 'Microsoft Excel', 'Power BI DAX', 'Python Pandas'],
      certifications: ['AnalyticsRise Relational SQL Specialist'],
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      saved: false,
    },
    {
      id: 'cand_2',
      username: 'elena-rostova',
      name: 'Elena Rostova',
      roleTitle: 'Lead BI Engineer',
      location: 'New York, NY (Hybrid)',
      readinessScore: 96,
      xpTotal: 3420,
      skills: ['Tableau LOD', 'Power BI DAX', 'Snowflake DWH', 'SQL Performance'],
      certifications: ['Tableau Certified Data Analyst', 'AnalyticsRise Excel Financial Architect'],
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      saved: true,
    },
    {
      id: 'cand_3',
      username: 'marcus-vance',
      name: 'Marcus Vance',
      roleTitle: 'Data Scientist',
      location: 'Austin, TX (Remote)',
      readinessScore: 88,
      xpTotal: 2980,
      skills: ['Python Scikit-Learn', 'Pandas Wrangling', 'SQL Querying', 'Statistics'],
      certifications: ['AnalyticsRise Python Data Scientist'],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      saved: false,
    },
  ]);

  const toggleSave = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, saved: !c.saved } : c))
    );
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSkill = selectedSkill === 'All' || c.skills.some((s) => s.includes(selectedSkill));
    const matchesReadiness = c.readinessScore >= minReadiness;
    return matchesSearch && matchesSkill && matchesReadiness;
  });

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> RECRUITER DISCOVERY PLATFORM
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              Verified Candidate Talent Search
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Filter candidates by verified simulator scores, cryptographic certificates, XP, and AI career readiness.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, role, or skill (e.g. SQL, Power BI)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="All">All Skill Tags</option>
                <option value="SQL">SQL</option>
                <option value="Excel">Excel</option>
                <option value="Power BI">Power BI</option>
                <option value="Python">Python</option>
                <option value="Tableau">Tableau</option>
              </select>

              <select
                value={minReadiness}
                onChange={(e) => setMinReadiness(Number(e.target.value))}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value={70}>Min Readiness: 70%+</option>
                <option value={85}>Min Readiness: 85%+</option>
                <option value={90}>Min Readiness: 90%+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidate List */}
        <div className="space-y-4">
          {filteredCandidates.map((cand) => (
            <div
              key={cand.id}
              className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 hover:border-[#00E5FF]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#4FC3F7] p-0.5 shrink-0">
                  <div className="w-full h-full bg-[#0D1117] rounded-2xl flex items-center justify-center font-bold text-white font-mono text-sm">
                    {cand.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{cand.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-[#00E5FF] font-mono font-bold mt-0.5">{cand.roleTitle}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> {cand.location}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cand.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">AI Readiness</span>
                  <strong className="text-xl font-display font-black text-emerald-400 font-mono">
                    {cand.readinessScore}%
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSave(cand.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      cand.saved
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <Link href={`/u/${cand.username}`}>
                    <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black uppercase tracking-wider hover:shadow-lg hover:shadow-[#00E5FF]/20 transition-all flex items-center gap-1.5 cursor-pointer">
                      View Profile <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
