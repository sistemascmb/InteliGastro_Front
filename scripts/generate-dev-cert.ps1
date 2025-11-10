Param(
  [Parameter(Mandatory=$false)]
  [string[]]$Hosts
)

# Genera un certificado HTTPS de desarrollo confiable usando mkcert
# Ubica los archivos en certs/dev-cert.pem y certs/dev-key.pem en la raíz del proyecto.
# Uso:
#   powershell -ExecutionPolicy Bypass -File .\scripts\generate-dev-cert.ps1
#   # Opcional, agregar hosts extra
#   powershell -ExecutionPolicy Bypass -File .\scripts\generate-dev-cert.ps1 -Hosts my-host.local 192.168.1.50

function Get-PrimaryIPv4 {
  try {
    $ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notmatch '^169\.254\.' }
    $first = $ips | Select-Object -ExpandProperty IPAddress | Select-Object -First 1
    return $first
  } catch { return $null }
}

$mkcert = Get-Command mkcert -ErrorAction SilentlyContinue
$MKCERT = $null
if ($mkcert) {
  $MKCERT = $mkcert.Source
} else {
  $wingetMkcert = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\FiloSottile.mkcert_Microsoft.Winget.Source_8wekyb3d8bbwe\mkcert.exe"
  if (Test-Path $wingetMkcert) { $MKCERT = $wingetMkcert }
}

if (-not $MKCERT) {
  Write-Host "mkcert no está instalado o no está en PATH." -ForegroundColor Yellow
  Write-Host "Instala mkcert y su CA local, por ejemplo:" -ForegroundColor Yellow
  Write-Host "  winget install -e --id FiloSottile.mkcert --accept-package-agreements --accept-source-agreements" -ForegroundColor Yellow
  Write-Host "  mkcert -install" -ForegroundColor Yellow
  exit 1
}

$root = Split-Path -Parent $PSScriptRoot
$certDir = Join-Path $root "certs"
if (-not (Test-Path $certDir)) { New-Item -ItemType Directory -Path $certDir | Out-Null }

$ip = Get-PrimaryIPv4
$allHosts = @("localhost","127.0.0.1","::1")
if ($ip) { $allHosts += $ip }
if ($Hosts -and $Hosts.Length -gt 0) { $allHosts += $Hosts }
$allHosts = $allHosts | Sort-Object -Unique

$crtFile = Join-Path $certDir "dev-cert.pem"
$keyFile = Join-Path $certDir "dev-key.pem"

Write-Host "Generando certificado para: $($allHosts -join ', ')" -ForegroundColor Cyan
# Asegura que la CA esté instalada
& $MKCERT -install | Out-Null
# Genera certificado y clave
& $MKCERT -key-file $keyFile -cert-file $crtFile $allHosts

if ((Test-Path $crtFile) -and (Test-Path $keyFile)) {
  Write-Host "Certificado generado con éxito:" -ForegroundColor Green
  Write-Host "  SSL_CRT_FILE=$crtFile" -ForegroundColor Green
  Write-Host "  SSL_KEY_FILE=$keyFile" -ForegroundColor Green
  Write-Host "Actualiza .env (descomenta SSL_CRT_FILE y SSL_KEY_FILE) y reinicia: npm start" -ForegroundColor Green
  exit 0
} else {
  Write-Host "No se generaron los archivos esperados. Revisa la salida de mkcert." -ForegroundColor Red
  exit 2
}