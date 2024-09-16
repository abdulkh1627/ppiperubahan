const { Pool } = require('pg');

const pool = new Pool({
  
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Menambahkan debugging
    trace: true
  });

async function testConnection() {
  try {
    console.log('Attempting to connect with:', process.env.DATABASE_URL);
    const client = await pool.connect();
    console.log('Connection successful');
    client.release();
  } catch (error) {
    console.error('Error during connection test:', error);
  }
}

testConnection();







