import { useState, useEffect, useRef, useCallback } from 'react'
import { ALGORITHMS } from '../algorithms'
import { parseReferenceString, generateRandomReferenceString, PRESET_CLASSIC, PRESET_BELADY } from '../utils/parser'
import { getStepExplanation } from '../utils/explanation'

const SPEED_CONFIG = {
  slow: 1400,
  normal: 800,
  fast: 350,
}

export function useSimulation(initialConfig = {}) {
  const [refStringInput, setRefStringInput] = useState(initialConfig.refString || PRESET_CLASSIC)
  const [frameCount, setFrameCount] = useState(initialConfig.frameCount || 3)
  const [algorithmId, setAlgorithmId] = useState(initialConfig.algorithmId || 'FIFO')
  const [inputError, setInputError] = useState(null)

  // Hasil simulasi
  const [result, setResult] = useState(null)

  // State pemutaran langkah (playback)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState('normal')

  const timerRef = useRef(null)

  // Fungsi menjalankan simulasi
  const runSimulation = useCallback(() => {
    const { valid, numbers, error } = parseReferenceString(refStringInput)
    if (!valid) {
      setInputError(error)
      setResult(null)
      return false
    }

    setInputError(null)
    const count = Math.max(1, Math.min(7, Number(frameCount) || 3))
    const algo = ALGORITHMS[algorithmId] || ALGORITHMS.FIFO

    const simResult = algo.simulate(numbers, count)
    setResult(simResult)
    setCurrentStepIndex(0)
    setIsPlaying(false)
    return true
  }, [refStringInput, frameCount, algorithmId])

  // Jalankan simulasi awal
  useEffect(() => {
    runSimulation()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Kontrol navigasi langkah
  const nextStep = useCallback(() => {
    if (!result || result.steps.length === 0) return
    setCurrentStepIndex((prev) => {
      if (prev < result.steps.length - 1) return prev + 1
      setIsPlaying(false)
      return prev
    })
  }, [result])

  const prevStep = useCallback(() => {
    if (!result || result.steps.length === 0) return
    setCurrentStepIndex((prev) => Math.max(0, prev - 1))
  }, [result])

  const resetPlayback = useCallback(() => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
  }, [])

  const togglePlay = useCallback(() => {
    if (!result || result.steps.length === 0) return
    // Jika sudah di ujung, mulai ulang dari 0
    if (!isPlaying && currentStepIndex >= result.steps.length - 1) {
      setCurrentStepIndex(0)
    }
    setIsPlaying((prev) => !prev)
  }, [result, isPlaying, currentStepIndex])

  // Timer pemutaran otomatis
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const intervalMs = SPEED_CONFIG[speed] || SPEED_CONFIG.normal
    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (!result || prev >= result.steps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, intervalMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, speed, result])

  // Navigasi keyboard (Panah Kiri, Panah Kanan, Spasi)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Abaikan jika fokus sedang berada pada elemen form
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextStep()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevStep()
      } else if (e.key === ' ') {
        e.preventDefault()
        togglePlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextStep, prevStep, togglePlay])

  // Helper pengisian cepat
  const fillClassic = useCallback(() => {
    setRefStringInput(PRESET_CLASSIC)
    setInputError(null)
  }, [])

  const fillBelady = useCallback(() => {
    setRefStringInput(PRESET_BELADY)
    setInputError(null)
  }, [])

  const randomize = useCallback(() => {
    const randomStr = generateRandomReferenceString(15, 7)
    setRefStringInput(randomStr)
    setInputError(null)
  }, [])

  const currentStep = result?.steps?.[currentStepIndex] || null
  const currentExplanation = currentStep ? getStepExplanation(currentStep, algorithmId) : ''

  return {
    // Form state & handlers
    refStringInput,
    setRefStringInput,
    frameCount: Number(frameCount),
    setFrameCount,
    algorithmId,
    setAlgorithmId,
    inputError,
    runSimulation,
    fillClassic,
    fillBelady,
    randomize,

    // Data hasil
    result,

    // Playback state & handlers
    currentStepIndex,
    setCurrentStepIndex,
    currentStep,
    currentExplanation,
    isPlaying,
    speed,
    setSpeed,
    nextStep,
    prevStep,
    resetPlayback,
    togglePlay,
  }
}
