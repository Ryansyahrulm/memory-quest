# Memory Quest

Memory Quest adalah game edukasi dan simulator manajemen memori (algoritma *page replacement*) berbasis web yang dirancang untuk membantu mahasiswa memahami konsep sistem operasi, khususnya manajemen memori virtual dan pergantian *frame*.

Aplikasi dibangun menggunakan **React 18 + Vite** (JavaScript) dengan styling murni berbasis **CSS Variables**, navigasi **react-router-dom**, serta unit test menggunakan **Vitest**.

---

## Fitur Utama

1. **Simulasi Interaktif (Simulator)**
   - Input *reference string* (hingga 30 halaman) dan jumlah *frame* fisik (1–7).
   - Mendukung algoritma **FIFO**, **LRU**, dan **Optimal**.
   - Mode pemutaran otomatis (*playback*) langkah demi langkah dengan kontrol jeda, kecepatan (Lambat, Normal, Cepat), dan navigasi keyboard (`←`, `→`, `Spasi`).
   - Penjelasan tekstual otomatis di setiap langkah mengenai alasan terjadinya *hit*, *fault*, maupun halaman yang digantikan.
   - Tabel alokasi *frame* responsif dengan penanda visual *page hit* dan *page fault*.

2. **Perbandingan Antar-Algoritma (Compare)**
   - Memproses ketiga algoritma secara serentak pada *reference string* dan jumlah *frame* yang sama.
   - Tabel komparasi performa (*Total Hit*, *Total Fault*, *Hit Ratio*) dengan badge otomatis untuk algoritma terbaik.
   - Grafik batang horizontal *page fault* berbasis CSS/SVG murni tanpa pustaka eksternal.
   - Analisis dan demonstrasi interaktif **Anomali Belady** (*Belady's Anomaly*) pada algoritma FIFO (perbandingan 3 vs 4 frame).

3. **Mode Quest (Game Edukasi)**
   - Mode kuis interaktif menebak *Hit* atau *Fault* pada setiap langkah akses memori.
   - Interaksi memilih *frame* korban (*victim frame*) secara langsung ketika memori penuh.
   - Tingkat kesulitan: **Mudah** (FIFO, 3 frame), **Sedang** (LRU, 3 frame), dan **Sulit** (Optimal, 4 frame).
   - Sistem 3 nyawa, perolehan skor, fitur petunjuk (*hint*), evaluasi kesalahan, dan penyimpanan skor tertinggi (*high score*) via `localStorage`.

4. **Materi Edukasi (Learn)**
   - Penjelasan konsep dasar: *Page Fault*, *Page Hit*, *Frame*, dan *Reference String*.
   - Ulasan komparatif cara kerja, kelebihan, dan kelemahan masing-masing algoritma dilengkapi tabel statis.

---

## Ringkasan Algoritma Page Replacement

- **FIFO (First-In, First-Out)**: Menggantikan halaman yang paling awal masuk ke memori fisik. Sangat sederhana dan berbeban rendah, namun rentan mengalami Anomali Belady.
- **LRU (Least Recently Used)**: Menggantikan halaman yang paling lama tidak diakses di masa lalu memanfaatkan prinsip lokalitas waktu (*temporal locality*). Bebas dari Anomali Belady.
- **Optimal (OPT / Belady)**: Menggantikan halaman yang waktu akses berikutnya paling jauh di masa depan. Menghasilkan *page fault* terendah secara teoretis dan berfungsi sebagai standar tolok ukur (*benchmark*).

---

## Struktur Folder

```text
src/
├── algorithms/     # Logika algoritma murni (fifo.js, lru.js, optimal.js, index.js, test)
├── components/     # Komponen UI modular (Button, Card, Field, Select, Badge, StatBlock, FrameTable, Navbar)
├── hooks/          # Custom hook manajemen state simulasi (useSimulation.js)
├── pages/          # Halaman aplikasi (Home, Simulator, Compare, Quest, Learn)
├── styles/         # Desain token dan gaya global (tokens.css, global.css)
└── utils/          # Helper parser input, preset data, dan penjelasan langkah
```

---

## Cara Menjalankan

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan
```bash
npm run dev
```
Akses aplikasi melalui peramban pada alamat lokal yang tertera (biasanya `http://localhost:5173`).

### 3. Menjalankan Unit Test
```bash
npm test
```
Menjalankan pengujian otomatis Vitest untuk memvalidasi akurasi perhitungan algoritma terhadap data uji klasik dan *edge cases*.

### 4. Build Produksi
```bash
npm run build
```
Menghasilkan berkas statis siap rilis di folder `dist/`.
