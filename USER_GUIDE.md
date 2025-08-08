# DOKUMENTASI CARA PENGGUNAAN PERANGKAT LUNAK GENESISNET

## Daftar Isi
1. [Pengenalan](#1-pengenalan)
2. [Persyaratan Sistem](#2-persyaratan-sistem)
3. [Instalasi](#3-instalasi)
4. [Login dan Otentikasi](#4-login-dan-otentikasi)
5. [Antarmuka Utama](#5-antarmuka-utama)
6. [Dashboard](#6-dashboard)
7. [Pencarian dan Analisis Data](#7-pencarian-dan-analisis-data)
8. [Mengelola Koneksi](#8-mengelola-koneksi)
9. [Menggunakan Transaction Pool](#9-menggunakan-transaction-pool)
10. [Memantau Log Aktivitas](#10-memantau-log-aktivitas)
11. [Setelan dan Kustomisasi](#11-setelan-dan-kustomisasi)
12. [Mode Training vs Mode Live](#12-mode-training-vs-mode-live)
13. [Troubleshooting](#13-troubleshooting)
14. [FAQ](#14-faq)

## 1. Pengenalan

GenesisNet adalah platform pertukaran data terdesentralisasi yang dibangun di atas Internet Computer Protocol (ICP). Aplikasi ini memungkinkan pengguna untuk terhubung ke jaringan node terdesentralisasi, melakukan pencarian data, melihat metrik jaringan secara real-time, dan berpartisipasi dalam transaksi data.

Dokumentasi ini akan memandu Anda melalui proses penggunaan perangkat lunak GenesisNet dari awal hingga fitur-fitur lanjutan.

## 2. Persyaratan Sistem

Untuk menjalankan GenesisNet, pastikan sistem Anda memenuhi persyaratan berikut:

- **Web Browser**: Chrome (v90+), Firefox (v88+), Edge (v90+), atau Safari (v14+)
- **Koneksi Internet**: Koneksi stabil dengan kecepatan minimal 5 Mbps
- **Perangkat**:
  - Desktop/Laptop dengan RAM minimal 4GB
  - Resolusi layar minimal 1280×720 px
  - OS: Windows 10+, macOS 10.14+, atau distribusi Linux utama

## 3. Instalasi

### Untuk Pengguna Umum
1. Buka browser Anda dan kunjungi [https://genesisnet.icp.io](https://genesisnet.icp.io)
2. Aplikasi akan dimuat secara otomatis tanpa perlu instalasi tambahan

### Untuk Pengembang (Instalasi Lokal)
1. Pastikan Node.js (v14+) dan npm (v6+) atau Yarn (v1.22+) telah terinstal di sistem Anda
2. Clone repositori dari GitHub:
   ```bash
   git clone https://github.com/ntshap/genesisnet.git
   ```
3. Masuk ke direktori proyek:
   ```bash
   cd genesisnet
   ```
4. Instal dependensi:
   ```bash
   npm install
   # atau
   yarn install
   ```
5. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   # atau
   yarn dev
   ```
6. Buka browser dan akses `http://localhost:5173` atau port yang ditunjukkan di terminal

## 4. Login dan Otentikasi

### Membuat Akun Baru
1. Pada halaman landing, klik tombol "LOGIN" di navbar
2. Pada halaman login, klik "Create Account"
3. Masukkan informasi yang diperlukan:
   - Username (minimal 4 karakter)
   - Email (format email yang valid)
   - Password (minimal 8 karakter, berisi huruf besar, huruf kecil, dan angka)
   - Konfirmasi password
4. Centang kotak persetujuan Syarat dan Ketentuan
5. Klik tombol "Create Account"
6. Verifikasi email Anda melalui tautan yang dikirim ke alamat email Anda

### Masuk ke Akun
1. Pada halaman landing, klik tombol "LOGIN" di navbar
2. Masukkan email/username dan password Anda
3. Klik "Login"
4. Opsional: Centang "Remember Me" untuk tetap masuk di perangkat tersebut

### Memulihkan Password
1. Pada halaman login, klik "Forgot Password?"
2. Masukkan alamat email terdaftar Anda
3. Ikuti instruksi yang dikirim ke email Anda untuk mengatur ulang password

## 5. Antarmuka Utama

### Halaman Landing
Halaman landing GenesisNet menyajikan informasi tentang platform dan fitur-fiturnya:
- **Header/Navbar**: Navigasi utama dengan tombol Login
- **Hero Section**: Pengenalan singkat tentang GenesisNet
- **Features Section**: Detail tentang fitur-fitur utama
- **Use Cases**: Contoh penggunaan platform
- **FAQ**: Pertanyaan yang sering diajukan
- **Footer**: Informasi hak cipta dan link penting

### Dashboard
Setelah login, Anda akan diarahkan ke Dashboard utama yang terdiri dari:
- **Navigation Sidebar**: Menu navigasi ke berbagai fitur
- **Main Content Area**: Area utama yang menampilkan visualisasi dan data
- **Control Panel**: Panel untuk mengatur parameter simulasi dan fitur
- **Network Visualization**: Tampilan grafis dari jaringan node
- **Metrics Display**: Panel yang menampilkan metrik kinerja
- **Activity Log**: Catatan aktivitas sistem secara real-time

## 6. Dashboard

### Navigasi Dashboard
- **Sidebar**: Gunakan sidebar di sebelah kiri untuk navigasi antar bagian
- **Toggle Sidebar**: Klik ikon hamburger di kiri atas untuk memperluas/menciutkan sidebar
- **User Menu**: Klik avatar pengguna di kanan atas untuk mengakses pengaturan akun dan logout

### Komponen-komponen Dashboard
1. **Control Panel**
   - Gunakan panel ini untuk mengatur parameter simulasi dan operasi
   - Tombol "Start/Stop Simulation" untuk mengendalikan simulasi jaringan
   - Slider parameter untuk menyesuaikan perilaku simulasi
   - Opsi filter untuk menyesuaikan tampilan data

2. **Network Visualization**
   - Tampilan grafis dari node jaringan dan koneksinya
   - Klik pada node untuk melihat informasi detailnya
   - Gunakan zoom in/out dan pan untuk navigasi dalam visualisasi
   - Toggle filter untuk menampilkan berbagai jenis node dan koneksi

3. **Metrics Display**
   - Menyajikan metrik kinerja real-time dalam bentuk grafik
   - Pilih metrik yang ingin ditampilkan dari dropdown
   - Hover pada titik data untuk melihat nilai detail
   - Pilih rentang waktu untuk menampilkan data historis

## 7. Pencarian dan Analisis Data

### Melakukan Pencarian Data
1. Di Dashboard, temukan panel "Search Data"
2. Masukkan kata kunci pencarian atau parameter spesifik
3. Pilih filter pencarian untuk menyaring hasil
4. Klik "Search" untuk memulai pencarian
5. Hasil akan muncul di panel hasil

### Menganalisis Hasil Pencarian
- Lihat hasil dalam format tabel atau visualisasi grafik
- Gunakan fitur sortir untuk mengurutkan hasil
- Filter hasil berdasarkan parameter spesifik
- Ekspor hasil dalam format CSV, JSON, atau PDF

### Advanced Query
Untuk pencarian lanjutan, gunakan sintaks query khusus:
- `type:dataset` untuk mencari hanya dataset
- `provider:name` untuk mencari dari provider tertentu
- `quality>8` untuk data dengan skor kualitas di atas 8
- `date:2025-08-01..2025-08-08` untuk rentang tanggal spesifik

## 8. Mengelola Koneksi

### Melihat Koneksi Aktif
1. Di sidebar, klik "Active Connections"
2. Panel akan menampilkan semua koneksi aktif dengan status dan latensi

### Detail Koneksi
Setiap koneksi menampilkan:
- **ID Peer**: Identifikasi unik peer (misalnya "peer-001.genesis.net")
- **Lokasi**: Lokasi geografis node (misalnya "US-East", "EU-West")
- **Latensi**: Waktu respons dalam milidetik (misalnya "12ms", "45ms")
- **Status**: Indikator status koneksi (hijau = baik, kuning = perhatian, merah = masalah)

### Mengelola Koneksi
- Klik pada koneksi untuk melihat detail lebih lanjut
- Gunakan tombol "Disconnect" untuk memutus koneksi secara manual
- Pilih "Optimize Connections" untuk mengoptimalkan routing secara otomatis
- Gunakan "Add Connection" untuk menambahkan koneksi baru secara manual

## 9. Menggunakan Transaction Pool

### Melihat Transaction Pool
1. Di sidebar, pilih "Transaction Pool"
2. Panel akan menampilkan transaksi aktif dengan detail

### Detail Transaksi
Setiap transaksi menampilkan:
- **ID Transaksi**: ID unik (misalnya "TX001", "TX002")
- **Jenis Transaksi**: Jenis operasi (misalnya "Data Transfer", "Smart Contract")
- **Nilai**: Jumlah ICP yang terlibat (misalnya "0.5 ICP", "1.2 ICP")
- **Status**: Status transaksi (pending, selesai, gagal)
- **Indikator Status**: Warna yang menunjukkan status (biru = pending, hijau = selesai, merah = gagal)

### Membuat Transaksi Baru
1. Klik tombol "New Transaction"
2. Pilih jenis transaksi dari dropdown
3. Masukkan parameter yang diperlukan
4. Tinjau detail transaksi
5. Klik "Submit" untuk mengirimkan transaksi

## 10. Memantau Log Aktivitas

### Melihat Log Aktivitas
1. Di bagian bawah Dashboard, temukan panel "Activity Log"
2. Panel ini menampilkan catatan kronologis aktivitas sistem

### Fitur Log Aktivitas
- **Jenis Log**: Ditandai dengan warna berbeda (info, error, warning, success, debug)
- **Pencarian**: Gunakan kotak pencarian untuk mencari entri log tertentu
- **Filter**: Filter log berdasarkan jenis (All, Info, Error, Warning, Success, Debug)
- **Clear**: Tombol "Clear" untuk menghapus semua log
- **Scroll Manual**: Gunakan scrollbar untuk melihat log sebelumnya
- **Scroll to End**: Tombol "Scroll to End" untuk langsung ke entri terbaru

## 11. Setelan dan Kustomisasi

### Pengaturan Akun
1. Klik avatar pengguna di kanan atas
2. Pilih "Settings" dari menu dropdown
3. Ubah informasi profil, preferensi notifikasi, dan setelan keamanan

### Kustomisasi Antarmuka
- **Theme**: Pilih tema antarmuka (Default, Light, Dark)
- **Layout**: Atur tata letak Dashboard sesuai preferensi
- **Notifications**: Atur preferensi notifikasi (email, push, in-app)
- **Metrics Display**: Kustomisasi metrik yang ditampilkan

## 12. Mode Training vs Mode Live

GenesisNet memiliki dua mode operasi:

### Mode Training
- Mode ini menggunakan data simulasi untuk pembelajaran dan pengujian
- Ditandai dengan label "TRAINING" di bagian bawah layar
- Tidak melakukan transaksi nyata di jaringan ICP
- Ideal untuk pengguna baru yang ingin memahami sistem

### Mode Live
- Mode ini terhubung ke jaringan ICP aktual
- Memungkinkan transaksi nyata dengan nilai ICP sebenarnya
- Ditandai dengan label "LIVE" di bagian bawah layar
- Untuk pengguna yang siap berpartisipasi dalam ekosistem sebenarnya

### Beralih Antar Mode
1. Klik ikon roda gigi di Control Panel
2. Pilih tab "Environment"
3. Pilih "Training" atau "Live" mode
4. Konfirmasi pilihan Anda

## 13. Troubleshooting

### Masalah Umum dan Solusi

#### Gagal Login
- Pastikan email dan password benar
- Periksa koneksi internet
- Bersihkan cache browser dan coba lagi

#### Dashboard Tidak Memuat
- Refresh browser
- Pastikan JavaScript diaktifkan
- Coba browser berbeda

#### Transaksi Gagal
- Periksa saldo ICP Anda
- Pastikan koneksi ke jaringan ICP stabil
- Pastikan parameter transaksi valid

#### Visualisasi Network Lag
- Kurangi jumlah node yang ditampilkan
- Tutup aplikasi lain yang memakan banyak memori
- Gunakan perangkat dengan spesifikasi lebih tinggi

#### Log Tidak Muncul
- Periksa pengaturan filter log
- Refresh panel log
- Restart aplikasi jika masalah berlanjut

### Kontak Support
Jika masalah berlanjut:
- Email: support@genesisnet.icp.io
- Discord: [https://discord.gg/genesisnet](https://discord.gg/genesisnet)
- Formulir Dukungan: Klik "Help & Support" di footer aplikasi

## 14. FAQ

### Pertanyaan Umum

#### Q: Apa itu GenesisNet?
A: GenesisNet adalah platform pertukaran data terdesentralisasi yang dibangun di atas Internet Computer Protocol, memungkinkan pencarian, transaksi, dan analisis data secara efisien dan aman.

#### Q: Bagaimana cara membuat akun?
A: Klik "LOGIN" di navbar, lalu pilih "Create Account". Isi formulir pendaftaran dengan informasi yang diperlukan dan verifikasi email Anda.

#### Q: Apa perbedaan mode Training dan Live?
A: Mode Training menggunakan data simulasi untuk pembelajaran, sementara mode Live terhubung ke jaringan sebenarnya dan menggunakan token ICP nyata.

#### Q: Bagaimana cara melakukan transaksi data?
A: Pertama temukan data yang diinginkan melalui pencarian, pilih penyedia data, mulai negosiasi, dan selesaikan transaksi menggunakan token ICP.

#### Q: Apakah aplikasi ini aman?
A: Ya, GenesisNet menggunakan enkripsi end-to-end, otentikasi dua faktor, dan mekanisme keamanan blockchain untuk melindungi data dan transaksi.

#### Q: Bagaimana cara meningkatkan kinerja visualisasi jaringan?
A: Kurangi jumlah node yang ditampilkan, filter koneksi yang tidak penting, dan gunakan perangkat dengan spesifikasi yang memadai.

---

© 2024 GenesisNet
