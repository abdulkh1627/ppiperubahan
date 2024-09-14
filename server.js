const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const bodyParser = require('body-parser');
const pool = require('./db'); // Import koneksi database

const app = express();
const port = 3000;

// Load data from CSV files
const provinsiData = [];
const kabupatenData = [];
const kecamatanData = [];
const kelurahanData = [];

// Function to clean BOM from strings
const cleanBOM = (str) => {
  if (typeof str === 'string') {
    return str.replace(/^\uFEFF/, '');
  }
  return str;
};

// Load CSV data
const loadCSVData = (filePath, dataArray) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Clean BOM from fields and log cleaned data
        const cleanedRow = {};
        Object.keys(row).forEach(key => {
          const cleanValue = cleanBOM(row[key]);
          cleanedRow[key.trim()] = cleanValue.trim(); // Ensure no extra whitespace
        });

        console.log('Cleaned row data:', cleanedRow);

        dataArray.push(cleanedRow);
      })
      .on('end', () => {
        console.log(`Data loaded from ${filePath}:`, dataArray);
        resolve();
      })
      .on('error', reject);
  });
};

// Load all CSV data
const loadAllData = async () => {
  try {
    await Promise.all([
      loadCSVData(path.join(__dirname, 'provinsi.csv'), provinsiData),
      loadCSVData(path.join(__dirname, 'kabupaten.csv'), kabupatenData),
      loadCSVData(path.join(__dirname, 'kecamatan.csv'), kecamatanData),
      loadCSVData(path.join(__dirname, 'kelurahan.csv'), kelurahanData)
    ]);
  } catch (error) {
    console.error('Error loading CSV data:', error);
    process.exit(1);
  }
};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// API to get provinsi
app.get('/api/provinsi', (req, res) => {
  res.json(provinsiData);
});

// API to get kabupaten by provinsi ID
app.get('/api/kabupaten/:provinsiId', (req, res) => {
  const provinsiId = req.params.provinsiId;
  const kabupaten = kabupatenData.filter(row => row.provinsi_id === provinsiId);
  res.json(kabupaten);
});

// API to get kecamatan by kabupaten ID
app.get('/api/kecamatan/:kabupatenId', (req, res) => {
  const kabupatenId = req.params.kabupatenId;
  console.log('Received kabupatenId:', kabupatenId); // Log kabupatenId for debugging

  // Clean BOM from 'id' and 'kabupaten_id'
  const cleanData = kecamatanData.map(item => ({
    id: cleanBOM(item.id),
    name: cleanBOM(item.name),
    kabupaten_id: cleanBOM(item.kabupaten_id)
  }));

  // Log cleaned data
  console.log('Cleaned kecamatanData:', cleanData);

  const kecamatan = cleanData.filter(row => row.kabupaten_id === kabupatenId);
  console.log('Filtered kecamatan:', kecamatan); // Log kecamatan for debugging

  res.json(kecamatan);
});

// API to get kelurahan by kecamatan ID
app.get('/api/kelurahan/:kecamatanId', (req, res) => {
  const kecamatanId = req.params.kecamatanId;
  console.log('Received kecamatanId:', kecamatanId); // Log received kecamatanId

  const kelurahan = kelurahanData.filter(row => cleanBOM(row.kecamatan_id) === cleanBOM(kecamatanId));
  console.log('Filtered kelurahan:', kelurahan); // Log the result after filtering

  if (kelurahan.length === 0) {
    return res.status(404).json({ error: `No kelurahan found for kecamatan ID ${kecamatanId}` });
  }

  res.json(kelurahan);
});

// Register route
app.post('/register', async (req, res) => {
  const { nama, nik, email, nomor_hp, alamat, kabupaten: kabupatenCode, provinsi: provinsiCode, kecamatan: kecamatanCode, kelurahan: kelurahanCode } = req.body;

  console.log('Received kecamatanCode:', kecamatanCode); // Debugging log

  // Find provinsi, kabupaten, kecamatan, kelurahan names by code
  const provinsi = provinsiData.find(p => p.id === provinsiCode);
  const provinsiName = provinsi ? provinsi.name : 'Unknown';

  const kabupaten = kabupatenData.find(k => k.id === kabupatenCode);
  const kabupatenName = kabupaten ? kabupaten.name : 'Unknown';

  const kecamatan = kecamatanData.find(kc => cleanBOM(kc.id) === cleanBOM(kecamatanCode));
  const kecamatanName = kecamatan ? kecamatan.name : 'Unknown';

  console.log('Found kecamatan:', kecamatanName); // Log kecamatan found

  const kelurahan = kelurahanData.find(kel => cleanBOM(kel.id) === cleanBOM(kelurahanCode));
  const kelurahanName = kelurahan ? kelurahan.name : 'Unknown';

  try {
    const query = `
      INSERT INTO anggota (nama, nik, email, nomor_hp, alamat, kabupaten, provinsi, kecamatan, kelurahan)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [nama, nik, email, nomor_hp, alamat, kabupatenName, provinsiName, kecamatanName, kelurahanName];
    
    await pool.query(query, values);
    res.send('Pendaftaran berhasil!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Terjadi kesalahan saat mendaftarkan anggota.');
  }
});

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const startServer = async () => {
  await loadAllData();
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
};

startServer();
