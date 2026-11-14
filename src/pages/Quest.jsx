import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button, Card, Badge, StatBlock } from '../components'
import { simulate as simulateFIFO } from '../algorithms/fifo'
import { simulate as simulateLRU } from '../algorithms/lru'
import { simulate as simulateOptimal } from '../algorithms/optimal'
import { getStepExplanation } from '../utils/explanation'
import './Quest.css'

const LEVELS = {
  mudah: {
    id: 'mudah',
    label: 'Mudah',
    algoId: 'FIFO',
    algoName: 'FIFO',
    frameCount: 3,
    pagesCount: 8,
    maxPageNum: 5,
    simulate: simulateFIFO,
  },
  sedang: {
    id: 'sedang',
    label: 'Sedang',
    algoId: 'LRU',
    algoName: 'LRU',
    frameCount: 3,
    pagesCount: 12,
    maxPageNum: 6,
    simulate: simulateLRU,
  },
  sulit: {
    id: 'sulit',
    label: 'Sulit',
    algoId: 'Optimal',
    algoName: 'Optimal',
    frameCount: 4,
    pagesCount: 15,
    maxPageNum: 7,
    simulate: simulateOptimal,
  },
}

// Pseudo-random generator sederhana berbasis seed (linear congruential generator)
function generateSeededArray(seed, count, maxVal) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  const result = []
  for (let i = 0; i < count; i++) {
    s = (s * 16807) % 2147483647
    result.push(s % (maxVal + 1))
  }
  return result
}

export default function Quest() {
  const [levelKey, setLevelKey] = useState('mudah')
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 10000) + 1)

  // State Permainan
  const [stepIndex, setStepIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState('guess_hit_fault') // 'guess_hit_fault' | 'select_victim' | 'step_done' | 'game_over'
  const [feedback, setFeedback] = useState(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [hintText, setHintText] = useState('')
  const [mistakes, setMistakes] = useState([])
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)

  const activeLevel = LEVELS[levelKey]

  // Hitung deretan referensi dan simulasikan ground truth
  const { referenceString, simResult } = useMemo(() => {
    const refs = generateSeededArray(seed, activeLevel.pagesCount, activeLevel.maxPageNum)
    const result = activeLevel.simulate(refs, activeLevel.frameCount)
    return { referenceString: refs, simResult: result }
  }, [seed, activeLevel])

  // Skor tertinggi dari localStorage
  const storageKey = `mq_highscore_${levelKey}`
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(storageKey)) || 0
    } catch {
      return 0
    }
  })

  // Mulai ulang game
  const resetGame = useCallback((newSeed = seed) => {
    setSeed(newSeed)
    setStepIndex(0)
    setLives(3)
    setScore(0)
    setPhase('guess_hit_fault')
    setFeedback(null)
    setHintUsed(false)
    setHintText('')
    setMistakes([])
    setCorrectAnswersCount(0)
  }, [seed])

  // Ganti level
  const handleSelectLevel = (newKey) => {
    setLevelKey(newKey)
    try {
      const stored = Number(localStorage.getItem(`mq_highscore_${newKey}`)) || 0
      setHighScore(stored)
    } catch {
      setHighScore(0)
    }
    setStepIndex(0)
    setLives(3)
    setScore(0)
    setPhase('guess_hit_fault')
    setFeedback(null)
    setHintUsed(false)
    setHintText('')
    setMistakes([])
    setCorrectAnswersCount(0)
  }

  // Kondisi frame sebelum langkah saat ini dieksekusi
  const currentGroundStep = simResult.steps[stepIndex] || null
  const prevFrames = useMemo(() => {
    if (stepIndex === 0) return []
    return simResult.steps[stepIndex - 1]?.frames || []
  }, [simResult, stepIndex])

  // Cek jika frame memori sebelum langkah ini sudah penuh
  const isMemoryFull = prevFrames.length >= activeLevel.frameCount

  // Selesaikan game dan update high score jika perlu
  const finishGame = useCallback((finalScore) => {
    setPhase('game_over')
    if (finalScore > highScore) {
      setHighScore(finalScore)
      try {
        localStorage.setItem(storageKey, String(finalScore))
      } catch {
        // Abaikan jika localStorage tidak tersedia
      }
    }
  }, [highScore, storageKey])

  // Handler tebakan Hit / Fault
  const handleGuess = useCallback((playerGuessIsHit) => {
    if (!currentGroundStep) return

    const actualIsHit = currentGroundStep.isHit
    const currentPage = currentGroundStep.page

    if (playerGuessIsHit === actualIsHit) {
      // Tebakan Benar
      if (actualIsHit || !isMemoryFull) {
        // Jika Hit atau (Fault tetapi memori belum penuh), langkah selesai langsung
        const points = hintUsed ? 10 : 15
        const newScore = score + points
        setScore(newScore)
        setCorrectAnswersCount((c) => c + 1)
        setFeedback({
          type: 'success',
          text: `Benar! Halaman ${currentPage} ${actualIsHit ? 'adalah Hit' : 'adalah Fault (dimasukkan ke frame kosong)'}. (+${points} poin)`,
        })
        setPhase('step_done')
      } else {
        // Fault dan memori penuh: pemain harus memilih frame yang digantikan
        setFeedback({
          type: 'hint',
          text: `Tepat, Page Fault terjadi! Karena semua ${activeLevel.frameCount} frame terisi, klik pada salah satu frame di atas untuk memilih halaman mana yang harus digantikan menurut aturan ${activeLevel.algoName}.`,
        })
        setPhase('select_victim')
      }
    } else {
      // Tebakan Salah
      const newLives = lives - 1
      setLives(newLives)
      const explanation = getStepExplanation(currentGroundStep, activeLevel.algoId)

      setMistakes((prev) => [
        ...prev,
        {
          step: stepIndex + 1,
          page: currentPage,
          yourAnswer: playerGuessIsHit ? 'Hit' : 'Fault',
          correctAnswer: actualIsHit ? 'Hit' : 'Fault',
          explanation,
        },
      ])

      setFeedback({
        type: 'error',
        text: `Salah. Halaman ${currentPage} sebenarnya adalah ${actualIsHit ? 'Hit' : 'Fault'}. ${explanation}`,
      })

      if (newLives <= 0) {
        finishGame(score)
      } else {
        setPhase('step_done')
      }
    }
  }, [currentGroundStep, isMemoryFull, hintUsed, score, activeLevel, lives, stepIndex, finishGame])

  // Handler memilih frame korban pergantian (select victim)
  const handleSelectVictim = useCallback((selectedFrameIndex) => {
    if (phase !== 'select_victim' || !currentGroundStep) return

    const correctFrameIndex = currentGroundStep.frameIndex
    const replacedPage = currentGroundStep.replaced
    const currentPage = currentGroundStep.page

    if (selectedFrameIndex === correctFrameIndex) {
      // Pilihan Benar
      const points = hintUsed ? 10 : 15
      const newScore = score + points
      setScore(newScore)
      setCorrectAnswersCount((c) => c + 1)
      setFeedback({
        type: 'success',
        text: `Tepat sekali! Halaman ${replacedPage} digantikan oleh ${currentPage} sesuai aturan ${activeLevel.algoName}. (+${points} poin)`,
      })
      setPhase('step_done')
    } else {
      // Pilihan Salah
      const newLives = lives - 1
      setLives(newLives)
      const selectedPage = prevFrames[selectedFrameIndex]
      const explanation = getStepExplanation(currentGroundStep, activeLevel.algoId)

      setMistakes((prev) => [
        ...prev,
        {
          step: stepIndex + 1,
          page: currentPage,
          yourAnswer: `Mengganti hal. ${selectedPage}`,
          correctAnswer: `Mengganti hal. ${replacedPage}`,
          explanation,
        },
      ])

      setFeedback({
        type: 'error',
        text: `Kurang tepat. Bukan halaman ${selectedPage} yang diganti. ${explanation}`,
      })

      if (newLives <= 0) {
        finishGame(score)
      } else {
        setPhase('step_done')
      }
    }
  }, [phase, currentGroundStep, hintUsed, score, activeLevel, lives, prevFrames, stepIndex, finishGame])

  // Lanjut ke langkah berikutnya
  const handleNextStep = useCallback(() => {
    if (stepIndex + 1 >= activeLevel.pagesCount) {
      // Semua langkah selesai
      finishGame(score)
    } else {
      setStepIndex((prev) => prev + 1)
      setPhase('guess_hit_fault')
      setFeedback(null)
      setHintUsed(false)
      setHintText('')
    }
  }, [stepIndex, activeLevel.pagesCount, finishGame, score])

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return

      if (phase === 'guess_hit_fault') {
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault()
          handleGuess(true)
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault()
          handleGuess(false)
        }
      } else if (phase === 'select_victim') {
        const num = parseInt(e.key, 10)
        if (num >= 1 && num <= activeLevel.frameCount) {
          e.preventDefault()
          handleSelectVictim(num - 1)
        }
      } else if (phase === 'step_done') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleNextStep()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, handleGuess, handleSelectVictim, handleNextStep, activeLevel.frameCount])

  // Berikan petunjuk (hint)
  const handleUseHint = () => {
    if (hintUsed || !currentGroundStep) return
    setHintUsed(true)

    let clue = ''
    switch (activeLevel.algoId) {
      case 'FIFO':
        clue = 'Petunjuk FIFO: Perhatikan halaman mana di antara frame yang masuk paling awal dalam urutan waktu.'
        break
      case 'LRU':
        clue = 'Petunjuk LRU: Periksa kapan masing-masing halaman di frame terakhir kali diakses. Halaman yang paling lampau digunakan adalah korbannya.'
        break
      case 'Optimal':
        clue = 'Petunjuk Optimal: Periksa sisa halaman di depan. Cari halaman di frame yang waktu pemakaiannya paling jauh atau tidak pernah dipakai lagi.'
        break
      default:
        clue = 'Periksa urutan akses referensi.'
    }

    setHintText(clue)
  }

  const accuracy = stepIndex > 0 || phase === 'game_over'
    ? Math.round((correctAnswersCount / Math.max(1, stepIndex + (phase === 'step_done' || phase === 'game_over' ? 1 : 0))) * 100)
    : 100

  return (
    <div className="quest-container">
      <header>
        <h1>Mode Quest: Tantangan Manajemen Memori</h1>
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
          Uji pemahaman Anda dengan menebak Hit/Fault dan menentukan halaman yang harus diganti pada setiap langkah.
        </p>
      </header>

      {/* Pilihan Level */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--font-size-14)', fontWeight: 500 }}>Tingkat Kesulitan:</span>
        {Object.values(LEVELS).map((lvl) => (
          <Button
            key={lvl.id}
            variant={levelKey === lvl.id ? 'primary' : 'secondary'}
            onClick={() => handleSelectLevel(lvl.id)}
            style={{ fontSize: 'var(--font-size-12)', padding: '6px 12px' }}
          >
            {lvl.label} ({lvl.algoName}, {lvl.frameCount} Frame)
          </Button>
        ))}
      </div>

      {/* Header Info Status Permainan */}
      <div className="quest-header-stats">
        <div className="quest-stats-badges">
          <span className="quest-lives">Nyawa: {lives}</span>
          <span className="quest-score">Skor: {score}</span>
          <span style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-muted)' }}>
            Skor Tertinggi ({activeLevel.label}): {highScore}
          </span>
        </div>
        <span className="quest-step-progress">
          Langkah {Math.min(stepIndex + 1, activeLevel.pagesCount)} dari {activeLevel.pagesCount} (Seed: #{seed})
        </span>
      </div>

      {/* Konten Utama Game atau Layar Hasil Akhir */}
      {phase !== 'game_over' ? (
        <Card className="quest-target-card">
          {/* Target Halaman yang Diminta */}
          <div className="quest-target-page-box">
            <span style={{ fontSize: 'var(--font-size-16)', fontWeight: 500 }}>
              Halaman yang diakses berikutnya:
            </span>
            <span className="target-page-number">
              {currentGroundStep?.page}
            </span>
          </div>

          {/* Kondisi Frame Memori Saat Ini */}
          <div>
            <span style={{ fontSize: 'var(--font-size-14)', color: 'var(--color-text-muted)' }}>
              Kondisi frame saat ini ({activeLevel.frameCount} slot):
              {phase === 'select_victim' && ' (Klik pada kotak frame untuk memilih korban pergantian)'}
            </span>
            <div className="quest-frames-grid">
              {Array.from({ length: activeLevel.frameCount }, (_, idx) => {
                const val = prevFrames[idx]
                const isSelectable = phase === 'select_victim'

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!isSelectable}
                    onClick={() => handleSelectVictim(idx)}
                    className={`quest-frame-box ${isSelectable ? 'is-selectable' : ''}`}
                    aria-label={`Frame ${idx + 1}: ${val !== undefined ? `berisi halaman ${val}` : 'kosong'}`}
                  >
                    <span className="frame-box-label">Frame {idx + 1}</span>
                    <span className="frame-box-value">
                      {val !== undefined ? val : '—'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sisa Deretan Halaman Mendatang (Dukungan untuk kalkulasi Optimal) */}
          <div style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-muted)' }}>
            Sisa deretan halaman ke depan:{' '}
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              {referenceString.slice(stepIndex + 1).join(', ') || '(akhir deretan)'}
            </span>
          </div>

          {/* Kotak Petunjuk jika Diaktifkan */}
          {hintText && (
            <div className="quest-feedback-box feedback-hint" role="note">
              {hintText}
            </div>
          )}

          {/* Kotak Umpan Balik Jawaban */}
          {feedback && (
            <div
              className={`quest-feedback-box ${feedback.type === 'success' ? 'feedback-success' : feedback.type === 'error' ? 'feedback-error' : 'feedback-hint'}`}
              role="alert"
            >
              {feedback.text}
            </div>
          )}

          {/* Tombol Aksi Permainan */}
          <div className="quest-actions-row">
            {phase === 'guess_hit_fault' && (
              <>
                <Button variant="primary" onClick={() => handleGuess(true)}>
                  Tebak Hit (H)
                </Button>
                <Button variant="secondary" onClick={() => handleGuess(false)}>
                  Tebak Fault (F)
                </Button>
                {!hintUsed && (
                  <Button variant="secondary" onClick={handleUseHint} style={{ marginLeft: 'auto' }}>
                    Gunakan Petunjuk (-5 poin)
                  </Button>
                )}
              </>
            )}

            {phase === 'step_done' && (
              <Button variant="primary" onClick={handleNextStep}>
                {stepIndex + 1 >= activeLevel.pagesCount ? 'Lihat Hasil Akhir' : 'Langkah Berikutnya (Spasi)'}
              </Button>
            )}
          </div>

          <span style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-muted)' }}>
            Navigasi keyboard: [H] Hit | [F] Fault | [1..{activeLevel.frameCount}] Pilih Frame | [Enter/Spasi] Lanjut
          </span>
        </Card>
      ) : (
        /* Layar Hasil Akhir (Game Selesai / Kalah) */
        <Card title={lives > 0 ? 'Tantangan Berhasil Diselesaikan' : 'Game Over (Kehabisan Nyawa)'}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-12)', marginBottom: 'var(--space-16)' }}>
            <StatBlock label="Skor Akhir" value={score} variant="accent" description="Poin diperoleh" />
            <StatBlock label="Skor Tertinggi" value={highScore} variant="default" description="Tersimpan di peramban" />
            <StatBlock label="Akurasi" value={`${accuracy}%`} variant={accuracy >= 70 ? 'hit' : 'fault'} description="Tingkat ketepatan tebakan" />
            <StatBlock label="Sisa Nyawa" value={lives} variant={lives > 0 ? 'hit' : 'fault'} description="Dari 3 nyawa" />
          </div>

          {/* Daftar Langkah yang Salah */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-14)', marginBottom: 'var(--space-8)' }}>
              Evaluasi Langkah yang Keliru:
            </h3>
            {mistakes.length === 0 ? (
              <p style={{ color: 'var(--color-hit)', fontSize: 'var(--font-size-14)' }}>
                Luar biasa! Tidak ada langkah yang salah. Anda menguasai algoritma {activeLevel.algoName} dengan sempurna.
              </p>
            ) : (
              <ul className="quest-summary-list">
                {mistakes.map((m, idx) => (
                  <li key={idx} className="quest-mistake-item">
                    <strong>Langkah {m.step} (Halaman {m.page}):</strong>
                    <br />
                    Jawaban Anda: <Badge variant="fault">{m.yourAnswer}</Badge> | Jawaban Benar: <Badge variant="hit">{m.correctAnswer}</Badge>
                    <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
                      Penjelasan: {m.explanation}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-12)', marginTop: 'var(--space-20)' }}>
            <Button variant="primary" onClick={() => resetGame(seed)}>
              Main Lagi (Seed Sama)
            </Button>
            <Button variant="secondary" onClick={() => resetGame(Math.floor(Math.random() * 10000) + 1)}>
              Acak Tantangan Baru
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
