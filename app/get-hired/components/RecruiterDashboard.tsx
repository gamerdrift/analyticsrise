'use client';

import React, { useState } from 'react';
import { UserCheck, Briefcase, Plus, Search, Building, Award, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export default function RecruiterDashboard() {
  const [activeSubTab, setActiveSubTab] = useState<'candidates' | 'postings' | 'companyProfile'>('candidates');

  const candidatePool = [
    {
      name: 'Alex Rivera',
      role: 'Senior Data Analyst',
      xp: '2,450 XP',
      score: '96% Match',
      skills: ['SQL', 'Excel Studio', 'Power BI', 'Python'],
      certificates: ['Certified Analytics Specialist (CAS-101)', 'Excel Pro Cert'],
      location: 'New York, US',
    },
    {
      name: 'Elena Rostova',
      role: 'Analytics Engineer',
      xp: '1,980 XP',
      score: '92% Match',
      skills: ['SQL', 'Snowflake', 'dbt', 'Python'],
      certificates: ['Data Engineering Simulation Cert'],
      location: 'London, UK',
    },
    {
      name: 'Priya Sharma',
      role: 'Business Intelligence Lead',
      xp: '3,100 XP',
      score: '98% Match',
      skills: ['Power BI', 'DAX', 'SQL', 'Tableau', 'Excel'],
      certificates: ['Certified Analytics Specialist', 'Power BI Enterprise'],
      location: 'Bengaluru, India',
    },
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Recruiter Header */}
      <div className="p-6 rounded-2xl border border-[#00E5FF]/30 bg-[#0D1117] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-bold uppercase border border-[#00E5FF]/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Recruiter Suite Active
          </div>
          <h2 className="text-xl font-bold font-display text-white uppercase mt-2">
            Employer & Talent Portal
          </h2>
          <p className="text-slate-400 text-xs">
            Source verified analytics talent, publish company roles, and review certified simulation scorecards.
          </p>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold uppercase hover:bg-[#4FC3F7] transition-all flex items-center gap-2 text-xs shadow-lg shadow-[#00E5FF]/20">
          <Plus className="w-4 h-4" /> Post New Job Role
        </button>
      </div>

      {/* Recruiter Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSubTab('candidates')}
          className={`px-4 py-2 rounded-lg font-bold uppercase transition-all flex items-center gap-2 ${
            activeSubTab === 'candidates'
              ? 'bg-[#00E5FF] text-black'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Certified Candidate Pool
        </button>
        <button
          onClick={() => setActiveSubTab('postings')}
          className={`px-4 py-2 rounded-lg font-bold uppercase transition-all flex items-center gap-2 ${
            activeSubTab === 'postings'
              ? 'bg-[#00E5FF] text-black'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Active Job Postings (3)
        </button>
        <button
          onClick={() => setActiveSubTab('companyProfile')}
          className={`px-4 py-2 rounded-lg font-bold uppercase transition-all flex items-center gap-2 ${
            activeSubTab === 'companyProfile'
              ? 'bg-[#00E5FF] text-black'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" /> Employer Profile Settings
        </button>
      </div>

      {/* Sub-tab: Candidate Search */}
      {activeSubTab === 'candidates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidatePool.map((c) => (
              <div key={c.name} className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/90 space-y-4 hover:border-[#00E5FF]/40 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">{c.name}</h3>
                    <p className="text-slate-400 text-xs">{c.role}</p>
                    <span className="text-[10px] text-slate-500">{c.location}</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] font-bold text-[10px] border border-[#00E5FF]/20">
                    {c.score}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Verified Skills:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {c.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Certificates:</span>
                  {c.certificates.map((cert) => (
                    <div key={cert} className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Award className="w-3 h-3" /> {cert}
                    </div>
                  ))}
                </div>

                <a
                  href={`mailto:support@analyticsrise.com?subject=Recruiter Candidate Contact Inquiry: ${c.name}`}
                  className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00E5FF] hover:text-black font-bold transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" /> Request Interview
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Active Postings */}
      {activeSubTab === 'postings' && (
        <div className="p-8 rounded-2xl border border-white/10 bg-[#0D1117] text-center space-y-3">
          <Briefcase className="w-10 h-10 text-[#00E5FF] mx-auto" />
          <h3 className="text-base font-bold text-white uppercase font-display">Active Employer Listings</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            You have 3 active job postings receiving candidate applications. Manage ATS integration or pipeline stages.
          </p>
        </div>
      )}

      {/* Sub-tab: Employer Profile */}
      {activeSubTab === 'companyProfile' && (
        <div className="p-8 rounded-2xl border border-white/10 bg-[#0D1117] space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-white uppercase font-display">Employer Branding Profile</h3>
          <p className="text-slate-400 text-xs">
            Manage your company description, technology stack tags, employee headcount, and corporate benefits.
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Company Name</label>
              <input type="text" defaultValue="Enterprise Partner Org" className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2 text-white text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Official Career Site URL</label>
              <input type="text" defaultValue="https://analyticsrise.com/careers" className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2 text-white text-xs" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
