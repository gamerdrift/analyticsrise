'use client';

export type VerificationType =
  | 'verified_certificate'
  | 'verified_portfolio'
  | 'verified_recruiter'
  | 'verified_employer'
  | 'verified_mentor';

export interface VerificationBadgeMeta {
  type: VerificationType;
  label: string;
  description: string;
  iconColor: string;
  badgeBg: string;
}

export const VERIFICATION_BADGES: Record<VerificationType, VerificationBadgeMeta> = {
  verified_certificate: {
    type: 'verified_certificate',
    label: 'Verified Certificate',
    description: 'Cryptographically signed SHA-256 ledger certificate',
    iconColor: 'text-[#00E5FF]',
    badgeBg: 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]',
  },
  verified_portfolio: {
    type: 'verified_portfolio',
    label: 'Verified Portfolio',
    description: 'Code execution proof verified in interactive sandbox',
    iconColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
  },
  verified_recruiter: {
    type: 'verified_recruiter',
    label: 'Verified Recruiter',
    description: 'Vetted enterprise hiring partner',
    iconColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  },
  verified_employer: {
    type: 'verified_employer',
    label: 'Verified Employer',
    description: 'Corporate corporate hiring profile authenticated',
    iconColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  },
  verified_mentor: {
    type: 'verified_mentor',
    label: 'Verified Mentor',
    description: 'Vetted AI senior analytics instructor',
    iconColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  },
};

export class VerificationService {
  static getBadgeMeta(type: VerificationType): VerificationBadgeMeta {
    return VERIFICATION_BADGES[type] || VERIFICATION_BADGES.verified_certificate;
  }
}
