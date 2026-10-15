# Route Finder — CrootJS + GitHub Pages

Aplikasi frontend untuk memilih titik berangkat/tujuan dan menghitung rute dari data polyline jalan GeoJSON dengan modul CrootJS. Tidak memakai Leaflet, Mapbox GL JS, Google Maps JavaScript SDK, npm, atau bundler.

## File
- `index.html`: struktur halaman.
- `style.css`: tampilan responsif.
- `main.js`: interaksi, pemuatan GeoJSON, dan pemanggilan modul CrootJS.
- `data/roads.geojson`: **data jalan contoh**; ganti dengan polyline jalan yang benar untuk wilayah tugas.

## Penting tentang polyline
Polyline di `data/roads.geojson` saat ini hanyalah data contoh agar struktur aplikasi tersedia. Ini bukan data jalan untuk lokasi proyekmu. Untuk rute nyata, masukkan jaringan jalan sebagai GeoJSON `FeatureCollection` yang berisi fitur `LineString`/`MultiLineString`, dengan koordinat GeoJSON `[longitude, latitude]`. Jaringan perlu tersambung pada persimpangan agar perhitungan rute bisa mengikuti jalan.

CrootJS menyediakan `map.js`, `geo.js`, dan `georoute.js` untuk menggambar peta, membaca GeoJSON, dan menghitung shortest route dari data garis jalan sendiri. Tile peta basemap berasal dari penyedia tile eksternal; tidak ada library JavaScript pemetaan eksternal.

## Publikasikan ke GitHub Pages
1. Buat repository GitHub baru dan unggah seluruh file/folder.
2. Buka **Settings → Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main`, folder `/(root)`, lalu **Save**.
5. Tunggu deployment selesai, kemudian buka URL Pages yang ditampilkan GitHub.

## Menyesuaikan data
Ganti isi `data/roads.geojson` dengan data jalan wilayah tugas. Pastikan `main.js` menggunakan API yang sesuai dengan versi CrootJS yang dipakai. API pemetaan/routing dapat berubah antar versi; dokumentasi resmi: https://croot.js.org/

## Catatan batasan
GitHub Pages hanya hosting statis. Proyek ini menghitung rute di browser dari data GeoJSON yang disediakan, bukan memanggil layanan navigasi real-time. Jarak adalah panjang polyline, bukan estimasi waktu tempuh atau kondisi lalu lintas.


## Rute yang diminta
- Titik berangkat: Universitas Logistik dan Bisnis Internasional (ULBI), sekitar `[-6.874305, 107.575689]` (latitude, longitude).
- Titik tujuan: Komplek Bumi Sariwangi 2, Jl. Sariwangi Selatan No. 11, sekitar `[-6.8638, 107.5673]` (latitude, longitude).

Koordinat tersebut dipakai sebagai titik awal dan tujuan. File GeoJSON saat ini hanya menyimpan waypoint, **belum berisi polyline jalan sebenarnya**, jadi aplikasi dengan sengaja tidak menggambar atau mengklaim rute jalan palsu. Untuk mengaktifkan routing, masukkan jaringan jalan GeoJSON `LineString`/`MultiLineString` dari area ini ke `data/roads.geojson`.
