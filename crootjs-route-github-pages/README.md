# Route Finder — CrootJS + GitHub Pages

Aplikasi web untuk menampilkan rute berkendara dari Universitas Logistik dan Bisnis Internasional (ULBI) ke Bumi Sariwangi 2. Antarmuka, peta, marker, dan gambar garis rute menggunakan modul CrootJS. Tidak memakai Leaflet, Mapbox GL JS, Google Maps JavaScript SDK, npm, atau bundler.

## Cara kerja
- Peta dan interaksi peta menggunakan modul CrootJS.
- Saat tombol **Cari rute jalan** ditekan, aplikasi meminta geometri rute berkendara dari layanan routing OSRM publik melalui internet.
- Garis rute yang diterima ditampilkan dengan CrootJS. Jarak dan estimasi durasi berasal dari respons layanan routing; tidak memperhitungkan lalu lintas langsung.
- Karena memakai layanan OSRM publik, fitur rute memerlukan koneksi internet dan ketersediaan layanan tersebut.

## Lokasi awal
- ULBI: latitude `-6.874305`, longitude `107.575689`.
- Bumi Sariwangi 2: latitude `-6.863800`, longitude `107.567300`.

## File
- `index.html`: struktur halaman.
- `style.css`: tampilan responsif.
- `main.js`: interaksi, modul CrootJS, dan permintaan rute.
- `data/roads.geojson`: GeoJSON waypoint awal.

## Deploy ke GitHub Pages
1. Unggah semua file dan folder ke folder proyek di repository GitHub.
2. Buka **Settings → Pages**.
3. Pilih **Deploy from a branch**, branch `main`, dan folder tempat `index.html` berada.
4. Simpan, tunggu deployment, lalu buka URL Pages. Jika file berada di subfolder `crootjs-route-github-pages`, URL situs harus diakhiri `/crootjs-route-github-pages/`.

Dokumentasi CrootJS: https://croot.js.org/
Dokumentasi API OSRM: https://project-osrm.org/docs/v5.9.1/api/
