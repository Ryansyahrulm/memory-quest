import './Learn.css'

export default function Learn() {
  return (
    <div className="learn-container">
      <header>
        <h1>Materi Manajemen Memori &amp; Page Replacement</h1>
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
          Ringkasan konsep dasar virtual memory dan algoritma pergantian halaman.
        </p>
      </header>

      {/* Bagian 1: Konsep Dasar */}
      <section className="learn-section">
        <h2>1. Konsep Dasar</h2>
        <dl className="learn-glossary">
          <div className="glossary-item">
            <dt>Page Fault</dt>
            <dd>
              Halaman yang diminta prosesor belum ada di memori fisik. Sistem operasi harus
              memuatnya dari storage sekunder (swap/pagefile), sehingga akses tertunda.
            </dd>
          </div>
          <div className="glossary-item">
            <dt>Page Hit</dt>
            <dd>
              Halaman yang diminta sudah berada di salah satu frame RAM. Akses dapat langsung
              dilayani tanpa operasi I/O.
            </dd>
          </div>
          <div className="glossary-item">
            <dt>Frame</dt>
            <dd>
              Slot penyimpanan pada RAM berukuran tetap. Setiap frame menampung tepat satu
              halaman (page) memori virtual. Jumlah frame menentukan kapasitas memori fisik
              yang tersedia untuk proses.
            </dd>
          </div>
          <div className="glossary-item">
            <dt>Reference String</dt>
            <dd>
              Urutan nomor halaman yang diakses proses dari waktu ke waktu selama program
              berjalan. Digunakan sebagai masukan simulasi algoritma page replacement.
            </dd>
          </div>
        </dl>
      </section>

      {/* Bagian 2: Algoritma FIFO */}
      <section className="learn-section">
        <h2>2. Algoritma First-In, First-Out (FIFO)</h2>
        <div className="algo-learn-card">
          <div className="algo-header">
            <p>
              <strong>Cara Kerja:</strong> Halaman yang paling awal masuk ke memori akan
              dikeluarkan pertama kali saat terjadi page fault dan seluruh frame penuh.
              Urutan masuk dilacak menggunakan antrean (queue).
            </p>
          </div>

          <div className="algo-pro-con-grid">
            <div>
              <strong>Kelebihan:</strong>
              <ul className="pro-list">
                <li>Implementasi sederhana menggunakan struktur data antrean.</li>
                <li>Overhead komputasi rendah; tidak perlu mencatat riwayat akses.</li>
              </ul>
            </div>
            <div>
              <strong>Kekurangan:</strong>
              <ul className="con-list">
                <li>Dapat menggantikan halaman penting yang sering dipakai karena masuk lebih dulu.</li>
                <li>Rentan terhadap Anomali Belady: menambah frame bisa meningkatkan jumlah page fault.</li>
              </ul>
            </div>
          </div>

          <div>
            <strong>Contoh Mini &mdash; 3 Frame, Ref: 1 2 3 4 1</strong>
            <div className="static-table-wrapper">
              <table className="static-table">
                <thead>
                  <tr>
                    <th scope="col">Ref</th>
                    <th scope="col">1</th>
                    <th scope="col">2</th>
                    <th scope="col">3</th>
                    <th scope="col">4</th>
                    <th scope="col">1</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">F1</th>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td className="static-fault">4</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <th scope="row">F2</th>
                    <td>—</td>
                    <td>2</td>
                    <td>2</td>
                    <td>2</td>
                    <td className="static-fault">1</td>
                  </tr>
                  <tr>
                    <th scope="row">F3</th>
                    <td>—</td>
                    <td>—</td>
                    <td>3</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <th scope="row">Hasil</th>
                    <td className="static-fault">Fault</td>
                    <td className="static-fault">Fault</td>
                    <td className="static-fault">Fault</td>
                    <td className="static-fault">Fault</td>
                    <td className="static-fault">Fault</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="table-note">Total: 5 page fault. Halaman 1 dikeluarkan saat referensi ke-4, lalu diminta lagi di referensi ke-5 sehingga terjadi fault kembali.</p>
          </div>
        </div>
      </section>

      {/* Bagian 3: Algoritma LRU */}
      <section className="learn-section">
        <h2>3. Algoritma Least Recently Used (LRU)</h2>
        <div className="algo-learn-card">
          <div className="algo-header">
            <p>
              <strong>Cara Kerja:</strong> Halaman yang paling lama tidak diakses akan dikeluarkan
              saat terjadi page fault. Algoritma ini menerapkan prinsip lokalitas waktu
              (temporal locality): halaman yang baru dipakai kemungkinan besar akan dipakai lagi.
            </p>
          </div>

          <div className="algo-pro-con-grid">
            <div>
              <strong>Kelebihan:</strong>
              <ul className="pro-list">
                <li>Performa mendekati optimal pada beban kerja umum.</li>
                <li>Kebal dari Anomali Belady; tergolong kelas algoritma stack.</li>
              </ul>
            </div>
            <div>
              <strong>Kekurangan:</strong>
              <ul className="con-list">
                <li>Membutuhkan pencatatan waktu akses setiap halaman (counter atau stack).</li>
                <li>Overhead implementasi lebih tinggi dibandingkan FIFO.</li>
              </ul>
            </div>
          </div>

          <div>
            <strong>Contoh Mini &mdash; 3 Frame, Ref: 1 2 3 2 4</strong>
            <div className="static-table-wrapper">
              <table className="static-table">
                <thead>
                  <tr>
                    <th scope="col">Ref</th>
                    <th scope="col">1</th>
                    <th scope="col">2</th>
                    <th scope="col">3</th>
                    <th scope="col">2</th>
                    <th scope="col">4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">F1</th>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td className="static-fault">4</td>
                  </tr>
                  <tr>
                    <th scope="row">F2</th>
                    <td>—</td>
                    <td>2</td>
                    <td>2</td>
                    <td className="static-hit">2</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <th scope="row">F3</th>
                    <td>—</td>
                    <td>—</td>
                    <td>3</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <th scope="row">Hasil</th>
                    <td className="static-fault">Fault</td>
                    <td className="static-fault">Fault</td>
                    <td className="static-fault">Fault</td>
                    <td className="static-hit">Hit</td>
                    <td className="static-fault">Fault</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="table-note">Total: 4 fault, 1 hit. Referensi ke-5 (halaman 4): halaman 1 dikeluarkan karena paling lama tidak diakses (terakhir dipakai di referensi ke-1).</p>
          </div>
        </div>
      </section>

      {/* Bagian 4: Algoritma Optimal */}
      <section className="learn-section">
        <h2>4. Algoritma Optimal (OPT / Belady)</h2>
        <div className="algo-learn-card">
          <div className="algo-header">
            <p>
              <strong>Cara Kerja:</strong> Halaman yang waktu pemakaian berikutnya paling jauh
              di masa depan &mdash; atau tidak akan digunakan lagi &mdash; dipilih untuk dikeluarkan.
              Algoritma ini memerlukan pengetahuan penuh atas urutan referensi mendatang.
            </p>
          </div>

          <div className="algo-pro-con-grid">
            <div>
              <strong>Kelebihan:</strong>
              <ul className="pro-list">
                <li>Menghasilkan jumlah page fault minimum untuk kapasitas frame tertentu.</li>
                <li>Bebas dari Anomali Belady.</li>
              </ul>
            </div>
            <div>
              <strong>Kekurangan:</strong>
              <ul className="con-list">
                <li>Tidak dapat diterapkan pada sistem nyata karena urutan akses masa depan tidak diketahui saat runtime.</li>
                <li>Hanya digunakan sebagai tolok ukur (benchmark) untuk mengevaluasi algoritma lain.</li>
              </ul>
            </div>
          </div>

          <div>
            <strong>Contoh Mini &mdash; 3 Frame, Ref: 1 2 3 2 4</strong>
            <div className="static-table-wrapper">
              <table className="static-table">
                <thead>
                  <tr>
                    <th scope="col">Ref</th>
                    <th scope="col">1</th>
                    <th scope="col">2</th>
                    <th scope="col">3</th>
                    <th scope="col">2</th>
                    <th scope="col">4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">F1</th>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <th scope="row">F2</th>
                    <td>—</td>
                    <td>2</td>
                    <td>2</td>
                    <td className="static-hit">2</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <th scope="row">F3</th>
                    <td>—</td>
                    <td>—</td>
                    <td>3</td>
                    <td>3</td>
                    <td className="static-fault">4</td>
                  </tr>
                  <tr>
                    <th scope="row">Hasil</th>
                    <td className="static-fault">Fault</td>
                    <td className="static-fault">Fault</td>
                    <td className="static-fault">Fault</td>
                    <td className="static-hit">Hit</td>
                    <td className="static-fault">Fault</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="table-note">Total: 4 fault, 1 hit. Referensi ke-5 (halaman 4): halaman 3 dikeluarkan karena tidak akan dipakai lagi, sedangkan halaman 1 dan 2 masih akan diakses.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
