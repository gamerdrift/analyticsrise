// app/components/ui/PasswordStrengthMeter.tsx
'use client';

import React from 'react';
import { StrengthLabel } from '@/lib/utils/password';

interface Props {
  strength: { score: number; label: StrengthLabel };
}

/**
 * Visual meter showing password strength.
 * 0‑4 score mapped to colour gradient from red → orange → yellow → light‑green → green.
 */
export const PasswordStrengthMeter: React.FC<Props> = ({ strength }) => {
  const colors = ['#FF1744', '#FF9100', '#FFC400', '#00E676', '#00E5FF'];
  const width = `${(strength.score / 4) * 100}%`;
  const bgColor = colors[strength.score] || colors[0];

  return (
    <div className="mt-1 space-y-1">
      <div className="h-2 w-full rounded bg-[#1E293B]">
        <div style={{ width, backgroundColor: bgColor }} className="h-full rounded transition-width duration-300" />
      </div>
      <p className="text-xs font-mono uppercase text-[#CCCCCC]">{strength.label}</p>
    </div>
  );
};
