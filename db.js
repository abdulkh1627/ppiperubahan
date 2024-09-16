require('dotenv').config();
const { Pool } = require('pg');

// Konfigurasi koneksi ke PostgreSQL menggunakan URL dari Supabase
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,  // Menggunakan variabel lingkungan untuk URL koneksi
  ssl: {
    rejectUnauthorized: false,  // Supabase memerlukan koneksi SSL
  },
});

module.exports = pool;

