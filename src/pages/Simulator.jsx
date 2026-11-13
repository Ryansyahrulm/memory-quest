import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Button,
  Field,
  Select,
  StatBlock,
  Badge,
  FrameTable,
  PlaybackControls,
} from '../components'
import { useSimulation } from '../hooks'
import {
  validateReferenceString,
  generateRandomReferenceString,
  getStepExplanation,
} from '../utils'
import './Simulator.css'

const EXAMPLE_REF_STRING = '7 0 1 2 0 3'
const INITIAL_PAGES = [7, 0, 1, 2, 0, 3]

const ALGORITHM_OPTIONS = [
  { value: 'FIFO', label: 'FIFO (First-In, First-Out)' },
  { value: 'LRU', label: 'LRU (Least Recently Used)' },
  { value: 'Optimal', label: 'Optimal (Belady)' },
]

const FRAME_OPTIONS = [1, 2, 3, 4, 5, 6, 7].map((num) => ({
  value: String(num),
  label: `${num} Frame`,
}))

// Peta durasi kecepatan: 1 = Lambat (1500ms), 2 = Normal (800ms), 3 = Cepat (350ms)
const SPEED_DURATIONS = {
  1: 1500,
  2: 800,
  3: 350,
}

export default function Simulator() {
  const [refString, setRefString] = useState(EXAMPLE_REF_STRING)
  const [frameCount, setFrameCount] = useState('3')
  const [algorithm, setAlgorithm] = useState('FIFO')
  const [errorMessage, setErrorMessage] = useState('')

  // State Kontrol Pemutaran
  const [currentStep, setCurrentStep] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedLevel, setSpeedLevel] = useState(2)

  const { result, currentConfig, runSimulation } = useSimulation(
    'FIFO',
    3,
    INITIAL_PAGES
  )

  const totalSteps = result?.steps?.length || 0

  // Timer Pemutaran Otomatis
  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) return

    const duration = SPEED_DURATIONS[speedLevel] || 800
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, duration)

    return () => clearInterval(interval)
  }, [isPlaying, speedLevel, totalSteps])

  // Navigasi Langkah
  const handlePrev = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1))
  }, [totalSteps])

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      if (currentStep >= totalSteps) {
        setCurrentStep(1)
      }
      setIsPlaying(true)
    }
  }, [isPlaying, currentStep, totalSteps])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(1)
  }, [])

  // Dukung Navigasi Keyboard (Panah Kiri / Kanan)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName : ''
      // Jangan intersep tombol panah jika user sedang berinteraksi dengan form input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext])

  // Handler Input Form
  const handleRefStringChange = (e) => {
    const value = e.target.value
    setRefString(value)

    if (errorMessage) {
      const validation = validateReferenceString(value)
      if (validation.isValid) {
        setErrorMessage('')
      }
    }
  }

  const handleFillExample = () => {
    setRefString(EXAMPLE_REF_STRING)
    setErrorMessage('')
    const validation = validateReferenceString(EXAMPLE_REF_STRING)
    if (validation.isValid) {
      runSimulation(validation.pages, Number(frameCount), algorithm)
      setCurrentStep(1)
      setIsPlaying(false)
    }
  }

  const handleRandomize = () => {
    const randomString = generateRandomReferenceString(12, 7)
    setRefString(randomString)
    setErrorMessage('')
    const validation = validateReferenceString(randomString)
    if (validation.isValid) {
      runSimulation(validation.pages, Number(frameCount), algorithm)
      setCurrentStep(1)
      setIsPlaying(false)
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
    runSimulation(validation.pages, Number(frameCount), algorithm)
    setCurrentStep(1)
    setIsPlaying(false)
  }

  // Data langkah yang terlihat (hanya sampai langkah saat ini)
  const visibleSteps = result?.steps ? result.steps.slice(0, currentStep) : []
  const currentStepData = result?.steps ? result.steps[currentStep - 1] : null
  const currentExplanation = currentStepData
    ? getStepExplanation(currentStepData, currentConfig.algorithm)
    : ''

  // Statistik kumulatif hingga langkah saat ini
  const currentHitCount = visibleSteps.filter((s) => s.isHit).length
  const currentFaultCount = visibleSteps.length - currentHitCount
  const currentHitRatio =
    visibleSteps.length > 0
      ? Number(((currentHitCount / visibleSteps.length) * 100).toFixed(1))
      : 0

  return (
    <div className="simulator-container">
      <header className="simulator-header">
        <h1>Simulator Pergantian Halaman</h1>
        <p>
          Simulasikan alokasi frame dan strategi page replacement (FIFO, LRU, Optimal) secara bertahap.
        </p>
      </header>

      <div className="simulator-layout">
        {/* Panel Kiri: Input Parameter */}
        <section aria-labelledby="input-panel-title">
          <Card title="Parameter Simulasi" id="input-panel-title">
            <form className="simulator-form" onSubmit={handleRun}>
              <div>
                <Field
                  label="Reference String"
                  id="reference-string-input"
                  value={refString}
                  onChange={handleRefStringChange}
                  error={errorMessage}
                  hint="Pisahkan angka dengan spasi atau koma (maks. 30 halaman, angka 0-99)"
                  placeholder="Contoh: 7 0 1 2 0 3"
                />
                <div className="ref-string-actions">
                  <Button variant="secondary" onClick={handleFillExample}>
                    Isi contoh
                  </Button>
                  <Button variant="secondary" onClick={handleRandomize}>
                    Acak
                  </Button>
                </div>
              </div>

              <Select
                label="Jumlah Frame"
                id="frame-count-select"
                value={frameCount}
                onChange={(e) => setFrameCount(e.target.value)}
                options={FRAME_OPTIONS}
                hint="Alokasi slot frame memori (1-7)"
              />

              <Select
                label="Pilihan Algoritma"
                id="algorithm-select"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                options={ALGORITHM_OPTIONS}
                hint="Strategi pemilihan korban penggantian halaman"
              />

              <div className="form-action">
                <Button type="submit" variant="primary">
                  Jalankan
                </Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Panel Kanan: Area Hasil & Pemutaran */}
        <section aria-labelledby="results-panel-title">
          <Card title="Hasil Simulasi" id="results-panel-title">
            <div className="results-panel">
              {result && totalSteps > 0 ? (
                <>
                  <div className="results-meta">
                    <div className="results-badges">
                      <Badge variant="neutral">
                        Algoritma: {currentConfig.algorithm}
                      </Badge>
                      <Badge variant="neutral">
                        {currentConfig.frameCount} Frame
                      </Badge>
                      <Badge variant="neutral">
                        Total {totalSteps} Akses
                      </Badge>
                    </div>

                    <div className="results-legend">
                      <div className="legend-item">
                        <span className="legend-swatch swatch-hit" aria-hidden="true" />
                        <span>Hit</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-swatch swatch-fault" aria-hidden="true" />
                        <span>Fault / Baru Masuk</span>
                      </div>
                    </div>
                  </div>

                  {/* Kontrol Pemutaran */}
                  <PlaybackControls
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    isPlaying={isPlaying}
                    speedLevel={speedLevel}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onTogglePlay={handleTogglePlay}
                    onReset={handleReset}
                    onSpeedChange={setSpeedLevel}
                  />

                  {/* Kalimat Penjelasan per Langkah (di atas tabel) */}
                  {currentExplanation && (
                    <div
                      className="step-explanation-box"
                      role="status"
                      aria-live="polite"
                    >
                      <span className="step-explanation-tag">
                        Langkah {currentStep}:
                      </span>
                      <span className="step-explanation-text">
                        {currentExplanation}
                      </span>
                    </div>
                  )}

                  {/* Tabel langkah: hanya menampilkan kolom sampai langkah saat ini */}
                  <FrameTable
                    steps={visibleSteps}
                    frameCount={Number(currentConfig.frameCount || frameCount)}
                  />

                  {/* Baris Ringkasan Metrik (kumulatif hingga langkah saat ini) */}
                  <div className="simulator-stats-row">
                    <StatBlock
                      label="Total Hit"
                      value={currentHitCount}
                      variant="hit"
                      description={`Langkah ${currentStep} dari ${totalSteps}`}
                    />
                    <StatBlock
                      label="Total Fault"
                      value={currentFaultCount}
                      variant="fault"
                      description={`Langkah ${currentStep} dari ${totalSteps}`}
                    />
                    <StatBlock
                      label="Hit Ratio"
                      value={`${currentHitRatio}%`}
                      variant="accent"
                      description="Hingga langkah saat ini"
                    />
                  </div>
                </>
              ) : (
                <div className="results-empty">
                  <p>
                    Belum ada simulasi yang dijalankan. Atur parameter lalu klik &quot;Jalankan&quot;.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
