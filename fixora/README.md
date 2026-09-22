# Fixora

Electronics repair marketplace and genuine-parts store. Tagline: **Fix Today. A Better Tomorrow.**

Book verified technicians (walk-in, doorstep, or pickup & drop), shop OEM-grade parts, and track jobs in one place.

## Run locally

This is a static site (no Node required). From this folder:

**Option A** — double-click `index.html` (hash routes still work).

**Option B** — PowerShell from this directory:

```powershell
$prefix = 'http://127.0.0.1:5173/'
$root = (Get-Location).Path
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Fixora at $prefix"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
  if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
  $path = Join-Path $root $rel
  if (Test-Path $path -PathType Leaf) {
    $bytes = [IO.File]::ReadAllBytes($path)
    $ext = [IO.Path]::GetExtension($path)
    $ctx.Response.ContentType = @{
      '.html'='text/html'; '.css'='text/css'; '.js'='text/javascript'
    }[$ext]
    if (-not $ctx.Response.ContentType) { $ctx.Response.ContentType = 'application/octet-stream' }
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}
```

Then open http://127.0.0.1:5173/

## What’s included

- Home: service search, categories, how it works, doorstep CTA, reviews
- Store: filters, sort, search, cart, checkout (demo)
- Book repair, track demo ID `FX-48291`, Care plans, vendor apply, login/signup
- Product photos from Unsplash
