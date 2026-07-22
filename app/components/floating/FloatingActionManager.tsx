'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageSquare, Sparkles, X } from 'lucide-react';
import AIMentor from '@/src/components/AIMentor';
import BetaFeedbackModal from '@/app/components/feedback/BetaFeedbackModal';

export interface FloatingActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  onClick: () => void;
  primaryColor?: string;
  ariaLabel: string;
}

export default function FloatingActionManager() {
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Global event listeners to allow launch from any component (e.g., Dashboard cards)
  useEffect(() => {
    const handleOpenMentor = () => {
      setIsMentorOpen(true);
      setIsFeedbackOpen(false);
    };
    const handleOpenFeedback = () => {
      setIsFeedbackOpen(true);
      setIsMentorOpen(false);
    };

    window.addEventListener('open-ai-mentor', handleOpenMentor);
    window.addEventListener('open-feedback-modal', handleOpenFeedback);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMentorOpen(false);
        setIsFeedbackOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-ai-mentor', handleOpenMentor);
      window.removeEventListener('open-feedback-modal', handleOpenFeedback);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const floatingActions: FloatingActionItem[] = [
    {
      id: 'ai-mentor',
      label: '🤖 AI Mentor',
      ariaLabel: 'Open AI Analytics Mentor assistant',
      icon: <Bot className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />,
      badge: 'PRO',
      onClick: () => {
        setIsMentorOpen(!isMentorOpen);
        if (isFeedbackOpen) setIsFeedbackOpen(false);
      },
    },
    {
      id: 'feedback',
      label: '💬 Beta Feedback',
      ariaLabel: 'Share platform feedback or report a bug',
      icon: <MessageSquare className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />,
      onClick: () => {
        setIsFeedbackOpen(!isFeedbackOpen);
        if (isMentorOpen) setIsMentorOpen(false);
      },
    },
  ];

  return (
    <>
      {/* Stacked Floating Buttons Container (Fixed Bottom Right) */}
      <aside
        aria-label="Floating Action Controls"
        className="fixed bottom-6 right-6 z-[90] flex flex-col-reverse items-end gap-3 pointer-events-none"
      >
        {floatingActions.map((action, index) => {
          const isCurrentActive =
            (action.id === 'ai-mentor' && isMentorOpen) ||
            (action.id === 'feedback' && isFeedbackOpen);

          return (
            <div key={action.id} className="relative group pointer-events-auto flex items-center gap-2.5">
              {/* Tooltip Label (Hover Effect) */}
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-lg bg-[#0D1117]/95 border border-[#1E293B] text-xs font-mono text-[#F5F7FA] shadow-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
                {action.label}
              </span>

              {/* Action Button */}
              <button
                onClick={action.onClick}
                aria-label={action.ariaLabel}
                aria-expanded={isCurrentActive}
                className={`relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl border focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/60 cursor-pointer ${
                  isCurrentActive
                    ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[#00E5FF]/40 scale-110'
                    : 'bg-[#0D1117]/85 border-[#00E5FF]/30 text-[#F5F7FA] hover:border-[#00E5FF] hover:shadow-[#00E5FF]/30 hover:scale-105 active:scale-95'
                }`}
              >
                {isCurrentActive ? (
                  <X className="w-6 h-6 text-black" />
                ) : (
                  <>
                    {action.icon}
                    {action.badge && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#00E5FF] text-black text-[9px] font-extrabold font-mono tracking-tighter shadow-md">
                        {action.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </aside>

      {/* Floating AI Mentor Panel */}
      <AnimatePresence>
        {isMentorOpen && (
          <div className="fixed bottom-24 right-6 z-[100]">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.18 }}
              className="w-85 sm:w-96 h-[520px] rounded-2xl border border-[#00E5FF]/40 bg-[#0D1117] shadow-2xl shadow-black/90 overflow-hidden"
            >
              <AIMentor mode="embedded" title="AI Analytics Mentor" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Beta Feedback Modal */}
      {isFeedbackOpen && (
        <BetaFeedbackModal isOpenOverride={isFeedbackOpen} onCloseOverride={() => setIsFeedbackOpen(false)} />
      )}
    </>
  );
}
