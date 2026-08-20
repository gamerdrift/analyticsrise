'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, PasswordInput, Checkbox, Select } from '@/app/components/forms/FormControls';
import { Button } from '@/app/components/ui/Button';
import { LoadingOverlay } from '@/app/components/ui/Loading';
import { AuthService } from '@/lib/services/auth';
import { UserService } from '@/lib/services/user';
import { handleFirebaseError } from '@/lib/utils/error';
import { evaluatePasswordStrength } from '@/lib/utils/password';
import { PasswordStrengthMeter } from '@/app/components/ui/PasswordStrengthMeter';
import { Mail } from 'lucide-react';
import { ArTriangleIcon } from '@/app/components/brand';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const passwordStrength = evaluatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const cred = await AuthService.signUpWithEmail(email, password);
      const uid = cred.user.uid;

      try {
        await UserService.createUserProfile(uid, email, fullName, 'student', { country, newsletter });
      } catch (profileErr) {
        console.warn('[Registration Workflow] Profile write warning:', profileErr);
      }

      router.replace('/dashboard');
    } catch (err: any) {
      const appErr = handleFirebaseError(err);
      setErrorMsg(appErr.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {submitting && <LoadingOverlay message="Creating account..." />}
      <section className="flex min-h-screen items-center justify-center bg-[#05070B] p-4 font-mono">
        <div className="w-full max-w-lg space-y-6 rounded-2xl bg-[#0D1117] p-8 shadow-2xl border border-white/10 backdrop-blur-md">
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block group" title="Return to AnalyticsRise Home">
              <ArTriangleIcon size={44} className="mx-auto transition-transform group-hover:scale-105" />
            </Link>
            <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-[#00E5FF]">
              Create Your AnalyticsRise Account
            </h1>
            <p className="text-xs text-slate-400">
              Join thousands of learners mastering data software in-browser
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <PasswordStrengthMeter strength={passwordStrength} />
            <PasswordInput label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <Select
              label="Country"
              options={[
                { value: '', label: 'Select country' },
                { value: 'US', label: 'United States' },
                { value: 'IN', label: 'India' },
                { value: 'CA', label: 'Canada' },
                { value: 'UK', label: 'United Kingdom' },
                { value: 'AU', label: 'Australia' },
              ]}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            <Checkbox label="Subscribe to Newsletter (optional)" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
            <Checkbox label="I accept the Terms and Privacy Policy" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} required />
            <Button type="submit" variant="primary" size="md" loading={submitting} disabled={!acceptTerms}>
              Register Account
            </Button>
          </form>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-white/5">
            <Link href="/login" className="hover:text-[#00E5FF] transition-colors">Already have an account? Login</Link>
          </div>

          <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-500 space-y-2">
            <p>Questions before signing up? Reach out:</p>
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
