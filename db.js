const { createClient } = require('@supabase/supabase-js');

// Gantilah dengan URL proyek dan kunci API Anda
const supabaseUrl = 'https://gzuvzskgphbeljkgglhq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6dXZ6c2tncGhiZWxqa2dnbGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYzOTUyOTEsImV4cCI6MjA0MTk3MTI5MX0.J0v5-bxGZz6Vc9TuHWRKRhCQhGSxLSQJpYbvgePT4E8';

const supabase = createClient(supabaseUrl, supabaseKey);

// Contoh fungsi untuk mengambil data
async function fetchData() {
  try {
    const { data, error } = await supabase
      .from('anggota')
      .select('*');

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Error executing query:', err);
  }
}

// Jalankan fungsi fetchData
fetchData();
module.exports = supabase;

