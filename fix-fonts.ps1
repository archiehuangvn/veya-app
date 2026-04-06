$dirs = @('d:\Work\veya-app\veya-next\app','d:\Work\veya-app\veya-next\components')
$files = Get-ChildItem -Path $dirs -Recurse -Include '*.tsx','*.ts'
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
  $u = $c -replace "'Syne, sans-serif'","'Be Vietnam Pro, sans-serif'" `
           -replace "'DM Sans, sans-serif'","'Inter, sans-serif'"
  if ($u -ne $c) {
    [System.IO.File]::WriteAllText($f.FullName, $u, [System.Text.Encoding]::UTF8)
    Write-Host "Updated: $($f.Name)"
  }
}
Write-Host "Font replacement done."
