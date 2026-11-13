/**
 * Memvalidasi dan mengurai reference string input pengguna
 * Aturan: hanya angka 0-99, dipisah spasi atau koma, maksimal 30 halaman
 * @param {string} input - Teks input reference string
 * @returns {{ isValid: boolean, pages: number[], error: string | null }}
 */
export function validateReferenceString(input) {
  if (input === undefined || input === null || typeof input !== 'string') {
    return {
      isValid: false,
      pages: [],
      error: 'Reference string tidak boleh kosong.',
    }
  }

  const trimmed = input.trim()
  if (trimmed === '') {
    return {
      isValid: false,
      pages: [],
      error: 'Reference string tidak boleh kosong.',
    }
  }

  // Pisahkan berdasarkan spasi atau koma
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean)

  if (tokens.length === 0) {
    return {
      isValid: false,
      pages: [],
      error: 'Reference string tidak boleh kosong.',
    }
  }

  if (tokens.length > 30) {
    return {
      isValid: false,
      pages: [],
      error: `Maksimal 30 halaman diperbolehkan (saat ini ${tokens.length} halaman).`,
    }
  }

  const pages = []
  for (const token of tokens) {
    // Validasi token hanya berisi angka bulat non-negatif
    if (!/^\d+$/.test(token)) {
      return {
        isValid: false,
        pages: [],
        error: `Input '${token}' tidak valid. Hanya angka 0-99 yang diperbolehkan.`,
      }
    }

    const num = Number(token)
    if (num < 0 || num > 99) {
      return {
        isValid: false,
        pages: [],
        error: `Nomor halaman ${num} di luar jangkauan. Hanya angka 0-99 yang diperbolehkan.`,
      }
    }

    pages.push(num)
  }

  return {
    isValid: true,
    pages,
    error: null,
  }
}

/**
 * Menghasilkan reference string acak untuk simulasi
 * @param {number} [count=12] - Jumlah nomor halaman
 * @param {number} [maxPage=7] - Nilai maksimum halaman
 * @returns {string}
 */
export function generateRandomReferenceString(count = 12, maxPage = 7) {
  const pages = []
  for (let i = 0; i < count; i++) {
    pages.push(Math.floor(Math.random() * (maxPage + 1)))
  }
  return pages.join(' ')
}

