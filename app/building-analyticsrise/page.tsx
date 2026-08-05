'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import {
  BookOpen,
  Sparkles,
  Award,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Headphones,
  FileText,
  Star,
  Users,
  Feather,
  ShoppingBag,
} from 'lucide-react';

interface BookEdition {
  id: string;
  badge: string;
  name: string;
  status: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const EDITIONS: BookEdition[] = [
  {
    id: 'digital',
    badge: 'INSTANT ACCESS',
    name: 'Digital Reader Edition',
    status: 'Available Now',
    price: '$19',
    description: 'Instant PDF, ePub, and Web Reader access to the complete 320-page book.',
    features: ['PDF, ePub & Kindle formats', 'Interactive code snippets', 'Free future digital updates', 'Exclusive founder video notes'],
    icon: <FileText className="w-5 h-5 text-amber-400" />,
    popular: true,
  },
  {
    id: 'hardcover',
    badge: 'PRE-ORDER',
    name: 'Hardcover Collector Edition',
    status: 'Shipping Q4 2026',
    price: '$39',
    description: 'Premium clothbound hardcover print edition with gold foil typography and custom bookmark.',
    features: ['Custom hardcover binding', 'High-quality matte paper', 'Includes Digital Reader Edition', 'Free global standard shipping'],
    icon: <BookOpen className="w-5 h-5 text-[#00E5FF]" />,
  },
  {
    id: 'audiobook',
    badge: 'COMING SOON',
    name: 'Founder Audiobook',
    status: 'Releasing Q4 2026',
    price: '$24',
    description: 'Narrated personally by the founder with unscripted engineering commentary and backstage stories.',
    features: ['Dolby Atmos audio mastering', 'Downloadable offline MP3/M4B', 'Exclusive 2-hour Q&A bonus chapter', 'Companion digital graphics pack'],
    icon: <Headphones className="w-5 h-5 text-purple-400" />,
  },
  {
    id: 'signed',
    badge: 'LIMITED PRE-ORDER',
    name: 'Signed Founder Edition',
    status: 'Only 500 Copies',
    price: '$99',
    description: 'Hand-signed and numbered hardcover edition with personalized founder dedication note.',
    features: ['Hand-signed & numbered certificate', 'Custom laser-engraved bookmark', 'Founder Private Q&A webinar invite', 'Includes all digital & audiobook formats'],
    icon: <Feather className="w-5 h-5 text-emerald-400" />,
  },
];

const CHAPTERS = [
  { num: '01', title: 'The Spark: Why Video Tutorials Fail Data Analysts' },
  { num: '02', title: 'Architecting WebAssembly Simulators in Browser' },
  { num: '03', title: 'The First 1,000 Users & Lessons in Product Traction' },
  { num: '04', title: 'Building AR Studio: The AI BI Paradigm Shift' },
  { num: '05', title: 'Scaling Infrastructure to 1.4 Million Executed Queries' },
  { num: '06', title: 'The Future of Autonomous Data Analytics' },
];

export default function BuildingAnalyticsRisePage() {
  const [selectedEdition, setSelectedEdition] = useState<BookEdition>(EDITIONS[0]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-amber-500/20 selection:text-amber-400 flex flex-col relative overflow-hidden">
      {/* Ambient warm glow */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-25" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none z-0" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-24">
        {/* HERO CINEMATIC SHOWCASE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
          {/* Left Column: Copy & Taglines */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase shadow-lg shadow-amber-500/10">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Official Book Launch
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tight leading-[1.05]">
              BUILDING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-[#00E5FF]">
                ANALYTICSRISE
              </span>
            </h1>

            <p className="text-base sm:text-xl font-mono text-amber-300 font-bold tracking-wider uppercase">
              The Journey from Idea to Global AI Software Company
            </p>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Discover the complete, behind-the-scenes founder story of architecting AnalyticsRise. From engineering browser-native data simulators to launching AR Studio and serving over 100,000 data professionals worldwide.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 320 Pages</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 6 Key Chapters</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Unfiltered Engineering Insights</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-mono font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Reserve Your Edition ({selectedEdition.price})
              </button>
              <a
                href="#chapters"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center"
              >
                Read Table of Contents
              </a>
            </div>
          </div>

          {/* Right Column: 3D Book Graphic Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="w-72 sm:w-80 h-[420px] rounded-r-2xl bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-400 p-8 shadow-[0_20px_50px_rgba(251,191,36,0.3)] border-l-8 border-amber-950 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform duration-500 relative group">
              <div className="space-y-4">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/80">ANALYTICSRISE PRESS</div>
                <h2 className="text-3xl font-display font-black text-black leading-tight uppercase">
                  BUILDING ANALYTICS<span className="text-white">RISE</span>
                </h2>
                <p className="text-xs font-mono font-bold text-black/80 uppercase">
                  Idea to Global Software Company
                </p>
              </div>

              <div className="space-y-2 border-t border-black/20 pt-4">
                <div className="text-[10px] font-mono text-black font-bold">BY THE FOUNDER TEAM</div>
                <div className="text-[9px] font-mono text-black/70">Foreword by Senior Software Architects</div>
              </div>
            </div>
          </div>
        </section>

        {/* EDITIONS SELECTOR GRID */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wider">
              Choose Your <span className="text-amber-400">Edition</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Select your preferred edition format below. All orders include instant digital access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EDITIONS.map((ed) => (
              <div
                key={ed.id}
                onClick={() => setSelectedEdition(ed)}
                className={`p-6 rounded-3xl bg-[#080C14] border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                  selectedEdition.id === ed.id
                    ? 'border-amber-400 shadow-xl shadow-amber-500/20 bg-[#0D1424]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300">
                      {ed.badge}
                    </span>
                    {ed.icon}
                  </div>

                  <div>
                    <h3 className="text-lg font-display font-bold text-white uppercase">{ed.name}</h3>
                    <span className="text-[10px] font-mono text-slate-500">{ed.status}</span>
                  </div>

                  <div className="text-3xl font-display font-black text-white">{ed.price}</div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{ed.description}</p>

                  <ul className="space-y-2 text-[11px] font-mono text-slate-300 pt-2 border-t border-white/10">
                    {ed.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
                    selectedEdition.id === ed.id
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {selectedEdition.id === ed.id ? 'Selected Edition' : 'Select Edition'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CHAPTER PREVIEW LIST */}
        <section id="chapters" className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
              Table of Contents Preview
            </h2>
            <p className="text-slate-400 text-xs font-mono">Inside the 6 core chapters of Building AnalyticsRise</p>
          </div>

          <div className="space-y-3">
            {CHAPTERS.map((ch) => (
              <div key={ch.num} className="p-5 rounded-2xl bg-[#080C14] border border-white/10 flex items-center gap-4 hover:border-amber-400/40 transition-all">
                <span className="text-xl font-mono font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                  {ch.num}
                </span>
                <span className="text-sm font-bold text-white font-mono">{ch.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ORDER MODAL */}
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md w-full rounded-3xl bg-[#080C14] border border-amber-400 p-8 space-y-6 relative shadow-2xl">
              <div className="space-y-2 text-center">
                <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white uppercase">Reserve {selectedEdition.name}</h3>
                <p className="text-xs text-slate-400 font-mono">Price: {selectedEdition.price} • {selectedEdition.status}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Full Name</label>
                  <input type="text" placeholder="Vidya" className="w-full px-4 py-3 rounded-xl bg-[#0D1424] border border-white/10 text-white text-xs font-mono focus:border-amber-400 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Email Address</label>
                  <input type="email" placeholder="name@domain.com" className="w-full px-4 py-3 rounded-xl bg-[#0D1424] border border-white/10 text-white text-xs font-mono focus:border-amber-400 outline-none" />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-slate-300 font-mono text-xs font-bold uppercase hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Edition reserved successfully! Confirmation link has been sent to your email.');
                    setOrderModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-amber-400 text-black font-mono text-xs font-bold uppercase hover:bg-yellow-300"
                >
                  Confirm Reservation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
