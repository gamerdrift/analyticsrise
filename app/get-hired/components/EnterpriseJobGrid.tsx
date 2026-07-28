'use client';

import React, { useState } from 'react';
import { Job, careerService } from '@/lib/services/careerService';
import { Search, Download, ArrowUpDown, Bookmark, CheckCircle2, ExternalLink, MapPin, Briefcase } from 'lucide-react';

interface EnterpriseJobGridProps {
  jobs: Job[];
  savedJobIds: string[];
  onToggleSave: (jobId: string) => void;
  onApply: (job: Job) => void;
}

export default function EnterpriseJobGrid({ jobs, savedJobIds, onToggleSave, onApply }: EnterpriseJobGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'title' | 'companyName' | 'salaryMax' | 'postedDate'>('postedDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Filter & Sort
  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') valA = (valA as string).toLowerCase();
    if (typeof valB === 'string') valB = (valB as string).toLowerCase();

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedJobs.length / pageSize) || 1;
  const paginatedJobs = sortedJobs.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: 'title' | 'companyName' | 'salaryMax' | 'postedDate') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#0D1117]/90">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search grid by title, company..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#05070B] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => careerService.exportJobsToCSV(sortedJobs)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[#00E5FF]/40 transition-all flex items-center gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#00E5FF]" /> Export CSV
          </button>
          <span className="text-slate-500 text-[10px] hidden sm:inline">
            Showing <strong className="text-white">{sortedJobs.length}</strong> Jobs
          </span>
        </div>
      </div>

      {/* Enterprise Data Grid Table */}
      <div className="rounded-xl border border-white/10 bg-[#0D1117] overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10 bg-[#05070B]/80 text-[10px] text-slate-400 uppercase tracking-widest sticky top-0 backdrop-blur-md">
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('companyName')}>
                <div className="flex items-center gap-1">Company <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-1">Job Title <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-4">Location</th>
              <th className="p-4">Work Type</th>
              <th className="p-4">Experience</th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('salaryMax')}>
                <div className="flex items-center gap-1">Salary <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('postedDate')}>
                <div className="flex items-center gap-1">Posted <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No analytics jobs match your active grid query filters.
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);
                return (
                  <tr key={job.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <img src={job.companyLogo} alt={job.companyName} className="w-8 h-8 rounded-lg object-cover border border-white/10" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{job.companyName}</span>
                          {job.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] uppercase border border-[#00E5FF]/20">
                              Featured
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-normal">{job.department}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      <div className="text-sm font-display text-white group-hover:text-[#00E5FF] transition-colors">
                        {job.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {job.requiredSkills.map((sk) => (
                          <span key={sk} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-400 border border-white/5">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          job.workType === 'Remote'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : job.workType === 'Hybrid'
                            ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {job.workType}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">{job.experience}</td>
                    <td className="p-4 font-bold text-white text-xs">
                      {job.currency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-500 text-[10px]">{job.postedDate}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onToggleSave(job.id)}
                          className={`p-2 rounded-lg border transition-all ${
                            isSaved
                              ? 'bg-amber-400/20 text-amber-400 border-amber-400/40'
                              : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                          }`}
                          title={isSaved ? 'Unsave Job' : 'Save Job'}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onApply(job)}
                          className="px-3 py-1.5 rounded-lg bg-[#00E5FF] text-black font-bold hover:bg-[#4FC3F7] transition-all text-xs flex items-center gap-1.5"
                        >
                          Apply <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-[#0D1117]/80">
        <span className="text-[10px] text-slate-500">
          Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:text-white"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
