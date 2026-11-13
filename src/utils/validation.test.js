import { describe, it, expect } from 'vitest'
import { validateReferenceString, generateRandomReferenceString } from './validation.js'

describe('Validasi Reference String', () => {
  it('Menerima string angka valid yang dipisahkan spasi', () => {
    const res = validateReferenceString('7 0 1 2 0 3')
    expect(res.isValid).toBe(true)
    expect(res.error).toBeNull()
    expect(res.pages).toEqual([7, 0, 1, 2, 0, 3])
  })

  it('Menerima string angka valid yang dipisahkan koma dan spasi bercampur', () => {
    const res = validateReferenceString('7, 0, 1, 2,0, 3')
    expect(res.isValid).toBe(true)
    expect(res.error).toBeNull()
    expect(res.pages).toEqual([7, 0, 1, 2, 0, 3])
  })

  it('Menerima angka bernilai batas 0 dan 99', () => {
    const res = validateReferenceString('0 99 50')
    expect(res.isValid).toBe(true)
    expect(res.pages).toEqual([0, 99, 50])
  })

  it('Menolak string kosong atau hanya spasi', () => {
    const resEmpty = validateReferenceString('')
    expect(resEmpty.isValid).toBe(false)
    expect(resEmpty.error).toBe('Reference string tidak boleh kosong.')

    const resSpaces = validateReferenceString('   ')
    expect(resSpaces.isValid).toBe(false)
    expect(resSpaces.error).toBe('Reference string tidak boleh kosong.')
  })

  it('Menolak karakter bukan angka (huruf atau simbol)', () => {
    const resAlpha = validateReferenceString('7 0 abc 2')
    expect(resAlpha.isValid).toBe(false)
    expect(resAlpha.error).toContain('Hanya angka 0-99 yang diperbolehkan')

    const resNegative = validateReferenceString('7 -1 2')
    expect(resNegative.isValid).toBe(false)
    expect(resNegative.error).toContain('Hanya angka 0-99 yang diperbolehkan')
  })

  it('Menolak angka di atas 99', () => {
    const resOver = validateReferenceString('7 100 2')
    expect(resOver.isValid).toBe(false)
    expect(resOver.error).toContain('di luar jangkauan')
  })

  it('Menolak jika melebihi batas maksimal 30 halaman', () => {
    const pages31 = Array.from({ length: 31 }, (_, i) => i % 10).join(' ')
    const resOverCount = validateReferenceString(pages31)
    expect(resOverCount.isValid).toBe(false)
    expect(resOverCount.error).toContain('Maksimal 30 halaman diperbolehkan')

    const pages30 = Array.from({ length: 30 }, (_, i) => i % 10).join(' ')
    const resValidCount = validateReferenceString(pages30)
    expect(resValidCount.isValid).toBe(true)
    expect(resValidCount.pages).toHaveLength(30)
  })

  it('Menghasilkan string acak yang valid dengan fungsi generateRandomReferenceString', () => {
    const randomStr = generateRandomReferenceString(15, 7)
    const res = validateReferenceString(randomStr)
    expect(res.isValid).toBe(true)
    expect(res.pages).toHaveLength(15)
    for (const page of res.pages) {
      expect(page).toBeGreaterThanOrEqual(0)
      expect(page).toBeLessThanOrEqual(7)
    }
  })
})

