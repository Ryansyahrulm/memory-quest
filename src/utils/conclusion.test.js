import { describe, it, expect } from 'vitest'
import { generateComparisonConclusion } from './conclusion.js'

describe('generateComparisonConclusion', () => {
  it('Mengembalikan teks kosong jika objek results tidak lengkap', () => {
    expect(generateComparisonConclusion(null)).toBe('')
    expect(generateComparisonConclusion({})).toBe('')
  })

  it('Contoh umum: Optimal (9), LRU (12), FIFO (15)', () => {
    const results = {
      FIFO: { totalFault: 15, totalHit: 5, hitRatio: 25 },
      LRU: { totalFault: 12, totalHit: 8, hitRatio: 40 },
      Optimal: { totalFault: 9, totalHit: 11, hitRatio: 55 },
    }
    const text = generateComparisonConclusion(results)
    expect(text).toBe(
      'Pada input ini Optimal menghasilkan 9 fault, lebih sedikit dari LRU (12) dan FIFO (15).'
    )
  })

  it('Kasus ketiga algoritma menghasilkan fault yang sama', () => {
    const results = {
      FIFO: { totalFault: 10, totalHit: 2, hitRatio: 16.7 },
      LRU: { totalFault: 10, totalHit: 2, hitRatio: 16.7 },
      Optimal: { totalFault: 10, totalHit: 2, hitRatio: 16.7 },
    }
    const text = generateComparisonConclusion(results)
    expect(text).toContain('ketiga algoritma menghasilkan performa identik dengan masing-masing 10 page fault')
  })

  it('Kasus Optimal dan LRU seri sebagai yang terbaik', () => {
    const results = {
      FIFO: { totalFault: 14, totalHit: 4, hitRatio: 22.2 },
      LRU: { totalFault: 8, totalHit: 10, hitRatio: 55.6 },
      Optimal: { totalFault: 8, totalHit: 10, hitRatio: 55.6 },
    }
    const text = generateComparisonConclusion(results)
    expect(text).toBe(
      'Pada input ini Optimal dan LRU sama-sama menghasilkan 8 fault, lebih sedikit dari FIFO (14).'
    )
  })

  it('Kasus Optimal terbaik tunggal dengan LRU dan FIFO seri', () => {
    const results = {
      FIFO: { totalFault: 12, totalHit: 6, hitRatio: 33.3 },
      LRU: { totalFault: 12, totalHit: 6, hitRatio: 33.3 },
      Optimal: { totalFault: 9, totalHit: 9, hitRatio: 50 },
    }
    const text = generateComparisonConclusion(results)
    expect(text).toBe(
      'Pada input ini Optimal menghasilkan 9 fault, lebih sedikit dari LRU dan FIFO (keduanya 12).'
    )
  })
})

