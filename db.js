const { Pool } = require('pg');

// Konfigurasi koneksi ke PostgreSQL
const pool = new Pool({
  user: 'postgres',       // Ganti dengan username PostgreSQL Anda
  host: 'localhost',
  database: 'partai_perubahan',   // Ganti dengan nama database Anda
  password: 'RezaOktober2023!',   // Ganti dengan password PostgreSQL Anda
  port: 5432,
});

module.exports = pool;
