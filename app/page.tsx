'use client';

import React from 'react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import LandingHero from '@/app/components/landing/LandingHero';
import InteractivePreview from '@/app/components/landing/InteractivePreview';
import {
  TechnologyShowcase,
  LearningPaths,
  BusinessProjects,
  Certifications,
  CareerHub,
  PricingSection,
  Testimonials,
  FaqSection,
  LandingFooter,
} from '@/app/components/landing/LandingSections';

export default function RootLandingPage() {
  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] flex flex-col relative overflow-hidden">
      {/* Background Cyber-Grid Elements */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-25" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#05070B]/50 to-[#05070B] opacity-90" />

      {/* Navigation */}
      <LandingNavbar />

      {/* Main Page Layout */}
      <main className="flex-1 relative z-10">
        <LandingHero />
        <InteractivePreview />
        <TechnologyShowcase />
        <LearningPaths />
        <BusinessProjects />
        <Certifications />
        <CareerHub />
        <PricingSection />
        <Testimonials />
        <FaqSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
