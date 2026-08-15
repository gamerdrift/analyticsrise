'use client';

import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { IconButton } from './IconButton';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastProps {
  id: string;
  type?: ToastType;
  title: string;
  message?: string;
  onDismiss?: (id: string) => void;
}

export function Toast({ id, type = 'info', title, message, onDismiss }: ToastProps) {
  const typeIcons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#00E5FF] shrink-0" />,
  };

  const typeBorders = {
    success: 'border-emerald-500/30',
    warning: 'border-amber-500/30',
    error: 'border-red-500/30',
    info: 'border-[#00E5FF]/30',
  };

  return (
    <div
      role="alert"
      className={clsx(
        'flex items-start gap-3 p-4 rounded-2xl bg-[#080C14] border shadow-2xl backdrop-blur-md max-w-sm w-full animate-in slide-in-from-top duration-200',
        typeBorders[type]
      )}
    >
      {typeIcons[type]}
      <div className="flex-1 space-y-0.5">
        <h4 className="text-xs font-mono font-bold text-white uppercase">{title}</h4>
        {message && <p className="text-xs text-slate-300 font-sans leading-relaxed">{message}</p>}
      </div>
      {onDismiss && (
        <IconButton
          icon={<X className="w-4 h-4" />}
          label="Dismiss notification"
          onClick={() => onDismiss(id)}
          size="sm"
        />
      )}
    </div>
  );
}
