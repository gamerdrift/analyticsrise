# Deploy script for AnalyticsRise

# Add the extracted Node 22.20 binaries to PATH
$nodeDir = "$env:TEMP\node22-20"
$env:PATH = "$nodeDir;$env:PATH"

Write-Host "Node version:" (node -v)

# Remove existing node_modules to avoid lock issues
if (Test-Path "node_modules") {
    Write-Host "Removing existing node_modules..."
    Remove-Item -Recurse -Force "node_modules"
}

# Clean npm cache
npm cache clean --force

# Reinstall dependencies without creating symlinks (Windows safe)
npm ci --no-bin-links

# Build the Next.js app
npm run build

# Deploy to Firebase Hosting (uses existing firebase.json/.firebaserc)
firebase deploy --only hosting

# Commit and push any changes (e.g., lockfile updates)
git add -A
if ((git status --porcelain) -ne "") {
    git commit -m "Deploy build"
    git push
} else {
    Write-Host "No changes to commit."
}
