'use client';

import React, { useState } from 'react';
import { feedbackService, FeedbackType } from '@/lib/services/feedbackService';
import { MessageSquare, X, Star, Send, CheckCircle2, Bug, Lightbulb, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface BetaFeedbackModalProps {
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
  showTrigger?: boolean;
}

export default function BetaFeedbackModal({
  isOpenOverride,
  onCloseOverride,
  showTrigger = false,
}: BetaFeedbackModalProps) {
  const { currentUser, userProfile } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isModalOpen = isOpenOverride !== undefined ? isOpenOverride : internalIsOpen;

  const handleClose = () => {
    if (onCloseOverride) {
      onCloseOverride();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || submitting) return;

    setSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        userId: currentUser?.uid || 'anonymous',
        userEmail: currentUser?.email || userProfile?.email || 'guest@analyticsrise.com',
        type,
        title: title.trim() || `${type.toUpperCase()} Report`,
        description: description.trim(),
        rating,
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        handleClose();
        setTitle('');
        setDescription('');
      }, 2000);
    } catch (err) {
      console.error('[Feedback Error]', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Optional Standalone Trigger Button */}
      {showTrigger && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 px-3.5 py-2.5 rounded-full bg-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#4FC3F7] transition-all shadow-xl shadow-[#00E5FF]/20 flex items-center gap-2 group cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-black group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Beta Feedback</span>
        </button>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in font-sans">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-[#00E5FF]/40 bg-[#0D1117] space-y-6 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close feedback dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3 font-mono">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white font-display uppercase">Feedback Submitted!</h3>
                <p className="text-xs text-slate-400">Thank you for helping us improve AnalyticsRise for Beta launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] font-bold uppercase border border-[#00E5FF]/20">
                      BETA FEEDBACK
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-wide">
                    Share Your Feedback
                  </h3>
                </div>

                {/* Feedback Type Selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('bug')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      type === 'bug'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-bold'
                        : 'bg-[#05070B] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bug className="w-4 h-4" />
                    <span className="text-[10px] uppercase">Bug Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('feature')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      type === 'feature'
                        ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF] font-bold'
                        : 'bg-[#05070B] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-[10px] uppercase">Idea / Feature</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('general')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      type === 'general'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-[#05070B] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[10px] uppercase">General</span>
                  </button>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-slate-400 text-[10px] uppercase block mb-1">Platform Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Title */}
                <div>
                  <label className="text-slate-400 text-[10px] uppercase block mb-1">Subject / Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. Issue running SQL simulator query..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-slate-400 text-[10px] uppercase block mb-1">Detailed Feedback</label>
                  <textarea
                    placeholder="Describe what happened or what suggestion you have..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white uppercase font-bold text-[10px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!description.trim() || submitting}
                    className="px-5 py-2 rounded-lg bg-[#00E5FF] text-black font-bold uppercase text-[10px] hover:bg-[#4FC3F7] transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-lg shadow-[#00E5FF]/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
