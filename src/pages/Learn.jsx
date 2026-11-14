import './Learn.css'

export default function Learn() {
  return (
    <div className="learn-container">
      <header>
        <h1>Materi Manajemen Memori & Page Replacement</h1>
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
          Ringkasan konsep dasar virtual memory dan algoritma pergantian halaman.
        </p>
      </header>

      {/* Bagian 1: Konsep Dasar */}
      <section className="learn-section">
        <h2>1. Konsep Dasar</h2>
        <dl className="concept-dl">
          <div className="concept-dl-item">
            <dt className="concept-dt">Page Fault</dt>
            <dd className="concept-dd">
              Kondisi saat halaman yang dibutuhkan prosesor belum ada di frame RAM. Sistem operasi harus mengambilnya dari storage sekunder, sehingga terjadi interupsi dan proses melambat.
            </dd>
          </div>
          <div className="concept-dl-item">
            <dt className="concept-dt">Page Hit</dt>
            <dd className="concept-dd">
              Kondisi saat halaman yang diminta sudah ada di salah satu frame RAM. Akses berlangsung langsung tanpa interupsi I/O.
            </dd>
          </div>
          <div className="concept-dl-item">
            <dt className="concept-dt">Frame</dt>
            <dd className="concept-dd">
              Slot memori fisik (RAM) berukuran tetap. Setiap frame menampung tepat satu halaman (page) dari memori virtual.
            </dd>
          </div>
          <div className="concept-dl-item">
            <dt className="concept-dt">Reference String</dt>
            <dd className="concept-dd">
              Urutan nomor halaman yang diakses proses dari waktu ke waktu. Contoh: <code className="concept-code">1, 2, 3, 4, 1, 2, 5</code>. Digunakan sebagai input simulasi algoritma.
            </dd>
          </div>
        </dl>
      </section>

      {/* Bagian 2: Algoritma FIFO */}
      <section className="learn-section">
        <h2>2. Algoritma First-In, First-Out (FIFO)</h2>
        <div className="algo-learn-card">
          <div className="algo-header">
            <p><strong>Prinsip Kerja:</strong> Halaman yang paling awal masuk ke memori fisik akan menjadi halaman pertama yang dikeluarkan saat terjadi page fault dan seluruh frame penuh.</p>
          </div>

          <div className="algo-pro-con-grid">
            <div>
              <strong>Kelebihan:</strong>
              <ul className="pro-list">
                <li>Struktur data sederhana menggunakan antrean (queue).</li>
                <li>Overhead komputasi sangat rendah tanpa perlu mencatat riwayat akses.</li>
              </ul>
            </div>
            <div>
              <strong>Kekurangan:</strong>
              <ul className="con-list">
                <li>Dapat menggantikan halaman penting yang sering digunakan hanya karena masuk lebih dulu.</li>
                <li>Rentan terhadap Anomali Belady (penambahan frame bisa menambah jumlah fault).</li>
              </ul>
            </div>
          </div>

          <div>
            <strong>Contoh Mini (3 Frame, Ref: 1, 2, 3, 4, 1):</strong>
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
                    <td>Fault</td>
                    <td>Fault</td>
                    <td>Fault</td>
                    <td>Fault</td>
                    <td>Fault</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian 3: Algoritma LRU */}
      <section className="learn-section">
        <h2>3. Algoritma Least Recently Used (LRU)</h2>
        <div className="algo-learn-card">
          <div className="algo-header">
            <p><strong>Prinsip Kerja:</strong> Menggantikan halaman yang paling lama tidak diakses di masa lampau, berdasarkan prinsip lokalitas waktu (temporal locality).</p>
          </div>

          <div className="algo-pro-con-grid">
            <div>
              <strong>Kelebihan:</strong>
              <ul className="pro-list">
                <li>Performa mendekati optimal pada beban kerja umum di dunia nyata.</li>
                <li>Kebal dari Anomali Belady karena tergolong dalam kelas algoritma stack.</li>
              </ul>
            </div>
            <div>
              <strong>Kekurangan:</strong>
              <ul className="con-list">
                <li>Membutuhkan dukungan hardware khusus (counter waktu atau stack dinamis).</li>
                <li>Overhead pemeliharaan catatan akses relatif lebih tinggi dibandingkan FIFO.</li>
              </ul>
            </div>
          </div>

          <div>
            <strong>Contoh Mini (3 Frame, Ref: 1, 2, 3, 2, 4):</strong>
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
                    <td>Fault</td>
                    <td>Fault</td>
                    <td>Fault</td>
                    <td>Hit</td>
                    <td>Fault (1 diganti)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian 4: Algoritma Optimal */}
      <section className="learn-section">
        <h2>4. Algoritma Optimal (OPT / Belady)</h2>
        <div className="algo-learn-card">
          <div className="algo-header">
            <p><strong>Prinsip Kerja:</strong> Menggantikan halaman yang waktu pemakaian berikutnya paling jauh di masa depan, atau yang tidak akan digunakan lagi.</p>
          </div>

          <div className="algo-pro-con-grid">
            <div>
              <strong>Kelebihan:</strong>
              <ul className="pro-list">
                <li>Menghasilkan jumlah page fault paling minimal secara matematis untuk kapasitas frame tertentu.</li>
                <li>Bebas dari Anomali Belady.</li>
              </ul>
            </div>
            <div>
              <strong>Kekurangan:</strong>
              <ul className="con-list">
                <li>Mustahil diterapkan secara nyata pada sistem operasi umum karena masa depan proses tidak dapat diketahui pasti.</li>
                <li>Hanya digunakan sebagai batas atas teoretis dan standar evaluasi (benchmark) algoritma lain.</li>
              </ul>
            </div>
          </div>

          <div>
            <strong>Contoh Mini (3 Frame, Ref: 1, 2, 3, 2, 4):</strong>
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
                    <td>Fault</td>
                    <td>Fault</td>
                    <td>Fault</td>
                    <td>Hit</td>
                    <td>Fault (3 diganti)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
