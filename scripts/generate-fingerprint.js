const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateFingerprint() {
  let commit = 'b6078b3';
  try {
    commit = execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    console.warn('Unable to get git commit hash, fallback to b6078b3');
  }

  let version = 'v1.0.0-beta';
  try {
    version = fs.readFileSync(path.join(__dirname, '../VERSION'), 'utf8').trim();
  } catch (e) {}

  const now = new Date().toISOString();
  const buildNum = `BUILD-${now.replace(/[-:T.]/g, '').substring(0, 14)}`;

  const fingerprint = {
    version,
    commit,
    buildTimestamp: now,
    deploymentTimestamp: now,
    firebaseProject: 'analyticsrise-56655',
    buildNumber: buildNum,
  };

  const targetPath = path.join(__dirname, '../lib/config/fingerprint.json');
  fs.writeFileSync(targetPath, JSON.stringify(fingerprint, null, 2), 'utf8');
  console.log('Generated Deployment Fingerprint:', fingerprint);
}

generateFingerprint();
