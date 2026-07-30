'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, Send, CheckCircle2, Star, Bug, Sparkles } from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { FeedbackService, UserFeedbackItem } from '@/lib/services/feedbackService';

export default function FeedbackPage() {
  const [category, setCategory] = useState<UserFeedbackItem['category']>('feature_request');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [list, setList] = useState<UserFeedbackItem[]>(FeedbackService.getFeedbackList());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    const created = FeedbackService.submitFeedback({ category, title, description });
    setList([...FeedbackService.getFeedbackList()]);
    setTitle('');
    setDescription('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-2">
              <MessageSquare className="w-3.5 h-3.5" /> FEEDBACK & FEATURE REQUEST ENGINE
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              Community Feedback & Feature Voting
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Submit feature requests, report bugs, rate courses/simulators, and vote on upcoming platform capabilities.
            </p>
          </div>
        </div>

        {/* Submit Form */}
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#0D1117] border border-[#00E5FF]/30 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-[#00E5FF]" /> Submit Feedback or Feature Idea
          </h3>

          {submitted && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Feedback submitted successfully!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Feedback Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="feature_request">Feature Request</option>
                <option value="bug">Report Bug</option>
                <option value="course_rating">Course Rating</option>
                <option value="simulator_rating">Simulator Rating</option>
                <option value="ai_mentor">AI Mentor Rating</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Title / Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Add Snowflake DWH syntax to SQL Lab..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Detailed Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the feature idea or issue..."
              className="w-full p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black uppercase tracking-wider hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all cursor-pointer"
          >
            Submit Feedback
          </button>
        </form>

        {/* Existing Community Feedback List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Popular Community Requests</h3>
          <div className="space-y-3">
            {list.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0D1117] border border-white/10 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#00E5FF]/20 text-[#00E5FF]">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> {item.upvotesCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
