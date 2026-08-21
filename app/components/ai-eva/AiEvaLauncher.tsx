'use client';

import React, { useEffect } from 'react';
import { Sparkles, Bot, X } from 'lucide-react';
import { ArTriangleIcon } from '@/app/components/brand';

interface AiEvaLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  hasErrorContext?: boolean;
  className?: string;
}

export function AiEvaLauncher({
  isOpen,
  onToggle,
  hasErrorContext = false,
  className = '',
}: AiEvaLauncherProps) {
  // Global Hotkey Listener: Ctrl+J or Cmd+J to toggle AI-EVA
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 cursor-pointer select-none group ${
        isOpen
          ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-lg shadow-[#00E5FF]/30'
          : hasErrorContext
          ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-sm shadow-rose-500/10'
          : 'bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border-[#00E5FF]/30 text-[#00E5FF] shadow-sm shadow-[#00E5FF]/10'
      } ${className}`}
      title="Toggle AI-EVA Learning Assistant (Ctrl+J)"
      aria-label="Toggle AI-EVA Learning Assistant"
    >
      {/* Visual Icon */}
      {isOpen ? (
        <X className="w-3.5 h-3.5" />
      ) : (
        <div className="relative">
          <ArTriangleIcon size={16} className="shrink-0 transition-transform group-hover:scale-110" />
          {hasErrorContext && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </div>
      )}

      <span>AI-EVA</span>

      {/* Keyboard Shortcut Hint Badge */}
      <span
        className={`hidden md:inline text-[9px] font-mono px-1 py-0.2 rounded border ${
          isOpen
            ? 'bg-black/20 border-black/30 text-black'
            : 'bg-white/5 border-white/10 text-slate-400'
        }`}
      >
        Ctrl+J
      </span>
    </button>
  );
}

export default AiEvaLauncher;
