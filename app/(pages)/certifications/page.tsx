'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  UserCertificateRecord,
  claimCertificate,
  fetchUserCertificates,
} from '@/lib/services/certificateService';

function CertificationsContent() {
  const searchParams = useSearchParams();
  const submissionIdParam = searchParams.get('submissionId');

  const { currentUser: user, loading: authLoading } = useAuth();

  const [certificates, setCertificates] = useState<UserCertificateRecord[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [activeCert, setActiveCert] = useState<UserCertificateRecord | null>(null);

  // Claiming State
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch Authentic User Certificates
  const loadCertificates = async (userId: string) => {
    setLoadingCerts(true);
    try {
      const certs = await fetchUserCertificates(userId);
      setCertificates(certs);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoadingCerts(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadCertificates(user.uid);
    } else if (!authLoading) {
      setLoadingCerts(false);
    }
  }, [user, authLoading]);

  // Handle Automatic/Manual Certificate Claiming via submissionId
  const handleClaim = async (subId: string) => {
    setIsClaiming(true);
    setClaimError(null);
    setClaimSuccess(null);

    try {
      const res = await claimCertificate(subId);
      setClaimSuccess(`Certificate "${res.credentialTitle}" successfully issued and signed!`);
      if (user) {
        await loadCertificates(user.uid);
      }
    } catch (err: any) {
      console.error('Failed to issue certificate:', err);
      setClaimError(
        err?.message ||
          'Unable to issue certificate. Ensure you have an active Pro membership plan with certificate access.'
      );
    } finally {
      setIsClaiming(false);
    }
  };

  useEffect(() => {
    if (user && submissionIdParam) {
      handleClaim(submissionIdParam);
    }
  }, [user, submissionIdParam]);

  const copyVerifyUrl = (certId: string) => {
    const url = `${window.location.origin}/verify/${certId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Credentials Shelf</span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
          PROFESSIONAL CERTIFICATIONS
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Verify and display your earned achievements. Each credential is cryptographically signed via HMAC-SHA256 and registered on the platform registry.
        </p>

        {claimSuccess && (
          <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            ✅ {claimSuccess}
          </div>
        )}

        {claimError && (
          <div className="mt-4 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center justify-between">
            <span>⚠️ {claimError}</span>
            <Link
              href="/pricing"
              className="px-3 py-1 bg-[#00E5FF] text-black font-bold uppercase tracking-wider text-[10px] rounded hover:bg-[#00B8CC]"
            >
              Upgrade Plan
            </Link>
          </div>
        )}
      </div>

      {/* Certificates Grid */}
      {loadingCerts ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          FETCHING ACCREDITED CREDENTIALS...
        </div>
      ) : !user ? (
        <div className="glass-panel p-10 text-center max-w-lg mx-auto space-y-4">
          <h3 className="text-lg font-bold text-white font-display uppercase">Authentication Required</h3>
          <p className="text-xs text-slate-400 font-sans">
            Please sign in to view your verified digital credentials and examination badges.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 cyber-button text-xs font-bold tracking-widest uppercase"
          >
            SIGN IN TO VIEW SHELF
          </Link>
        </div>
      ) : certificates.length === 0 ? (
        <div className="glass-panel p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full border border-slate-700 mx-auto flex-center text-slate-500">
            📜
          </div>
          <h3 className="text-lg font-bold text-white font-display uppercase">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Pass official course assessments with an 80% score or higher on an eligible Pro membership plan to earn verifiable credentials.
          </p>
          <Link
            href="/assessments"
            className="inline-block px-6 py-2.5 cyber-button text-xs font-bold tracking-widest uppercase"
          >
            EXPLORE ASSESSMENTS
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="glass-panel p-6 flex flex-col justify-between h-64 border-t-2 border-[#00E5FF] relative overflow-hidden"
            >
              <div>
                <div className="flex justify-between items-start mb-3 font-mono text-[9px]">
                  <span className="px-2 py-0.5 bg-[#00E5FF]/10 rounded border border-[#00E5FF]/30 text-[#00E5FF]">
                    {cert.status === 'valid' ? 'AUTHENTICATED' : cert.status.toUpperCase()}
                  </span>
                  <span className="text-slate-500 font-mono">Score: {cert.score}%</span>
                </div>

                <h3 className="text-md font-bold text-white font-display uppercase tracking-wide leading-snug">
                  {cert.credentialTitle}
                </h3>

                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Recipient: <span className="text-slate-200">{cert.recipientName}</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono">
                  Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setActiveCert(cert)}
                  className="px-4 py-2 cyber-button text-[9px] font-bold tracking-widest uppercase"
                >
                  VIEW CREDENTIAL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verified Certificate Modal */}
      <AnimatePresence>
        {activeCert && (
          <div className="fixed inset-0 z-50 flex-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCert(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Certificate */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-4xl p-1 bg-gradient-to-br from-[#00E5FF] via-[#4FC3F7] to-purple-600 rounded-xl overflow-hidden shadow-2xl z-10"
            >
              <div className="p-8 md:p-12 bg-[#0C1017] rounded-lg text-center space-y-8 grid-bg-dense relative">
                {/* Certificate Details */}
                <div className="flex justify-between items-start text-xs font-mono text-slate-500">
                  <div className="text-left">
                    <span className="block text-slate-400 font-bold">ISSUING AUTHORITY: ANALYTICSRISE</span>
                    <span>CREDENTIAL ID: {activeCert.certificateId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#00E5FF] font-bold block">CRYPTOGRAPHICALLY SIGNED</span>
                    <span>HMAC-SHA256 SECURED</span>
                  </div>
                </div>

                <div className="space-y-4 max-w-xl mx-auto">
                  <span className="text-xs text-[#00E5FF] font-mono tracking-widest uppercase font-bold block">
                    Official Certificate of Achievement
                  </span>

                  <h2 className="text-3xl md:text-5xl font-black text-white font-display tracking-wide uppercase">
                    CREDENTIAL AWARDED
                  </h2>

                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent mx-auto my-4" />

                  <p className="text-sm text-slate-400 font-mono">This document certifies that</p>

                  <h3 className="text-xl md:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] uppercase tracking-widest py-2">
                    {activeCert.recipientName}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                    has successfully solved realistic industry case studies and demonstrated verified mastery in
                  </p>

                  <h4 className="text-lg font-bold text-white font-display uppercase tracking-widest mt-2">
                    {activeCert.credentialTitle}
                  </h4>
                </div>

                {/* Footer and Verification Link */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-[10px] font-mono text-slate-500">
                  <div className="text-left space-y-1">
                    <span className="block font-bold text-white text-xs">AnalyticsRise Credential Authority</span>
                    <span>Status: {activeCert.status.toUpperCase()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => copyVerifyUrl(activeCert.certificateId)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 text-xs font-mono flex items-center gap-2"
                    >
                      <span>{copiedLink ? '✓ LINK COPIED!' : '📋 COPY VERIFY LINK'}</span>
                    </button>
                    <Link
                      href={`/verify/${activeCert.certificateId}`}
                      target="_blank"
                      className="px-4 py-2 cyber-button text-xs font-bold tracking-widest uppercase"
                    >
                      OPEN PUBLIC VERIFIER ↗
                    </Link>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="block font-bold text-slate-400">
                      ISSUED: {new Date(activeCert.issuedAt).toISOString().split('T')[0]}
                    </span>
                    <span>GRADE: {activeCert.score}%</span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveCert(null)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default function CertificationsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="py-20 text-center text-slate-500 font-mono text-xs">
            INITIALIZING CERTIFICATIONS CENTER...
          </div>
        </DashboardLayout>
      }
    >
      <CertificationsContent />
    </Suspense>
  );
}
