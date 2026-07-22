// 'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/app/components/ThemeProvider';
import { SkeletonLoader } from '@/app/components/feedback/FeedbackControls';

import { Sparkles } from 'lucide-react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { useLanguage } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';
import SettingsView from '@/app/components/dashboard/SettingsView';


// Default skills if none stored
const DEFAULT_SKILLS = {
  Excel: 70,
  SQL: 55,
  'Power BI': 40,
  Tableau: 20,
  Python: 10,
  R: 5,
  Alteryx: 0,
  Statistics: 30,
  'Business Analytics': 45,
};



export default function DashboardClient() {
  const { userProfile, loading } = useAuth();
  const { toggleTheme } = useTheme();
  const { t } = useLanguage();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('dashboard.welcomeMorning'));
    else if (hour < 18) setGreeting(t('dashboard.welcomeAfternoon'));
    else setGreeting(t('dashboard.welcomeEvening'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <SkeletonLoader variant="card" count={1} className="h-44" />
          <div className="grid md:grid-cols-3 gap-6">
            <SkeletonLoader variant="card" count={1} className="h-32" />
            <SkeletonLoader variant="card" count={1} className="h-32" />
            <SkeletonLoader variant="card" count={1} className="h-32" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const xp = userProfile?.xp ?? 0;
  const level = userProfile?.level ?? 1;
  const xpForNextLevel = (level + 1) * 1000;

  return (
    <DashboardLayout>
      {/* Header */}
      <section className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">{greeting}</h1>
          <p className="text-sm opacity-80">{t('dashboard.subtitle')}</p>
        </div>
        <button onClick={toggleTheme} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition" aria-label={t('dashboard.toggleTheme')}>
          <Sparkles size={24} />
        </button>
      </section>
      {/* Additional UI omitted for brevity */}
      <SettingsView />
    </DashboardLayout>
  );
}
