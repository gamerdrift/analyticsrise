'use client';

import React from 'react';
import { ShieldCheck, Award, UserCheck, Building2, Sparkles } from 'lucide-react';
import { VerificationService, VerificationType } from '@/lib/services/verificationService';

interface VerificationBadgeProps {
  type: VerificationType;
  showText?: boolean;
}

export default function VerificationBadge({ type, showText = true }: VerificationBadgeProps) {
  const meta = VerificationService.getBadgeMeta(type);

  const getIcon = () => {
    switch (type) {
      case 'verified_certificate':
        return <Award className={`w-3.5 h-3.5 ${meta.iconColor}`} />;
      case 'verified_portfolio':
        return <UserCheck className={`w-3.5 h-3.5 ${meta.iconColor}`} />;
      case 'verified_recruiter':
        return <ShieldCheck className={`w-3.5 h-3.5 ${meta.iconColor}`} />;
      case 'verified_employer':
        return <Building2 className={`w-3.5 h-3.5 ${meta.iconColor}`} />;
      case 'verified_mentor':
        return <Sparkles className={`w-3.5 h-3.5 ${meta.iconColor}`} />;
      default:
        return <ShieldCheck className={`w-3.5 h-3.5 ${meta.iconColor}`} />;
    }
  };

  return (
    <span
      title={meta.description}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase font-mono tracking-wider ${meta.badgeBg}`}
    >
      {getIcon()}
      {showText && <span>{meta.label}</span>}
    </span>
  );
}
