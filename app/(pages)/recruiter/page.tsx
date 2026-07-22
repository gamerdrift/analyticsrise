'use client';

import React from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import RecruiterPortal from '@/app/components/career/RecruiterPortal';

export default function RecruiterPage() {
  return (
    <DashboardLayout>
      <RecruiterPortal />
    </DashboardLayout>
  );
}
