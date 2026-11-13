/**
 * Simulasi algoritma Page Replacement Optimal (Belady's OPT)
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
        // Cari halaman yang pemakaian berikutnya paling jauh di masa depan
        let optIndex = 0
        let furthestTime = -1

        for (let f = 0; f < frames.length; f++) {
          const p = frames[f]
          let nextUse = Infinity

          for (let next = i + 1; next < referenceString.length; next++) {
            if (referenceString[next] === p) {
              nextUse = next
              break
            }
          }

          // Jika tidak pernah dipakai lagi, langsung pilih untuk diganti
          if (nextUse === Infinity) {
            optIndex = f
            furthestTime = Infinity
            break
          }

          if (nextUse > furthestTime) {
            furthestTime = nextUse
            optIndex = f
          }
        }

        targetIndex = optIndex
        replaced = frames[targetIndex]
        frames[targetIndex] = page
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
