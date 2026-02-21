# Rename image files in images/ to hyphenated lowercase names and remove diacritics.
# Usage: Open PowerShell in the workspace root and run: .\scripts\rename-images.ps1

$imagesDir = Join-Path $PSScriptRoot "..\images" | Resolve-Path
$imagesDir = $imagesDir.Path
Write-Host "Images directory: $imagesDir"

Get-ChildItem -Path $imagesDir -File | ForEach-Object {
    $orig = $_.Name

    # Normalize and remove diacritics
    $norm = [string]::Copy($orig)
    $norm = $norm.Normalize([System.Text.NormalizationForm]::FormD)
    $chars = $norm.ToCharArray() | Where-Object {
        $cat = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_)
        $cat -ne [System.Globalization.UnicodeCategory]::NonSpacingMark
    }
    $norm = -join $chars

    # Lowercase, replace spaces with hyphens, remove characters except letters, numbers, dot and hyphen
    $new = $norm.ToLower() -replace '\s+','-' -replace '[^a-z0-9\.-]','-'
    # Collapse multiple hyphens
    $new = $new -replace '-{2,}','-'
    # Trim leading/trailing hyphens
    $new = $new.Trim('-')

    if ($new -ne $orig) {
        $src = Join-Path $imagesDir $orig
        $dst = Join-Path $imagesDir $new
        if (Test-Path $dst) {
            Write-Host "SKIP: target exists -> $dst"
        } else {
            Write-Host "Renaming: $orig -> $new"
            Rename-Item -Path $src -NewName $new
        }
    }
}

Write-Host "Done. Review files and update any references if necessary."