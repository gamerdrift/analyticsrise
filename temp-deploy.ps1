# Temporary clean deployment script for AnalyticsRise

# Define paths
$projectRoot = "$PSScriptRoot"
$tempDir = "$env:TEMP\AnalyticsRise_deploy_tmp"

# -----------------------------------------------------
# 1. Clean any previous temp folder
# -----------------------------------------------------
if (Test-Path $tempDir) {
    Write-Host "Removing previous temporary folder …"
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}

# -----------------------------------------------------
# 2. Copy project files (excluding node_modules) to temp
# -----------------------------------------------------
Write-Host "Copying project to temporary directory …"
# Use robocopy to copy everything except node_modules
robocopy $projectRoot $tempDir /MIR /XD node_modules .git .cache_node_modules

# -----------------------------------------------------
# 3. Install dependencies in temp (offline, force)
# -----------------------------------------------------
Set-Location $tempDir
Write-Host "Installing dependencies in temporary folder …"
npm ci --prefer-offline --force

# -----------------------------------------------------
# 4. Build Next.js app
# -----------------------------------------------------
Write-Host "Building Next.js app …"
npx next build

# -----------------------------------------------------
# 5. Deploy to Firebase Hosting
# -----------------------------------------------------
Write-Host "Deploying to Firebase Hosting …"
firebase deploy --only hosting

# -----------------------------------------------------
# 6. Clean up temporary folder
# -----------------------------------------------------
Write-Host "Cleaning up temporary folder …"
Set-Location $projectRoot
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue

Write-Host "Deployment completed successfully."
