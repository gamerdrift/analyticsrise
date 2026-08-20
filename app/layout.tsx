import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Orbitron } from 'next/font/google';
import '@/styles/globals.css';
import ThemeProvider from '@/app/components/ThemeProvider';
import LoadingProvider from '@/lib/contexts/LoadingContext';
import AuthProvider from '@/lib/contexts/AuthContext';
import LanguageProvider from '@/lib/contexts/LanguageContext';
import { LearningProvider } from '@/src/context/LearningContext';
import BrowserLanguageBanner from '@/app/components/i18n/BrowserLanguageBanner';
import FloatingActionManager from '@/app/components/floating/FloatingActionManager';
import { Navbar } from '@/app/components/navigation/NavControls';
import LanguageSwitcher from '@/app/components/i18n/LanguageSwitcher';
import Footer from '@/app/components/layout/Footer';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AnalyticsRise - Practice. Master. Get Hired.',
  description:
    'Master data analytics with real business projects and land top jobs. Learn SQL, Power BI, Tableau, Excel, Python, and more through hands-on practice. Official support: support@analyticsrise.com',
  keywords: [
    'analytics',
    'data analytics jobs',
    'get hired',
    'career intelligence',
    'SQL jobs',
    'Power BI jobs',
    'Tableau jobs',
    'Excel jobs',
    'Python jobs',
  ],
  authors: [{ name: 'AnalyticsRise Team' }],
  creator: 'AnalyticsRise',
  publisher: 'AnalyticsRise',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://analyticsrise.com',
    siteName: 'AnalyticsRise',
    title: 'AnalyticsRise - Practice. Master. Get Hired.',
    description:
      'Master data analytics with real business projects and land top analytics jobs globally.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnalyticsRise - Practice. Master. Get Hired.',
    description: 'Master data analytics through hands-on projects and discover global analytics careers.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'AnalyticsRise',
  url: 'https://analyticsrise.com',
  logo: 'https://analyticsrise.com/public/favicon.ico',
  sameAs: ['https://analyticsrise-56655.web.app'],
  description:
    'The premier enterprise-grade, browser-based data analytics simulator and AI career intelligence platform.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@analyticsrise.com',
    contactType: 'customer support',
    availableLanguage: ['English', 'Spanish', 'French', 'German', 'Hindi'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} antialiased bg-[#05070B] text-[#F5F7FA]`}>
        <LoadingProvider>
          <AuthProvider>
            <LanguageProvider>
              <LearningProvider>
                <ThemeProvider>
                  <div className="min-h-screen flex flex-col">
                    <Navbar
                      logoText="AnalyticsRISE"
                      links={[
                        { label: 'Home', href: '/' },
                        { label: 'Products', href: '/products' },
                        { label: 'Pricing', href: '/pricing' },
                        { label: 'Enterprise', href: '/enterprise' },
                        { label: 'About', href: '/about' },
                      ]}
                      actions={
                        <>
                          <LanguageSwitcher variant="compact" className="mb-2 md:mr-2 z-50" />
                          <Link href="/login" className="text-xs uppercase tracking-widest text-slate-400 hover:text-white font-bold transition-colors px-3 py-2">Login</Link>
                          <Link href="/register" className="px-4 py-2 rounded border border-[#00E5FF] text-[#00E5FF] text-[10px] font-bold tracking-widest uppercase hover:bg-[#00E5FF]/10 transition-all shadow-md shadow-[#00E5FF]/10 hover:shadow-[#00E5FF]/20">Register</Link>
                        </>
                      }
                    />
                    <main className="flex-1 pt-16">{children}</main>
                    <Footer />
                  </div>
                  <BrowserLanguageBanner />
                  <FloatingActionManager />
                </ThemeProvider>
              </LearningProvider>
            </LanguageProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
