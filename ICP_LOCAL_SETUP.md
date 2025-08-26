# GenesisNet - Konfigurasi ICP Lokal untuk Hackathon

## Ringkasan
GenesisNet dikonfigurasi untuk menggunakan **jaringan ICP lokal** dengan **token simulasi gratis** untuk keperluan development dan demonstrasi hackathon. Anda **TIDAK perlu membeli token ICP sungguhan**.

## Konfigurasi Jaringan Lokal

### 1. Pengaturan Otomatis
- **Host**: `http://localhost:4943` (jaringan lokal)
- **Canister ID**: `ryjl3-tyaaa-aaaaa-aaaba-cai` (ledger lokal)
- **Transfer Fee**: `0 ICP` (gratis untuk demo)
- **Saldo Default**: `100 ICP` untuk user wallet

### 2. Saldo Default (Token Simulasi)
```javascript
DEFAULT_BALANCES: {
  DATA_REQUESTER: 1000.0,    // 1000 ICP untuk Data Requester Agent
  DATA_PROVIDER: 500.0,      // 500 ICP untuk Data Provider Agent  
  USER_WALLET: 100.0,        // 100 ICP untuk user wallet
  SYSTEM_RESERVE: 10000.0    // 10000 ICP untuk system reserve
}
```

### 3. Fitur Khusus Lokal
- ✅ **Token Gratis**: Saldo otomatis terisi tanpa perlu beli
- ✅ **Transfer Gratis**: Tidak ada biaya transfer untuk demo
- ✅ **Mock Server**: Menggunakan mock DFX replica untuk stabilitas
- ✅ **Error Handling**: Fallback ke saldo default jika terjadi error

## Cara Penggunaan

### 1. Jalankan Mock DFX Replica
```bash
cd backend
python mock_dfx_replica.py
```

### 2. Jalankan Aplikasi
```bash
npm run dev
```

### 3. Verifikasi Saldo
- Saldo akan otomatis muncul sebagai `100.00 ICP` di wallet
- Jika terjadi error, saldo akan fallback ke nilai default
- Semua transaksi menggunakan token simulasi

## File Konfigurasi

### Konfigurasi ICP Lokal
- `src/config/icpLocalConfig.js` - Pengaturan jaringan lokal
- `src/services/icpLedgerService.js` - Service ICP dengan fallback lokal
- `backend/mock_dfx_replica.py` - Mock server untuk simulasi ICP

### Environment Variables
```properties
# .env
VITE_ICP_HOST=http://localhost:4943
VITE_NODE_ENV=development
```

## Keuntungan Pendekatan Ini

1. **💰 Tanpa Biaya**: Tidak perlu membeli token ICP sungguhan
2. **🚀 Cepat Setup**: Langsung jalan tanpa konfigurasi kompleks  
3. **🛡️ Aman**: Tidak ada risiko kehilangan token sungguhan
4. **📊 Demo Ready**: Perfect untuk presentasi hackathon
5. **🔄 Konsisten**: Saldo selalu tersedia untuk testing

## Demo Flow
1. User masuk ke dashboard → Saldo `100 ICP` langsung muncul
2. Pilih data provider → Transaksi menggunakan token simulasi
3. Pembayaran berhasil → Saldo berkurang secara simulasi
4. Data provider menerima pembayaran → Dalam token simulasi

## Catatan Penting
- Semua transaksi adalah **SIMULASI** 
- Token yang digunakan **BUKAN token ICP sungguhan**
- Cocok untuk development, testing, dan demo hackathon
- Untuk production, ganti ke jaringan mainnet dengan token asli

---
*Konfigurasi ini memungkinkan GenesisNet untuk demonstrasi lengkap alur pembayaran ICP tanpa biaya riil.*
