/**
 * Menghasilkan satu kalimat penjelasan per langkah simulasi page replacement.
 * Disesuaikan dengan status (hit/fault), nomor frame, dan algoritma yang aktif.
 *
 * @param {Object} step - Objek langkah { page, frames, isHit, replaced, frameIndex }
 * @param {string} [algorithmKey='FIFO'] - Algoritma yang dipilih ('FIFO', 'LRU', 'Optimal')
 * @returns {string} Kalimat penjelasan lugas untuk langkah terkait
 */
export function getStepExplanation(step, algorithmKey = 'FIFO') {
  if (!step) {
    return ''
  }

  const { page, isHit, replaced, frameIndex } = step
  const frameNumber = frameIndex + 1

  // Kasus Page Hit: Halaman sudah berada dalam frame memori
  if (isHit) {
    return `Halaman ${page} sudah ada di memori pada Frame ${frameNumber} (page hit). Tidak ada pergantian halaman.`
  }

  // Kasus Page Fault: Memori masih memiliki frame kosong (belum ada eviksi)
  if (replaced === null || replaced === undefined) {
    return `Halaman ${page} tidak ada di memori (page fault). Dimuat ke Frame ${frameNumber} yang masih kosong.`
  }

  // Kasus Page Fault dengan pergantian halaman (eviksi) berdasarkan strategi algoritma
  switch (algorithmKey) {
    case 'FIFO':
      return `Halaman ${page} tidak ada di memori (page fault). Halaman ${replaced} dikeluarkan karena masuk paling awal.`

    case 'LRU':
      return `Halaman ${page} tidak ada di memori (page fault). Halaman ${replaced} dikeluarkan karena paling lama tidak digunakan.`

    case 'Optimal':
      return `Halaman ${page} tidak ada di memori (page fault). Halaman ${replaced} dikeluarkan karena tidak akan digunakan lagi dalam waktu paling lama.`

    default:
      return `Halaman ${page} tidak ada di memori (page fault). Halaman ${replaced} dikeluarkan dari Frame ${frameNumber}.`
  }
}

