import React from 'react';
import PublicPortfolioClient from './PublicPortfolioClient';

export async function generateStaticParams() {
  return [
    { username: 'alex-rivera' },
    { username: 'elena-rostova' },
    { username: 'marcus-vance' },
    { username: 'demo' },
  ];
}

export default function Page({ params }: { params: { username: string } }) {
  return <PublicPortfolioClient username={params.username} />;
}
