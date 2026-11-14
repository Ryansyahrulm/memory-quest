/**
 * Simulasi algoritma Page Replacement LRU (Least Recently Used)
 * @param {number[]} referenceString - Deretan nomor halaman
 * @param {number} frameCount - Jumlah alokasi frame memori
 * @returns {{ steps: Array<{page: number, frames: number[], isHit: boolean, replaced: number|null, frameIndex: number}>, totalHit: number, totalFault: number, hitRatio: number }}
 */
export function simulate(referenceString = [], frameCount = 3) {
  if (!Array.isArray(referenceString) || referenceString.length === 0 || frameCount <= 0) {
    return {
      steps: [],
      totalHit: 0,
      totalFault: 0,
      hitRatio: 0,
    }
  }

  const frames = []
  const lastUsed = new Map()
  const steps = []
  let totalHit = 0
  let totalFault = 0

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i]
    const existingIndex = frames.indexOf(page)

    if (existingIndex !== -1) {
      // Halaman sudah ada di memori (Hit)
      totalHit++
      lastUsed.set(page, i)
      steps.push({
        page,
        frames: [...frames],
        isHit: true,
        replaced: null,
        frameIndex: existingIndex,
      })
    } else {
      // Halaman belum ada di memori (Fault)
      totalFault++
      let replaced = null
      let targetIndex

      if (frames.length < frameCount) {
        targetIndex = frames.length
        frames.push(page)
      } else {
        // Cari halaman dengan akses terakhir paling lampau
        let lruPageIndex = 0
        let minTime = Infinity

        for (let f = 0; f < frames.length; f++) {
          const p = frames[f]
          const time = lastUsed.get(p) ?? -1
          if (time < minTime) {
            minTime = time
            lruPageIndex = f
          }
        }

        targetIndex = lruPageIndex
        replaced = frames[targetIndex]
        frames[targetIndex] = page
      }

      lastUsed.set(page, i)
      steps.push({
        page,
        frames: [...frames],
        isHit: false,
        replaced,
        frameIndex: targetIndex,
      })
    }
  }

  const totalSteps = steps.length
  const hitRatio = totalSteps > 0 ? Number(((totalHit / totalSteps) * 100).toFixed(2)) : 0

  return {
    steps,
    totalHit,
    totalFault,
    hitRatio,
  }
}

export default simulate
