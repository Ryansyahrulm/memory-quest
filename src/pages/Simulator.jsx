import { useState } from 'react'
import { useSimulation } from '../hooks/useSimulation'
import { Button, Card, Field, Select, StatBlock, FrameTable } from '../components'
import './Simulator.css'

export default function Simulator() {
  const {
    refStringInput,
    setRefStringInput,
    frameCount,
    setFrameCount,
    algorithmId,
    setAlgorithmId,
    inputError,
    runSimulation,
    fillClassic,
    randomize,
    result,
    currentStepIndex,
    currentExplanation,
    isPlaying,
    speed,
    setSpeed,
    nextStep,
    prevStep,
    resetPlayback,
    togglePlay,
  } = useSimulation()

  const [limitToCurrentStep, setLimitToCurrentStep] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    runSimulation()
  }

  const totalSteps = result?.steps?.length || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
      <header>
        <h1>Simulasi Manajemen Memori</h1>
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
          Visualisasi pergantian halaman (page replacement) berbasis langkah demi langkah.
        </p>
      </header>

      <div className="simulator-layout">
        {/* Panel Kiri: Form Input Parameter */}
        <aside>
          <Card title="Parameter Simulasi" description="Konfigurasikan reference string, jumlah frame, dan algoritma.">
            <form onSubmit={handleSubmit} className="simulator-form" noValidate>
              <Field
                label="Reference String"
                id="refString"
                value={refStringInput}
                onChange={(e) => setRefStringInput(e.target.value)}
                placeholder="Contoh: 7 0 1 2 0 3"
                hint="Maks. 30 angka (0-99), pisahkan spasi atau koma"
                error={inputError}
                required
              />

              <div className="simulator-quick-buttons">
                <Button variant="secondary" onClick={fillClassic} type="button" style={{ fontSize: 'var(--font-size-12)', padding: '4px 8px' }}>
                  Isi contoh
                </Button>
                <Button variant="secondary" onClick={randomize} type="button" style={{ fontSize: 'var(--font-size-12)', padding: '4px 8px' }}>
                  Acak
                </Button>
              </div>

              <Select
                label="Jumlah Frame"
                id="frameCount"
                value={frameCount}
                onChange={(e) => setFrameCount(e.target.value)}
                options={['1', '2', '3', '4', '5', '6', '7'].map((n) => ({
                  value: n,
                  label: `${n} Frame`,
                }))}
              />

              <Select
                label="Algoritma"
                id="algorithmId"
                value={algorithmId}
                onChange={(e) => setAlgorithmId(e.target.value)}
                options={[
                  { value: 'FIFO', label: 'First-In, First-Out (FIFO)' },
                  { value: 'LRU', label: 'Least Recently Used (LRU)' },
                  { value: 'Optimal', label: 'Optimal (Belady)' },
                ]}
              />

              <Button variant="primary" type="submit" style={{ marginTop: 'var(--space-8)' }}>
                Jalankan
              </Button>
            </form>
          </Card>
        </aside>

        {/* Panel Kanan: Area Hasil, Playback, dan Visualisasi Tabel */}
        <section className="simulator-results" aria-label="Hasil Simulasi">
          {result && totalSteps > 0 ? (
            <>
              {/* Penjelasan Langkah Aktif */}
              <div
                className="step-explanation-box"
                aria-live="polite"
                aria-atomic="true"
              >
                {currentExplanation || 'Tekan Berikutnya atau Putar untuk memulai simulasi.'}
              </div>

              {/* Kontrol Pemutaran (Playback) */}
              <div className="playback-controls">
                <div className="playback-buttons">
                  <Button
                    variant="secondary"
                    onClick={prevStep}
                    disabled={currentStepIndex <= 0}
                    aria-label="Langkah sebelumnya"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="primary"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Jeda otomatis' : 'Putar otomatis'}
                  >
                    {isPlaying ? 'Jeda' : 'Putar'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={nextStep}
                    disabled={currentStepIndex >= totalSteps - 1}
                    aria-label="Langkah berikutnya"
                  >
                    Berikutnya
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={resetPlayback}
                    disabled={currentStepIndex === 0 && !isPlaying}
                    aria-label="Reset langkah ke awal"
                  >
                    Reset
                  </Button>
                </div>

                <span className="playback-step-info">
                  Langkah {currentStepIndex + 1} dari {totalSteps}
                </span>

                <div className="playback-speed-group">
                  <span>Kecepatan:</span>
                  <div className="speed-buttons" role="group" aria-label="Kecepatan pemutaran">
                    <button
                      type="button"
                      className={`speed-btn ${speed === 'slow' ? 'active' : ''}`}
                      onClick={() => setSpeed('slow')}
                    >
                      Lambat
                    </button>
                    <button
                      type="button"
                      className={`speed-btn ${speed === 'normal' ? 'active' : ''}`}
                      onClick={() => setSpeed('normal')}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      className={`speed-btn ${speed === 'fast' ? 'active' : ''}`}
                      onClick={() => setSpeed('fast')}
                    >
                      Cepat
                    </button>
                  </div>
                </div>
              </div>

              {/* Mode Tampilan Tabel (Per Langkah vs Semua) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-muted)' }}>
                  Navigasi keyboard: [Panah Kiri] Mundur | [Panah Kanan] Maju | [Spasi] Putar/Jeda
                </span>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: 'var(--font-size-12)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={limitToCurrentStep}
                    onChange={(e) => setLimitToCurrentStep(e.target.checked)}
                  />
                  Hanya tampilkan sampai langkah saat ini
                </label>
              </div>

              {/* Tabel Langkah Pergantian Frame */}
              <FrameTable
                steps={result.steps}
                frameCount={frameCount}
                currentStepIndex={currentStepIndex}
                limitToCurrentStep={limitToCurrentStep}
              />

              {/* Baris Ringkasan Metrik */}
              <div className="summary-stats-grid">
                <StatBlock
                  label="Total Hit"
                  value={result.totalHit}
                  variant="hit"
                  description="Halaman ditemukan di memori"
                />
                <StatBlock
                  label="Total Fault"
                  value={result.totalFault}
                  variant="fault"
                  description="Pergantian halaman terjadi"
                />
                <StatBlock
                  label="Hit Ratio"
                  value={`${result.hitRatio}%`}
                  variant="accent"
                  description="Efisiensi pemanfaatan cache"
                />
                <StatBlock
                  label="Fault Ratio"
                  value={`${(100 - result.hitRatio).toFixed(2)}%`}
                  variant="default"
                  description="Tingkat kegagalan pencarian"
                />
              </div>
            </>
          ) : (
            <Card>
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-24)' }}>
                {inputError || 'Masukkan parameter dan klik "Jalankan" untuk memulai simulasi.'}
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
