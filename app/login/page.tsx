// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, PasswordInput, Checkbox } from '@/app/components/forms/FormControls';
import { Button } from '@/app/components/ui/Button';
import { LoadingOverlay } from '@/app/components/ui/Loading';
import { AuthService } from '@/lib/services/auth';
import { handleFirebaseError } from '@/lib/utils/error';
import { useAuth } from '@/lib/hooks/useAuth';
import { Globe as IconBrandGoogle, GitBranch as IconBrandGithub } from 'lucide-react';

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
      // Remember Me is handled by AuthContext cookie default (7 days). No extra work.
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
      <section className="flex min-h-screen items-center justify-center bg-[#05070B] p-4">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-[#0D1117] p-8 shadow-2xl backdrop-blur-md">
          <h1 className="text-center text-2xl font-display uppercase tracking-widest text-[#00E5FF]">
            AnalyticsRise Login
          </h1>
          {errorMsg && (
            <div className="rounded bg-[#FF1744]/20 p-3 text-[#FF1744] text-sm">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
          <div className="flex flex-col space-y-3">
            <Button variant="secondary" size="md" onClick={handleGoogle} icon={<IconBrandGoogle size={16} />} iconPosition="left">
              Continue with Google
            </Button>
            <Button variant="secondary" size="md" onClick={handleGithub} icon={<IconBrandGithub size={16} />} iconPosition="left">
              Continue with GitHub
            </Button>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <a href="/forgot-password" className="hover:underline">
              Forgot Password?
            </a>
            <a href="/register" className="hover:underline">
              Register Instead
            </a>
          </div>
          <footer className="mt-6 text-center text-xs text-slate-500">
            <a href="/privacy" className="mx-2 hover:underline">Privacy</a>
            <a href="/terms" className="mx-2 hover:underline">Terms</a>
            <a href="/support" className="mx-2 hover:underline">Support</a>
          </footer>
        </div>
      </section>
    </>
  );
}
