'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { careerService, Job, Company, CareerFilter } from '@/lib/services/careerService';
import EnterpriseJobGrid from './components/EnterpriseJobGrid';
import CompanyCardGrid from './components/CompanyCardGrid';
import AICareerMatchCard from './components/AICareerMatchCard';
import CareerInsightsDashboard from './components/CareerInsightsDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import {
  Briefcase,
  Search,
  Globe2,
  Building2,
  Clock,
  Filter,
  Sparkles,
  Bookmark,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileText,
  X,
  Send,
  Mail,
} from 'lucide-react';

type Tab = 'jobs' | 'companies' | 'insights' | 'recruiter' | 'saved';

export default function GetHiredPage() {
  const [activeTab, setActiveTab] = useState<Tab>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedWorkType, setSelectedWorkType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');

  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyNotes, setApplyNotes] = useState('');

  useEffect(() => {
    setSavedJobIds(careerService.getSavedJobIds());
  }, []);

  const filter: CareerFilter = {
    query: searchQuery,
    country: selectedCountry,
    workType: selectedWorkType,
    experience: selectedExperience,
    skill: selectedSkill,
  };

  const jobs = careerService.getJobs(filter);
  const companies = careerService.getCompanies();

  const handleToggleSave = (jobId: string) => {
    careerService.toggleSaveJob(jobId);
    setSavedJobIds(careerService.getSavedJobIds());
  };

  const handleOpenApplyModal = (job: Job) => {
    setApplyingJob(job);
    setApplySuccess(false);
    setApplyNotes('');
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    careerService.applyToJob(applyingJob.id, applyNotes);
    setApplySuccess(true);
    setTimeout(() => {
      setApplyingJob(null);
      setApplySuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ─── PHASE 2: HERO SECTION ──────────────────────────────────────────────── */}
        <section className="relative rounded-3xl border border-[#00E5FF]/30 bg-gradient-to-r from-[#0D1117] via-slate-900 to-[#07090E] p-8 sm:p-12 overflow-hidden shadow-2xl">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Global AI Career Intelligence Platform
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display text-white uppercase tracking-tight leading-tight">
              Discover Your Next <span className="text-[#00E5FF]">Analytics Career</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore analytics, business intelligence, data engineering, AI and data science opportunities from leading tech companies and enterprises around the world.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs font-bold">
              <button
                onClick={() => setActiveTab('jobs')}
                className="px-6 py-3.5 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#4FC3F7] transition-all shadow-xl shadow-[#00E5FF]/20 flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Search Jobs
              </button>

              <button
                disabled
                className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 cursor-not-allowed uppercase tracking-wider flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-amber-400" /> Upload Resume (Coming Soon)
              </button>
            </div>
          </div>
        </section>

        {/* ─── PHASE 3: TOP METRICS GRID ─────────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Global Open Jobs</span>
              <Briefcase className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="text-3xl font-black font-display text-white">14,280+</div>
            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% from last week
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Remote Jobs</span>
              <Globe2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black font-display text-[#00E5FF]">6,420+</div>
            <div className="text-[10px] text-slate-400">45% of total listings</div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Hiring Companies</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black font-display text-white">1,850+</div>
            <div className="text-[10px] text-slate-400">Verified Enterprise Partners</div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>New Jobs Today</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black font-display text-purple-400">340+</div>
            <div className="text-[10px] text-slate-400">Fresh daily listings</div>
          </div>
        </section>

        {/* ─── PHASE 7: AI CAREER MATCH CARD ─────────────────────────────────────── */}
        <AICareerMatchCard score={92} />

        {/* ─── SEARCH & FILTER CONTROLS BAR ─────────────────────────────────────── */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#0D1117] space-y-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 font-bold text-white uppercase text-xs">
              <Filter className="w-4 h-4 text-[#00E5FF]" /> Quick Search & Filter Controls
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('All');
                setSelectedWorkType('All');
                setSelectedExperience('All');
                setSelectedSkill('All');
              }}
              className="text-[10px] text-slate-400 hover:text-[#00E5FF] underline"
            >
              Reset Filters
            </button>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Search Keywords</label>
              <input
                type="text"
                placeholder="Search job title, skill, or employer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="All">All Countries</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="India">India</option>
                <option value="Germany">Germany</option>
                <option value="Remote">Remote Worldwide</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Work Type</label>
              <select
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
                className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="All">All Work Types</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Experience Level</label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="All">All Experience Levels</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Core Tech Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="All">All Skills</option>
                <option value="SQL">SQL</option>
                <option value="Excel">Excel Studio</option>
                <option value="Python">Python</option>
                <option value="Tableau">Tableau</option>
                <option value="Power BI">Power BI</option>
                <option value="Snowflake">Snowflake</option>
                <option value="Databricks">Databricks</option>
                <option value="AWS">AWS</option>
              </select>
            </div>
          </div>
        </section>

        {/* ─── TAB NAVIGATION BAR ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Enterprise Job Grid ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('companies')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-2 ${
              activeTab === 'companies'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" /> Hiring Companies ({companies.length})
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-2 ${
              activeTab === 'insights'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Market Insights
          </button>

          <button
            onClick={() => setActiveTab('recruiter')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-2 ${
              activeTab === 'recruiter'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Recruiter Suite
          </button>
        </div>

        {/* ─── TAB CONTENTS ───────────────────────────────────────────────────────── */}
        {activeTab === 'jobs' && (
          <EnterpriseJobGrid
            jobs={jobs}
            savedJobIds={savedJobIds}
            onToggleSave={handleToggleSave}
            onApply={handleOpenApplyModal}
          />
        )}

        {activeTab === 'companies' && <CompanyCardGrid companies={companies} />}

        {activeTab === 'insights' && <CareerInsightsDashboard />}

        {activeTab === 'recruiter' && <RecruiterDashboard />}

        {/* ─── APPLICATION SUBMISSION MODAL ─────────────────────────────────────── */}
        {applyingJob && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-mono">
            <div className="bg-[#0D1117] border border-[#00E5FF]/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setApplyingJob(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] text-[#00E5FF] uppercase tracking-widest font-bold">1-Click Job Application</span>
                <h3 className="text-xl font-bold font-display text-white">{applyingJob.title}</h3>
                <p className="text-xs text-slate-400">{applyingJob.companyName} • {applyingJob.location}</p>
              </div>

              {applySuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white uppercase">Application Tracked & Submitted!</h4>
                  <p className="text-xs text-slate-400">
                    Your profile and verified simulation scorecards have been queued for {applyingJob.companyName}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-400 uppercase text-[10px] block mb-1">Applicant Name</label>
                    <input type="text" defaultValue="Analytics Learner" required className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 uppercase text-[10px] block mb-1">Contact Email</label>
                    <input type="email" defaultValue="learner@example.com" required className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 uppercase text-[10px] block mb-1">Cover Note / Highlights (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Mention your simulation scorecards or projects..."
                      value={applyNotes}
                      onChange={(e) => setApplyNotes(e.target.value)}
                      className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#4FC3F7] transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <Send className="w-4 h-4" /> Submit Application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
