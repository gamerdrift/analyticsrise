"use client";

import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function PrivacyNoticeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#00E5FF]/[0.06] border-b border-[#00E5FF]/20 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-300">
      <div className="flex items-center gap-2 truncate">
        <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0" />
        <span className="truncate">
          <strong>Privacy Guarantee:</strong> Uploaded CSV data is processed 100% in your browser memory. Zero server uploads, zero AI data sharing.
        </span>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="text-slate-500 hover:text-white p-1 ml-2 shrink-0 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
