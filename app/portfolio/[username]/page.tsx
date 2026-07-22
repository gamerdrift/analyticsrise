import React from 'react';
import PublicPortfolioClient from './PublicPortfolioClient';

export async function generateStaticParams() {
  return [
    { username: 'alex-rivera' },
    { username: 'demo' },
    { username: 'guest' },
  ];
}

export default function Page({ params }: { params: { username: string } }) {
  return <PublicPortfolioClient username={params.username} />;
}
