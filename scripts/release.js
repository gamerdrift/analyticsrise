const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runStep(name, command) {
  console.log(`\n==================================================`);
  console.log(`🚀 DEVOPS PIPELINE STEP: ${name}`);
  console.log(`==================================================`);
  try {
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`✅ ${name} PASSED.`);
  } catch (error) {
    console.error(`\n🔴 DEPLOYMENT PIPELINE FAILED AT STEP: ${name}`);
    console.error(error.message);
    process.exit(1);
  }
}

function purgeCachedBuilds() {
  console.log(`\n==================================================`);
  console.log(`🧹 DEVOPS PIPELINE STEP: DEPLOYMENT PURGE`);
  console.log(`==================================================`);
  const root = path.join(__dirname, '..');
  const dirsToPurge = ['.next', 'out', 'dist', 'build', 'node_modules/.cache'];

  dirsToPurge.forEach((dir) => {
    const target = path.join(root, dir);
    if (fs.existsSync(target)) {
      try {
        fs.rmSync(target, { recursive: true, force: true });
        console.log(`Purged cached directory: ${dir}`);
      } catch (e) {
        console.warn(`Failed to purge ${dir}: ${e.message}`);
      }
    }
  });
  console.log(`✅ DEPLOYMENT PURGE PASSED.`);
}

function verifyBuildBundle() {
  console.log(`\n==================================================`);
  console.log(`🔍 DEVOPS PIPELINE STEP: BUNDLE VERIFICATION`);
  console.log(`==================================================`);
  const indexPath = path.join(__dirname, '../out/index.html');
  if (!fs.existsSync(indexPath)) {
    console.error(`🔴 BUNDLE VERIFICATION FAILED: out/index.html does not exist.`);
    process.exit(1);
  }

  const requiredRoutes = [
    'career-copilot',
    'resume-studio',
    'interview-lab',
    'recruiter',
    'companies',
    'admin/executive',
    'admin/health',
    'feedback',
  ];

  const missingRoutes = requiredRoutes.filter((route) => {
    const htmlPath = path.join(__dirname, '..', `out/${route}.html`);
    const dirHtmlPath = path.join(__dirname, '..', `out/${route}/index.html`);
    return !fs.existsSync(htmlPath) && !fs.existsSync(dirHtmlPath);
  });

  if (missingRoutes.length > 0) {
    console.error(`🔴 BUNDLE VERIFICATION FAILED: Missing Sprint 10 production route bundles:`, missingRoutes);
    process.exit(1);
  }

  console.log(`✅ BUNDLE VERIFICATION PASSED: All ${requiredRoutes.length} Sprint 10 production route HTML bundles verified in out/.`);
}

function main() {
  console.log(`Starting AnalyticsRise Automated DevOps Release Pipeline...\n`);

  // Step 1: Generate Fresh Fingerprint
  runStep('Generate Fingerprint', 'node scripts/generate-fingerprint.js');

  // Step 2: Linting
  runStep('ESLint Audit', 'npx next lint');

  // Step 3: Type Checking
  runStep('TypeScript Type Check', 'npx tsc --noEmit');

  // Step 4: Deployment Purge
  purgeCachedBuilds();

  // Step 5: Production Build (Next.js export to out/)
  runStep('Next.js Production Build', 'npx next build');

  // Step 6: Bundle Verification
  verifyBuildBundle();

  // Step 7: Firebase Hosting Deployment
  runStep('Firebase Hosting Deployment', 'npx firebase deploy --only hosting');

  console.log(`\n==================================================`);
  console.log(`🟢 ONE SOURCE OF TRUTH ESTABLISHED – DEPLOYMENT PIPELINE CERTIFIED`);
  console.log(`==================================================\n`);
}

main();
