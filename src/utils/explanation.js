/**
 * Menghasilkan kalimat penjelasan akademis per langkah simulasi
 * @param {object} step - Objek langkah { page, frames, isHit, replaced, frameIndex }
 * @param {string} algorithmId - ID algoritma ('FIFO', 'LRU', 'Optimal')
 * @returns {string}
 */
export function getStepExplanation(step, algorithmId = 'FIFO') {
  if (!step) return ''

  const { page, isHit, replaced, frameIndex } = step
  const frameNum = (frameIndex ?? 0) + 1

  if (isHit) {
    return `Halaman ${page} sudah ada di memori pada Frame ${frameNum} (page hit). Tidak ada pergantian halaman.`
  }

  // Page Fault tanpa pergantian (frame masih ada yang kosong)
  if (replaced === null || replaced === undefined) {
    return `Halaman ${page} tidak ada di memori (page fault). Dimuat ke Frame ${frameNum} yang masih kosong.`
  }

  // Page Fault dengan pergantian (frame penuh)
  switch (algorithmId) {
    case 'FIFO':
      return `Halaman ${page} tidak ada di memori (page fault). Halaman ${replaced} dikeluarkan karena masuk paling awal.`
    case 'LRU':
      return `Halaman ${page} tidak ada di memori (page fault). Halaman ${replaced} dikeluarkan karena paling lama tidak digunakan.`
    case 'Optimal':
      return `Halaman ${page} tidak ada di memori (page fault). Halaman ${replaced} dikeluarkan karena tidak akan digunakan lagi dalam waktu paling lama.`
    default:
      return `Halaman ${page} tidak ada di memori (page fault). Halaman ${replaced} dikeluarkan.`
  }
}

export default getStepExplanation
