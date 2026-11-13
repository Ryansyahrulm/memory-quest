import { useState } from 'react'
import { Card, Button, Field, Select, Badge, FrameTable } from '../components'
import { FIFO, LRU, Optimal } from '../algorithms'
import {
  validateReferenceString,
  generateRandomReferenceString,
  generateComparisonConclusion,
  BELADY_REFERENCE_STRING,
} from '../utils'
import './Compare.css'

const INITIAL_REF_STRING = '7 0 1 2 0 3 0 4 2 3'
const INITIAL_PAGES = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3]

const FRAME_OPTIONS = [1, 2, 3, 4, 5, 6, 7].map((num) => ({
  value: String(num),
  label: `${num} Frame`,
}))

function runAllAlgorithms(pages, frameCount) {
  return {
    FIFO: FIFO.simulate(pages, frameCount),
    LRU: LRU.simulate(pages, frameCount),
    Optimal: Optimal.simulate(pages, frameCount),
  }
}

export default function Compare() {
  const [refString, setRefString] = useState(INITIAL_REF_STRING)
  const [frameCount, setFrameCount] = useState('3')
  const [errorMessage, setErrorMessage] = useState('')
  const [isBeladyActive, setIsBeladyActive] = useState(false)

  // Inisialisasi hasil langsung secara lazy tanpa cascading effect
  const [results, setResults] = useState(() => runAllAlgorithms(INITIAL_PAGES, 3))
  const [activeConfig, setActiveConfig] = useState({
    pages: INITIAL_PAGES,
    frameCount: 3,
  })

  const executeComparison = (pages, frames) => {
    const newResults = runAllAlgorithms(pages, frames)
    setResults(newResults)
    setActiveConfig({ pages, frameCount: frames })
  }

  const handleRefStringChange = (e) => {
    const value = e.target.value
    setRefString(value)
    setIsBeladyActive(value.trim() === BELADY_REFERENCE_STRING)

    if (errorMessage) {
      const validation = validateReferenceString(value)
      if (validation.isValid) {
        setErrorMessage('')
      }
    }
  }

  const handleFillExample = () => {
    setRefString(INITIAL_REF_STRING)
    setErrorMessage('')
    setIsBeladyActive(false)
    const validation = validateReferenceString(INITIAL_REF_STRING)
    if (validation.isValid) {
      executeComparison(validation.pages, Number(frameCount))
    }
  }

  const handleRandomize = () => {
    const randomString = generateRandomReferenceString(12, 7)
    setRefString(randomString)
    setErrorMessage('')
    setIsBeladyActive(false)
    const validation = validateReferenceString(randomString)
    if (validation.isValid) {
      executeComparison(validation.pages, Number(frameCount))
    }
  }

  const handleBelady = () => {
    setRefString(BELADY_REFERENCE_STRING)
    setErrorMessage('')
    setIsBeladyActive(true)
    const validation = validateReferenceString(BELADY_REFERENCE_STRING)
    if (validation.isValid) {
      executeComparison(validation.pages, Number(frameCount))
    }
  }

  const handleRun = (e) => {
    if (e) e.preventDefault()

    const validation = validateReferenceString(refString)
    if (!validation.isValid) {
      setErrorMessage(validation.error)
      return
    }

    setErrorMessage('')
    executeComparison(validation.pages, Number(frameCount))
  }

  // Tentukan algoritma terbaik (fault paling sedikit)
  const minFault = results
    ? Math.min(
        results.FIFO.totalFault,
        results.LRU.totalFault,
        results.Optimal.totalFault
      )
    : 0

  const maxFault = results
    ? Math.max(
        results.FIFO.totalFault,
        results.LRU.totalFault,
        results.Optimal.totalFault,
        1
      )
    : 1

  const conclusionText = results ? generateComparisonConclusion(results) : ''

  const comparisonRows = results
    ? [
        {
          key: 'FIFO',
          name: 'First-In, First-Out (FIFO)',
          shortName: 'FIFO',
          totalHit: results.FIFO.totalHit,
          totalFault: results.FIFO.totalFault,
          hitRatio: results.FIFO.hitRatio,
          isBest: results.FIFO.totalFault === minFault,
        },
        {
          key: 'LRU',
          name: 'Least Recently Used (LRU)',
          shortName: 'LRU',
          totalHit: results.LRU.totalHit,
          totalFault: results.LRU.totalFault,
          hitRatio: results.LRU.hitRatio,
          isBest: results.LRU.totalFault === minFault,
        },
        {
          key: 'Optimal',
          name: 'Optimal (Belady OPT)',
          shortName: 'Optimal',
          totalHit: results.Optimal.totalHit,
          totalFault: results.Optimal.totalFault,
          hitRatio: results.Optimal.hitRatio,
          isBest: results.Optimal.totalFault === minFault,
        },
      ]
    : []

  return (
    <div className="compare-container">
      <header className="compare-header">
        <h1>Bandingkan Algoritma</h1>
        <p>
          Analisis perbandingan performa page fault dan hit antar algoritma FIFO, LRU, dan Optimal secara simultan.
        </p>
      </header>

      {/* Panel Parameter Input */}
      <Card title="Parameter Komparasi">
        <form className="compare-form" onSubmit={handleRun}>
          <div className="compare-input-row">
            <div>
              <Field
                label="Reference String"
                id="compare-ref-string"
                value={refString}
                onChange={handleRefStringChange}
                error={errorMessage}
                hint="Pisahkan angka dengan spasi atau koma (maks. 30 halaman, angka 0-99)"
                placeholder="Contoh: 7 0 1 2 0 3 0 4 2 3"
              />
              <div className="compare-actions">
                <Button variant="secondary" onClick={handleFillExample}>
                  Isi contoh
                </Button>
                <Button variant="secondary" onClick={handleRandomize}>
                  Acak
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleBelady}
                  className="belady-btn"
                  title="Isi reference string Anomali Belady (1 2 3 4 1 2 5 1 2 3 4 5)"
                >
                  Coba Anomali Belady
                </Button>
              </div>
            </div>

            <Select
              label="Jumlah Frame"
              id="compare-frame-count"
              value={frameCount}
              onChange={(e) => setFrameCount(e.target.value)}
              options={FRAME_OPTIONS}
              hint="Alokasi frame untuk ketiga algoritma"
            />

            <div>
              <Button type="submit" variant="primary">
                Bandingkan
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Informasi Anomali Belady */}
      {isBeladyActive && (
        <aside className="belady-callout" role="note">
          <strong>Eksperimen Anomali Belady:</strong> Pada reference string ini, perhatikan algoritma FIFO!
          Saat menggunakan <strong>3 Frame</strong>, FIFO menghasilkan <strong>9 fault</strong>.
          Namun jika Anda mengubah jumlah frame menjadi <strong>4 Frame</strong>, FIFO justru mengalami <strong>10 fault</strong> (meningkat).
          Algoritma LRU dan Optimal kebal terhadap anomali ini (stack algorithm).
        </aside>
      )}

      {/* 1. Tabel Perbandingan & 2. Bar Chart Horizontal */}
      {results && (
        <>
          <section aria-labelledby="comparison-summary-title">
            <Card title="Ringkasan Performa Komparasi" id="comparison-summary-title">
              <div className="compare-overview-grid">
                {/* 1. Tabel Perbandingan */}
                <div>
                  <div className="comparison-table-wrapper">
                    <table className="comparison-table" aria-label="Tabel ringkasan perbandingan algoritma">
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
                        {comparisonRows.map((row) => (
                          <tr
                            key={row.key}
                            className={row.isBest ? 'row-best' : ''}
                          >
                            <td>
                              <strong>{row.name}</strong>
                            </td>
                            <td className="num-cell hit-cell">{row.totalHit}</td>
                            <td className="num-cell fault-cell">{row.totalFault}</td>
                            <td className="num-cell">{row.hitRatio}%</td>
                            <td>
                              {row.isBest ? (
                                <Badge variant="hit">Terbaik</Badge>
                              ) : (
                                <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Bar Chart Horizontal Sederhana (Manual CSS/SVG) */}
                <div>
                  <div
                    className="barchart-container"
                    role="img"
                    aria-label="Grafik batang horizontal jumlah page fault"
                  >
                    <div className="barchart-title">
                      Perbandingan Jumlah Page Fault (Lebih sedikit lebih baik)
                    </div>
                    {comparisonRows.map((row) => {
                      const barPercentage = Math.max(
                        10,
                        Number(((row.totalFault / maxFault) * 100).toFixed(1))
                      )
                      return (
                        <div key={row.key} className="barchart-row">
                          <div className="barchart-label">
                            <span>
                              <strong>{row.shortName}</strong>
                            </span>
                            {row.isBest && <Badge variant="hit">Terbaik</Badge>}
                          </div>
                          <div className="barchart-track">
                            <div
                              className={`barchart-bar ${row.isBest ? 'bar-best' : ''}`}
                              style={{ width: `${barPercentage}%` }}
                            />
                            <span className="barchart-value-label">
                              {row.totalFault} fault
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* 4. Satu Paragraf Kesimpulan Otomatis */}
          <section aria-labelledby="conclusion-title">
            <Card title="Kesimpulan Analisis" id="conclusion-title">
              <div className="compare-conclusion-box" role="status">
                <p>
                  <strong>Kesimpulan:</strong> {conclusionText}
                </p>
              </div>
            </Card>
          </section>

          {/* 3. Tiga Tabel Langkah Bersebelahan */}
          <section aria-labelledby="step-tables-title">
            <Card
              title="Perbandingan Langkah Frame Tiap Algoritma"
              id="step-tables-title"
              description="Tiga tabel ditampilkan bersebelahan agar pergantian halaman tiap algoritma mudah dibandingkan. Pada layar kecil, tabel ditampilkan bertumpuk."
            >
              <div className="compare-step-tables-list">
                {/* Tabel Optimal */}
                <div className="compare-step-table-card">
                  <header className="compare-step-table-header">
                    <span className="compare-step-table-title">
                      Optimal (OPT)
                    </span>
                    <div className="compare-step-table-meta">
                      <Badge
                        variant={
                          results.Optimal.totalFault === minFault
                            ? 'hit'
                            : 'neutral'
                        }
                      >
                        {results.Optimal.totalFault} Fault
                      </Badge>
                      <span className="compare-ratio-text">
                        {results.Optimal.hitRatio}% Hit
                      </span>
                    </div>
                  </header>
                  <FrameTable
                    steps={results.Optimal.steps}
                    frameCount={activeConfig.frameCount}
                  />
                </div>

                {/* Tabel LRU */}
                <div className="compare-step-table-card">
                  <header className="compare-step-table-header">
                    <span className="compare-step-table-title">
                      LRU
                    </span>
                    <div className="compare-step-table-meta">
                      <Badge
                        variant={
                          results.LRU.totalFault === minFault
                            ? 'hit'
                            : 'neutral'
                        }
                      >
                        {results.LRU.totalFault} Fault
                      </Badge>
                      <span className="compare-ratio-text">
                        {results.LRU.hitRatio}% Hit
                      </span>
                    </div>
                  </header>
                  <FrameTable
                    steps={results.LRU.steps}
                    frameCount={activeConfig.frameCount}
                  />
                </div>

                {/* Tabel FIFO */}
                <div className="compare-step-table-card">
                  <header className="compare-step-table-header">
                    <span className="compare-step-table-title">
                      FIFO
                    </span>
                    <div className="compare-step-table-meta">
                      <Badge
                        variant={
                          results.FIFO.totalFault === minFault
                            ? 'hit'
                            : 'neutral'
                        }
                      >
                        {results.FIFO.totalFault} Fault
                      </Badge>
                      <span className="compare-ratio-text">
                        {results.FIFO.hitRatio}% Hit
                      </span>
                    </div>
                  </header>
                  <FrameTable
                    steps={results.FIFO.steps}
                    frameCount={activeConfig.frameCount}
                  />
                </div>
              </div>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
