'use client';

import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function ExcelPrivacyNoticeBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between text-xs text-emerald-300 shrink-0">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-white font-semibold">Local Privacy Guarantee:</strong> Your spreadsheets are parsed and calculated 100% inside your browser. No files or cell values are uploaded to cloud servers.
        </span>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="p-1 rounded text-emerald-400 hover:text-white transition-colors"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
