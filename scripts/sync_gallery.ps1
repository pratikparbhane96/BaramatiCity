# Baramati Tourism Gallery Sync Script
# Run this script to automatically update your website's gallery with new photos and videos.

$uploadsPath = Join-Path $PSScriptRoot "..\uploads"
$dataPath = Join-Path $PSScriptRoot "..\data\gallery_posts.json"

if (-not (Test-Path $uploadsPath)) {
    Write-Host "Error: Uploads folder not found at $uploadsPath" -ForegroundColor Red
    exit
}

# Read existing data
$data = Get-Content $dataPath | ConvertFrom-Json
$existingFiles = $data.posts.src

# Scan uploads folder
$files = Get-ChildItem $uploadsPath -Include *.jpg, *.jpeg, *.png, *.webp, *.mp4, *.webm -Recurse

$newCount = 0
foreach ($file in $files) {
    # Create a relative path
    $relativeSrc = "uploads/" + $file.Name
    
    if ($existingFiles -notcontains $relativeSrc) {
        $type = "image"
        if ($file.Extension -match "mp4|webm") { $type = "video" }
        
        $newPost = [PSCustomObject]@{
            id = (Get-Date).Ticks
            type = $type
            src = $relativeSrc
            author = "Community Member"
            location = "Baramati"
            caption = "New shared moment from Baramati! 📸"
            date = "Just now"
            likes = 0
            comments = 0
        }
        
        $data.posts += $newPost
        $newCount++
    }
}

# Save updated data
$data | ConvertTo-Json -Depth 10 | Set-Content $dataPath

Write-Host "Successfully synced gallery! Added $newCount new items." -ForegroundColor Green
Write-Host "Refresh your website to see the changes."
