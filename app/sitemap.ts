import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://analyticsrise.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/ar-studio',
    '/ar-assist',
    '/building-analyticsrise',
    '/products',
    '/pricing',
    '/enterprise',
    '/about',
    '/ar-academy',
    '/dashboard-gallery',
    '/blog',
    '/community',
    '/resume-builder',
    '/sql-playground',
    '/excel-playground',
    '/login',
    '/register',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/ar-studio' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/ar-studio' || route === '/ar-assist' ? 0.9 : 0.8,
  }));
}
