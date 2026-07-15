# Clean deployment script for AnalyticsRise

# Paths
$projectRoot = "$PSScriptRoot"

# -----------------------------------------------------
# 1. Force‑remove existing node_modules (ignore errors)
# -----------------------------------------------------
Write-Host "Removing existing node_modules (if any) …"
Remove-Item -Recurse -Force "$projectRoot\node_modules" -ErrorAction SilentlyContinue

# -----------------------------------------------------
# 2. Install dependencies fresh (offline, force)
# -----------------------------------------------------
Write-Host "Installing dependencies …"
npm ci --prefer-offline --force

# -----------------------------------------------------
# 3. Build Next.js app
# -----------------------------------------------------
Write-Host "Building Next.js app …"
npx next build

# -----------------------------------------------------
# 4. Deploy to Firebase Hosting
# -----------------------------------------------------
Write-Host "Deploying to Firebase Hosting …"
firebase deploy --only hosting

# -----------------------------------------------------
# 5. Optional: push any lockfile changes
# -----------------------------------------------------
git add -A
if ((git status --porcelain) -ne "") {
    git commit -m "Clean deploy build"
    git push -u origin main
} else {
    Write-Host "No Git changes to push."
}
