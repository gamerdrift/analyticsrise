'use client';

import React, { useRef, useEffect } from 'react';
import { Sparkles, Terminal, HelpCircle, AlertCircle, ArrowRight, Lightbulb, Compass } from 'lucide-react';
import { AiEvaMessage as MessageType, AiEvaContext } from '@/lib/ai/eva/types';
import { AiEvaMessage } from './AiEvaMessage';
import { ArTriangleIcon } from '@/app/components/brand';

interface AiEvaChatProps {
  messages: MessageType[];
  isLoading: boolean;
  context?: AiEvaContext;
  onSelectPrompt: (promptText: string) => void;
  onApplyCodeSnippet?: (code: string) => void;
  className?: string;
}

const DEFAULT_SUGGESTED_PROMPTS = [
  { id: 'explain_query', label: 'Explain this query', icon: Terminal, prompt: 'Can you explain what my current SQL query is doing step-by-step?' },
  { id: 'fix_error', label: 'Help me fix this error', icon: AlertCircle, prompt: 'I encountered an error in my query. Can you help me understand why and how to fix it?' },
  { id: 'explain_joins', label: 'Explain JOINs', icon: Compass, prompt: 'What is the difference between an INNER JOIN and a LEFT JOIN?' },
  { id: 'give_hint', label: 'Give me a hint', icon: Lightbulb, prompt: 'Can you give me a conceptual hint for the current challenge without giving away the full answer?' },
  { id: 'learn_next', label: 'What should I learn next?', icon: ArrowRight, prompt: 'What is the recommended next concept I should practice in SQL?' },
];

export function AiEvaChat({
  messages,
  isLoading,
  context,
  onSelectPrompt,
  onApplyCodeSnippet,
  className = '',
}: AiEvaChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Contextually customize suggested prompt pills based on whether error or query exists
  const activePrompts = DEFAULT_SUGGESTED_PROMPTS.filter((p) => {
    if (p.id === 'fix_error' && !context?.sqlError) return false;
    if (p.id === 'explain_query' && !context?.currentQuery) return false;
    return true;
  });

  return (
    <div className={`flex flex-col gap-4 overflow-y-auto pr-1 ${className}`}>
      {/* Empty State / Welcome Screen */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#0D1117]/60 border border-white/5 my-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mb-4 shadow-lg shadow-[#00E5FF]/10">
            <ArTriangleIcon size={28} />
          </div>

          <h3 className="text-base font-black font-display text-white tracking-wider uppercase mb-1">
            Meet <span className="text-[#00E5FF]">AI-EVA</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6 font-sans">
            Your personal AnalyticsRise SQL learning assistant. Ask questions, diagnose query errors, explore database concepts, and get guided challenge hints.
          </p>

          {/* Suggested Quick Prompts Grid */}
          <div className="w-full flex flex-col gap-2 text-left">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold px-1">
              Suggested Quick Actions:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activePrompts.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectPrompt(item.prompt)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-[#00E5FF]/10 border border-white/10 hover:border-[#00E5FF]/40 text-left transition-all duration-200 group cursor-pointer flex items-center gap-2.5"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono text-slate-200 group-hover:text-white truncate">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Message Stream */}
      {messages.map((msg) => (
        <AiEvaMessage
          key={msg.id}
          message={msg}
          onApplyCodeSnippet={onApplyCodeSnippet}
        />
      ))}

      {/* Thinking / Loading Animation */}
      {isLoading && (
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0D1117]/90 border border-[#00E5FF]/20 shadow-md shadow-black/30 animate-pulse">
          <div className="w-7 h-7 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 flex items-center justify-center shrink-0">
            <ArTriangleIcon size={16} />
          </div>
          <div className="flex flex-col gap-1.5 justify-center py-1">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#00E5FF]">
              AI-EVA is analyzing...
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3F7] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default AiEvaChat;
