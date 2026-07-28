'use client';

import React, { useState } from 'react';
import { Sparkles, Brain, MessageSquare, Award, BookOpen, DollarSign, X } from 'lucide-react';

interface AICareerAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AICareerAdvisorModal({ isOpen, onClose }: AICareerAdvisorModalProps) {
  const [topic, setTopic] = useState<'interview' | 'resume' | 'salary' | 'roadmap'>('interview');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (topic === 'interview') {
        setResponse(
          'AI Mentor Tip: When asked "How do you handle performance tuning for heavy SQL joins?", focus on indexing strategies, CTE restructuring, filtering early (where clauses before join), and evaluating EXPLAIN query plans.'
        );
      } else if (topic === 'salary') {
        setResponse(
          'AI Mentor Tip: For Senior Data Analyst roles in US Metro areas, standard total comp ranges between $140,000 - $175,000. Anchor your counter-offer around high-impact business metrics achieved in simulator scorecards.'
        );
      } else {
        setResponse('AI Mentor Tip: Enhance your DAX and Snowflake credentials to target top-tier 15% salary bands.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-[#0D1117] border border-[#00E5FF]/40 rounded-2xl max-w-xl w-full p-8 space-y-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-bold uppercase border border-[#00E5FF]/20">
            <Sparkles className="w-3.5 h-3.5" /> AI Career Advisor & Mentor
          </div>
          <h2 className="text-xl font-bold font-display text-white uppercase">Technical Interview & Career Coach</h2>
        </div>

        {/* Topic Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setTopic('interview')}
            className={`p-2.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
              topic === 'interview' ? 'bg-[#00E5FF] text-black border-[#00E5FF]' : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            Interview Simulator
          </button>
          <button
            onClick={() => setTopic('salary')}
            className={`p-2.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
              topic === 'salary' ? 'bg-[#00E5FF] text-black border-[#00E5FF]' : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            Salary Negotiation
          </button>
          <button
            onClick={() => setTopic('resume')}
            className={`p-2.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
              topic === 'resume' ? 'bg-[#00E5FF] text-black border-[#00E5FF]' : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            Resume Coaching
          </button>
          <button
            onClick={() => setTopic('roadmap')}
            className={`p-2.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
              topic === 'roadmap' ? 'bg-[#00E5FF] text-black border-[#00E5FF]' : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            Career Roadmap
          </button>
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleAskAI} className="space-y-4">
          <textarea
            rows={3}
            placeholder={
              topic === 'interview'
                ? 'Ask AI Mentor a technical SQL or Power BI interview question...'
                : topic === 'salary'
                ? 'Ask for negotiation strategies or salary benchmarks...'
                : 'Ask for resume bullet point improvements...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#05070B] border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full py-3 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#4FC3F7] transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
          >
            {loading ? <Brain className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Ask AI Career Advisor
          </button>
        </form>

        {/* AI Response Output */}
        {response && (
          <div className="p-4 rounded-xl border border-[#00E5FF]/30 bg-[#05070B] text-slate-200 text-xs leading-relaxed space-y-2">
            <span className="text-[10px] text-[#00E5FF] font-bold uppercase block">AI Mentor Response</span>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
