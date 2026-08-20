'use client';

import React from 'react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import LandingHero from '@/app/components/landing/LandingHero';
import ThreePillarsSection from '@/app/components/landing/ThreePillarsSection';
import FlagshipProductsSection from '@/app/components/landing/FlagshipProductsSection';
import LearnerJourneySection from '@/app/components/landing/LearnerJourneySection';
import WhyAnalyticsRiseSection from '@/app/components/landing/WhyAnalyticsRiseSection';
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
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#05070B]/60 to-[#05070B] opacity-90" />

      {/* Navigation */}
      <LandingNavbar />

      {/* Main Learner-First Conversion Architecture */}
      <main className="flex-1 relative z-10">
        {/* 1. Hero: Learn Data. Practice Real Skills. Rise Higher. */}
        <LandingHero />

        {/* 2. The Three Pillars: 01 Learn • 02 Practice • 03 Rise */}
        <ThreePillarsSection />

        {/* 3. Flagship Learning Studios: SQL, Excel, Power BI + Coming Soon */}
        <FlagshipProductsSection />

        {/* 4. The 5-Step Ascension Pathway & Beginner Reassurance */}
        <LearnerJourneySection />

        {/* 5. Why AnalyticsRise: Traditional vs AnalyticsRise Matrix */}
        <WhyAnalyticsRiseSection />

        {/* 6. Structured Syllabus Roadmaps */}
        <LearningPaths />

        {/* 7. Practical Real-World Labs */}
        <BusinessProjects />

        {/* 8. Cryptographic Proof of Capability */}
        <Certifications />

        {/* 9. Career Alignment Hub */}
        <CareerHub />

        {/* 10. Industry Technology Stack Core */}
        <TechnologyShowcase />

        {/* 11. Transparent Pricing & Free Sandbox Pathway */}
        <PricingSection />

        {/* 12. Verified Learner Testimonials */}
        <Testimonials />

        {/* 13. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
