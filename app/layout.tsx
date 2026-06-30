import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Orbitron } from 'next/font/google';
import '@/styles/globals.css';
import ThemeProvider from '@/app/components/ThemeProvider';
import LoadingProvider from '@/lib/contexts/LoadingContext';
import AuthProvider from '@/lib/contexts/AuthContext';
import LanguageProvider from '@/lib/contexts/LanguageContext';
import BrowserLanguageBanner from '@/app/components/i18n/BrowserLanguageBanner';

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
  title: 'AnalyticsRise - Practice. Master. Get Certified.',
  description:
    'Master data analytics with real business projects. Learn SQL, Power BI, Tableau, Excel, Python, and more through hands-on practice.',
  keywords: [
    'analytics',
    'data analytics',
    'learning platform',
    'certification',
    'SQL',
    'Power BI',
    'Tableau',
    'Excel',
    'Python',
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
    title: 'AnalyticsRise - Practice. Master. Get Certified.',
    description:
      'Master data analytics with real business projects. Learn SQL, Power BI, Tableau, Excel, Python, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnalyticsRise - Practice. Master. Get Certified.',
    description: 'Master data analytics through hands-on projects and real business scenarios.',
  },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} antialiased bg-[#05070B] text-[#F5F7FA]`}>
        <LoadingProvider>
          <AuthProvider>
            <LanguageProvider>
              <ThemeProvider>
                <div className="min-h-screen flex flex-col">
                  {/* Header/Navigation will go here */}
                  <main className="flex-1">{children}</main>
                  {/* Footer will go here */}
                </div>
                <BrowserLanguageBanner />
              </ThemeProvider>
            </LanguageProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
