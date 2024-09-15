$provinsiId = '11.01.01'
$url = "https://ppiperubahan.vercel.app/api/kelurahan/$provinsiId"

$response = Invoke-RestMethod -Uri $url
Write-Host $response
