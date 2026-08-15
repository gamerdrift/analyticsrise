'use client';

import React from 'react';
import { clsx } from 'clsx';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = 'System Interaction Interrupted',
  message = 'An unexpected service response occurred while processing your request. Please retry.',
  errorCode,
  onRetry,
  isRetrying = false,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={clsx(
        'rounded-3xl bg-red-950/20 border border-red-500/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto',
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xs text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
          {message}
        </p>
        {errorCode && (
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 font-mono text-[10px] text-red-300 font-bold uppercase">
            Diagnostic Code: {errorCode}
          </span>
        )}
      </div>
      {onRetry && (
        <div className="pt-2">
          <Button
            onClick={onRetry}
            isLoading={isRetrying}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            variant="outline"
            size="md"
          >
            Retry Action
          </Button>
        </div>
      )}
    </div>
  );
}
