param(
  [Parameter(Mandatory=$true)]
  [string]$RenderApiKey,
  [string]$Repo = "https://github.com/Souravpreetsingh/startup-idea-validator",
  [string]$Branch = "master",
  [string]$VercelProjectDir = "$PSScriptRoot\frontend"
)

$ErrorActionPreference = "Stop"

function Log($msg) { Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $msg" -ForegroundColor Cyan }

# 1. Create the Render web service via API
Log "Creating Render web service..."
$body = @{
  type = "web"
  name = "startup-validator-backend"
  repo = $Repo
  branch = $Branch
  rootDir = "backend"
  buildCommand = "npm install && npm run build"
  startCommand = "npm start"
  healthCheckPath = "/api/health"
  envVars = @(
    @{ key = "NODE_ENV"; value = "production" }
    @{ key = "CLIENT_URL"; value = "https://ai-startup-validator-souravpreetsinghs-projects.vercel.app" }
  )
} | ConvertTo-Json -Depth 10

try {
  $service = Invoke-RestMethod -Uri "https://api.render.com/v1/services" `
    -Method Post `
    -Body $body `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $RenderApiKey" }
  
  $serviceId = $service.service.id
  $renderUrl = "https://$($service.service.serviceDetails.url)"
  Log "Service created! ID: $serviceId"
  Log "URL will be: $renderUrl"
} catch {
  Write-Host "Failed to create service: $_" -ForegroundColor Red
  
  # Maybe service already exists, try listing
  Log "Checking for existing services..."
  $services = Invoke-RestMethod -Uri "https://api.render.com/v1/services" `
    -Headers @{ Authorization = "Bearer $RenderApiKey" }
  
  $existing = $services | Where-Object { $_.service.name -eq "startup-validator-backend" }
  if ($existing) {
    $serviceId = $existing.service.id
    $renderUrl = "https://$($existing.service.serviceDetails.url)"
    Log "Found existing service: $serviceId at $renderUrl"
  } else {
    Write-Host "`nPlease create the service manually at https://dashboard.render.com/blueprints" -ForegroundColor Yellow
    exit 1
  }
}

# 2. Trigger initial deploy
Log "Triggering initial deploy..."
try {
  $deploy = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/deploys" `
    -Method Post `
    -Headers @{ Authorization = "Bearer $RenderApiKey" }
  Log "Deploy triggered! ID: $($deploy.id)"
} catch {
  Write-Host "Deploy trigger failed: $_" -ForegroundColor Yellow
}

# 3. Set secrets on Render
Log "Configuring environment variables (secrets)..."
$secrets = @(
  @{ key = "MONGO_URI"; value = "" }
  @{ key = "JWT_SECRET"; value = "" }
  @{ key = "GEMINI_API_KEY"; value = "" }
)

foreach ($secret in $secrets) {
  $val = Read-Host "Enter value for $($secret.key)" -AsSecureString
  $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($val)
  $secret.value = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}

try {
  $null = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/env-vars" `
    -Method Put `
    -Body ($secrets | ConvertTo-Json) `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $RenderApiKey" }
  Log "Environment variables set"
} catch {
  Write-Host "Failed to set env vars: $_" -ForegroundColor Yellow
}

# 4. Update Vercel env var with Render URL
Log "Updating Vercel NEXT_PUBLIC_API_URL..."
$apiUrl = "$renderUrl/api"
Set-Location $VercelProjectDir
$null | vercel env rm NEXT_PUBLIC_API_URL production --yes 2>$null
$apiUrl | vercel env add NEXT_PUBLIC_API_URL production --yes

Log "Done! Backend deploying at: $renderUrl"
Log "Vercel API URL set to: $apiUrl"
Log "`nPush to GitHub to trigger auto-deploys: git push origin master"
