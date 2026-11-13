import { useState, useCallback, useEffect } from 'react'
import { Button, Card, Badge, StatBlock } from '../components'
import { ALGORITHMS } from '../algorithms'
import './Quest.css'

// ─── Konfigurasi Level ──────────────────────────────────────────────────────
const LEVELS = {
  easy: {
    key: 'easy',
    label: 'Mudah',
    algorithm: 'FIFO',
    frameCount: 3,
    pageCount: 8,
    maxPage: 5,
    description: 'FIFO · 3 Frame · 8 Halaman',
    storageKey: 'mq_best_easy',
  },
  medium: {
    key: 'medium',
    label: 'Sedang',
    algorithm: 'LRU',
    frameCount: 3,
    pageCount: 12,
    maxPage: 6,
    description: 'LRU · 3 Frame · 12 Halaman',
    storageKey: 'mq_best_medium',
  },
  hard: {
    key: 'hard',
    label: 'Sulit',
    algorithm: 'Optimal',
    frameCount: 4,
    pageCount: 15,
    maxPage: 7,
    description: 'Optimal · 4 Frame · 15 Halaman',
    storageKey: 'mq_best_hard',
  },
}

const ALGO_EVICT_REASON = {
  FIFO: 'masuk paling awal',
  LRU: 'paling lama tidak digunakan',
  Optimal: 'tidak akan digunakan paling lama ke depan',
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function generateRandomPages(count, maxPage) {
  const pages = []
  for (let i = 0; i < count; i++) {
    pages.push(Math.floor(Math.random() * (maxPage + 1)))
  }
  return pages
}

function readHighscore(storageKey) {
  try {
    const v = localStorage.getItem(storageKey)
    return v !== null ? Number(v) : 0
  } catch {
    return 0
  }
}

function writeHighscore(storageKey, score) {
  try {
    localStorage.setItem(storageKey, String(score))
  } catch {
    // ignore
  }
}

function buildFeedbackMessage(step, algorithm, hitFaultCorrect, evictCorrect, playerHitFault, playerEvictIndex) {
  const { page, isHit, replaced, frameIndex } = step
  const frameNum = frameIndex + 1
  const reason = ALGO_EVICT_REASON[algorithm] || ''

  if (hitFaultCorrect && evictCorrect) {
    // Benar
    if (isHit) {
      return `Benar! Halaman ${page} sudah ada di memori (Frame ${frameNum}).`
    }
    if (replaced === null) {
      return `Benar! Halaman ${page} tidak ada di memori, dimuat ke Frame ${frameNum} yang masih kosong.`
    }
    return `Benar! Halaman ${page} tidak ada di memori. Halaman ${replaced} dikeluarkan karena ${reason}.`
  }

  // Salah
  if (!hitFaultCorrect) {
    const correctLabel = isHit ? 'Hit' : 'Fault'
    if (isHit) {
      return `Salah. Halaman ${page} sebenarnya sudah ada di memori (Hit), berada di Frame ${frameNum}.`
    }
    if (replaced === null) {
      return `Salah. Halaman ${page} sebenarnya tidak ada di memori (${correctLabel}), dimuat ke Frame ${frameNum} yang masih kosong.`
    }
    return `Salah. Halaman ${page} sebenarnya tidak ada di memori (${correctLabel}). Halaman ${replaced} seharusnya dikeluarkan karena ${reason}.`
  }

  // hit/fault benar, eviksi salah
  return `Salah pilihan. Seharusnya Frame ${frameNum} (Halaman ${replaced}) yang diganti karena ${reason}.`
}

// ─── Komponen Layar Pilih Level ──────────────────────────────────────────────
function ScreenSelect({ onStart }) {
  const highscores = {
    easy: readHighscore(LEVELS.easy.storageKey),
    medium: readHighscore(LEVELS.medium.storageKey),
    hard: readHighscore(LEVELS.hard.storageKey),
  }

  return (
    <div className="quest-container">
      <header className="quest-header">
        <h1>Quest</h1>
        <p>
          Uji pemahamanmu tentang page replacement. Tebak apakah setiap akses
          menghasilkan Hit atau Fault, dan tentukan halaman mana yang dikeluarkan
          dari memori.
        </p>
      </header>

      <div className="quest-level-grid">
        {Object.values(LEVELS).map((level) => (
          <div key={level.key} className="quest-level-card">
            <div className="quest-level-label">{level.label}</div>
            <div className="quest-level-desc">{level.description}</div>
            {highscores[level.key] > 0 && (
              <div className="quest-level-best">
                Skor tertinggi: <strong>{highscores[level.key]}</strong>
              </div>
            )}
            <div className="quest-level-action">
              <Button variant="primary" onClick={() => onStart(level.key)}>
                Mulai
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="quest-rules-box">
        <h3>Cara Bermain</h3>
        <ul className="quest-rules-list">
          <li>Tiap langkah, tentukan apakah halaman yang diminta menghasilkan <strong>Hit</strong> (sudah ada di memori) atau <strong>Fault</strong> (tidak ada).</li>
          <li>Jika fault dan memori penuh, pilih frame mana yang akan diganti.</li>
          <li>Benar tanpa petunjuk: <strong>+15 poin</strong>. Benar dengan petunjuk: <strong>+10 poin</strong>.</li>
          <li>Salah: kehilangan 1 nyawa. Tersisa 3 nyawa total.</li>
          <li>Gunakan tombol <strong>Petunjuk</strong> jika butuh bantuan (mengurangi 5 poin).</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Komponen HUD ────────────────────────────────────────────────────────────
function GameHUD({ level, stepIndex, totalSteps, score, lives }) {
  const progressPct = totalSteps > 0 ? Math.round((stepIndex / totalSteps) * 100) : 0

  return (
    <div className="quest-hud-wrapper">
      <div className="quest-hud">
        <div className="quest-hud-item">
          <span className="quest-hud-label">Level</span>
          <span className="quest-hud-value">{level.label}</span>
        </div>
        <div className="quest-hud-item">
          <span className="quest-hud-label">Langkah</span>
          <span className="quest-hud-value quest-hud-mono">
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>
        <div className="quest-hud-item">
          <span className="quest-hud-label">Skor</span>
          <span className="quest-hud-value quest-hud-mono">{score}</span>
        </div>
        <div className="quest-hud-item">
          <span className="quest-hud-label">Nyawa</span>
          <span className="quest-hud-value quest-hud-mono">{lives} / 3</span>
        </div>
      </div>
      <div className="quest-progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
        <div className="quest-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  )
}

// ─── Komponen Frame Display ───────────────────────────────────────────────────
function FrameSlots({ frames, frameCount, clickable = false, onClickFrame, selectedIndex }) {
  const slots = Array.from({ length: frameCount }, (_, i) => frames[i] ?? null)

  return (
    <div className="quest-frames-row">
      {slots.map((page, i) => {
        const isEmpty = page === null
        if (clickable && !isEmpty) {
          return (
            <button
              key={i}
              className={`quest-frame-slot frame-btn ${selectedIndex === i ? 'selected' : ''}`}
              onClick={() => onClickFrame(i)}
              aria-label={`Frame ${i + 1}: Halaman ${page}`}
            >
              <span className="quest-frame-label">F{i + 1}</span>
              <span className="quest-frame-value">{page}</span>
            </button>
          )
        }
        return (
          <div
            key={i}
            className={`quest-frame-slot ${isEmpty ? 'empty' : ''}`}
            aria-label={isEmpty ? `Frame ${i + 1} kosong` : `Frame ${i + 1}: Halaman ${page}`}
          >
            <span className="quest-frame-label">F{i + 1}</span>
            <span className="quest-frame-value">{isEmpty ? '—' : page}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Komponen Layar Gameplay ─────────────────────────────────────────────────
function ScreenPlay({ levelKey, onGameOver, onFinish }) {
  const level = LEVELS[levelKey]
  const algo = ALGORITHMS[level.algorithm]

  // Inisialisasi lazy: generate pages + simulate sekali
  const [gameData] = useState(() => {
    const pages = generateRandomPages(level.pageCount, level.maxPage)
    const { steps } = algo.simulate(pages, level.frameCount)
    return { pages, steps }
  })

  const { steps } = gameData
  const totalSteps = steps.length

  // State gameplay
  const [stepIndex, setStepIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState('answer-hitfault') // 'answer-hitfault' | 'answer-evict' | 'feedback'
  const [playerHitFault, setPlayerHitFault] = useState(null) // 'hit' | 'fault'
  const [playerEvictIndex, setPlayerEvictIndex] = useState(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [hintText, setHintText] = useState('')
  const [feedback, setFeedback] = useState(null) // { correct, message, scoreDelta }
  const [wrongSteps, setWrongSteps] = useState([])

  const step = steps[stepIndex]
  // Frame SEBELUM langkah ini diproses
  const prevFrames = stepIndex > 0 ? steps[stepIndex - 1].frames : []
  const frameCount = level.frameCount
  const isFrameFull = prevFrames.length >= frameCount

  // Apakah fault + frame penuh → perlu pilih eviksi?
  const needsEvict = !step.isHit && step.replaced !== null

  // ── Handler Petunjuk ──
  const handleHint = useCallback(() => {
    if (hintUsed) return
    setHintUsed(true)
    setScore((s) => Math.max(0, s - 5))

    if (phase === 'answer-hitfault') {
      const ans = step.isHit ? 'Hit' : 'Fault'
      setHintText(`Petunjuk: Jawaban yang benar adalah ${ans}.`)
    } else if (phase === 'answer-evict') {
      setHintText(
        `Petunjuk: Ganti Frame ${step.frameIndex + 1} (Halaman ${step.replaced}) karena ${ALGO_EVICT_REASON[level.algorithm]}.`
      )
    }
  }, [hintUsed, phase, step, level.algorithm])

  // ── Handler Hit/Fault ──
  const handleAnswerHitFault = useCallback(
    (answer) => {
      setPlayerHitFault(answer)

      if (!step.isHit && needsEvict) {
        // Fault + frame penuh → tanya eviksi
        setPhase('answer-evict')
        setHintText('')
      } else {
        // Langsung evaluasi
        const hitFaultCorrect = (answer === 'hit') === step.isHit
        const correct = hitFaultCorrect // tidak ada eviksi
        const msg = buildFeedbackMessage(step, level.algorithm, hitFaultCorrect, true, answer, null)
        const delta = correct ? (hintUsed ? 10 : 15) : 0

        if (correct) {
          setScore((s) => s + delta)
        } else {
          const newLives = lives - 1
          setLives(newLives)
          setWrongSteps((ws) => [
            ...ws,
            {
              stepIndex,
              page: step.page,
              explanation: msg,
            },
          ])
          if (newLives <= 0) {
            setFeedback({ correct: false, message: msg, scoreDelta: 0, gameOver: true })
            setPhase('feedback')
            return
          }
        }
        setFeedback({ correct, message: msg, scoreDelta: delta, gameOver: false })
        setPhase('feedback')
      }
    },
    [step, needsEvict, hintUsed, lives, stepIndex, level.algorithm]
  )

  // ── Handler Pilih Frame (Eviksi) ──
  const handleEvictFrame = useCallback(
    (frameIdx) => {
      setPlayerEvictIndex(frameIdx)

      const hitFaultCorrect = playerHitFault === 'fault' // sudah pasti fault karena kita di phase evict
      const evictCorrect = frameIdx === step.frameIndex
      const correct = hitFaultCorrect && evictCorrect
      const msg = buildFeedbackMessage(step, level.algorithm, hitFaultCorrect, evictCorrect, playerHitFault, frameIdx)
      const delta = correct ? (hintUsed ? 10 : 15) : 0

      if (correct) {
        setScore((s) => s + delta)
      } else {
        const newLives = lives - 1
        setLives(newLives)
        setWrongSteps((ws) => [
          ...ws,
          {
            stepIndex,
            page: step.page,
            explanation: msg,
          },
        ])
        if (newLives <= 0) {
          setFeedback({ correct: false, message: msg, scoreDelta: 0, gameOver: true })
          setPhase('feedback')
          return
        }
      }
      setFeedback({ correct, message: msg, scoreDelta: delta, gameOver: false })
      setPhase('feedback')
    },
    [step, playerHitFault, hintUsed, lives, stepIndex, level.algorithm]
  )

  // ── Handler Lanjut ──
  const handleNext = useCallback(() => {
    if (feedback?.gameOver) {
      onGameOver({ score, lives: 0, stepIndex, wrongSteps })
      return
    }

    const nextIndex = stepIndex + 1
    if (nextIndex >= totalSteps) {
      onFinish({ score, lives, wrongSteps, totalSteps })
      return
    }

    setStepIndex(nextIndex)
    setPhase('answer-hitfault')
    setPlayerHitFault(null)
    setPlayerEvictIndex(null)
    setHintUsed(false)
    setHintText('')
    setFeedback(null)
  }, [feedback, stepIndex, totalSteps, score, lives, wrongSteps, onGameOver, onFinish])

  return (
    <div className="quest-container">
      <GameHUD
        level={level}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        score={score}
        lives={lives}
      />

      <Card>
        <div className="quest-play-area">
          {/* Info langkah */}
          <div className="quest-step-info">
            <span className="quest-step-label">Halaman yang diminta</span>
            <span className="quest-page-number">{step.page}</span>
          </div>

          {/* Kondisi frame saat ini (sebelum langkah diproses) */}
          <div className="quest-frame-section">
            <div className="quest-section-label">Kondisi Frame Saat Ini</div>
            {phase === 'answer-evict' ? (
              <>
                <p className="quest-evict-prompt">
                  Halaman {step.page} tidak ada di memori dan semua frame penuh.
                  Klik frame mana yang akan diganti:
                </p>
                <FrameSlots
                  frames={prevFrames}
                  frameCount={frameCount}
                  clickable
                  onClickFrame={handleEvictFrame}
                  selectedIndex={playerEvictIndex}
                />
              </>
            ) : (
              <FrameSlots
                frames={prevFrames}
                frameCount={frameCount}
              />
            )}
          </div>

          {/* Area Jawaban */}
          {phase === 'answer-hitfault' && (
            <>
              <div className="quest-answer-buttons">
                <button
                  className="quest-btn-answer quest-btn-hit"
                  onClick={() => handleAnswerHitFault('hit')}
                >
                  Hit
                  <span className="quest-btn-sub">Halaman sudah ada di memori</span>
                </button>
                <button
                  className="quest-btn-answer quest-btn-fault"
                  onClick={() => handleAnswerHitFault('fault')}
                >
                  Fault
                  <span className="quest-btn-sub">Halaman tidak ada di memori</span>
                </button>
              </div>
              <div className="quest-hint-row">
                <Button
                  variant="secondary"
                  onClick={handleHint}
                  disabled={hintUsed}
                >
                  {hintUsed ? 'Petunjuk sudah dipakai' : 'Petunjuk (-5 poin)'}
                </Button>
                {hintText && (
                  <span className="quest-hint-text">{hintText}</span>
                )}
              </div>
            </>
          )}

          {phase === 'answer-evict' && (
            <div className="quest-hint-row">
              <Button
                variant="secondary"
                onClick={handleHint}
                disabled={hintUsed}
              >
                {hintUsed ? 'Petunjuk sudah dipakai' : 'Petunjuk (-5 poin)'}
              </Button>
              {hintText && (
                <span className="quest-hint-text">{hintText}</span>
              )}
            </div>
          )}

          {/* Feedback */}
          {phase === 'feedback' && feedback && (
            <div className={`quest-feedback-box ${feedback.correct ? 'correct' : 'wrong'}`} role="status">
              <div className="quest-feedback-header">
                <Badge variant={feedback.correct ? 'hit' : 'fault'}>
                  {feedback.correct ? 'Benar' : 'Salah'}
                </Badge>
                {feedback.correct && feedback.scoreDelta > 0 && (
                  <span className="quest-score-delta">+{feedback.scoreDelta} poin</span>
                )}
                {!feedback.correct && (
                  <span className="quest-score-delta wrong">−1 nyawa</span>
                )}
              </div>
              <p className="quest-feedback-message">{feedback.message}</p>
              <div className="quest-feedback-action">
                <Button variant="primary" onClick={handleNext}>
                  {feedback.gameOver
                    ? 'Lihat Hasil'
                    : stepIndex + 1 >= totalSteps
                    ? 'Selesai'
                    : 'Langkah Berikutnya'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// ─── Komponen Layar Hasil ─────────────────────────────────────────────────────
function ScreenResult({ levelKey, score, lives, wrongSteps, totalSteps, onReplay, onSelectLevel }) {
  const level = LEVELS[levelKey]
  const correctCount = totalSteps - wrongSteps.length
  const accuracy = totalSteps > 0 ? Math.round((correctCount / totalSteps) * 100) : 0
  const prevBest = readHighscore(level.storageKey)
  const isNewBest = score > prevBest

  useEffect(() => {
    if (isNewBest) {
      writeHighscore(level.storageKey, score)
    }
  }, [isNewBest, level.storageKey, score])

  return (
    <div className="quest-container">
      <header className="quest-header">
        <h1>Quest Selesai!</h1>
        <p>
          Level <strong>{level.label}</strong> — {level.description}
        </p>
        {isNewBest && (
          <Badge variant="hit" className="quest-newbest-badge">Skor Tertinggi Baru!</Badge>
        )}
      </header>

      <div className="quest-stats-row">
        <StatBlock label="Skor" value={score} variant="accent" />
        <StatBlock label="Akurasi" value={`${accuracy}%`} variant={accuracy >= 70 ? 'hit' : 'fault'} />
        <StatBlock label="Nyawa Tersisa" value={lives} />
        <StatBlock label="Langkah Benar" value={`${correctCount} / ${totalSteps}`} />
      </div>

      {wrongSteps.length > 0 && (
        <Card title={`Langkah yang Salah (${wrongSteps.length})`}>
          <ol className="quest-wrong-list">
            {wrongSteps.map((w, i) => (
              <li key={i} className="quest-wrong-item">
                <div className="quest-wrong-header">
                  <Badge variant="fault">Langkah {w.stepIndex + 1}</Badge>
                  <span className="quest-wrong-page">Halaman {w.page}</span>
                </div>
                <p className="quest-wrong-explanation">{w.explanation}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {wrongSteps.length === 0 && (
        <div className="quest-perfect-box">
          <strong>Sempurna!</strong> Semua {totalSteps} langkah dijawab dengan benar.
        </div>
      )}

      <div className="quest-action-row">
        <Button variant="primary" onClick={onReplay}>Main Lagi</Button>
        <Button variant="secondary" onClick={onSelectLevel}>Pilih Level</Button>
      </div>
    </div>
  )
}

// ─── Komponen Layar Game Over ─────────────────────────────────────────────────
function ScreenGameOver({ levelKey, score, stepIndex, wrongSteps, onReplay, onSelectLevel }) {
  const level = LEVELS[levelKey]
  const correctCount = stepIndex - wrongSteps.length

  return (
    <div className="quest-container">
      <header className="quest-header">
        <h1>Game Over</h1>
        <p>
          Nyawa habis di langkah {stepIndex + 1} — Level <strong>{level.label}</strong>
        </p>
      </header>

      <div className="quest-stats-row">
        <StatBlock label="Skor" value={score} variant="accent" />
        <StatBlock label="Langkah Tercapai" value={stepIndex + 1} />
        <StatBlock label="Langkah Benar" value={Math.max(0, correctCount)} />
      </div>

      {wrongSteps.length > 0 && (
        <Card title="Langkah yang Salah">
          <ol className="quest-wrong-list">
            {wrongSteps.map((w, i) => (
              <li key={i} className="quest-wrong-item">
                <div className="quest-wrong-header">
                  <Badge variant="fault">Langkah {w.stepIndex + 1}</Badge>
                  <span className="quest-wrong-page">Halaman {w.page}</span>
                </div>
                <p className="quest-wrong-explanation">{w.explanation}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className="quest-action-row">
        <Button variant="primary" onClick={onReplay}>Coba Lagi</Button>
        <Button variant="secondary" onClick={onSelectLevel}>Pilih Level</Button>
      </div>
    </div>
  )
}

// ─── Root Component ───────────────────────────────────────────────────────────
export default function Quest() {
  const [screen, setScreen] = useState('select') // 'select' | 'playing' | 'result' | 'gameover'
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [finalData, setFinalData] = useState(null)
  const [replayKey, setReplayKey] = useState(0) // force remount untuk replay

  const handleStart = useCallback((levelKey) => {
    setSelectedLevel(levelKey)
    setFinalData(null)
    setReplayKey((k) => k + 1)
    setScreen('playing')
  }, [])

  const handleFinish = useCallback((data) => {
    setFinalData(data)
    setScreen('result')
  }, [])

  const handleGameOver = useCallback((data) => {
    setFinalData(data)
    setScreen('gameover')
  }, [])

  const handleReplay = useCallback(() => {
    setFinalData(null)
    setReplayKey((k) => k + 1)
    setScreen('playing')
  }, [])

  const handleSelectLevel = useCallback(() => {
    setScreen('select')
    setSelectedLevel(null)
    setFinalData(null)
  }, [])

  if (screen === 'select') {
    return <ScreenSelect onStart={handleStart} />
  }

  if (screen === 'playing' && selectedLevel) {
    return (
      <ScreenPlay
        key={replayKey}
        levelKey={selectedLevel}
        onFinish={handleFinish}
        onGameOver={handleGameOver}
      />
    )
  }

  if (screen === 'result' && finalData) {
    return (
      <ScreenResult
        levelKey={selectedLevel}
        score={finalData.score}
        lives={finalData.lives}
        wrongSteps={finalData.wrongSteps}
        totalSteps={finalData.totalSteps}
        onReplay={handleReplay}
        onSelectLevel={handleSelectLevel}
      />
    )
  }

  if (screen === 'gameover' && finalData) {
    return (
      <ScreenGameOver
        levelKey={selectedLevel}
        score={finalData.score}
        stepIndex={finalData.stepIndex}
        wrongSteps={finalData.wrongSteps}
        onReplay={handleReplay}
        onSelectLevel={handleSelectLevel}
      />
    )
  }

  return null
}
