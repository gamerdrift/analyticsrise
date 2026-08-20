'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  VerifyCertificateResponse,
  verifyCertificateStatus,
} from '@/lib/services/certificateService';

interface PublicVerifyClientProps {
  certificateId: string;
}

export default function PublicVerifyClient({ certificateId }: PublicVerifyClientProps) {
  const [result, setResult] = useState<VerifyCertificateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkCertificate() {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const res = await verifyCertificateStatus(certificateId);
        if (isMounted) {
          setResult(res);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Verification error:', err);
          setErrorMsg(err?.message || 'Unable to connect to verification authority. Please retry.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (certificateId) {
      checkCertificate();
    }

    return () => {
      isMounted = false;
    };
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex justify-between items-center py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 font-display font-black tracking-wider text-lg">
          <span className="text-[#00E5FF]">ANALYTICS</span>RISE
        </Link>
        <span className="text-[10px] font-mono uppercase text-slate-500 bg-white/5 px-2.5 py-1 rounded border border-white/5">
          Public Credential Registry
        </span>
      </header>

      {/* Main Verification Card */}
      <main className="max-w-2xl w-full mx-auto my-12">
        <div className="glass-panel p-8 sm:p-12 relative overflow-hidden bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl">
          {/* Accent Line */}
          <div
            className={`absolute top-0 left-0 w-full h-1.5 ${
              isLoading
                ? 'bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent animate-pulse'
                : result?.valid
                ? 'bg-emerald-500'
                : result?.status === 'revoked'
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          />

          {isLoading ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-12 h-12 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase">
                Verifying Cryptographic Credential Signature...
              </p>
              <p className="text-[11px] text-slate-500 font-mono">ID: {certificateId}</p>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex-center mx-auto text-2xl text-rose-400">
                ⚠️
              </div>
              <div>
                <h2 className="text-xl font-bold font-display uppercase tracking-wide text-rose-400">
                  Verification Service Error
                </h2>
                <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          ) : result?.valid ? (
            /* VALID AUTHENTIC CREDENTIAL */
            <div className="space-y-8">
              {/* Badge */}
              <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex-center text-emerald-400 text-lg">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400 block">
                      Authentic & Verified Credential
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      HMAC-SHA256 Cryptographic Signature Matched
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  ID: {result.certificateId}
                </span>
              </div>

              {/* Recipient & Credential Info */}
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Credential Issued To
                </span>
                <h1 className="text-2xl sm:text-3xl font-black font-display text-white uppercase tracking-wide">
                  {result.recipientName}
                </h1>
              </div>

              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest block font-bold">
                  Certified Specialization
                </span>
                <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide">
                  {result.credentialTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                  <span>🎯 Score: {result.score}%</span>
                  <span>•</span>
                  <span>
                    📅 Issued: {result.issuedAt ? new Date(result.issuedAt).toISOString().split('T')[0] : '--'}
                  </span>
                  <span>•</span>
                  <span>Status: VALID</span>
                </div>
              </div>

              {/* Audit Metadata */}
              <div className="text-[10px] font-mono text-slate-500 space-y-1 border-t border-white/5 pt-6">
                <div className="flex justify-between">
                  <span>Issuing Authority:</span>
                  <span className="text-slate-300">AnalyticsRise Platform Core</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification Timestamp:</span>
                  <span className="text-slate-300">{result.verifiedAt || new Date().toISOString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Algorithm:</span>
                  <span className="text-slate-300">HMAC-SHA256 Timing-Safe Validated</span>
                </div>
              </div>
            </div>
          ) : result?.status === 'revoked' ? (
            /* REVOKED CREDENTIAL */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex-center mx-auto text-2xl text-amber-400">
                🚫
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400 block">
                  Credential Revoked
                </span>
                <h2 className="text-xl font-bold font-display uppercase tracking-wide text-white mt-1">
                  {result.credentialTitle || 'AnalyticsRise Certification'}
                </h2>
                <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed max-w-md mx-auto">
                  This credential was previously issued to <span className="text-slate-200">{result.recipientName}</span> but has since been revoked by the issuing authority.
                </p>
              </div>
            </div>
          ) : result?.status === 'tampered' ? (
            /* TAMPERED / INVALID SIGNATURE */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex-center mx-auto text-2xl text-rose-400">
                ⛔
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-rose-400 block">
                  Signature Mismatch Detected
                </span>
                <h2 className="text-xl font-bold font-display uppercase tracking-wide text-white mt-1">
                  Invalid or Corrupted Credential
                </h2>
                <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed max-w-md mx-auto">
                  The cryptographic signature for this certificate does not match the authoritative registry records. The record may have been altered or forged.
                </p>
              </div>
            </div>
          ) : (
            /* NOT FOUND */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex-center mx-auto text-2xl text-slate-400">
                ❓
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block">
                  Record Not Found
                </span>
                <h2 className="text-xl font-bold font-display uppercase tracking-wide text-white mt-1">
                  Unregistered Credential ID
                </h2>
                <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed max-w-md mx-auto">
                  No certificate matching ID &quot;{certificateId}&quot; exists in the official AnalyticsRise credential registry.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center py-6 text-[10px] font-mono text-slate-600 border-t border-white/5">
        <span>© {new Date().getFullYear()} AnalyticsRise. All rights reserved. Zero-Trust Verification Protocol.</span>
      </footer>
    </div>
  );
}
