'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#05070B] text-[#F5F7FA] p-8 font-mono">
      <div className="max-w-md w-full text-center space-y-6 bg-[#0D1117] p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h1 className="text-6xl font-black text-[#00E5FF] font-display">404</h1>
        <h2 className="text-xl font-bold uppercase tracking-wider text-white">Page Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The route you are trying to access does not exist or may have been updated in Release v1.0.0-beta.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-[#00E5FF] hover:bg-[#4FC3F7] text-black rounded text-xs font-bold transition flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Home Page
          </Link>
        </div>
        <div className="pt-6 border-t border-white/5 text-xs text-slate-500 space-y-2">
          <p>Report a broken link or need support?</p>
          <a
            href="mailto:support@analyticsrise.com"
            className="inline-flex items-center gap-1.5 text-[#00E5FF] font-mono font-bold hover:underline"
          >
            <Mail className="w-3.5 h-3.5" /> support@analyticsrise.com
          </a>
        </div>
      </div>
    </main>
  );
}
