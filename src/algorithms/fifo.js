/**
 * Simulasi algoritma Page Replacement FIFO (First-In, First-Out)
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
  const steps = []
  let totalHit = 0
  let totalFault = 0
  let fifoIndex = 0

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i]
    const existingIndex = frames.indexOf(page)

    if (existingIndex !== -1) {
      // Halaman sudah ada di memori (Hit)
      totalHit++
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
      let targetIndex = -1

      if (frames.length < frameCount) {
        targetIndex = frames.length
        frames.push(page)
      } else {
        targetIndex = fifoIndex
        replaced = frames[targetIndex]
        frames[targetIndex] = page
        fifoIndex = (fifoIndex + 1) % frameCount
      }

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
