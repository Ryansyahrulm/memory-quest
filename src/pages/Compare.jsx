import { useState, useMemo } from 'react'
import { Button, Card, Field, Select, Badge, FrameTable } from '../components'
import { simulate as simulateFIFO } from '../algorithms/fifo'
import { simulate as simulateLRU } from '../algorithms/lru'
import { simulate as simulateOptimal } from '../algorithms/optimal'
import { parseReferenceString, PRESET_CLASSIC, PRESET_BELADY } from '../utils/parser'
import './Compare.css'

export default function Compare() {
  const [refStringInput, setRefStringInput] = useState(PRESET_CLASSIC)
  const [frameCount, setFrameCount] = useState(3)
  const [inputError, setInputError] = useState(null)
  const [isBeladyMode, setIsBeladyMode] = useState(false)

  // Eksekusi perbandingan ketiga algoritma secara bersamaan
  const comparisonData = useMemo(() => {
    const { valid, numbers, error } = parseReferenceString(refStringInput)
    if (!valid) {
      return { error, valid: false }
    }

    const count = Math.max(1, Math.min(7, Number(frameCount) || 3))
    const fifoResult = simulateFIFO(numbers, count)
    const lruResult = simulateLRU(numbers, count)
    const optResult = simulateOptimal(numbers, count)

    // Simulasi khusus Anomali Belady jika mode aktif (FIFO 3 vs 4 frame)
    const fifo3 = simulateFIFO(numbers, 3)
    const fifo4 = simulateFIFO(numbers, 4)

    const list = [
      { id: 'Optimal', name: 'Optimal (OPT)', ...optResult },
      { id: 'LRU', name: 'Least Recently Used (LRU)', ...lruResult },
      { id: 'FIFO', name: 'First-In, First-Out (FIFO)', ...fifoResult },
    ]

    // Cari page fault terendah
    const minFault = Math.min(...list.map((item) => item.totalFault))

    // Generator teks kesimpulan otomatis
    let conclusion = `Pada input ini, algoritma Optimal menghasilkan ${optResult.totalFault} page fault (${optResult.hitRatio}% hit ratio), `
    if (optResult.totalFault < lruResult.totalFault && lruResult.totalFault < fifoResult.totalFault) {
      conclusion += `lebih efisien dibandingkan LRU (${lruResult.totalFault} fault) dan FIFO (${fifoResult.totalFault} fault).`
    } else if (lruResult.totalFault === fifoResult.totalFault) {
      conclusion += `sementara LRU dan FIFO menghasilkan jumlah fault yang sama (${lruResult.totalFault} fault).`
    } else {
      conclusion += `sedangkan LRU menghasilkan ${lruResult.totalFault} fault dan FIFO menghasilkan ${fifoResult.totalFault} fault.`
    }

    return {
      valid: true,
      numbers,
      list,
      minFault,
      conclusion,
      fifoResult,
      lruResult,
      optResult,
      belady: {
        fifo3,
        fifo4,
        isAnomaly: fifo4.totalFault > fifo3.totalFault,
      },
    }
  }, [refStringInput, frameCount])

  const handleApplyBelady = () => {
    setRefStringInput(PRESET_BELADY)
    setFrameCount(3)
    setIsBeladyMode(true)
    setInputError(null)
  }

  const handleApplyClassic = () => {
    setRefStringInput(PRESET_CLASSIC)
    setFrameCount(3)
    setIsBeladyMode(false)
    setInputError(null)
  }

  // Hitung nilai maksimum fault untuk skala bar chart
  const maxFaultInChart = useMemo(() => {
    if (!comparisonData.valid) return 1
    const maxVal = Math.max(...comparisonData.list.map((i) => i.totalFault))
    return Math.max(maxVal, 1)
  }, [comparisonData])

  return (
    <div className="compare-layout">
      <header>
        <h1>Bandingkan Algoritma</h1>
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
          Komparasi langsung kinerja FIFO, LRU, dan Optimal pada reference string dan kapasitas memori yang sama.
        </p>
      </header>

      {/* Formulir Input Parameter */}
      <Card className="compare-form-card" title="Parameter Perbandingan">
        <div className="compare-form-grid">
          <Field
            label="Reference String"
            id="compareRefString"
            value={refStringInput}
            onChange={(e) => {
              setRefStringInput(e.target.value)
              setIsBeladyMode(false)
            }}
            placeholder="Contoh: 7 0 1 2 0 3"
            hint="Pisahkan angka dengan spasi atau koma"
            error={comparisonData.valid ? null : comparisonData.error || inputError}
          />

          <Select
            label="Jumlah Frame"
            id="compareFrameCount"
            value={frameCount}
            onChange={(e) => setFrameCount(Number(e.target.value))}
            options={['1', '2', '3', '4', '5', '6', '7'].map((n) => ({
              value: n,
              label: `${n} Frame`,
            }))}
          />

          <div style={{ display: 'flex', gap: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
            <Button variant="secondary" onClick={handleApplyClassic}>
              Contoh Standar
            </Button>
            <Button variant="secondary" onClick={handleApplyBelady}>
              Coba Anomali Belady
            </Button>
          </div>
        </div>

        {/* Informasi Khusus Anomali Belady */}
        {isBeladyMode && comparisonData.valid && (
          <div className="belady-box" style={{ marginTop: 'var(--space-12)' }}>
            <strong>Eksperimen Anomali Belady (FIFO):</strong>
            <p style={{ fontSize: 'var(--font-size-14)' }}>
              Pada algoritma FIFO dengan string <code>{PRESET_BELADY}</code>:
              <br />
              • Dengan <strong>3 Frame</strong>: menghasilkan <strong>{comparisonData.belady.fifo3.totalFault} Page Fault</strong>.
              <br />
              • Dengan <strong>4 Frame</strong>: menghasilkan <strong>{comparisonData.belady.fifo4.totalFault} Page Fault</strong>!
            </p>
            <p style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-muted)' }}>
              Menambah kapasitas frame dari 3 menjadi 4 justru meningkatkan page fault dari 9 ke 10. Fenomena ini membuktikan bahwa algoritma FIFO tidak memiliki properti stack.
            </p>
          </div>
        )}
      </Card>

      {comparisonData.valid && (
        <>
          {/* 1. Tabel Perbandingan Kinerja */}
          <Card title="Tabel Perbandingan Kinerja" description="Evaluasi total hit, page fault, dan hit ratio ketiga algoritma.">
            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th scope="col">Algoritma</th>
                    <th scope="col">Page Hit</th>
                    <th scope="col">Page Fault</th>
                    <th scope="col">Hit Ratio</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.list.map((row) => {
                    const isBest = row.totalFault === comparisonData.minFault
                    return (
                      <tr key={row.id} className={isBest ? 'best-row' : ''}>
                        <td>
                          <strong>{row.name}</strong>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{row.totalHit}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.totalFault}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{row.hitRatio}%</td>
                        <td>
                          {isBest ? (
                            <Badge variant="hit">Terbaik</Badge>
                          ) : (
                            <Badge variant="neutral">—</Badge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 2. Visualisasi Grafik Batang Horizontal (CSS/SVG Murni) */}
          <Card title="Perbandingan Page Fault" description="Grafik batang horizontal perbandingan jumlah kegagalan halaman (semakin sedikit semakin baik).">
            <div className="chart-container" role="img" aria-label="Grafik perbandingan page fault">
              {comparisonData.list.map((row) => {
                const percent = (row.totalFault / maxFaultInChart) * 100
                const isBest = row.totalFault === comparisonData.minFault

                return (
                  <div key={row.id} className="chart-row">
                    <span className="chart-label">{row.id}</span>
                    <div className="chart-bar-track">
                      <div
                        className={`chart-bar-fill ${isBest ? 'is-best' : ''}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="chart-value">{row.totalFault}</span>
                  </div>
                )
              })}

              <div className="chart-axis">
                <span />
                <div className="chart-axis-ticks">
                  <span>0</span>
                  <span>{Math.round(maxFaultInChart / 2)}</span>
                  <span>{maxFaultInChart} (Fault)</span>
                </div>
                <span />
              </div>
            </div>
          </Card>

          {/* 3. Kesimpulan Otomatis */}
          <div className="conclusion-box" aria-live="polite">
            <strong>Kesimpulan Analisis:</strong>
            <p style={{ marginTop: 'var(--space-4)' }}>{comparisonData.conclusion}</p>
          </div>

          {/* 4. Tiga Tabel Langkah Bersebelahan / Bertumpuk */}
          <Card title="Detail Pergantian Frame Tiap Algoritma" description="Perbandingan langkah per langkah isi memori antara FIFO, LRU, dan Optimal.">
            <div className="side-by-side-tables">
              {comparisonData.list.map((row) => (
                <div key={row.id} className="algorithm-subtable">
                  <div className="algorithm-subtable-header">
                    <h3 style={{ fontSize: 'var(--font-size-14)' }}>
                      {row.name} ({row.totalFault} Fault, {row.totalHit} Hit)
                    </h3>
                    {row.totalFault === comparisonData.minFault && (
                      <Badge variant="hit">Fault Terendah</Badge>
                    )}
                  </div>
                  <FrameTable
                    steps={row.steps}
                    frameCount={frameCount}
                    caption={`Visualisasi langkah ${row.name}`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
