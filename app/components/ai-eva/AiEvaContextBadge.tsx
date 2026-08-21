'use client';

import React from 'react';
import { Terminal, AlertCircle, FileCode, Database } from 'lucide-react';
import { AiEvaContext } from '@/lib/ai/eva/types';

interface AiEvaContextBadgeProps {
  context?: AiEvaContext;
  className?: string;
}

export function AiEvaContextBadge({ context, className = '' }: AiEvaContextBadgeProps) {
  if (!context) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 text-[10px] font-mono ${className}`}>
      {/* Product Tag */}
      <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] font-bold flex items-center gap-1">
        <Terminal className="w-2.5 h-2.5" />
        {context.product === 'sql-studio' ? 'SQL Studio' : context.product}
      </span>

      {/* Schema / Table Tag */}
      {context.activeSchema && (
        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">
          <Database className="w-2.5 h-2.5 text-slate-400" />
          {context.activeSchema}
          {context.activeTable ? `.${context.activeTable}` : ''}
        </span>
      )}

      {/* Error Attached Tag */}
      {context.sqlError && (
        <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
          Error Attached
        </span>
      )}

      {/* Query Attached Tag */}
      {context.currentQuery && (
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
          <FileCode className="w-2.5 h-2.5 text-emerald-400" />
          Editor Query Attached
        </span>
      )}
    </div>
  );
}

export default AiEvaContextBadge;
