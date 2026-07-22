'use client';

import React, { useState } from 'react';
import { portfolioService, MOCK_PORTFOLIOS, PortfolioData } from '@/lib/services/portfolioService';
import {
  Globe,
  Share2,
  ExternalLink,
  ShieldCheck,
  Code,
  Award,
  Database,
  BarChart2,
  CheckCircle2,
  Lock,
  Eye,
  Sparkles,
  Copy,
} from 'lucide-react';
import Link from 'next/link';

export default function PortfolioStudio() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(MOCK_PORTFOLIOS['alex-rivera']);
  const [copyToast, setCopyToast] = useState(false);

  const publicUrl = `https://analyticsrise.com/portfolio/${portfolio.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2.5 rounded-lg bg-[#00E5FF] text-black font-bold font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> Public Portfolio link copied to clipboard!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              PORTFOLIO STUDIO
            </span>
            <span className="text-xs text-slate-400 font-mono">Public URL Active</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white uppercase tracking-wide mt-1">
            PUBLIC ANALYTICS PORTFOLIO
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-slate-300 font-mono text-xs font-bold uppercase hover:bg-slate-700 transition-all flex items-center gap-1.5"
          >
            <Copy className="w-4 h-4 text-[#00E5FF]" /> Copy Share Link
          </button>
          <Link href={`/portfolio/${portfolio.username}`} target="_blank">
            <button className="px-4 py-2 rounded-lg bg-[#00E5FF] text-black font-mono text-xs font-bold uppercase hover:bg-[#4FC3F7] transition-all flex items-center gap-1.5 shadow-lg shadow-[#00E5FF]/20">
              <Eye className="w-4 h-4" /> View Public Page <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Public URL Box */}
      <div className="glass-panel p-4 rounded-xl border border-[#00E5FF]/30 bg-[#0D1117]/90 flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 truncate">
          <Globe className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <span className="text-slate-400">Public Address:</span>
          <span className="text-white font-bold truncate">{publicUrl}</span>
        </div>
        <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase text-[10px] border border-emerald-500/20 shrink-0">
          ● {portfolio.privacy.toUpperCase()}
        </span>
      </div>

      {/* Live Interactive Portfolio Component Preview */}
      <div className="p-8 rounded-2xl border border-white/10 bg-[#07090D] space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#4FC3F7] flex items-center justify-center font-bold text-black text-2xl font-display shadow-lg shadow-[#00E5FF]/20">
              {portfolio.fullName.substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-2xl font-black text-white font-display uppercase tracking-wide mt-2">
              {portfolio.fullName}
            </h2>
            <p className="text-xs text-[#00E5FF] font-mono font-bold">{portfolio.headline}</p>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{portfolio.bio}</p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {portfolio.socials.linkedin && (
              <a href={portfolio.socials.linkedin} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[#00E5FF]">
                LinkedIn
              </a>
            )}
            {portfolio.socials.github && (
              <a href={portfolio.socials.github} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[#00E5FF]">
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Skills Matrix */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#00E5FF]" /> Verified Technical Skills Matrix
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.skills.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#0D1117] border border-white/5 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{s.name}</span>
                  <span className="text-[#00E5FF] font-bold">{s.rating}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#00E5FF] rounded-full" style={{ width: `${s.rating}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Cryptographic Certificates */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> Cryptographic Ledger Certificates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.certifications.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-[#0D1117] border border-emerald-500/20 font-mono text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white uppercase text-xs">{c.title}</h4>
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    VERIFIED
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Issuer: {c.issuer} • Date: {c.issueDate}</p>
                <div className="text-[9px] text-slate-400 bg-white/5 p-2 rounded truncate border border-white/5">
                  Hash: {c.hash}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Projects Showcase */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4 text-[#00E5FF]" /> Hands-on Simulation Projects
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {portfolio.projects.map((p) => (
              <div key={p.id} className="p-5 rounded-xl bg-[#0D1117] border border-white/10 font-mono text-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-[#00E5FF] uppercase px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-slate-500">Verified Workstation</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-display uppercase tracking-wide">{p.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{p.description}</p>

                  {p.codeSnippet && (
                    <div className="mt-3 p-3 rounded bg-[#05070B] border border-white/5 text-[10px] text-[#00E5FF] overflow-x-auto">
                      <pre>{p.codeSnippet}</pre>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-4 text-[10px] text-slate-400">
                    {p.metrics?.map((m, i) => (
                      <span key={i}>
                        {m.label}: <strong className="text-white">{m.value}</strong>
                      </span>
                    ))}
                  </div>
                  {p.demoUrl && (
                    <Link href={p.demoUrl}>
                      <button className="text-[10px] text-[#00E5FF] font-bold hover:underline flex items-center gap-1">
                        Run Demo <ExternalLink className="w-3 h-3" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
