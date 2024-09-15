# Membuat hash table untuk header
$headers = @{
    "Authorization" = "Bearer msnmfqvkzNJme2z4EgrAceVE"
    # Tambahkan header lain jika diperlukan
}
# Mengirim permintaan ke API
Invoke-RestMethod -Uri "https://ppiperubahan-mda9kiz5j-khaliks-projects.vercel.app/api/provinsi" -Method Get -Headers $headers
