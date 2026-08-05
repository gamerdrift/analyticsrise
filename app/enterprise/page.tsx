'use client';

import React, { useState } from 'react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import {
  Building2,
  ShieldCheck,
  Lock,
  Cpu,
  Users,
  CheckCircle2,
  ArrowRight,
  Mail,
  Zap,
  Layers,
} from 'lucide-react';

export default function EnterpriseLandingPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-25" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00E5FF]/10 rounded-full blur-[160px] pointer-events-none z-0" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-24">
        {/* HERO */}
        <section className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono font-bold tracking-widest uppercase shadow-lg shadow-[#00E5FF]/10">
            <Building2 className="w-4 h-4 text-[#00E5FF]" /> Enterprise Solutions
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white uppercase tracking-tight leading-[1.05]">
            SCALE AI ANALYTICS FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-indigo-300 to-[#00E5FF]">
              THE ENTIRE ENTERPRISE
            </span>
          </h1>

          <p className="text-base sm:text-xl font-mono text-[#00E5FF] font-bold tracking-wider uppercase">
            SOC-2 Type II Certified • Custom VPC Deployment • Dedicated Support
          </p>

          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Empower your entire workforce with AR Studio and AR Assist under enterprise-grade governance, SAML/Okta Single Sign-On, custom data privacy controls, and dedicated account management.
          </p>
        </section>

        {/* ENTERPRISE PILLARS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4">
            <ShieldCheck className="w-8 h-8 text-[#00E5FF]" />
            <h3 className="text-lg font-display font-bold text-white uppercase">Enterprise Security</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              SOC-2 Type II, HIPAA, and GDPR compliant. Client-side WebAssembly execution keeps data securely inside your network perimeter.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4">
            <Lock className="w-8 h-8 text-indigo-400" />
            <h3 className="text-lg font-display font-bold text-white uppercase">SAML & Okta SSO</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Seamless identity management integration with Okta, Azure AD, Ping Identity, and Google Workspace SSO.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4">
            <Cpu className="w-8 h-8 text-purple-400" />
            <h3 className="text-lg font-display font-bold text-white uppercase">Dedicated VPC & On-Prem</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Deploy AR Studio directly on AWS, Azure, GCP VPCs, or air-gapped on-premises Kubernetes clusters.
            </p>
          </div>
        </section>

        {/* CONTACT SALES FORM */}
        <section className="p-10 rounded-3xl bg-[#080C14] border border-[#00E5FF]/30 max-w-3xl mx-auto space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
              Contact Enterprise Sales
            </h2>
            <p className="text-slate-400 text-xs font-mono">
              Get a custom deployment consultation within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2 font-mono text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <div className="font-bold text-sm text-white">Request Received!</div>
              <p>An Enterprise Solutions Architect will reach out to your team shortly.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Work Email</label>
                  <input required type="email" placeholder="alex@company.com" className="w-full px-4 py-3 rounded-xl bg-[#0D1424] border border-white/10 text-white text-xs font-mono focus:border-[#00E5FF] outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Company Name</label>
                  <input required type="text" placeholder="Acme Global Inc." className="w-full px-4 py-3 rounded-xl bg-[#0D1424] border border-white/10 text-white text-xs font-mono focus:border-[#00E5FF] outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Team Size</label>
                <select className="w-full px-4 py-3 rounded-xl bg-[#0D1424] border border-white/10 text-white text-xs font-mono focus:border-[#00E5FF] outline-none">
                  <option>10 - 50 Seats</option>
                  <option>50 - 250 Seats</option>
                  <option>250 - 1,000 Seats</option>
                  <option>1,000+ Enterprise Seats</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Deployment Requirements</label>
                <textarea rows={3} placeholder="Tell us about your database connectors or VPC requirements..." className="w-full px-4 py-3 rounded-xl bg-[#0D1424] border border-white/10 text-white text-xs font-mono focus:border-[#00E5FF] outline-none" />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] text-black font-mono font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#00E5FF]/20"
              >
                Submit Enterprise Request
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
