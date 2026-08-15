'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'right' | 'left' | 'bottom';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  position = 'right',
  children,
  footer,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionStyles = {
    right: 'top-0 right-0 h-full w-full max-w-md border-l border-white/10 animate-in slide-in-from-right duration-300',
    left: 'top-0 left-0 h-full w-full max-w-md border-r border-white/10 animate-in slide-in-from-left duration-300',
    bottom: 'bottom-0 left-0 w-full max-h-[85vh] border-t border-white/10 rounded-t-3xl animate-in slide-in-from-bottom duration-300',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#05070B]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div
        className={clsx(
          'fixed bg-[#080C14] shadow-2xl p-6 flex flex-col justify-between z-10',
          positionStyles[position]
        )}
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          {title && (
            <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
              {title}
            </h2>
          )}
          <IconButton icon={<X className="w-5 h-5" />} label="Close drawer" onClick={onClose} size="sm" />
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4">{children}</div>

        {footer && <div className="pt-4 border-t border-white/5 mt-4">{footer}</div>}
      </div>
    </div>
  );
}
