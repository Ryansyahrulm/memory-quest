/**
 * Parser dan validator untuk string referensi halaman
 * @param {string} input - Teks masukan pengguna (dipisah spasi atau koma)
 * @returns {{ valid: boolean, numbers: number[], error: string | null }}
 */
export function parseReferenceString(input) {
  if (typeof input !== 'string') {
    return { valid: false, numbers: [], error: 'Input harus berupa teks.' }
  }

  const trimmed = input.trim()
  if (!trimmed) {
    return { valid: false, numbers: [], error: 'Reference string tidak boleh kosong.' }
  }

  // Pisahkan berdasarkan spasi atau koma
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean)

  if (tokens.length === 0) {
    return { valid: false, numbers: [], error: 'Masukkan minimal satu halaman.' }
  }

  if (tokens.length > 30) {
    return {
      valid: false,
      numbers: [],
      error: `Maksimal 30 halaman (saat ini ${tokens.length} halaman).`,
    }
  }

  const numbers = []
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    // Cek apakah angka bulat non-negatif
    if (!/^\d+$/.test(token)) {
      return {
        valid: false,
        numbers: [],
        error: `Karakter "${token}" tidak valid. Hanya angka 0-99 yang diperbolehkan.`,
      }
    }

    const num = Number(token)
    if (num < 0 || num > 99) {
      return {
        valid: false,
        numbers: [],
        error: `Nilai halaman ${num} di luar rentang (hanya 0-99).`,
      }
    }

    numbers.push(num)
  }

  return { valid: true, numbers, error: null }
}

/**
 * Menghasilkan string referensi acak
 * @param {number} length - Jumlah halaman (default 12)
 * @param {number} maxPage - Nilai halaman tertinggi (default 7)
 * @returns {string}
 */
export function generateRandomReferenceString(length = 12, maxPage = 7) {
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(Math.floor(Math.random() * (maxPage + 1)))
  }
  return result.join(' ')
}

export const PRESET_CLASSIC = '7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1'
export const PRESET_BELADY = '1 2 3 4 1 2 5 1 2 3 4 5'
