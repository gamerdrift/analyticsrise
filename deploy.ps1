# Deploy script for AnalyticsRise

# Add the extracted Node 22.20 binaries to PATH
$nodeDir = "$env:TEMP\node22-20"
$env:PATH = "$nodeDir;$pwd\node_modules\.bin;$env:PATH"

Write-Host "Node version:" (node -v)

# Clean npm cache (quick)\r
npm cache clean --force

# Build the Next.js app using npx (no global install needed)\r
npx next build

# Deploy to Firebase Hosting\r
firebase deploy --only hosting

# Commit and push any changes (e.g., lockfile updates)\r
git add -A\r
if ((git status --porcelain) -ne "") {\r
    git commit -m "Deploy build"\r
    git push -u origin main\r
} else {\r
    Write-Host "No changes to commit."\r
}
