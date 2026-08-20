'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, PasswordInput, Checkbox } from '@/app/components/forms/FormControls';
import { Button } from '@/app/components/ui/Button';
import { LoadingOverlay } from '@/app/components/ui/Loading';
import { AuthService } from '@/lib/services/auth';
import { handleFirebaseError } from '@/lib/utils/error';
import { useAuth } from '@/lib/hooks/useAuth';
import { Globe as IconBrandGoogle, GitBranch as IconBrandGithub, Mail } from 'lucide-react';
import { ArTriangleIcon } from '@/app/components/brand';

export default function LoginPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await AuthService.loginWithEmail(email, password);
      router.replace('/dashboard');
    } catch (err) {
      const appErr = handleFirebaseError(err);
      setErrorMsg(appErr.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await AuthService.loginWithGoogle();
      router.replace('/dashboard');
    } catch (err) {
      const appErr = handleFirebaseError(err);
      setErrorMsg(appErr.message);
    }
  };

  const handleGithub = async () => {
    try {
      await AuthService.loginWithGithub();
      router.replace('/dashboard');
    } catch (err) {
      const appErr = handleFirebaseError(err);
      setErrorMsg(appErr.message);
    }
  };

  return (
    <>
      {(authLoading || submitting) && <LoadingOverlay message="Logging in..." />}
      <section className="flex min-h-screen items-center justify-center bg-[#05070B] p-4 font-mono">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-[#0D1117] p-8 shadow-2xl border border-white/10 backdrop-blur-md">
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block group" title="Return to AnalyticsRise Home">
              <ArTriangleIcon size={44} className="mx-auto transition-transform group-hover:scale-105" />
            </Link>
            <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-[#00E5FF]">
              AnalyticsRise Login
            </h1>
            <p className="text-xs text-slate-400">
              Access your personal data learning workspace
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Checkbox
              label="Remember Me"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <Button type="submit" variant="primary" size="md" loading={submitting}>
              Login
            </Button>
          </form>

          <div className="flex flex-col space-y-3 pt-2 border-t border-white/5">
            <Button variant="secondary" size="md" onClick={handleGoogle} icon={<IconBrandGoogle size={16} />} iconPosition="left">
              Continue with Google
            </Button>
            <Button variant="secondary" size="md" onClick={handleGithub} icon={<IconBrandGithub size={16} />} iconPosition="left">
              Continue with GitHub
            </Button>
          </div>

          <div className="flex justify-between text-xs text-slate-400 pt-2">
            <Link href="/forgot-password" className="hover:text-white transition-colors">
              Forgot Password?
            </Link>
            <Link href="/register" className="hover:text-[#00E5FF] transition-colors">
              Create Account
            </Link>
          </div>

          <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-500 space-y-2">
            <p>Need support? Contact our help desk:</p>
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
