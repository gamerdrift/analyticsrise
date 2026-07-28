'use client';

import React, { useState } from 'react';
import { Mail, Clock, Calendar, Send, ShieldCheck, CheckCircle2, MessageSquare, Building2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold tracking-widest uppercase mb-2">
            <Mail className="w-4 h-4" /> Official Support & Contact
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-wider uppercase">
            Get in Touch with <span className="text-[#00E5FF]">AnalyticsRise</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            We are here to assist with learner support, enterprise team licensing, platform feedback, and partnership inquiries.
          </p>
        </section>

        {/* Contact Information Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Official Support Email */}
          <div className="p-6 rounded-2xl bg-[#0D1117] border border-[#00E5FF]/30 space-y-3 relative overflow-hidden shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Direct Email Support</h3>
            <p className="text-slate-400 text-xs">Reach our dedicated support desk directly:</p>
            <a
              href="mailto:support@analyticsrise.com"
              className="text-[#00E5FF] font-mono font-bold text-xs hover:underline inline-block break-all"
            >
              support@analyticsrise.com
            </a>
          </div>

          {/* Card 2: Response Time */}
          <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/10 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Response SLA</h3>
            <p className="text-slate-400 text-xs">Typical support response timeframe:</p>
            <span className="text-white font-mono font-bold text-xs">&lt; 24 Hours (Mon – Fri)</span>
          </div>

          {/* Card 3: Business Hours */}
          <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/10 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Business Hours</h3>
            <p className="text-slate-400 text-xs">Global desk operations:</p>
            <span className="text-white font-mono font-bold text-xs">9:00 AM – 6:00 PM EST</span>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="p-8 rounded-2xl bg-[#0D1117] border border-white/10 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#00E5FF]" /> Send Us a Message
            </h2>
            <p className="text-slate-400 text-xs">
              Fill out the form below or email us directly at{' '}
              <a href="mailto:support@analyticsrise.com" className="text-[#00E5FF] underline font-mono">
                support@analyticsrise.com
              </a>
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2 text-center font-mono">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
              <h3 className="text-base font-bold uppercase">Message Received</h3>
              <p className="text-xs text-slate-300">
                Thank you for contacting AnalyticsRise! Our support desk has received your request and will follow up shortly at <strong className="text-white">{formData.email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full p-3 rounded-lg bg-[#05070B] border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase">Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sarah@example.com"
                    className="w-full p-3 rounded-lg bg-[#05070B] border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">Inquiry Category</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-3 rounded-lg bg-[#05070B] border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Learner Technical Support">Learner Technical Support</option>
                  <option value="Enterprise Licensing">Enterprise Licensing</option>
                  <option value="Billing & Subscriptions">Billing & Subscriptions</option>
                  <option value="Feedback">Platform Feedback</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase">Message / Description</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist your analytics journey?"
                  className="w-full p-3 rounded-lg bg-[#05070B] border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-widest hover:bg-[#4FC3F7] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00E5FF]/20"
              >
                <Send className="w-4 h-4" /> Submit Support Request
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
