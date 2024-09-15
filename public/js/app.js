document.addEventListener('DOMContentLoaded', () => {
  const provinsiSelect = document.getElementById('provinsi');
  const kabupatenSelect = document.getElementById('kabupaten');
  const kecamatanSelect = document.getElementById('kecamatan');
  const kelurahanSelect = document.getElementById('kelurahan');
  const registrationForm = document.getElementById('registrationForm');

  const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
  };

  const fetchProvinsi = async () => {
    try {
      const response = await fetch('https://backend-one-mu.vercel.app/api/provinsi', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer msnmfqvkzNJme2z4EgrAceVE'
        }
      });
      if (!response.ok) throw new Error(`Error fetching provinsi. Status: ${response.status}`);
      
      const provinsi = await response.json();
      const options = provinsi.map(item => createOption(item.id, item.name));
      provinsiSelect.append(...options);
    } catch (error) {
      console.error('Error fetching provinsi:', error.message);
      alert('Gagal memuat data provinsi.');
    }
  };

  const fetchKabupaten = async (provinsiId) => {
    try {
      const response = await fetch(`https://backend-one-mu.vercel.app/api/kabupaten/${provinsiId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer msnmfqvkzNJme2z4EgrAceVE'
        }
      });
      if (!response.ok) throw new Error(`Error fetching kabupaten. Status: ${response.status}`);
      
      const kabupaten = await response.json();
      kabupatenSelect.innerHTML = '<option value="" disabled selected>Pilih Kabupaten</option>';
      const options = kabupaten.map(item => createOption(item.id, item.name));
      kabupatenSelect.append(...options);
    } catch (error) {
      console.error('Error fetching kabupaten:', error.message);
      alert('Gagal memuat data kabupaten.');
    }
  };

  const fetchKecamatan = async (kabupatenId) => {
    try {
      const response = await fetch(`https://backend-one-mu.vercel.app/api/kecamatan/${kabupatenId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer msnmfqvkzNJme2z4EgrAceVE'
        }
      });
      if (!response.ok) throw new Error(`Error fetching kecamatan. Status: ${response.status}`);
      
      let kecamatan = await response.json();
      kecamatan = kecamatan.map(item => ({
        id: item['﻿id'] || item.id,
        name: item.name,
        kabupaten_id: item.kabupaten_id
      }));
      
      kecamatanSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan</option>';
      const options = kecamatan.map(item => createOption(item.id, item.name));
      kecamatanSelect.append(...options);
    } catch (error) {
      console.error('Error fetching kecamatan:', error.message);
      alert('Gagal memuat data kecamatan.');
    }
  };

  const fetchKelurahan = async (kecamatanId) => {
    try {
      const response = await fetch(`https://backend-one-mu.vercel.app/api/kelurahan/${kecamatanId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer msnmfqvkzNJme2z4EgrAceVE'
        }
      });
      if (!response.ok) throw new Error(`Error fetching kelurahan. Status: ${response.status}`);
      
      const kelurahan = await response.json();
      kelurahanSelect.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';
      const options = kelurahan.map(item => createOption(item.id, item.name));
      kelurahanSelect.append(...options);
    } catch (error) {
      console.error('Error fetching kelurahan:', error.message);
      alert('Gagal memuat data kelurahan.');
    }
  };

  provinsiSelect.addEventListener('change', debounce(async () => {
    const provinsiId = provinsiSelect.value;
    kabupatenSelect.innerHTML = '<option value="" disabled selected>Pilih Kabupaten</option>';
    kecamatanSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan</option>';
    kelurahanSelect.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';
    await fetchKabupaten(provinsiId);
  }, 300));

  kabupatenSelect.addEventListener('change', async () => {
    const kabupatenId = kabupatenSelect.value;
    kecamatanSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan</option>';
    kelurahanSelect.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';
    await fetchKecamatan(kabupatenId);
  });

  kecamatanSelect.addEventListener('change', async () => {
    const kecamatanId = kecamatanSelect.value;
    kelurahanSelect.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';
    await fetchKelurahan(kecamatanId);
  });

  fetchProvinsi();

  registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(registrationForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch('https://backend-one-mu.vercel.app/register', {
        method: 'POST',
        body: new URLSearchParams(data),
      });
      if (response.ok) {
        const result = await response.text();
        await Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Berhasil',
          text: result,
        });
        registrationForm.reset();
        provinsiSelect.innerHTML = '<option value="" disabled selected>Pilih Provinsi</option>';
        kabupatenSelect.innerHTML = '<option value="" disabled selected>Pilih Kabupaten</option>';
        kecamatanSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan</option>';
        kelurahanSelect.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';
        await fetchProvinsi(); // Reset dan load ulang data provinsi
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
