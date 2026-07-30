'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Video,
  Play,
  CheckCircle2,
  Sparkles,
  Award,
  Brain,
  MessageSquare,
  BarChart2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';

export default function AIInterviewLabPage() {
  const [category, setCategory] = useState<'HR' | 'SQL' | 'Excel' | 'Python' | 'Tableau' | 'Power BI' | 'Statistics' | 'Business Case'>('SQL');
  const [isRecording, setIsRecording] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [evaluation, setEvaluation] = useState<{
    technicalScore: number;
    communicationScore: number;
    confidenceScore: number;
    feedback: string;
    suggestedAnswer: string;
  } | null>(null);

  const questions: Record<string, string> = {
    HR: 'Tell me about a complex data analytical conflict you resolved with cross-functional business stakeholders.',
    SQL: 'Explain how you would write a SQL query to calculate running total revenue ordered by transaction date using window functions.',
    Excel: 'Walk me through when you would select INDEX/MATCH over VLOOKUP and how dynamic array formulas improve model performance.',
    Python: 'How do you handle missing NaN data values in a 500k-row Pandas DataFrame without introducing data bias?',
    Tableau: 'Explain the difference between FIXED, INCLUDE, and EXCLUDE Level of Detail (LOD) calculations in Tableau.',
    'Power BI': 'How do you optimize a slow Power BI report with 50M rows using DAX measures and Star Schema data modeling?',
    Statistics: 'What is the statistical interpretation of a p-value = 0.03 at alpha = 0.05 in an A/B test analysis?',
    'Business Case': 'E-commerce conversion dropped 12% last week. Outline your step-by-step diagnostic workflow to isolate the root cause.',
  };

  const handleSimulateAnswer = () => {
    setEvaluation({
      technicalScore: 92,
      communicationScore: 88,
      confidenceScore: 90,
      feedback: 'Excellent breakdown of window frame syntax (ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW). Strong technical depth.',
      suggestedAnswer: 'I use SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) to compute running revenue without collapsing rows.',
    });
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Video className="w-3.5 h-3.5" /> AI INTERVIEW SIMULATION LAB v2.0
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              Live AI Technical Interview Platform
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Practice real-time technical questions across 8 domains with AI evaluation, confidence scoring, and suggested ideal answers.
            </p>
          </div>
        </div>

        {/* Domain Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(['HR', 'SQL', 'Excel', 'Python', 'Tableau', 'Power BI', 'Statistics', 'Business Case'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setEvaluation(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border shrink-0 transition-all cursor-pointer ${
                category === cat
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black border-transparent shadow-lg shadow-[#00E5FF]/20'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Question & Response Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-[#0D1117] border border-[#00E5FF]/30 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-[#00E5FF] font-bold uppercase">{category} TECHNICAL INTERVIEW</span>
              <span>Audio/Video Telemetry Active</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-400 block">AI INTERVIEWER QUESTION</span>
              <h3 className="text-base font-bold text-white leading-relaxed">{questions[category]}</h3>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-slate-300 block">Your Answer Response</label>
              <textarea
                rows={6}
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Speak or type your technical answer here..."
                className="w-full p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                  {isRecording ? 'Stop Recording' : 'Voice Answer'}
                </button>

                <button
                  onClick={handleSimulateAnswer}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Submit for AI Evaluation <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Evaluation Output */}
          <div className="p-8 rounded-3xl bg-[#0D1117] border border-white/10 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" /> AI Evaluation Breakdown
            </h3>

            {evaluation ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 text-center">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Technical</span>
                    <strong className="text-xl font-display font-black text-[#00E5FF] font-mono">
                      {evaluation.technicalScore}%
                    </strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 text-center">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Communication</span>
                    <strong className="text-xl font-display font-black text-emerald-400 font-mono">
                      {evaluation.communicationScore}%
                    </strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 text-center">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Confidence</span>
                    <strong className="text-xl font-display font-black text-amber-400 font-mono">
                      {evaluation.confidenceScore}%
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-xs">
                  <span className="font-bold text-emerald-300 block">AI Feedback Summary</span>
                  <p className="text-slate-300 leading-relaxed">{evaluation.feedback}</p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1 text-xs">
                  <span className="font-bold text-cyan-300 block">Suggested Benchmark Answer</span>
                  <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{evaluation.suggestedAnswer}</p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                Submit an answer above to generate instant technical evaluation, confidence scores, and suggested model answers.
              </div>
            )}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
