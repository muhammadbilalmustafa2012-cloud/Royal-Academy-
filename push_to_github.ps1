param(
    [string]$Token    = $env:GH_TOKEN,
    [string]$Owner    = "mujtaba-javaid",
    [string]$Repo     = "Royal-academy",
    [string]$Branch   = "main",
    [string]$RootPath = "C:\Users\Dell\.gemini\antigravity-ide\scratch\royal-academy"
)

if (-not $Token) {
    Write-Host "ERROR: No GitHub token." -ForegroundColor Red
    exit 1
}

$headers = @{
    Authorization = "token $Token"
    Accept        = "application/vnd.github.v3+json"
}

$excludeDirs  = @("node_modules", ".git", "dist", "build", "coverage", "node22", "portable-git", "mingit")
$excludeFiles = @("git-portable.exe", "mingit.zip")

function ShouldSkip($fullpath) {
    foreach ($d in $excludeDirs) {
        if ($fullpath -match [regex]::Escape("\$d\") -or $fullpath -match [regex]::Escape("\$d")) {
            return $true
        }
    }
    foreach ($f in $excludeFiles) {
        if ($fullpath.EndsWith("\$f")) { return $true }
    }
    return $false
}

$allFiles = Get-ChildItem -Path $RootPath -Recurse -File | Where-Object { -not (ShouldSkip $_.FullName) }
$total    = $allFiles.Count
$pushed   = 0
$failed   = 0

Write-Host "Pushing $total files to github.com/$Owner/$Repo ..." -ForegroundColor Cyan

foreach ($file in $allFiles) {
    $relPath = $file.FullName.Substring($RootPath.Length + 1).Replace("\", "/")
    
    try {
        $bytes   = [System.IO.File]::ReadAllBytes($file.FullName)
        $content = [Convert]::ToBase64String($bytes)
    } catch {
        Write-Host "  SKIP (read error): $relPath" -ForegroundColor Yellow
        continue
    }

    $apiUrl = "https://api.github.com/repos/$Owner/$Repo/contents/$relPath"

    $sha = $null
    try {
        $existing = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Get -ErrorAction Stop
        $sha      = $existing.sha
    } catch { }

    $bodyObj = [ordered]@{
        message = "Add $relPath"
        content = $content
        branch  = $Branch
    }
    if ($sha) { $bodyObj.sha = $sha }
    $bodyJson = $bodyObj | ConvertTo-Json -Depth 5

    try {
        Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Put -Body $bodyJson -ContentType "application/json" -ErrorAction Stop | Out-Null
        $pushed++
        Write-Host ("  OK  [{0}/{1}] {2}" -f $pushed, $total, $relPath) -ForegroundColor Green
    } catch {
        $failed++
        Write-Host ("  ERR  {0} -- {1}" -f $relPath, $_.Exception.Message) -ForegroundColor Red
    }
}

Write-Host ""
Write-Host ("=== Done! Pushed: {0}  Failed: {1}  Total: {2} ===" -f $pushed, $failed, $total) -ForegroundColor Cyan
Write-Host ("Repo URL: https://github.com/{0}/{1}" -f $Owner, $Repo) -ForegroundColor Blue
