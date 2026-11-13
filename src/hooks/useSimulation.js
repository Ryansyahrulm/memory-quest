import { useState, useCallback } from 'react'
import { ALGORITHMS } from '../algorithms'

/**
 * Custom hook untuk menjalankan dan menyimpan status simulasi page replacement
 * @param {string} [initialAlgorithm='FIFO'] - Kunci algoritma awal (FIFO, LRU, Optimal)
 * @param {number} [initialFrameCount=3] - Jumlah frame awal
 * @param {number[]} [initialPages=[]] - Nomor halaman awal untuk inisialisasi langsung
 * @returns {{
 *   result: { steps: Array, totalHit: number, totalFault: number, hitRatio: number } | null,
 *   currentConfig: { algorithm: string, frameCount: number, referenceString: number[] },
 *   runSimulation: (pages: number[], frameCount: number, algorithmKey: string) => Object,
 *   resetSimulation: () => void
 * }}
 */
export function useSimulation(
  initialAlgorithm = 'FIFO',
  initialFrameCount = 3,
  initialPages = []
) {
  const [result, setResult] = useState(() => {
    if (
      Array.isArray(initialPages) &&
      initialPages.length > 0 &&
      ALGORITHMS[initialAlgorithm]
    ) {
      return ALGORITHMS[initialAlgorithm].simulate(initialPages, initialFrameCount)
    }
    return null
  })

  const [currentConfig, setCurrentConfig] = useState({
    algorithm: initialAlgorithm,
    frameCount: initialFrameCount,
    referenceString: Array.isArray(initialPages) ? [...initialPages] : [],
  })

  const runSimulation = useCallback(
    (pages = [], frameCount = 3, algorithmKey = 'FIFO') => {
      const algo = ALGORITHMS[algorithmKey]
      if (!algo || typeof algo.simulate !== 'function') {
        throw new Error(`Algoritma '${algorithmKey}' tidak ditemukan.`)
      }

      const simResult = algo.simulate(pages, frameCount)
      setResult(simResult)
      setCurrentConfig({
        algorithm: algorithmKey,
        frameCount,
        referenceString: [...pages],
      })

      return simResult
    },
    []
  )

  const resetSimulation = useCallback(() => {
    setResult(null)
    setCurrentConfig({
      algorithm: initialAlgorithm,
      frameCount: initialFrameCount,
      referenceString: [],
    })
  }, [initialAlgorithm, initialFrameCount])

  return {
    result,
    currentConfig,
    runSimulation,
    resetSimulation,
  }
}

export default useSimulation
