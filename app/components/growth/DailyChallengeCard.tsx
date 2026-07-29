'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, XCircle, HelpCircle, ArrowRight, Award } from 'lucide-react';
import { ChallengeService } from '@/lib/services/challengeService';
import { DailyChallenge } from '@/lib/config/challenges';

export default function DailyChallengeCard() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<{ isCorrect: boolean; xpEarned: number; explanation: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const ch = ChallengeService.getTodaysChallenge();
    setChallenge(ch);
    setIsCompleted(ChallengeService.isTodaysChallengeCompleted());
  }, []);

  if (!challenge) return null;

  const handleSubmit = () => {
    if (!selectedOption) return;
    const res = ChallengeService.submitAnswer(challenge.id, selectedOption);
    setResult(res);
    setIsCompleted(true);
  };

  return (
    <div className="w-full rounded-3xl bg-[#0D1117] border border-white/10 p-6 sm:p-8 relative overflow-hidden">
      {/* Top Badge Row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase tracking-widest">
            {challenge.domain.toUpperCase()} CHALLENGE
          </span>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10 uppercase">
            {challenge.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-black font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{challenge.xpReward} XP
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-display font-black text-white mb-2">
        {challenge.title}
      </h3>
      <p className="text-xs text-slate-400 mb-6">{challenge.question}</p>

      {/* Code Snippet Preview */}
      {challenge.codeSnippet && (
        <div className="p-4 rounded-2xl bg-[#05070B] border border-white/10 font-mono text-xs text-[#00E5FF] mb-6 overflow-x-auto">
          {challenge.codeSnippet}
        </div>
      )}

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {challenge.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => !result && setSelectedOption(opt.id)}
            disabled={!!result}
            className={`w-full p-4 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${
              selectedOption === opt.id
                ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-white shadow-md shadow-[#00E5FF]/10'
                : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/20'
            }`}
          >
            <span>{opt.text}</span>
            {selectedOption === opt.id && <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />}
          </button>
        ))}
      </div>

      {/* Result Output */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border mb-6 text-xs ${
            result.isCorrect
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            {result.isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct! +{result.xpEarned} XP Earned!
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" /> Incorrect Answer
              </>
            )}
          </div>
          <p className="text-[11px] opacity-90 leading-relaxed">{result.explanation}</p>
        </motion.div>
      )}

      {/* Submit CTA */}
      {!result ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedOption
              ? 'bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black hover:shadow-lg hover:shadow-[#00E5FF]/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          Submit Answer <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="text-center text-xs text-slate-400 font-mono">
          ✅ Today&apos;s challenge completed. Come back tomorrow for the next challenge!
        </div>
      )}
    </div>
  );
}
