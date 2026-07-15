# Fast deployment script for AnalyticsRise

# Paths
$projectRoot = "$PSScriptRoot"
$cacheDir = "$projectRoot\.cache_node_modules"

# -----------------------------------------------------
# 1. Restore cached node_modules if it exists
# -----------------------------------------------------
if (Test-Path $cacheDir) {
    Write-Host "Restoring cached node_modules ..."
    xcopy /E /I "$cacheDir" "$projectRoot\node_modules" > $null
} else {
    Write-Host "Installing dependencies (offline, force) …"
    npm ci --prefer-offline --force
    Write-Host "Caching node_modules for next run ..."
    New-Item -ItemType Directory -Force -Path $cacheDir > $null
    xcopy /E /I "$projectRoot\node_modules" "$cacheDir" > $null
}

# -----------------------------------------------------
# 2. Build the Next.js app
# -----------------------------------------------------
Write-Host "Building Next.js app …"
npx next build

# -----------------------------------------------------
# 3. Deploy to Firebase Hosting
# -----------------------------------------------------
Write-Host "Deploying to Firebase Hosting …"
firebase deploy --only hosting

# -----------------------------------------------------
# 4. Optional: push lockfile changes to git
# -----------------------------------------------------
git add -A
if ((git status --porcelain) -ne "") {
    git commit -m "Fast deploy build"
    git push -u origin main
} else {
    Write-Host "No Git changes to push."
}
