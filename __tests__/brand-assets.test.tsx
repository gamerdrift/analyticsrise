import fs from 'fs';
import path from 'path';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ArTriangleIcon, ArLogo } from '../app/components/brand';

describe('AnalyticsRise Official Triangular AR Brand Identity Audit', () => {
  const publicDir = path.join(__dirname, '..', 'public');
  const logoDir = path.join(publicDir, 'assets', 'logo');
  const appDir = path.join(__dirname, '..', 'app');

  describe('1. Centralized Logo Asset Directory Audit (public/assets/logo/)', () => {
    const requiredLogoAssets = [
      'ar-triangle-logo.svg',
      'ar-triangle-logo.png',
      'favicon.ico',
      'favicon.svg',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'apple-touch-icon.png',
      'android-chrome-192x192.png',
      'android-chrome-512x512.png',
    ];

    test.each(requiredLogoAssets)('Asset %s exists and is non-empty in public/assets/logo/', (assetName) => {
      const assetPath = path.join(logoDir, assetName);
      expect(fs.existsSync(assetPath)).toBe(true);
      const stat = fs.statSync(assetPath);
      expect(stat.size).toBeGreaterThan(0);
    });
  });

  describe('2. Public Root Favicon and Application Icon Suite Audit', () => {
    const rootFavicons = [
      'favicon.ico',
      'favicon.svg',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'apple-touch-icon.png',
      'android-chrome-192x192.png',
      'android-chrome-512x512.png',
      'manifest.json',
    ];

    test.each(rootFavicons)('Root asset %s exists and is valid', (assetName) => {
      const assetPath = path.join(publicDir, assetName);
      expect(fs.existsSync(assetPath)).toBe(true);
      const stat = fs.statSync(assetPath);
      expect(stat.size).toBeGreaterThan(0);
    });

    test('app/favicon.ico exists for Next.js App Router metadata compatibility', () => {
      const appFavicon = path.join(appDir, 'favicon.ico');
      expect(fs.existsSync(appFavicon)).toBe(true);
      expect(fs.statSync(appFavicon).size).toBeGreaterThan(0);
    });

    test('SVG favicon contains triangular frame path geometry', () => {
      const svgPath = path.join(publicDir, 'favicon.svg');
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      expect(svgContent).toContain('<svg');
      expect(svgContent).toContain('M 50 8'); // Triangular apex path
      expect(svgContent).toContain('AR');
    });

    test('manifest.json references valid icon paths', () => {
      const manifestPath = path.join(publicDir, 'manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      expect(manifest.name).toBe('AnalyticsRise');
      expect(manifest.icons.length).toBeGreaterThanOrEqual(4);

      for (const icon of manifest.icons) {
        const iconFile = path.join(publicDir, icon.src.replace(/^\//, ''));
        expect(fs.existsSync(iconFile)).toBe(true);
      }
    });
  });

  describe('3. React Component Rendering and Accessibility Audit', () => {
    test('ArTriangleIcon renders accessible SVG with correct role and label', () => {
      const { container } = render(<ArTriangleIcon size={32} alt="AnalyticsRise Official Logo" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-label', 'AnalyticsRise Official Logo');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    test('ArLogo renders full brand mark with wordmark when requested', () => {
      const { getByText, container } = render(<ArLogo size={40} showWordmark />);
      expect(getByText('ANALYTICS')).toBeInTheDocument();
      expect(getByText('RISE')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('4. Navigation Simplification & Home Link Removal Audit', () => {
    test('LandingNavbar source code does not contain redundant Home navigation item', () => {
      const landingNavPath = path.join(__dirname, '..', 'app', 'components', 'landing', 'LandingNavbar.tsx');
      const content = fs.readFileSync(landingNavPath, 'utf8');
      expect(content).not.toMatch(/name:\s*['"]Home['"]/i);
      expect(content).toContain("name: 'Products'");
      expect(content).toContain("name: 'Learning Paths'");
      expect(content).toContain("name: 'Enterprise'");
      expect(content).toContain("name: 'About'");
      expect(content).toContain('aria-label="AnalyticsRise Home"');
    });

    test('Root layout.tsx does not pass redundant Home navigation item to Navbar', () => {
      const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx');
      const content = fs.readFileSync(layoutPath, 'utf8');
      expect(content).not.toMatch(/label:\s*['"]Home['"]/i);
      expect(content).toContain("label: 'Products'");
      expect(content).toContain("label: 'Learning Paths'");
      expect(content).toContain("label: 'Enterprise'");
      expect(content).toContain("label: 'About'");
    });

    test('NavControls Navbar renders logo with aria-label="AnalyticsRise Home" linking to "/"', () => {
      const navControlsPath = path.join(__dirname, '..', 'app', 'components', 'navigation', 'NavControls.tsx');
      const content = fs.readFileSync(navControlsPath, 'utf8');
      expect(content).toContain('href="/"');
      expect(content).toContain('aria-label="AnalyticsRise Home"');
    });
  });

  describe('5. Mission 03: Learner-First Homepage Architecture Audit', () => {
    test('LandingHero embodies "LEARN DATA. PRACTICE REAL SKILLS. RISE HIGHER."', () => {
      const heroPath = path.join(__dirname, '..', 'app', 'components', 'landing', 'LandingHero.tsx');
      const content = fs.readFileSync(heroPath, 'utf8');
      expect(content).toContain('LEARN DATA.');
      expect(content).toContain('PRACTICE REAL SKILLS.');
      expect(content).toContain('RISE HIGHER.');
      expect(content).toContain('/courses');
      expect(content).toContain('#flagships');
    });

    test('ThreePillarsSection contains 01 LEARN, 02 PRACTICE, 03 RISE', () => {
      const pillarsPath = path.join(__dirname, '..', 'app', 'components', 'landing', 'ThreePillarsSection.tsx');
      const content = fs.readFileSync(pillarsPath, 'utf8');
      expect(content).toContain('LEARN');
      expect(content).toContain('PRACTICE');
      expect(content).toContain('RISE');
      expect(content).toContain('Learn the concepts');
      expect(content).toContain('Practice real skills');
      expect(content).toContain('Prove your progress');
    });

    test('FlagshipProductsSection features SQL Studio, Excel Studio Pro, and Power BI Studio', () => {
      const flagshipsPath = path.join(__dirname, '..', 'app', 'components', 'landing', 'FlagshipProductsSection.tsx');
      const content = fs.readFileSync(flagshipsPath, 'utf8');
      expect(content).toContain('SQL Studio');
      expect(content).toContain('Excel Studio Pro');
      expect(content).toContain('Power BI Studio');
      expect(content).toContain('/sql-studio');
      expect(content).toContain('/excel-studio');
      expect(content).toContain('/simulators/powerbi');
      expect(content).toContain('Python Lab');
      expect(content).toContain('Tableau Studio');
    });

    test('LearnerJourneySection implements 5-Step Ascension Pathway', () => {
      const journeyPath = path.join(__dirname, '..', 'app', 'components', 'landing', 'LearnerJourneySection.tsx');
      const content = fs.readFileSync(journeyPath, 'utf8');
      expect(content).toContain('Choose Your Skill');
      expect(content).toContain('Learn the Concepts');
      expect(content).toContain('Practice by Doing');
      expect(content).toContain('Test Yourself');
      expect(content).toContain('Track Your Rise');
      expect(content).toContain('Start Where You Are');
    });

    test('WhyAnalyticsRiseSection contrasts passive video courses with active in-browser practice', () => {
      const whyPath = path.join(__dirname, '..', 'app', 'components', 'landing', 'WhyAnalyticsRiseSection.tsx');
      const content = fs.readFileSync(whyPath, 'utf8');
      expect(content).toContain('Traditional Video Courses');
      expect(content).toContain('The AnalyticsRise Platform');
      expect(content).toContain('Learning Method');
      expect(content).toContain('Proof of Skill');
    });
  });

  describe('6. Mission 04: Reusable Entitlements & Freemium Architecture', () => {
    test('Entitlements module correctly evaluates Free vs Pro feature capabilities', () => {
      const { canUseFeature, requiresUpgrade, getUpgradeContext } = require('../lib/entitlements/entitlements');
      expect(canUseFeature('sql.core_challenges', 'free')).toBe(true);
      expect(canUseFeature('sql.custom_datasets', 'free')).toBe(false);
      expect(canUseFeature('sql.custom_datasets', 'pro')).toBe(true);
      expect(requiresUpgrade('sql.custom_datasets', 'free')).toBe(true);
      
      const context = getUpgradeContext('sql.custom_datasets');
      expect(context.title).toBe('Analyze Your Own Data');
      expect(context.productId).toBe('sql');
      expect(context.benefits.length).toBeGreaterThan(0);
    });

    test('Multi-currency pricing configuration supports INR and USD explicitly', () => {
      const { getPlanPriceDisplay, PRICING_CONFIG } = require('../lib/monetization/pricingConfig');
      expect(PRICING_CONFIG.INR.pro.monthlyPrice).toBe(1499);
      expect(PRICING_CONFIG.USD.pro.monthlyPrice).toBe(29);
      
      const inrDisplay = getPlanPriceDisplay('pro', 'INR', 'annual');
      expect(inrDisplay.formatted).toContain('₹999');
      
      const usdDisplay = getPlanPriceDisplay('pro', 'USD', 'annual');
      expect(usdDisplay.formatted).toContain('$19');
    });
  });
});



