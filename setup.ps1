# Setup script for System Control Hub
# Prerequisites: PowerShell 5.1+, Node.js 18+, internet access

Write-Host "Installing npm dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed"; exit 1 }

Write-Host "Starting development server (npm run dev)..." -ForegroundColor Cyan
npm run dev
