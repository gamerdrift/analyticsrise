import React from 'react';
import CompanyDetailClient from './CompanyDetailClient';

export async function generateStaticParams() {
  return [
    { companyId: 'snowflake' },
    { companyId: 'databricks' },
  ];
}

export default function Page({ params }: { params: { companyId: string } }) {
  return <CompanyDetailClient companyId={params.companyId} />;
}
