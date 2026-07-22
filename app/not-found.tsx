'use client';
// app/not-found.tsx
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#05070B] text-[#F5F7FA] p-8">
      <h1 className="text-5xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="mb-6 text-lg">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition"
        >
          Go Back
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
