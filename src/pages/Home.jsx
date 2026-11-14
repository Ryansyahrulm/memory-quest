import { Link } from 'react-router-dom'
import { Button } from '../components'

export default function Home() {
  return (
    <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      <header>
        <h1 style={{ fontSize: 'var(--font-size-28)', fontWeight: 600 }}>Memory Quest</h1>
        <p style={{ marginTop: 'var(--space-8)', fontSize: 'var(--font-size-16)', lineHeight: 1.6, color: 'var(--color-text)' }}>
          Game edukasi simulasi manajemen memori (page replacement) berbasis web untuk mahasiswa mata kuliah Sistem Operasi.
        </p>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-12)' }}>
        <Link to="/simulator" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Mulai Simulasi</Button>
        </Link>
        <Link to="/quest" style={{ textDecoration: 'none' }}>
          <Button variant="secondary">Main Quest</Button>
        </Link>
      </div>

      <section style={{ marginTop: 'var(--space-8)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-20)' }}>
        <h2 style={{ fontSize: 'var(--font-size-16)', marginBottom: 'var(--space-12)' }}>
          Cakupan Aplikasi:
        </h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--space-24)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', color: 'var(--color-text)', lineHeight: 1.6 }}>
          <li>
            Visualisasi interaktif pergantian halaman langkah demi langkah pada algoritma FIFO, LRU, dan Optimal.
          </li>
          <li>
            Komparasi matriks performa page fault, page hit, grafik rasio, serta demonstrasi Anomali Belady.
          </li>
          <li>
            Tantangan interaktif untuk menguji pemahaman pergantian frame memori virtual dengan sistem penilaian objektif.
          </li>
        </ul>
      </section>
    </div>
  )
}
