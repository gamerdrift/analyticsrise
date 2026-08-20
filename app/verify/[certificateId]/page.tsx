import React from 'react';
import PublicVerifyClient from './PublicVerifyClient';

export async function generateStaticParams() {
  return [
    { certificateId: 'cert_sample_sql' },
    { certificateId: 'cert_sample_excel' },
  ];
}

export default function VerifyPage({ params }: { params: { certificateId: string } }) {
  return <PublicVerifyClient certificateId={params.certificateId} />;
}
