# Memory Quest

Memory Quest adalah aplikasi web edukatif dan simulator interaktif manajemen memori (khususnya algoritma *page replacement* pada memori virtual) yang dirancang untuk membantu mahasiswa dan pembelajar mata kuliah Sistem Operasi memahami mekanisme alokasi *frame*, penanganan *page fault*, serta pemilihan *victim frame*.

Aplikasi ini dikembangkan menggunakan **React 18** dan dibundel dengan **Vite**. Desain antarmuka mengusung gaya akademik yang bersih (*clean & minimalist*) berbasis **CSS Variables** murni tanpa ketergantungan pustaka UI pihak ketiga. Logika algoritma dipisahkan sebagai *pure function* dan diuji secara komprehensif menggunakan **Vitest**.

---

## Fitur Utama

### 1. Simulasi Interaktif (Simulator)
- **Konfigurasi Fleksibel**: Menerima masukan *reference string* hingga 30 angka halaman (rentang nilai 0–99) dan alokasi frame fisik antara 1 hingga 7 frame.
- **Pilihan Algoritma**: Mendukung tiga algoritma utama: **FIFO**, **LRU**, dan **Optimal**.
- **Preset & Generator Acak**: Dilengkapi tombol pemuatan contoh *reference string* klasik dan pembuat angka acak otomatis.
- **Tabel Alokasi Frame Responsif**: Visualisasi matriks alokasi frame dengan penanda warna status yang jelas:
  - **Hijau**: *Page Hit* (halaman sudah tersedia di frame memori).
  - **Merah**: *Page Fault* (halaman belum tersedia dan harus dimuat ke frame).
- **Kontrol Playback**:
  - Tombol Putar (*Play*), Jeda (*Pause*), Langkah Maju (*Next*), Langkah Mundur (*Prev*), dan Reset.
  - Tiga pilihan kecepatan pemutaran: Lambat, Normal, dan Cepat.
  - Dukungan navigasi keyboard: `Spasi` (Putar/Jeda), `→` (Langkah berikutnya), dan `←` (Langkah sebelumnya).
- **Penjelasan Langkah Otomatis**: Analisis kontekstual secara tekstual pada setiap langkah yang menerangkan alasan terjadinya hit/fault serta identitas halaman yang digantikan.
- **Statistik Real-time**: Menampilkan metrik *Total Hit*, *Total Fault*, dan *Hit Ratio* (%) yang diperbarui seketika.

### 2. Komparasi Antar-Algoritma (Compare)
- **Eksekusi Simultan**: Menjalankan algoritma FIFO, LRU, dan Optimal secara bersamaan pada data masukan dan jumlah frame yang sama.
- **Tabel Evaluasi Kinerja**: Menampilkan perbandingan langsung nilai *Total Hit*, *Total Fault*, dan *Hit Ratio* lengkap dengan lencana (*badge*) penanda performa terbaik.
- **Grafik Komparatif**: Visualisasi diagram batang horizontal untuk jumlah *page fault* berbasis SVG/CSS murni tanpa pustaka diagram eksternal.
- **Kesimpulan Komparasi Otomatis**: Generator narasi berbasis logika evaluasi yang merangkum algoritma paling efisien.
- **Laboratorium Anomali Belady**: Modus khusus untuk mendemonstrasikan fenomena Anomali Belady pada algoritma FIFO (membandingkan performa 3 frame vs 4 frame).

### 3. Mode Tantangan (Quest)
- **Kuis Edukatif Interaktif**: Melatih intuisi pengguna dengan menebak apakah akses halaman pada setiap langkah menghasilkan *Hit* atau *Fault*.
- **Interaksi Pemilihan Frame Korban (*Victim Frame*)**: Jika memori telah penuh dan terjadi *fault*, pengguna ditantang memilih secara langsung frame mana yang harus digantikan sesuai algoritma aktif.
- **Tiga Tingkat Kesulitan**:
  - **Mudah**: Algoritma FIFO, 3 frame, 8 langkah akses.
  - **Sedang**: Algoritma LRU, 3 frame, 12 langkah akses.
  - **Sulit**: Algoritma Optimal, 4 frame, 15 langkah akses.
- **Mekanika Permainan**:
  - Sistem 3 nyawa.
  - Perhitungan skor dinamis berdasarkan ketepatan tebakan.
  - Fitur bantuan (*Hint*) kontekstual untuk membantu saat bimbang.
  - Penyimpanan skor tertinggi (*High Score*) lokal menggunakan `localStorage`.

### 4. Materi Pembelajaran (Learn)
- **Glosarium Konsep Inti**: Penjelasan mendalam mengenai istilah penting seperti *Page Fault*, *Page Hit*, *Frame*, dan *Reference String*.
- **Ulasan Mendalam Algoritma**: Pembahasan cara kerja langkah demi langkah, kelebihan, kekurangan, serta tabel komparasi karakteristik tiap algoritma.

---

## Penjelasan Singkat Algoritma

| Algoritma | Konsep Penggantian | Kelebihan | Kelemahan | Kerentanan Anomali Belady |
| :--- | :--- | :--- | :--- | :---: |
| **FIFO** (*First-In, First-Out*) | Mengganti halaman yang berada paling awal di dalam memori fisik (berdasarkan urutan waktu masuk pertama kali). | Implementasi sangat mudah dan komputasi ringan menggunakan antrean (*queue*). | Tidak mempertimbangkan frekuensi maupun keterkinian akses data; performa sering kali suboptimal. | **Ya** (dapat terjadi) |
| **LRU** (*Least Recently Used*) | Mengganti halaman yang paling lama tidak diakses di masa lalu, bersandar pada prinsip lokalitas waktu (*temporal locality*). | Performa andal dan mendekati optimal pada banyak skenario beban kerja nyata. | Membutuhkan pencatatan riwayat atau waktu akses (*timestamp*) yang menambah beban *overhead*. | **Tidak** |
| **Optimal** (*OPT / Belady's Algorithm*) | Mengganti halaman yang waktu akses berikutnya berada paling jauh di masa depan, atau yang tidak akan digunakan lagi. | Menghasilkan jumlah *page fault* minimum secara matematis untuk kumpulan data tertentu. | Mustahil diimplementasikan pada sistem operasi nyata karena masa depan tidak dapat diketahui secara pasti (*future knowledge*). Berfungsi sebagai tolok ukur (*benchmark*) teoretis. | **Tidak** |

---

## Struktur Folder

Berikut adalah arsitektur dan struktur folder proyek `memory-quest`:

```text
memory-quest/
├── public/                 # Berkas statis publik
├── src/
│   ├── algorithms/         # Pure functions implementasi algoritma & unit tests
│   │   ├── fifo.js         # Logika simulasi algoritma First-In, First-Out
│   │   ├── lru.js          # Logika simulasi algoritma Least Recently Used
│   │   ├── optimal.js      # Logika simulasi algoritma Optimal (Belady)
│   │   ├── index.js        # Entry point export modul algoritma
│   │   └── algorithms.test.js # Unit test Vitest untuk memvalidasi algoritma
│   ├── assets/             # Aset gambar dan ikon aplikasi
│   ├── components/         # Komponen antarmuka modular (UI components)
│   │   ├── Badge.jsx       # Label status dan penanda hasil
│   │   ├── Button.jsx      # Elemen tombol interaktif (primary, secondary, danger)
│   │   ├── Card.jsx        # Komponen kartu kontainer konten
│   │   ├── Field.jsx       # Komponen input teks berserta label & pesan validasi
│   │   ├── FrameTable.jsx  # Tabel visualisasi alokasi frame per langkah
│   │   ├── Navbar.jsx      # Navigasi utama aplikasi
│   │   ├── Select.jsx      # Dropdown pilihan kustom
│   │   └── StatBlock.jsx   # Kartu penampil ringkasan metrik statistik
│   ├── hooks/              # Custom React Hooks
│   │   └── useSimulation.js# Hook pengelola state simulasi dan kontrol playback
│   ├── pages/              # Komponen halaman (Routes)
│   │   ├── Home.jsx        # Halaman selamat datang dan ikhtisar modul
│   │   ├── Simulator.jsx   # Halaman simulasi visual langkah demi langkah
│   │   ├── Compare.jsx     # Halaman komparasi multi-algoritma & Anomali Belady
│   │   ├── Quest.jsx       # Halaman permainan tantangan edukasi interaktif
│   │   └── Learn.jsx       # Halaman materi teori manajemen memori
│   ├── styles/             # Pengaturan tata letak dan desain visual
│   │   ├── tokens.css      # Definisi CSS Variables (warna, spasi, tipografi)
│   │   └── global.css      # Pengaturan reset dasar dan kelas global
│   ├── utils/              # Fungsi utilitas murni pembantu
│   │   ├── parser.js       # Parser dan penormal deretan angka reference string
│   │   ├── validation.js   # Skema validasi masukan angka dan batas frame
│   │   ├── explanation.js  # Generator narasi penjelasan konteks langkah
│   │   └── conclusion.js   # Generator narasi perbandingan kinerja algoritma
│   ├── App.jsx             # Komponen utama dengan konfigurasi React Router
│   └── main.jsx            # Titik masuk utama aplikasi React
├── index.html              # Template berkas HTML utama
├── package.json            # Konfigurasi dependensi dan skrip proyek
├── vite.config.js          # Konfigurasi build dan server Vite
└── eslint.config.js        # Konfigurasi standardisasi kode ESLint
```

---

## Cara Menjalankan

### Prasyarat
Pastikan lingkungan Anda telah terpasang:
- **Node.js** (versi 18.x atau yang lebih baru direkomendasikan)
- **npm** (biasanya disertakan saat instalasi Node.js)

### 1. Masuk ke Direktori Proyek
Buka terminal dan navigasikan ke direktori `memory-quest`:
```bash
cd memory-quest
```

### 2. Instalasi Dependensi
Jalankan perintah berikut untuk mengunduh seluruh pustaka yang diperlukan:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Development)
Untuk menjalankan server lokal dengan fitur *Hot Module Replacement* (HMR):
```bash
npm run dev
```
Setelah server aktif, buka peramban dan akses alamat yang ditampilkan pada terminal (secara baku `http://localhost:5173`).

### 4. Menjalankan Pengujian (Testing)
Untuk memverifikasi kebenaran logika algoritma dan fungsi utilitas melalui unit test Vitest:
```bash
npm test
```

### 5. Memeriksa Kualitas Kode (Linting)
Untuk memastikan kepatuhan terhadap standar kode menggunakan ESLint:
```bash
npm run lint
```

### 6. Membangun Berkas Produksi (Build)
Untuk mengompilasi dan mengoptimasi aplikasi menjadi bundel statis siap rilis:
```bash
npm run build
```
Hasil berkas produksi akan disimpan di direktori `dist/`.

### 7. Menjalankan Pratinjau Build (Preview)
Untuk meninjau hasil bundel produksi secara lokal:
```bash
npm run preview
```
