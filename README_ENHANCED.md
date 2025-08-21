# GenesisNet - Pusat Kendali Ekonomi Data Otonom
## Enhanced Visualization & Autonomous Agent Demo

![GenesisNet Logo](genesisnet.png)

## 🚀 Tentang GenesisNet

GenesisNet adalah platform revolusioner yang mengubah cara kita mengakses dan menegosiasikan data. Berbeda dengan marketplace data tradisional seperti Kaggle, GenesisNet menggunakan agen otonom yang secara aktif mencari, menegosiasikan, dan mengurus data sesuai kebutuhan Anda.

## 🎯 Konsep Utama

### Bukan Marketplace Biasa
GenesisNet bukan "toko" data yang menampilkan katalog statis. Sebaliknya, Data Request Agent bertindak seperti "orang suruhan" yang secara otonom:
- Mencari data sesuai kriteria spesifik
- Menegosiasikan harga secara real-time
- Mengurus pengiriman dan pembayaran
- Memastikan kualitas data

### Proses Otonom
Sistem bekerja secara mandiri tanpa campur tangan manusia:
1. **Discovery**: Agen mencari data yang sesuai
2. **Negotiation**: Otomatis menegosiasikan harga dan syarat
3. **Execution**: Mengurus transaksi dan pengiriman
4. **Quality Assurance**: Memvalidasi kualitas data

## 🎮 Fitur Visualisasi Enhanced

### 1. Agen Otonom yang "Hidup"
- **Ikon Robot/Drone**: Setiap agen memiliki ikon yang berbeda (Bot, Drone, Rocket)
- **Pergerakan Real-time**: Agen bergerak antar node setiap 3-5 detik
- **Status Aktif**: Panel yang menunjukkan agen mana yang sedang bekerja

### 2. Efek Visual Dinamis
- **Efek Kilat**: Node yang sedang aktif menampilkan efek kilat kuning
- **Animasi Pulsing**: Status indicator yang berkedip secara berkelanjutan
- **Transisi Halus**: Semua animasi menggunakan transisi yang smooth

### 3. Tracking Camera
- **Auto-Track Mode**: Kamera otomatis mengikuti pergerakan agen
- **Manual Control**: Pengguna tetap dapat mengontrol kamera secara manual
- **Smooth Transitions**: Transisi kamera yang halus dengan durasi 1 detik

### 4. Interaktivitas Tinggi
- **Click to Explore**: Klik node untuk melihat detail informasi
- **Draggable Panels**: Panel informasi dapat di-drag ke mana saja
- **Zoom Controls**: Zoom in/out untuk melihat detail atau gambaran besar

## 🛠️ Teknologi

- **Frontend**: React + Vite + Tailwind CSS
- **Visualization**: D3.js dengan animasi custom
- **Icons**: Lucide React untuk ikon yang konsisten
- **Styling**: Neubrutalism design system

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📊 Komponen Utama

### NetworkVisualization
Komponen utama yang menampilkan:
- Topologi jaringan dengan 14 node
- Agen otonom yang bergerak
- Efek visual dinamis
- Tracking camera functionality

### Control Panel
- Tombol start negotiation
- Toggle tracking camera
- Zoom controls
- Status monitoring

### Metrics Display
- CPU usage real-time
- Data quality metrics
- Network latency
- Active connections

## 🎨 Fitur Visual Baru

### 1. Lightning Effect
```javascript
// Efek kilat untuk node yang sedang aktif
if (activeAgent && activeAgent.targetNode === node.id) {
  const lightning = nodeContainer.append('path')
    .attr('d', 'M-10,-10 L-5,-5 L-8,0 L-3,5 L-10,10 L-5,5 L-8,0 L-3,-5 Z')
    .attr('fill', '#ffff00')
    .attr('stroke', '#ff6600')
    .attr('stroke-width', 2);
}
```

### 2. Agent Movement Simulation
```javascript
// Simulasi pergerakan agen otonom
const moveAgent = () => {
  const randomAgent = agentTypes[Math.floor(Math.random() * agentTypes.length)];
  const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
  
  setActiveAgent({
    type: randomAgent,
    targetNode: randomNode,
    timestamp: Date.now()
  });
};
```

### 3. Camera Tracking
```javascript
// Fungsi tracking camera
const focusOnNode = (nodeId) => {
  const svg = d3.select(svgRef.current);
  const node = svg.select(`[data-node-id="${nodeId}"]`);
  
  if (!node.empty()) {
    const newTransform = d3.zoomIdentity
      .translate(targetX, targetY)
      .scale(1.2);
    
    svg.transition()
      .duration(1000)
      .call(d3.zoom().transform, newTransform);
  }
};
```

## 📈 Metrik Penting

### CPU Usage
- Menunjukkan beban sistem
- Mempengaruhi kecepatan negosiasi
- Indikator efisiensi agen

### Data Quality
- Skor kualitas data (0-100)
- Mempengaruhi harga negosiasi
- Validasi otomatis

### Network Latency
- Waktu respons sistem
- Optimasi performa
- Monitoring real-time

## 🎯 Demo Script

### Pembukaan (30 detik)
"Selamat datang di GenesisNet - Pusat Kendali Ekonomi Data Otonom. Saya akan menunjukkan kepada Anda bagaimana kami mengatasi masalah utama dalam ekonomi data saat ini."

### Demonstrasi Live Topology (2 menit)
"Lihatlah dasbor ini. Ini bukan hanya visualisasi statis - ini adalah bukti hidup bahwa agen-agen otonom kami benar-benar bekerja."

### Point 1: Agen yang Bergerak (30 detik)
"Perhatikan ikon robot, drone, dan roket yang bergerak antar node. Setiap ikon mewakili agen otonom yang sedang melakukan tugasnya."

### Point 2: Efek Visual Dinamis (30 detik)
"Lihat efek kilat kuning pada node yang sedang aktif. Status indicator yang berkedip. Ini bukan animasi kosong - ini menunjukkan aktivitas real-time."

### Point 3: Tracking Camera (30 detik)
"Fitur tracking camera ini memungkinkan Anda mengikuti pergerakan agen secara otomatis. Klik tombol 'Auto-Track' dan lihat bagaimana kamera mengikuti agen."

## 🔧 Troubleshooting

### Jika Animasi Tidak Berjalan
- Pastikan browser mendukung CSS animations
- Refresh halaman untuk restart simulasi
- Periksa console untuk error

### Jika Tracking Camera Tidak Berfungsi
- Pastikan node target ada dalam viewport
- Coba reset zoom terlebih dahulu
- Periksa apakah tracking mode aktif

### Jika Agen Tidak Bergerak
- Tunggu 3-5 detik untuk pergerakan berikutnya
- Refresh halaman untuk restart simulasi
- Periksa apakah ada error di console

## 📝 Changelog

### v2.0.0 - Enhanced Visualization
- ✅ Added lightning effects for active nodes
- ✅ Implemented tracking camera functionality
- ✅ Added robot/drone icons for agents
- ✅ Enhanced status indicators with pulsing animation
- ✅ Added active agent status panel
- ✅ Improved interactivity and user experience

### v1.0.0 - Initial Release
- ✅ Basic network visualization
- ✅ Node information panels
- ✅ Zoom and pan controls
- ✅ Basic animations

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas! Silakan:
1. Fork repository ini
2. Buat branch untuk fitur baru
3. Commit perubahan Anda
4. Push ke branch
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Kontak

- **Email**: info@genesisnet.com
- **Website**: https://genesisnet.com
- **Twitter**: @GenesisNetData

---

**GenesisNet** - Di mana data menemukan Anda, bukan sebaliknya. 🚀
