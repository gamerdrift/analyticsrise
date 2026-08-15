'use client';

import React from 'react';
import { clsx } from 'clsx';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'offline' | 'ai_active';
}

export function Avatar({ src, name, size = 'md', status, className, ...props }: AvatarProps) {
  const sizeStyles = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  };

  const statusStyles = {
    online: 'bg-emerald-400',
    busy: 'bg-amber-400',
    offline: 'bg-slate-500',
    ai_active: 'bg-[#00E5FF] animate-pulse',
  };

  const getInitials = (text?: string | null) => {
    if (!text) return null;
    const parts = text.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="relative inline-block" {...props}>
      <div
        className={clsx(
          'rounded-full bg-[#0D1424] border border-white/20 flex items-center justify-center font-mono font-bold text-white shrink-0 overflow-hidden select-none',
          sizeStyles[size],
          className
        )}
      >
        {src ? (
          <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-slate-400" />
        )}
      </div>
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#05070B]',
            statusStyles[status]
          )}
        />
      )}
    </div>
  );
}
