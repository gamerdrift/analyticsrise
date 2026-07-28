'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, AlertTriangle, CheckCircle2, ArrowRight, Upload, Brain } from 'lucide-react';
import Link from 'next/link';

interface ResumeAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeAnalyzer({ isOpen, onClose }: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  if (!isOpen) return null;

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-[#0D1117] border border-[#00E5FF]/40 rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-bold uppercase border border-[#00E5FF]/20">
              <Sparkles className="w-3.5 h-3.5" /> AI Resume Intelligence Engine
            </div>
            <h2 className="text-xl font-bold font-display text-white uppercase">ATS Resume Optimizer</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {!analyzed ? (
          <form onSubmit={handleRunAnalysis} className="space-y-4">
            <p className="text-slate-400 text-xs">
              Paste your resume text or executive summary below to evaluate ATS keywords, technical gaps, and course recommendations.
            </p>
            <textarea
              rows={6}
              placeholder="Paste your resume content, technical summary, or target role experience here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              required
              className="w-full bg-[#05070B] border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] text-xs leading-relaxed"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !resumeText.trim()}
              className="w-full py-3.5 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#4FC3F7] transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-[#00E5FF]/20 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-4 h-4 animate-spin" /> Analyzing ATS Keywords...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run AI Resume Analysis
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* ATS Score Overview */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">ATS Compatibility Score</span>
                <span className="text-3xl font-black font-display text-white">84 / 100</span>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-400/20 text-emerald-300 font-bold text-xs">Strong Fit</span>
            </div>

            {/* Keyword Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/10 bg-[#05070B] space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Matched Keywords (8)
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['SQL Queries', 'Excel Studio', 'Data Modeling', 'Power BI', 'Python', 'Tableau', 'Reporting', 'ETL'].map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#05070B] space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Missing High-Demand Keywords (3)
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['dbt', 'Snowflake DW', 'DAX Measures'].map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/20">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Recommendation */}
            <div className="p-4 rounded-xl border border-[#00E5FF]/20 bg-[#05070B] space-y-2">
              <span className="text-[10px] text-[#00E5FF] font-bold uppercase block">Recommended AnalyticsRise Course</span>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">Snowflake & dbt Enterprise Masterclass</h4>
                  <p className="text-slate-400 text-[10px]">Fills 2 missing resume keywords for Senior Analytics roles</p>
                </div>
                <Link
                  href="/courses"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-[#00E5FF] text-black font-bold hover:bg-[#4FC3F7] transition-all text-xs flex items-center gap-1 shrink-0"
                >
                  Enroll <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <button
              onClick={() => setAnalyzed(false)}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase"
            >
              Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
