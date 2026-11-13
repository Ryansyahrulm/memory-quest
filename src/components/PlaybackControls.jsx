import Button from './Button'
import './PlaybackControls.css'

const SPEED_LABELS = {
  1: 'Lambat',
  2: 'Normal',
  3: 'Cepat',
}

export default function PlaybackControls({
  currentStep = 1,
  totalSteps = 1,
  isPlaying = false,
  speedLevel = 2,
  onPrev,
  onNext,
  onTogglePlay,
  onReset,
  onSpeedChange,
  disabled = false,
}) {
  const isFirstStep = currentStep <= 1
  const isLastStep = currentStep >= totalSteps

  return (
    <div className="playback-controls" aria-label="Kontrol Pemutaran Simulasi">
      <div className="playback-controls-main">
        {/* Tombol Kontrol */}
        <div className="playback-buttons">
          <Button
            variant="secondary"
            onClick={onPrev}
            disabled={disabled || isFirstStep}
            aria-label="Langkah sebelumnya"
          >
            Sebelumnya
          </Button>

          <Button
            variant="primary"
            onClick={onTogglePlay}
            disabled={disabled || totalSteps <= 1}
            aria-label={isPlaying ? 'Jeda pemutaran' : 'Putar otomatis'}
          >
            {isPlaying ? 'Jeda' : 'Putar otomatis'}
          </Button>

          <Button
            variant="secondary"
            onClick={onNext}
            disabled={disabled || isLastStep}
            aria-label="Langkah berikutnya"
          >
            Berikutnya
          </Button>

          <Button
            variant="secondary"
            onClick={onReset}
            disabled={disabled || (isFirstStep && !isPlaying)}
            aria-label="Reset ke langkah awal"
          >
            Reset
          </Button>
        </div>

        {/* Indikator Langkah */}
        <div className="playback-step-counter">
          Langkah <strong>{currentStep}</strong> dari <strong>{totalSteps}</strong>
        </div>

        {/* Slider Kecepatan 3 Level */}
        <div className="playback-speed-group">
          <div className="playback-speed-header">
            <span>Kecepatan</span>
            <span className="speed-value">{SPEED_LABELS[speedLevel] || 'Normal'}</span>
          </div>
          <input
            id="simulation-speed-slider"
            type="range"
            min="1"
            max="3"
            step="1"
            value={speedLevel}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            disabled={disabled}
            className="playback-speed-slider"
            aria-label="Pilihan kecepatan pemutaran: 1 Lambat, 2 Normal, 3 Cepat"
          />
          <div className="playback-speed-labels" aria-hidden="true">
            <span className={speedLevel === 1 ? 'active' : ''}>Lambat</span>
            <span className={speedLevel === 2 ? 'active' : ''}>Normal</span>
            <span className={speedLevel === 3 ? 'active' : ''}>Cepat</span>
          </div>
        </div>
      </div>

      {/* Navigasi Keyboard Hint */}
      <div className="playback-keyboard-hint">
        <span>Navigasi keyboard:</span>
        <kbd aria-label="Tombol Panah Kiri">←</kbd>
        <span>Sebelumnya</span>
        <span>•</span>
        <kbd aria-label="Tombol Panah Kanan">→</kbd>
        <span>Berikutnya</span>
      </div>
    </div>
  )
}

