'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * ARDS Cybernetic Loading Spinner Component
 * 
 * Renders a high-tech glowing rotating spinner aligned with design tokens.
 */
export const LoadingSpinner = ({ 
  size = 'md', 
  label 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  label?: string 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4" role="status" aria-live="polite">
      <div className="relative">
        {/* Glowing border ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className={`${sizeClasses[size]} border-transparent border-t-[#00E5FF] border-r-[#4FC3F7]/40 rounded-full`}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.4))'
          }}
        />
        {/* Pulsing center Core */}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[#00E5FF]"
          style={{
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.8)'
          }}
        />
      </div>
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#4FC3F7] animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * ARDS Glowing Skeleton Text Lines
 */
export const SkeletonText = ({ 
  lines = 1, 
  className 
}: { 
  lines?: number; 
  className?: string 
}) => {
  return (
    <div className={`space-y-2.5 animate-pulse ${className || ''}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-3.5 bg-[#1E293B] rounded-sm"
          style={{ width: index === lines - 1 && lines > 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
};

/**
 * ARDS Glassmorphism Skeleton Content Card
 */
export const SkeletonCard = ({ 
  className 
}: { 
  className?: string 
}) => {
  return (
    <div 
      className={`bg-[#0D1117]/70 backdrop-blur-md border border-white/10 p-5 rounded-md animate-pulse space-y-4 ${className || ''}`}
      aria-hidden="true"
    >
      <div className="h-5 w-1/3 bg-[#1E293B] rounded-sm" />
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-[#1E293B] rounded-sm" />
        <div className="h-3.5 w-5/6 bg-[#1E293B] rounded-sm" />
      </div>
      <div className="h-8 w-24 bg-[#1E293B] rounded-sm mt-4" />
    </div>
  );
};

/**
 * Fullscreen Blocking Loading Overlay
 * Useful during route transition, session startup, or network synchronizations.
 */
export const LoadingOverlay = ({ 
  message 
}: { 
  message?: string 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070B]/85 backdrop-blur-sm">
      <LoadingSpinner size="lg" label={message || 'Initializing secure environment link...'} />
    </div>
  );
};
