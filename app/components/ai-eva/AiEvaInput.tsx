'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Loader2 } from 'lucide-react';
import { AI_EVA_LIMITS } from '@/lib/ai/eva/limits';

interface AiEvaInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function AiEvaInput({
  onSend,
  isLoading,
  disabled = false,
  placeholder = 'Ask AI-EVA a question about your query, errors, or concepts...',
  className = '',
}: AiEvaInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = text.length;
  const isOverLimit = charCount > AI_EVA_LIMITS.MAX_USER_MESSAGE_LENGTH;
  const canSend = text.trim().length > 0 && !isOverLimit && !isLoading && !disabled;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canSend) return;

    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-adjust height up to 120px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex flex-col gap-1.5 ${className}`}>
      <div className="relative rounded-2xl bg-[#080C14] border border-white/10 focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          rows={1}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs font-sans text-white placeholder:text-slate-500 p-3 pr-20 resize-none outline-none max-h-32 min-h-[44px]"
        />

        {/* Input Actions (Clear + Send) */}
        <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
          {text.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setText('');
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            disabled={!canSend}
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              canSend
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black shadow-md shadow-[#00E5FF]/20 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
            title="Send to AI-EVA (Enter)"
            aria-label="Send message to AI-EVA"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Input Footer with Char Counter and Shortcut Helper */}
      <div className="flex items-center justify-between px-2 text-[10px] font-mono text-slate-500">
        <span>Press <kbd className="px-1 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400">Enter</kbd> to send, <kbd className="px-1 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400">Shift+Enter</kbd> for newline</span>
        <span className={isOverLimit ? 'text-rose-400 font-bold' : ''}>
          {charCount} / {AI_EVA_LIMITS.MAX_USER_MESSAGE_LENGTH}
        </span>
      </div>
    </form>
  );
}

export default AiEvaInput;
