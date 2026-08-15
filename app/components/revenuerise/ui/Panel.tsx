'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  statusBadge?: React.ReactNode;
  children: React.ReactNode;
}

export function Panel({ title, icon, action, statusBadge, children, className, ...props }: PanelProps) {
  return (
    <section
      className={clsx(
        'rounded-3xl bg-[#080C14] border border-white/10 p-6 md:p-8 space-y-6 relative overflow-hidden transition-all duration-300 hover:border-white/20',
        className
      )}
      {...props}
    >
      {(title || action || statusBadge) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#00E5FF]">{icon}</div>}
            {title && (
              <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
                {title}
              </h2>
            )}
            {statusBadge && <div className="ml-2">{statusBadge}</div>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
