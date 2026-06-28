'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

// --- MODAL DIALOG ---
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, footerActions, className }: ModalProps) {
  // Trap escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // block scrolling
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal Content Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={twMerge(
              clsx(
                'w-full max-w-lg rounded-xl border border-slate-800 bg-[#0D1117]/95 backdrop-blur-md shadow-2xl relative z-50 flex flex-col',
                className
              )
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h4 id="modal-title" className="text-sm font-bold font-display uppercase tracking-wider text-white">
                {title}
              </h4>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white p-1 focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-xs text-slate-400 overflow-y-auto leading-relaxed max-h-[60vh]">{children}</div>

            {/* Footer actions */}
            {footerActions && (
              <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800 bg-[#0A0D12]/50">
                {footerActions}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- SLIDE-OUT DRAWER ---
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'right' | 'bottom';
  className?: string;
}

export function Drawer({ open, onClose, title, children, position = 'right', className }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const slideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      layoutClass: 'top-0 bottom-0 right-0 h-full w-full max-w-md border-l',
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      layoutClass: 'bottom-0 left-0 right-0 w-full h-2/3 border-t',
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer panel */}
          <motion.div
            initial={slideVariants[position].initial}
            animate={slideVariants[position].animate}
            exit={slideVariants[position].exit}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={twMerge(
              clsx(
                'fixed bg-[#0D1117] border-slate-800 shadow-2xl z-50 flex flex-col',
                slideVariants[position].layoutClass,
                className
              )
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h4 id="drawer-title" className="text-sm font-bold font-display uppercase tracking-wider text-white">
                {title}
              </h4>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white p-1 focus:outline-none"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 text-xs text-slate-400 overflow-y-auto leading-relaxed">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- CONFIRMATION DIALOG ---
interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  loading = false,
}: ConfirmProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      className="max-w-md"
      footerActions={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-slate-300 font-semibold text-xs uppercase font-display tracking-wide">{title}</p>
          <p className="text-slate-500 leading-normal">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
