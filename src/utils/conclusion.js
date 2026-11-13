/**
 * Menghasilkan kalimat kesimpulan otomatis perbandingan performa page replacement.
 *
 * @param {{
 *   FIFO: { totalFault: number, totalHit: number, hitRatio: number },
 *   LRU: { totalFault: number, totalHit: number, hitRatio: number },
 *   Optimal: { totalFault: number, totalHit: number, hitRatio: number }
 * }} results - Hasil simulasi ketiga algoritma
 * @returns {string} Paragraf kesimpulan perbandingan
 */
export function generateComparisonConclusion(results) {
  if (!results || !results.FIFO || !results.LRU || !results.Optimal) {
    return ''
  }

  const f = results.FIFO.totalFault
  const l = results.LRU.totalFault
  const o = results.Optimal.totalFault

  // Kasus 1: Ketiga algoritma menghasilkan jumlah fault yang sama
  if (f === l && l === o) {
    return `Pada input ini, ketiga algoritma menghasilkan performa identik dengan masing-masing ${o} page fault (hit ratio ${results.Optimal.hitRatio}%).`
  }

  // Kasus 2: Optimal adalah yang terbaik secara tunggal
  if (o < l && o < f) {
    if (l === f) {
      return `Pada input ini Optimal menghasilkan ${o} fault, lebih sedikit dari LRU dan FIFO (keduanya ${l}).`
    }
    if (l < f) {
      return `Pada input ini Optimal menghasilkan ${o} fault, lebih sedikit dari LRU (${l}) dan FIFO (${f}).`
    }
    return `Pada input ini Optimal menghasilkan ${o} fault, lebih sedikit dari FIFO (${f}) dan LRU (${l}).`
  }

  // Kasus 3: Optimal dan LRU sama-sama terbaik
  if (o === l && o < f) {
    return `Pada input ini Optimal dan LRU sama-sama menghasilkan ${o} fault, lebih sedikit dari FIFO (${f}).`
  }

  // Kasus 4: Optimal dan FIFO sama-sama terbaik
  if (o === f && o < l) {
    return `Pada input ini Optimal dan FIFO sama-sama menghasilkan ${o} fault, lebih sedikit dari LRU (${l}).`
  }

  // Kasus 5: LRU dan FIFO sama-sama terbaik
  if (l === f && l < o) {
    return `Pada input ini LRU dan FIFO sama-sama menghasilkan ${l} fault, lebih sedikit dari Optimal (${o}).`
  }

  // Kasus 6: LRU terbaik tunggal
  if (l < o && l < f) {
    if (o === f) {
      return `Pada input ini LRU menghasilkan ${l} fault, lebih sedikit dari Optimal dan FIFO (keduanya ${o}).`
    }
    if (o < f) {
      return `Pada input ini LRU menghasilkan ${l} fault, lebih sedikit dari Optimal (${o}) dan FIFO (${f}).`
    }
    return `Pada input ini LRU menghasilkan ${l} fault, lebih sedikit dari FIFO (${f}) dan Optimal (${o}).`
  }

  // Kasus 7: FIFO terbaik tunggal
  if (f < o && f < l) {
    if (o === l) {
      return `Pada input ini FIFO menghasilkan ${f} fault, lebih sedikit dari Optimal dan LRU (keduanya ${o}).`
    }
    if (o < l) {
      return `Pada input ini FIFO menghasilkan ${f} fault, lebih sedikit dari Optimal (${o}) dan LRU (${l}).`
    }
    return `Pada input ini FIFO menghasilkan ${f} fault, lebih sedikit dari LRU (${l}) dan Optimal (${o}).`
  }

  return `Perbandingan: Optimal (${o} fault), LRU (${l} fault), FIFO (${f} fault).`
}

export const BELADY_REFERENCE_STRING = '1 2 3 4 1 2 5 1 2 3 4 5'
export const BELADY_PAGES = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]

