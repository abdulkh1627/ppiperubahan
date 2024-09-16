document.addEventListener('DOMContentLoaded', () => {
  const provinsiSelect = document.getElementById('provinsi');
  const kabupatenSelect = document.getElementById('kabupaten');
  const kecamatanSelect = document.getElementById('kecamatan');
  const kelurahanSelect = document.getElementById('kelurahan');
  const registrationForm = document.getElementById('registrationForm');

  // Helper function to create an option element
  const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
  };

  // Fetch and populate provinsi
  const fetchProvinsi = async () => {
    try {
      const response = await fetch('/api/provinsi');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const provinsi = await response.json();
      provinsiSelect.innerHTML = '<option value="" disabled selected>Pilih Provinsi</option>'; // Reset dropdown
      provinsi.forEach(item => {
        provinsiSelect.appendChild(createOption(item.id, item.name));
      });
    } catch (error) {
      console.error('Error fetching provinsi:', error);
    }
  };

  // Fetch and populate kabupaten based on selected provinsi
  const fetchKabupaten = async (provinsiId) => {
    try {
      const response = await fetch(`/api/kabupaten/${provinsiId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const kabupaten = await response.json();
      kabupatenSelect.innerHTML = '<option value="" disabled selected>Pilih Kabupaten</option>'; // Reset kabupaten
      kabupaten.forEach(item => {
        kabupatenSelect.appendChild(createOption(item.id, item.name));
      });
    } catch (error) {
      console.error('Error fetching kabupaten:', error);
    }
  };

  // Fetch and populate kecamatan based on selected kabupaten
  const fetchKecamatan = async (kabupatenId) => {
    try {
      const response = await fetch(`/api/kecamatan/${kabupatenId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      let kecamatan = await response.json();

      // Clean BOM if present
      kecamatan = kecamatan.map(item => ({
        id: item['﻿id'] || item.id, // Handle BOM in key 'id'
        name: item.name,
        kabupaten_id: item.kabupaten_id
      }));

      console.log('Filtered kecamatan:', kecamatan); // Debugging

      kecamatanSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan</option>'; // Reset kecamatan
      kecamatan.forEach(item => {
        kecamatanSelect.appendChild(createOption(item.id, item.name));
      });

      if (kecamatan.length === 0) {
        console.warn('No kecamatan data found for the selected kabupatenId');
        kecamatanSelect.innerHTML = '<option value="" disabled selected>Kecamatan tidak ditemukan</option>';
      }
    } catch (error) {
      console.error('Error fetching kecamatan:', error);
    }
  };

  // Fetch and populate kelurahan based on selected kecamatan
  const fetchKelurahan = async (kecamatanId) => {
    const url = `/api/kelurahan/${kecamatanId}`;
    console.log('Fetching URL:', url); // Debugging

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const kelurahan = await response.json();
      console.log('Raw response data:', kelurahan); // Debugging raw response data

      // Ensure the received data is an array
      if (!Array.isArray(kelurahan)) throw new TypeError('Expected an array but got something else');

      kelurahanSelect.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>'; // Reset kelurahan
      kelurahan.forEach(item => {
        const option = createOption(item.id, item.name);
        kelurahanSelect.appendChild(option);
      });

      if (kelurahan.length === 0) {
        console.warn('No kelurahan data found for the selected kecamatanId');
        kelurahanSelect.innerHTML = '<option value="" disabled selected>Kelurahan tidak ditemukan</option>';
      }
    } catch (error) {
      console.error('Error fetching kelurahan:', error);
    }
  };

  // Event listener for selecting a provinsi
  provinsiSelect.addEventListener('change', async () => {
    const provinsiId = provinsiSelect.value;
    console.log('Selected provinsiId:', provinsiId); // Debugging

    // Reset kabupaten, kecamatan, kelurahan
    kabupatenSelect.innerHTML = '<option value="" disabled selected>Pilih Kabupaten</option>';
    kecamatanSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan</option>';
    kelurahanSelect.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';

    if (provinsiId) {
      await fetchKabupaten(provinsiId);
    }
  });

  // Event listener for selecting a kabupaten
  kabupatenSelect.addEventListener('change', async () => {
    const kabupatenId = kabupatenSelect.value;
    console.log('Received kabupatenId:', kabupatenId);

    kecamatanSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan</option>'; // Reset kecamatan
    await fetchKecamatan(kabupatenId);
  });

  // Event listener for selecting a kecamatan
  kecamatanSelect.addEventListener('change', async () => {
    const kecamatanId = kecamatanSelect.value;
    console.log('Selected kecamatanId:', kecamatanId); // Debugging

    // Ensure kecamatanId is valid
    if (!kecamatanId || kecamatanId === "undefined") {
      console.error('KecamatanId tidak valid atau tidak ditemukan');
      return;
    }

    kelurahanSelect.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';
    await fetchKelurahan(kecamatanId);
  });

  // Initial fetch for provinsi
  fetchProvinsi();

  // Event listener for form submission
  registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(registrationForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data),
      });

      if (response.ok) {
        const result = await response.text();
        await Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Berhasil',
          text: result,
        });
        // Reset form after successful submission
        registrationForm.reset();
        // Optionally clear dropdowns
        provinsiSelect.innerHTML = '<option value="" disabled selected>Pilih Provinsi</option>';
        kabupatenSelect.innerHTML = '<option value="" disabled selected>Pilih Kabupaten</option>';
        kecamatanSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan</option>';
        kelurahanSelect.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';
      } else {
        const error = await response.text();
        await Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: error,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Tidak dapat menghubungi server.',
      });
    }
  });
});
