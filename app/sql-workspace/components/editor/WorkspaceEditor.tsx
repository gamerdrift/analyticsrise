"use client";

import React, { useRef, useState } from 'react';
import { useSqlWorkspace } from '../../contexts/SqlWorkspaceContext';
import { Play, Save, RotateCcw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function WorkspaceEditor() {
  const { state, dispatch, runWorkspaceQuery, saveCurrentProject } = useSqlWorkspace();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const query = state.query;
  const lineCount = Math.max(10, query.split('\n').length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run Query: Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runWorkspaceQuery();
      return;
    }

    // Save Project: Ctrl/Cmd + S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
      return;
    }

    // Tab Key Indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = query.substring(0, start) + '  ' + query.substring(end);

      dispatch({ type: 'SET_QUERY', payload: newText });

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleSave = () => {
    const success = saveCurrentProject();
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#05070B] border border-white/10 rounded-xl overflow-hidden shadow-lg">
      {/* Editor Controls Bar */}
      <div className="h-11 bg-[#080C14] border-b border-white/10 flex items-center justify-between px-3 md:px-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
            SQL Query Workbench
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
            title="Save Project (Ctrl+S)"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={runWorkspaceQuery}
            disabled={state.isExecuting}
            className="px-4 py-1.5 rounded-lg bg-[#00E5FF] hover:bg-[#00B8CC] disabled:opacity-50 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-[#00E5FF]/20 cursor-pointer"
            title="Execute SQL (Ctrl+Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{state.isExecuting ? 'Running...' : 'Run Query'}</span>
          </button>
        </div>
      </div>

      {/* Editor Textarea with Line Numbers */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs sm:text-sm bg-[#05070B]">
        {/* Line Numbers Gutter */}
        <div className="w-10 bg-[#070A10] border-r border-white/5 py-3 select-none text-right pr-2 text-slate-600 text-xs font-mono shrink-0 overflow-hidden">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Query Input Area */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => dispatch({ type: 'SET_QUERY', payload: e.target.value })}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          placeholder="-- Write your SQL query here (e.g. SELECT * FROM customers;)"
          className="flex-1 w-full bg-transparent text-slate-100 p-3 leading-6 resize-none outline-none font-mono selection:bg-[#00E5FF]/30 overflow-auto custom-scrollbar"
        />
      </div>

      {/* Error Output Banner */}
      {state.executionError && (
        <div className="p-3 bg-rose-950/50 border-t border-rose-500/30 text-rose-300 font-mono text-xs flex items-start gap-2 animate-in fade-in shrink-0">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">SQL Error:</span>
            <span>{state.executionError}</span>
          </div>
        </div>
      )}
    </div>
  );
}
