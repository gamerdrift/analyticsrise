'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { careerService, Job, Company, CareerFilter, Application, ApplicationStatus } from '@/lib/services/careerService';
import { jobAggregatorEngine } from '@/lib/services/jobAggregator';
import EnterpriseJobGrid from './components/EnterpriseJobGrid';
import CompanyCardGrid from './components/CompanyCardGrid';
import AICareerMatchCard from './components/AICareerMatchCard';
import CareerInsightsDashboard from './components/CareerInsightsDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import JobDetailDrawer from './components/JobDetailDrawer';
import ApplicationTracker from './components/ApplicationTracker';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import EmployerProfileModal from './components/EmployerProfileModal';
import AICareerAdvisorModal from './components/AICareerAdvisorModal';
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
  Award,
  Crown,
  Brain,
} from 'lucide-react';

type Tab = 'jobs' | 'companies' | 'tracker' | 'insights' | 'recruiter';

export default function GetHiredPage() {
  const [activeTab, setActiveTab] = useState<Tab>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedWorkType, setSelectedWorkType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] = useState(false);

  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeDrawerJob, setActiveDrawerJob] = useState<Job | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyNotes, setApplyNotes] = useState('');

  const [isResumeAnalyzerOpen, setIsResumeAnalyzerOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  useEffect(() => {
    setSavedJobIds(careerService.getSavedJobIds());
    setApplications(careerService.getApplications());
  }, []);

  const filter: CareerFilter = {
    query: searchQuery,
    country: selectedCountry,
    workType: selectedWorkType,
    experience: selectedExperience,
    skill: selectedSkill,
    source: selectedSource,
    visaSponsorshipOnly,
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
    setIsApplyModalOpen(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    careerService.applyToJob(applyingJob.id, applyNotes);
    setApplications(careerService.getApplications());
    setApplySuccess(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setApplyingJob(null);
      setApplySuccess(false);
    }, 1800);
  };

  const handleUpdateAppStatus = (appId: string, status: ApplicationStatus, note?: string) => {
    const updated = careerService.updateApplicationStatus(appId, status, note);
    setApplications(updated);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ─── PHASE 2: HERO SECTION ──────────────────────────────────────────────── */}
        <section className="relative rounded-3xl border border-[#00E5FF]/30 bg-gradient-to-r from-[#0D1117] via-slate-900 to-[#07090E] p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-mono text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" /> Global Universal Job Aggregator
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold uppercase">
                <Crown className="w-3 h-3" /> Premium Intelligence Active
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display text-white uppercase tracking-tight leading-tight">
              Discover Your Next <span className="text-[#00E5FF]">Analytics Career</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore analytics, business intelligence, data engineering, AI and data science opportunities aggregated live from 10 global channels (LinkedIn, Greenhouse, Lever, Workday, Remote.com, USAJobs).
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs font-bold">
              <button
                onClick={() => setActiveTab('jobs')}
                className="px-6 py-3.5 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#4FC3F7] transition-all shadow-xl shadow-[#00E5FF]/20 flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Search Global Jobs
              </button>

              <button
                onClick={() => setIsResumeAnalyzerOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#00E5FF]/40 transition-all uppercase tracking-wider flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#00E5FF]" /> AI ATS Resume Scanner
              </button>

              <button
                onClick={() => setIsAiAdvisorOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all uppercase tracking-wider flex items-center gap-2"
              >
                <Brain className="w-4 h-4 text-purple-400" /> AI Interview Simulator
              </button>
            </div>
          </div>
        </section>

        {/* ─── PHASE 3: TOP METRICS GRID ─────────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Aggregated Global Jobs</span>
              <Briefcase className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="text-3xl font-black font-display text-white">14,280+</div>
            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 10 Aggregated Channels
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Remote Worldwide Jobs</span>
              <Globe2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black font-display text-[#00E5FF]">6,420+</div>
            <div className="text-[10px] text-slate-400">45% of total listings</div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Verified Employers</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black font-display text-white">1,850+</div>
            <div className="text-[10px] text-slate-400">Glassdoor Rated Partners</div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Tracked Applications</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black font-display text-purple-400">{applications.length}</div>
            <div className="text-[10px] text-slate-400">8-Stage Pipeline Active</div>
          </div>
        </section>

        {/* ─── PHASE 7: AI CAREER MATCH CARD ─────────────────────────────────────── */}
        <AICareerMatchCard score={92} />

        {/* ─── PHASE 3: ADVANCED SEARCH & FILTER CONTROLS ───────────────────────── */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#0D1117] space-y-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 font-bold text-white uppercase text-xs">
              <Filter className="w-4 h-4 text-[#00E5FF]" /> Universal Multi-Tier Search Engine
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('All');
                setSelectedWorkType('All');
                setSelectedExperience('All');
                setSelectedSkill('All');
                setSelectedSource('All');
                setVisaSponsorshipOnly(false);
              }}
              className="text-[10px] text-slate-400 hover:text-[#00E5FF] underline"
            >
              Reset All Filters
            </button>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
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

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Provider Source Channel</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="All">All Ingestion Providers (10)</option>
                <option value="LinkedIn">LinkedIn Jobs API</option>
                <option value="Greenhouse">Greenhouse ATS</option>
                <option value="Lever">Lever ATS</option>
                <option value="Workday">Workday Enterprise</option>
                <option value="Remote">Remote.com Feed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <input
              type="checkbox"
              id="visaCheck"
              checked={visaSponsorshipOnly}
              onChange={(e) => setVisaSponsorshipOnly(e.target.checked)}
              className="accent-[#00E5FF] w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="visaCheck" className="text-xs text-slate-300 font-bold cursor-pointer">
              Show Visa Sponsorship Available Jobs Only
            </label>
          </div>
        </section>

        {/* ─── TAB NAVIGATION BAR ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'jobs'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Enterprise Job Grid ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'tracker'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" /> Application Tracker ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab('companies')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'companies'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" /> Hiring Companies ({companies.length})
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'insights'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Market Insights
          </button>

          <button
            onClick={() => setActiveTab('recruiter')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'recruiter'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Recruiter Portal
          </button>
        </div>

        {/* ─── TAB CONTENTS ───────────────────────────────────────────────────────── */}
        {activeTab === 'jobs' && (
          <EnterpriseJobGrid
            jobs={jobs}
            savedJobIds={savedJobIds}
            onToggleSave={handleToggleSave}
            onApply={(j) => setActiveDrawerJob(j)}
          />
        )}

        {activeTab === 'tracker' && (
          <ApplicationTracker
            applications={applications}
            onUpdateStatus={handleUpdateAppStatus}
          />
        )}

        {activeTab === 'companies' && <CompanyCardGrid companies={companies} />}

        {activeTab === 'insights' && <CareerInsightsDashboard />}

        {activeTab === 'recruiter' && <RecruiterDashboard />}

        {/* ─── PHASE 5: JOB DETAIL SIDE-DRAWER ───────────────────────────────────── */}
        <JobDetailDrawer
          job={activeDrawerJob}
          isOpen={!!activeDrawerJob}
          isSaved={activeDrawerJob ? savedJobIds.includes(activeDrawerJob.id) : false}
          onClose={() => setActiveDrawerJob(null)}
          onToggleSave={handleToggleSave}
          onApply={handleOpenApplyModal}
        />

        {/* ─── PHASE 8: AI RESUME ANALYZER MODAL ──────────────────────────────────── */}
        <ResumeAnalyzer
          isOpen={isResumeAnalyzerOpen}
          onClose={() => setIsResumeAnalyzerOpen(false)}
        />

        {/* ─── PHASE 12: AI CAREER ADVISOR MODAL ──────────────────────────────────── */}
        <AICareerAdvisorModal
          isOpen={isAiAdvisorOpen}
          onClose={() => setIsAiAdvisorOpen(false)}
        />

        {/* ─── PHASE 10: EMPLOYER PROFILE MODAL ──────────────────────────────────── */}
        <EmployerProfileModal
          company={selectedCompany}
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />

        {/* ─── APPLICATION SUBMISSION MODAL ─────────────────────────────────────── */}
        {isApplyModalOpen && applyingJob && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4 font-mono">
            <div className="bg-[#0D1117] border border-[#00E5FF]/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] text-[#00E5FF] uppercase tracking-widest font-bold">Universal Application Submission</span>
                <h3 className="text-xl font-bold font-display text-white">{applyingJob.title}</h3>
                <p className="text-xs text-slate-400">{applyingJob.companyName} • {applyingJob.location}</p>
              </div>

              {applySuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white uppercase">Application Tracked & Submitted!</h4>
                  <p className="text-xs text-slate-400">
                    Your profile and verified simulation scorecards have been queued for {applyingJob.companyName}. Added to Application Tracker.
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
                      placeholder="Mention your simulation scorecards or project links..."
                      value={applyNotes}
                      onChange={(e) => setApplyNotes(e.target.value)}
                      className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#4FC3F7] transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <Send className="w-4 h-4" /> Confirm & Submit Application
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
