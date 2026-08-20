'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/app/components/forms/FormControls';
import { Button } from '@/app/components/ui/Button';
import { LoadingOverlay } from '@/app/components/ui/Loading';
import { AuthService } from '@/lib/services/auth';
import { handleFirebaseError } from '@/lib/utils/error';
import { KeyRound, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { ArTriangleIcon } from '@/app/components/brand';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await AuthService.resetPassword(email.trim());
      setSubmitted(true);
    } catch (err: any) {
      const appErr = handleFirebaseError(err);
      setErrorMsg(appErr.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {submitting && <LoadingOverlay message="Sending reset link..." />}
      <section className="flex min-h-screen items-center justify-center bg-[#05070B] p-4 font-mono">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-[#0D1117] p-8 shadow-2xl border border-white/10 backdrop-blur-md">
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block group mb-1" title="Return to AnalyticsRise Home">
              <ArTriangleIcon size={40} className="mx-auto transition-transform group-hover:scale-105" />
            </Link>
            <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white">
              Reset Password
            </h1>
            <p className="text-xs text-slate-400">
              Enter your account email address to receive password reset instructions.
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-rose-400 text-xs flex items-center gap-2">
              <span>{errorMsg}</span>
            </div>
          )}

          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase">Reset Link Sent!</h3>
                <p className="text-xs text-slate-400">
                  If an account exists for <span className="text-[#00E5FF]">{email}</span>, check your inbox for instructions to reset your password.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold uppercase text-xs hover:bg-[#4FC3F7] transition-all shadow-lg shadow-[#00E5FF]/20 mt-4"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="learner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="md" loading={submitting}>
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="flex justify-between items-center text-xs text-slate-400 pt-4 border-t border-white/5">
            <Link href="/login" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
            <Link href="/register" className="hover:text-[#00E5FF] transition-colors">
              Create Account
            </Link>
          </div>

          <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-500 space-y-2">
            <p>Need support resetting password? Contact desk:</p>
            <a
              href="mailto:support@analyticsrise.com"
              className="inline-flex items-center gap-1.5 text-[#00E5FF] font-mono font-bold hover:underline"
            >
              <Mail className="w-3.5 h-3.5" /> support@analyticsrise.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
