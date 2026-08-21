'use client';

import React, { useState } from 'react';
import { Lock, X, ShieldCheck } from 'lucide-react';

export default function PowerBIPrivacyNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#0D1117] border-b border-white/5 px-4 py-2 flex items-center justify-between text-xs font-mono select-none">
      <div className="flex items-center gap-2 text-slate-300">
        <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-emerald-400">100% In-Browser Privacy:</strong> Your datasets and schema definitions are processed and stored locally. Zero raw rows or files leave your device.
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
