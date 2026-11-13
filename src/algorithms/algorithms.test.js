import { describe, it, expect } from 'vitest'
import { FIFO, LRU, Optimal, ALGORITHMS } from './index.js'
import { simulate as simulateFIFO } from './fifo.js'
import { simulate as simulateLRU } from './lru.js'
import { simulate as simulateOptimal } from './optimal.js'

describe('Algoritma Page Replacement', () => {
  // Contoh klasik buku teks Silberschatz:
  // 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1 (3 frame)
  const classicRefString = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1]
  const classicFrames = 3

  describe('Contoh Klasik (3 Frame)', () => {
    it('FIFO menghasilkan tepat 15 page fault dan 5 hit', () => {
      const result = simulateFIFO(classicRefString, classicFrames)
      expect(result.totalFault).toBe(15)
      expect(result.totalHit).toBe(5)
      expect(result.hitRatio).toBe(25)
      expect(result.steps).toHaveLength(20)

      // Cek langkah pertama: 7 masuk ke frame 0
      expect(result.steps[0]).toEqual({
        page: 7,
        frames: [7],
        isHit: false,
        replaced: null,
        frameIndex: 0,
      })

      // Cek langkah kelima (indeks 4): akses 0 menghasilkan Hit
      expect(result.steps[4].page).toBe(0)
      expect(result.steps[4].isHit).toBe(true)
      expect(result.steps[4].replaced).toBeNull()
      expect(result.steps[4].frameIndex).toBe(1)
    })

    it('LRU menghasilkan tepat 12 page fault dan 8 hit', () => {
      const result = simulateLRU(classicRefString, classicFrames)
      expect(result.totalFault).toBe(12)
      expect(result.totalHit).toBe(8)
      expect(result.hitRatio).toBe(40)
      expect(result.steps).toHaveLength(20)

      // Cek pergantian pertama pada langkah ke-4 (halaman 2 menggantikan 7)
      expect(result.steps[3].page).toBe(2)
      expect(result.steps[3].isHit).toBe(false)
      expect(result.steps[3].replaced).toBe(7)
      expect(result.steps[3].frameIndex).toBe(0)
    })

    it('Optimal menghasilkan tepat 9 page fault dan 11 hit', () => {
      const result = simulateOptimal(classicRefString, classicFrames)
      expect(result.totalFault).toBe(9)
      expect(result.totalHit).toBe(11)
      expect(result.hitRatio).toBe(55)
      expect(result.steps).toHaveLength(20)

      // Pada langkah ke-4 (halaman 2), 7 diganti karena paling jauh di masa depan
      expect(result.steps[3].page).toBe(2)
      expect(result.steps[3].isHit).toBe(false)
      expect(result.steps[3].replaced).toBe(7)
    })
  })

  describe('Edge Cases', () => {
    describe('Frame = 1', () => {
      const ref = [1, 2, 1, 3]

      it('FIFO dengan 1 frame selalu fault jika halaman berikutnya beda', () => {
        const res = simulateFIFO(ref, 1)
        expect(res.totalFault).toBe(4)
        expect(res.totalHit).toBe(0)
        expect(res.steps[1].replaced).toBe(1)
        expect(res.steps[2].replaced).toBe(2)
      })

      it('LRU dengan 1 frame menghasilkan hit saat halaman berulang', () => {
        const res = simulateLRU([1, 1, 2], 1)
        expect(res.totalFault).toBe(2)
        expect(res.totalHit).toBe(1)
        expect(res.steps[1].isHit).toBe(true)
      })

      it('Optimal dengan 1 frame konsisten mengganti frame', () => {
        const res = simulateOptimal([1, 2, 3], 1)
        expect(res.totalFault).toBe(3)
        expect(res.totalHit).toBe(0)
      })
    })

    describe('Reference String Kosong', () => {
      it('Mengembalikan state kosong tanpa error untuk semua algoritma', () => {
        const emptyFIFO = simulateFIFO([], 3)
        const emptyLRU = simulateLRU([], 3)
        const emptyOPT = simulateOptimal([], 3)

        for (const res of [emptyFIFO, emptyLRU, emptyOPT]) {
          expect(res.steps).toEqual([])
          expect(res.totalHit).toBe(0)
          expect(res.totalFault).toBe(0)
          expect(res.hitRatio).toBe(0)
        }
      })
    })

    describe('Semua Halaman Sama', () => {
      const samePages = [4, 4, 4, 4, 4]

      it('Hanya 1 fault di awal, sisanya hit (hit ratio 80%)', () => {
        const resFIFO = simulateFIFO(samePages, 3)
        const resLRU = simulateLRU(samePages, 3)
        const resOPT = simulateOptimal(samePages, 3)

        for (const res of [resFIFO, resLRU, resOPT]) {
          expect(res.totalFault).toBe(1)
          expect(res.totalHit).toBe(4)
          expect(res.hitRatio).toBe(80)
          expect(res.steps[0].isHit).toBe(false)
          expect(res.steps[1].isHit).toBe(true)
          expect(res.steps[2].isHit).toBe(true)
        }
      })
    })
  })

  describe('Ekspor Map ALGORITHMS', () => {
    it('Mengekspor objek algoritma dengan struktur yang tepat', () => {
      expect(ALGORITHMS.FIFO).toBeDefined()
      expect(ALGORITHMS.LRU).toBeDefined()
      expect(ALGORITHMS.Optimal).toBeDefined()

      expect(typeof FIFO.simulate).toBe('function')
      expect(typeof LRU.simulate).toBe('function')
      expect(typeof Optimal.simulate).toBe('function')

      expect(FIFO.name).toBe('First-In, First-Out (FIFO)')
      expect(LRU.name).toBe('Least Recently Used (LRU)')
      expect(Optimal.name).toBe('Optimal (OPT)')
    })
  })
})
