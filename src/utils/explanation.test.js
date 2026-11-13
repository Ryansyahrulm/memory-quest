import { describe, it, expect } from 'vitest'
import { getStepExplanation } from './explanation.js'

describe('getStepExplanation', () => {
  it('Mengembalikan string kosong jika data step kosong', () => {
    expect(getStepExplanation(null)).toBe('')
    expect(getStepExplanation(undefined)).toBe('')
  })

  it('Menjelaskan kondisi Page Hit dengan tepat', () => {
    const hitStep = {
      page: 0,
      frames: [7, 0, 1],
      isHit: true,
      replaced: null,
      frameIndex: 1,
    }
    const explanation = getStepExplanation(hitStep, 'FIFO')
    expect(explanation).toBe(
      'Halaman 0 sudah ada di memori pada Frame 2 (page hit). Tidak ada pergantian halaman.'
    )
  })

  it('Menjelaskan kondisi Page Fault pada frame kosong (tanpa eviksi)', () => {
    const initialFaultStep = {
      page: 7,
      frames: [7],
      isHit: false,
      replaced: null,
      frameIndex: 0,
    }
    const explanation = getStepExplanation(initialFaultStep, 'FIFO')
    expect(explanation).toBe(
      'Halaman 7 tidak ada di memori (page fault). Dimuat ke Frame 1 yang masih kosong.'
    )
  })

  describe('Menjelaskan eviksi sesuai algoritma', () => {
    const evictionStep = {
      page: 3,
      frames: [3, 0, 1],
      isHit: false,
      replaced: 7,
      frameIndex: 0,
    }

    it('FIFO: menjelaskan bahwa halaman dikeluarkan karena masuk paling awal', () => {
      const text = getStepExplanation(evictionStep, 'FIFO')
      expect(text).toBe(
        'Halaman 3 tidak ada di memori (page fault). Halaman 7 dikeluarkan karena masuk paling awal.'
      )
    })

    it('LRU: menjelaskan bahwa halaman dikeluarkan karena paling lama tidak digunakan', () => {
      const text = getStepExplanation(evictionStep, 'LRU')
      expect(text).toBe(
        'Halaman 3 tidak ada di memori (page fault). Halaman 7 dikeluarkan karena paling lama tidak digunakan.'
      )
    })

    it('Optimal: menjelaskan bahwa halaman dikeluarkan karena tidak akan digunakan lagi dalam waktu paling lama', () => {
      const text = getStepExplanation(evictionStep, 'Optimal')
      expect(text).toBe(
        'Halaman 3 tidak ada di memori (page fault). Halaman 7 dikeluarkan karena tidak akan digunakan lagi dalam waktu paling lama.'
      )
    })
  })
})

