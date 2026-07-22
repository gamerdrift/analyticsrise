'use client';

import React, { useState } from 'react';
import {
  jobService,
  MOCK_JOBS,
  INITIAL_APPLICATIONS,
  JobPosting,
  ApplicationTrackerItem,
} from '@/lib/services/jobService';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Building,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function JobHub() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [keyword, setKeyword] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobList, setJobList] = useState<JobPosting[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>(INITIAL_APPLICATIONS);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  const handleSearch = () => {
    const results = jobService.getJobs({ keyword, remoteOnly });
    setJobList(results);
  };

  const handleApply = (job: JobPosting) => {
    const existing = applications.find((a) => a.jobId === job.id);
    if (!existing) {
      const newApp: ApplicationTrackerItem = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salaryRange,
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
      };
      setApplications([newApp, ...applications]);
    }
    setAppliedToast(job.title);
    setTimeout(() => setAppliedToast(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {appliedToast && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-bold font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> Applied to {appliedToast}! Tracker updated.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-mono font-bold uppercase tracking-widest">
              JOB INTELLIGENCE HUB
            </span>
            <span className="text-xs text-slate-400 font-mono">Matched to Skill Profile</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white uppercase tracking-wide mt-1">
            ANALYTICS CAREER OPPORTUNITIES & TRACKER
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#0D1117] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'jobs'
                ? 'bg-[#00E5FF] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recommended Jobs ({jobList.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'applications'
                ? 'bg-[#00E5FF] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Application Tracker ({applications.length})
          </button>
        </div>
      </div>

      {/* ─── TAB 1: RECOMMENDED JOBS ────────────────────────────────────────── */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 bg-[#0D1117]/90 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search jobs by role, tool (SQL, Power BI, Python)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 pl-9 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="rounded border-slate-700 text-[#00E5FF] focus:ring-0"
              />
              <span>Remote Only</span>
            </label>

            <button
              onClick={handleSearch}
              className="px-5 py-2.5 rounded-lg bg-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#4FC3F7] transition-all shrink-0"
            >
              Filter Roles
            </button>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            {jobList.map((job) => (
              <div
                key={job.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 hover:border-[#00E5FF]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20 uppercase">
                      {job.matchScore}% Skill Match
                    </span>
                    {job.isRemote && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase">
                        Remote
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">• {job.postedDate}</span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-wide">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-500" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <DollarSign className="w-3.5 h-3.5" /> {job.salaryRange}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.skillsRequired.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0 w-full md:w-auto justify-between md:justify-start">
                  <button
                    onClick={() => handleApply(job)}
                    className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#4FC3F7] transition-all flex items-center gap-1.5 shadow-lg shadow-[#00E5FF]/10"
                  >
                    Quick Apply <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: APPLICATION TRACKER ────────────────────────────────────────── */}
      {activeTab === 'applications' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Saved', 'Applied', 'Interviewing', 'Offer'].map((statusKey) => {
              const statusApps = applications.filter((a) => a.status === statusKey);
              return (
                <div key={statusKey} className="glass-panel p-4 rounded-xl border border-white/10 bg-[#0D1117]/90 space-y-3 min-h-[400px]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-white uppercase text-xs">{statusKey}</span>
                    <span className="text-[10px] text-[#00E5FF] font-bold bg-[#00E5FF]/10 px-2 py-0.5 rounded">
                      {statusApps.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {statusApps.map((app) => (
                      <div key={app.id} className="p-3.5 rounded-lg bg-[#05070B] border border-white/5 space-y-2">
                        <h4 className="font-bold text-white font-display uppercase tracking-wider text-xs">
                          {app.title}
                        </h4>
                        <p className="text-[10px] text-slate-400">{app.company} • {app.salary}</p>
                        {app.notes && (
                          <p className="text-[9px] text-[#00E5FF] bg-[#00E5FF]/5 p-2 rounded border border-[#00E5FF]/10">
                            {app.notes}
                          </p>
                        )}
                        <span className="text-[9px] text-slate-500 block">Applied: {app.appliedDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
