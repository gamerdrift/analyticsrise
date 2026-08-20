"use client";

import React, { useRef } from 'react';
import { useSqlStudio } from '@/app/sql-studio/contexts/SqlStudioContext';

interface SqlEditorProps {
  onRunQuery?: () => void;
  onSubmitChallenge?: () => void;
}

export default function SqlEditor({ onRunQuery, onSubmitChallenge }: SqlEditorProps) {
  const { state, dispatch } = useSqlStudio();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const query = state.editor.query;
  const lineCount = Math.max(8, query.split('\n').length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Submit Challenge: Ctrl/Cmd + Shift + Enter
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (onSubmitChallenge) onSubmitChallenge();
      return;
    }

    // 2. Run Query: Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (onRunQuery) onRunQuery();
      return;
    }

    // 3. Tab Key Indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = query.substring(0, start) + '  ' + query.substring(end);

      dispatch({ type: 'SET_QUERY', payload: newText });

      // Restore cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="flex bg-[#05070B] border border-white/10 rounded-lg overflow-hidden font-mono text-sm focus-within:border-[#00E5FF]/40 transition-colors">
      {/* Line Numbers Gutter */}
      <div className="w-10 bg-[#080C14] border-r border-white/5 py-4 select-none text-right pr-2.5 text-slate-600 text-xs font-mono shrink-0">
        {lineNumbers.map((num) => (
          <div key={num} className="leading-6 h-6">
            {num}
          </div>
        ))}
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => dispatch({ type: 'SET_QUERY', payload: e.target.value })}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder="-- Write your SQL query here... (Press Ctrl+Enter to run)"
          className="w-full h-full min-h-[192px] p-4 bg-transparent text-slate-100 font-mono text-xs md:text-sm leading-6 border-none focus:outline-none focus:ring-0 resize-none"
          rows={Math.max(8, lineCount)}
        />
      </div>
    </div>
  );
}
