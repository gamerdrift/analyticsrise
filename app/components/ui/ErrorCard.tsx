// app/components/ui/ErrorCard.tsx
'use client';

import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/**
 * Displays a user‑friendly error message with optional retry action.
 * Uses ARDS design tokens (red glow) and is WCAG AA accessible.
 */
export const ErrorCard: React.FC<Props> = ({ title = 'Something went wrong', message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#0D1117] shadow-2xl border border-[#FF1744]/30 max-w-md mx-auto">
    <XCircle className="w-12 h-12 text-[#FF1744] mb-4" aria-hidden="true" />
    <h2 className="text-xl font-display uppercase tracking-widest text-[#FF1744] mb-2">{title}</h2>
    <p className="text-center text-sm text-[#FFCCCC] mb-4">{message}</p>
    {onRetry && (
      <Button variant="primary" size="sm" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);
