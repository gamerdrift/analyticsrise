'use client';

import React, { useState } from 'react';
import {
  interviewService,
  INTERVIEW_QUESTIONS,
  InterviewQuestion,
  InterviewCategory,
  InterviewReviewResult,
} from '@/lib/services/interviewService';
import {
  MessageSquare,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  Play,
  RotateCcw,
  BookOpen,
  Send,
  ShieldCheck,
} from 'lucide-react';

const CATEGORIES: InterviewCategory[] = [
  'SQL',
  'Excel',
  'Python',
  'Power BI',
  'Tableau',
  'Statistics',
  'Business Analytics',
  'Behavioral',
  'Case Studies',
];

export default function InterviewCenter() {
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory>('SQL');
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion>(INTERVIEW_QUESTIONS[0]);
  const [userResponseText, setUserResponseText] = useState('');
  const [reviewResult, setReviewResult] = useState<InterviewReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const filteredQuestions = interviewService.getQuestionsByCategory(selectedCategory);

  const handleSubmitAnswer = async () => {
    if (!userResponseText.trim() || isReviewing) return;
    setIsReviewing(true);
    const result = await interviewService.reviewAnswer(activeQuestion.id, userResponseText);
    setReviewResult(result);
    setIsReviewing(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              INTERVIEW PREPARATION CENTER
            </span>
            <span className="text-xs text-slate-400 font-mono">9 Categories • AI Grading</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white uppercase tracking-wide mt-1">
            ANALYTICS INTERVIEW & MOCK EVALUATOR
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 bg-[#0D1117]/80 text-right font-mono text-xs">
            <span className="text-[10px] text-slate-400 block uppercase">Interview Readiness Score</span>
            <span className="text-xl font-bold font-display text-[#00E5FF]">84 / 100</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = cat === selectedCategory;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                const qList = interviewService.getQuestionsByCategory(cat);
                if (qList.length) setActiveQuestion(qList[0]);
                setReviewResult(null);
                setUserResponseText('');
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#00E5FF] text-black font-bold shadow-lg shadow-[#00E5FF]/20'
                  : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Workstation Grid: Question Selector Left (4 cols), Question & Answer Workspace Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Question Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
            {selectedCategory} Questions ({filteredQuestions.length})
          </span>

          {filteredQuestions.map((q) => {
            const isActive = q.id === activeQuestion.id;
            return (
              <div
                key={q.id}
                onClick={() => {
                  setActiveQuestion(q);
                  setReviewResult(null);
                  setUserResponseText('');
                }}
                className={`p-4 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#161B22] border-[#00E5FF] shadow-lg shadow-[#00E5FF]/10'
                    : 'bg-[#0D1117]/80 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#00E5FF] font-bold uppercase">{q.difficulty}</span>
                  <span className="text-[10px] text-slate-500">~{Math.round(q.timeLimitSeconds / 60)} mins</span>
                </div>
                <h4 className="font-bold text-white font-display uppercase tracking-wide text-xs">
                  {q.title}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Question & Answer Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Scenario Box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold tracking-widest">
                SCENARIO QUESTION • {activeQuestion.difficulty}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time limit: {Math.round(activeQuestion.timeLimitSeconds / 60)}m
              </span>
            </div>

            <h3 className="text-lg font-bold font-display text-white uppercase tracking-wide">
              {activeQuestion.title}
            </h3>
            <p className="text-xs text-slate-300 font-mono leading-relaxed bg-[#05070B] p-4 rounded-xl border border-white/5">
              {activeQuestion.scenario}
            </p>
          </div>

          {/* User Answer Textarea */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/90 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00E5FF]" /> Your Answer Formulation
              </label>
              <span className="text-[10px] font-mono text-slate-500">Voice or Text Input Supported</span>
            </div>

            <textarea
              value={userResponseText}
              onChange={(e) => setUserResponseText(e.target.value)}
              placeholder="Structure your answer using technical parameters, real-world examples, and quantitative results..."
              rows={6}
              className="w-full bg-[#05070B] border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={!userResponseText.trim() || isReviewing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black font-bold font-mono text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20"
              >
                <Sparkles className="w-4 h-4" /> {isReviewing ? 'AI Evaluating...' : 'Submit to AI Review Engine'}
              </button>
            </div>
          </div>

          {/* AI Review Result Drawer */}
          {reviewResult && (
            <div className="glass-panel p-6 rounded-2xl border border-[#00E5FF]/30 bg-[#0D1117]/95 space-y-4 font-mono text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> AI Evaluation Report
                </span>
                <span className="text-lg font-black text-white font-display">
                  Score: <span className="text-[#00E5FF]">{reviewResult.score}/100</span>
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed bg-[#05070B] p-3 rounded border border-white/5">
                {reviewResult.feedback}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Strengths Evident:</span>
                  <ul className="list-disc pl-4 text-slate-300 space-y-1">
                    {reviewResult.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Areas to Improve:</span>
                  <ul className="list-disc pl-4 text-slate-300 space-y-1">
                    {reviewResult.missingElements.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                <strong className="text-white">Ideal Model Answer reference:</strong>
                <p className="mt-1 text-slate-300 bg-[#05070B] p-3 rounded">{activeQuestion.modelAnswer}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
