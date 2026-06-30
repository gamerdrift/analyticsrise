// app/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, PasswordInput, Checkbox, Select } from '@/app/components/forms/FormControls';
import { Button } from '@/app/components/ui/Button';
import { LoadingOverlay } from '@/app/components/ui/Loading';
import { AuthService } from '@/lib/services/auth';
import { UserService } from '@/lib/services/user';
import { handleFirebaseError } from '@/lib/utils/error';
import { evaluatePasswordStrength } from '@/lib/utils/password';
import { PasswordStrengthMeter } from '@/app/components/ui/PasswordStrengthMeter';

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
      await UserService.createUserProfile(uid, email, fullName, 'student');
      // Store additional fields
      await UserService.updateUserProfile(uid, {
        profile: {
          displayName: fullName,
          email,
          avatarUrl: '',
          role: 'student',
          country,
          newsletter,
        },
      });
      await AuthService.logout(); // Ensure email verification required
      router.replace('/verify-email');
    } catch (err) {
      const appErr = handleFirebaseError(err);
      setErrorMsg(appErr.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {(submitting) && <LoadingOverlay message="Creating account..." />}
      <section className="flex min-h-screen items-center justify-center bg-[#05070B] p-4">
        <div className="w-full max-w-lg space-y-6 rounded-xl bg-[#0D1117] p-8 shadow-2xl backdrop-blur-md">
          <h1 className="text-center text-2xl font-display uppercase tracking-widest text-[#00E5FF]">
            Create Your AnalyticsRise Account
          </h1>
          {errorMsg && (
            <div className="rounded bg-[#FF1744]/20 p-3 text-[#FF1744] text-sm">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <PasswordStrengthMeter strength={passwordStrength} />
            <PasswordInput label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <Select label="Country" options={[{value:'', label:'Select country'}, {value:'US', label:'United States'}, {value:'IN', label:'India'}]} value={country} onChange={(e) => setCountry(e.target.value)} required />
            <Checkbox label="Subscribe to Newsletter (optional)" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
            <Checkbox label="I accept the Terms and Conditions" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} required />
            <Button type="submit" variant="primary" size="md" loading={submitting} disabled={!acceptTerms}>
              Register
            </Button>
          </form>
          <div className="flex justify-between text-xs text-slate-400">
            <a href="/login" className="hover:underline">Already have an account? Login</a>
          </div>
        </div>
      </section>
    </>
  );
}
