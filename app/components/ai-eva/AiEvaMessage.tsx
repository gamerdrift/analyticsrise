'use client';

import React, { useState } from 'react';
import { Bot, User, Copy, Check, Terminal } from 'lucide-react';
import { AiEvaMessage as MessageType } from '@/lib/ai/eva/types';
import { ArTriangleIcon } from '@/app/components/brand';

interface AiEvaMessageProps {
  message: MessageType;
  onApplyCodeSnippet?: (code: string) => void;
}

export function AiEvaMessage({ message, onApplyCodeSnippet }: AiEvaMessageProps) {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simple Markdown-style parser for headings, bullets, and inline code
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Heading level 3 ###
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-[#00E5FF] font-display uppercase tracking-wider mt-3 mb-1.5">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Heading level 2 ##
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-sm font-black text-white font-display uppercase tracking-wider mt-3.5 mb-2 border-b border-white/10 pb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      // Bullet list item
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.slice(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 text-xs my-0.5">
            {renderInlineFormatting(bulletText)}
          </li>
        );
      }
      // Numbered list item
      const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-300 text-xs my-0.5">
            {renderInlineFormatting(numMatch[2])}
          </li>
        );
      }
      // Standard paragraph
      if (line.trim().length === 0) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed my-1">
          {renderInlineFormatting(line)}
        </p>
      );
    });
  };

  const renderInlineFormatting = (text: string) => {
    // Split by inline code `code`
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={pIdx}
            className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[#00E5FF] font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="text-white font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-2xl transition-all ${
        isAssistant
          ? 'bg-[#0D1117]/90 border border-[#00E5FF]/20 shadow-md shadow-black/30'
          : 'bg-white/5 border border-white/10 ml-6'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {isAssistant ? (
          <div className="w-7 h-7 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 flex items-center justify-center shadow-sm shadow-[#00E5FF]/20">
            <ArTriangleIcon size={16} />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-white flex items-center gap-1.5">
            {isAssistant ? (
              <>
                <span className="text-[#00E5FF]">AI-EVA</span>
                <span className="text-slate-500 font-normal">· Learning Assistant</span>
              </>
            ) : (
              <span className="text-slate-400">You</span>
            )}
          </span>
          <span className="text-[9px] font-mono text-slate-500">{message.timestamp}</span>
        </div>

        {/* Formatted Text */}
        <div className="space-y-1 font-sans">{formatContent(message.content)}</div>

        {/* Optional Code Snippet Block */}
        {message.codeSnippet && (
          <div className="mt-3 rounded-xl bg-black/60 border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-[#00E5FF]">
                <Terminal className="w-3 h-3" />
                <span>SQL Example</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(message.codeSnippet!)}
                  className="px-2 py-0.5 rounded hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                {onApplyCodeSnippet && (
                  <button
                    type="button"
                    onClick={() => onApplyCodeSnippet(message.codeSnippet!)}
                    className="px-2 py-0.5 rounded bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] font-bold transition-colors"
                  >
                    Insert
                  </button>
                )}
              </div>
            </div>
            <pre className="p-3 text-[11px] font-mono text-slate-200 overflow-x-auto selection:bg-[#00E5FF]/30">
              <code>{message.codeSnippet}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiEvaMessage;
