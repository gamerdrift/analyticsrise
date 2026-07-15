"use client";
// app/error.tsx - Global error handling page for Next.js App Router
import { NextPage } from 'next';
import { ErrorProps } from 'next/dist/pages/_error';

const ErrorPage: NextPage<ErrorProps> = ({ statusCode, title, ...rest }) => {
  const code = statusCode ?? 500;
  const message = title ?? (code === 404 ? 'Page Not Found' : 'Internal Server Error');
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--background)',
      color: 'var(--foreground)',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>{code}</h1>
      <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>{message}</p>
    </div>
  );
};

export default ErrorPage;
