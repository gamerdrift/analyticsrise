"use client";

import React, { useState } from 'react';
import { ChallengeHint } from '@/lib/sql/challenges/types';
import { Lightbulb, ChevronDown, ChevronRight, Lock, Eye } from 'lucide-react';

interface HintAccordionProps {
  hints: ChallengeHint[];
  onHintRevealed?: (hintsUsedCount: number) => void;
}

export default function HintAccordion({ hints, onHintRevealed }: HintAccordionProps) {
  const [revealedLevels, setRevealedLevels] = useState<number[]>([]);
  const [expandedLevels, setExpandedLevels] = useState<number[]>([]);

  if (!hints || hints.length === 0) {
    return null;
  }

  const sortedHints = [...hints].sort((a, b) => a.level - b.level);

  const handleRevealNext = (level: number) => {
    if (revealedLevels.includes(level)) return;

    const newRevealed = [...revealedLevels, level];
    const newExpanded = [...expandedLevels, level];
    setRevealedLevels(newRevealed);
    setExpandedLevels(newExpanded);

    if (onHintRevealed) {
      onHintRevealed(newRevealed.length);
    }
  };

  const toggleExpand = (level: number) => {
    if (!revealedLevels.includes(level)) return;
    setExpandedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Progressive Hints ({revealedLevels.length}/{sortedHints.length})
        </h4>
      </div>

      <div className="space-y-2">
        {sortedHints.map((hint, index) => {
          const isRevealed = revealedLevels.includes(hint.level);
          const isExpanded = expandedLevels.includes(hint.level);
          const isNextToReveal =
            !isRevealed && (index === 0 || revealedLevels.includes(sortedHints[index - 1].level));

          return (
            <div
              key={hint.level}
              className={`border rounded-lg overflow-hidden transition-colors ${
                isRevealed
                  ? 'border-amber-500/30 bg-amber-950/10'
                  : 'border-white/5 bg-[#0A0E17]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => toggleExpand(hint.level)}
                  disabled={!isRevealed}
                  className="flex items-center gap-2 text-left flex-1"
                >
                  {isRevealed ? (
                    isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    )
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                  <span
                    className={`font-semibold ${
                      isRevealed ? 'text-amber-300' : 'text-slate-500'
                    }`}
                  >
                    Level {hint.level} — {hint.title || `Hint ${hint.level}`}
                  </span>
                </button>

                {!isRevealed && isNextToReveal && (
                  <button
                    type="button"
                    onClick={() => handleRevealNext(hint.level)}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[10px] font-bold flex items-center gap-1 transition-all"
                  >
                    <Eye className="w-3 h-3" /> Reveal
                  </button>
                )}

                {!isRevealed && !isNextToReveal && (
                  <span className="text-[10px] text-slate-600">Locked</span>
                )}
              </div>

              {/* Revealed Content */}
              {isRevealed && isExpanded && (
                <div className="px-3 pb-3 pt-1 text-xs text-slate-300 font-sans border-t border-amber-500/10 bg-black/20">
                  <p className="leading-relaxed whitespace-pre-wrap">{hint.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
