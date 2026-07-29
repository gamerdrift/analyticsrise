'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  FileSpreadsheet,
  Database,
  Code2,
  Award,
  UserCheck,
  Briefcase,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { ONBOARDING_STEPS, OnboardingService } from '@/lib/services/onboardingService';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingWizard({ isOpen, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    OnboardingService.completeStep(step.id);
    if (isLast) {
      OnboardingService.completeAll();
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    OnboardingService.completeAll();
    onClose();
  };

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-8 h-8 text-[#00E5FF]" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-amber-400" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-8 h-8 text-emerald-400" />;
      case 'Database':
        return <Database className="w-8 h-8 text-cyan-400" />;
      case 'Code2':
        return <Code2 className="w-8 h-8 text-purple-400" />;
      case 'Award':
        return <Award className="w-8 h-8 text-amber-300" />;
      case 'UserCheck':
        return <UserCheck className="w-8 h-8 text-blue-400" />;
      case 'Briefcase':
        return <Briefcase className="w-8 h-8 text-[#00E5FF]" />;
      default:
        return <Rocket className="w-8 h-8 text-[#00E5FF]" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleSkip}
          className="fixed inset-0 bg-[#05070B]/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0D1117]/95 border border-[#00E5FF]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#00E5FF]/10 z-10 overflow-hidden"
        >
          {/* Top Neon Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-2 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent rounded-full shadow-lg shadow-[#00E5FF]/50" />

          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              <span>STEP {currentStep + 1} OF {ONBOARDING_STEPS.length}</span>
              <span className="text-[#00E5FF]">({Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}%)</span>
            </div>
            <button
              onClick={handleSkip}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Skip Onboarding
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-8">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content Card */}
          <div className="text-center py-6 px-4 rounded-2xl bg-white/5 border border-white/5 mb-8 relative">
            <div className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00E5FF]/10">
              {getStepIcon(step.iconName)}
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white mb-2">
              {step.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isLast ? 'Complete Onboarding 🎉' : 'Next Tool'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
