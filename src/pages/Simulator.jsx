import { useState } from 'react'
import { Button, Card, Field, Select, Badge, StatBlock } from '../components'

export default function Simulator() {
  const [refString, setRefString] = useState('7 0 1 2 0 3')
  const [frameCount, setFrameCount] = useState('3')
  const [algorithm, setAlgorithm] = useState('FIFO')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      <header>
        <h1>Komponen Dasar UI (Halaman Sementara)</h1>
        <p style={{ marginTop: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          Halaman tinjauan komponen dasar untuk verifikasi visual desain token, state interaktif, dan aksesibilitas.
        </p>
      </header>

      {/* 1. Tombol (Button) */}
      <Card title="1. Button (Tombol)" description="Varian primary dan secondary dengan state hover, focus, dan disabled.">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-12)' }}>
          <Button variant="primary">Primary Normal</Button>
          <Button variant="primary" disabled>Primary Disabled</Button>
          <Button variant="secondary">Secondary Normal</Button>
          <Button variant="secondary" disabled>Secondary Disabled</Button>
        </div>
      </Card>

      {/* 2. Form Fields (Field & Select) */}
      <Card title="2. Input & Field" description="Field dengan label, hint, validasi error, dan state disabled.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-16)' }}>
          <Field
            label="Reference String (Normal)"
            value={refString}
            onChange={(e) => setRefString(e.target.value)}
            hint="Pisahkan angka dengan spasi atau koma"
          />
          <Field
            label="Input Error (Validasi)"
            value="abc 12 999"
            readOnly
            error="Hanya angka 0-99 yang diperbolehkan"
          />
          <Field
            label="Input Nonaktif (Disabled)"
            value="Nilai tetap"
            disabled
            hint="Field ini sedang dinonaktifkan"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-16)', marginTop: 'var(--space-12)' }}>
          <Select
            label="Pilihan Algoritma"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            options={[
              { value: 'FIFO', label: 'First-In, First-Out (FIFO)' },
              { value: 'LRU', label: 'Least Recently Used (LRU)' },
              { value: 'Optimal', label: 'Optimal (Belady)' },
            ]}
            hint="Pilih strategi penggantian frame"
          />
          <Select
            label="Jumlah Frame"
            value={frameCount}
            onChange={(e) => setFrameCount(e.target.value)}
            options={['1', '2', '3', '4', '5', '6', '7'].map((n) => ({ value: n, label: `${n} Frame` }))}
          />
          <Select
            label="Select Nonaktif (Disabled)"
            disabled
            value="locked"
            options={[{ value: 'locked', label: 'Terkunci' }]}
            hint="Pilihan tidak dapat diubah"
          />
        </div>
      </Card>

      {/* 3. Badge Status */}
      <Card title="3. Badge Status" description="Indikator status Hit (hijau), Fault (merah), dan informasi netral.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <Badge variant="hit">Page Hit</Badge>
          <Badge variant="fault">Page Fault</Badge>
          <Badge variant="neutral">Netral: 3 Frame</Badge>
          <Badge variant="neutral">Algoritma: FIFO</Badge>
        </div>
      </Card>

      {/* 4. StatBlock */}
      <Card title="4. StatBlock (Statistik)" description="Tampilan metrik dengan angka besar proporsional mono dan label penjelas.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-12)' }}>
          <StatBlock label="Total Hit" value={5} variant="hit" description="Halaman ditemukan" />
          <StatBlock label="Total Fault" value={15} variant="fault" description="Pergantian halaman" />
          <StatBlock label="Hit Ratio" value="25.0%" variant="accent" description="Tingkat keberhasilan" />
          <StatBlock label="Total Langkah" value={20} variant="default" description="Akses referensi" />
        </div>
      </Card>
    </div>
  )
}
