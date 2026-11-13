import { simulate as simulateFIFO } from './fifo.js'
import { simulate as simulateLRU } from './lru.js'
import { simulate as simulateOptimal } from './optimal.js'

export const FIFO = {
  id: 'FIFO',
  name: 'First-In, First-Out (FIFO)',
  simulate: simulateFIFO,
}

export const LRU = {
  id: 'LRU',
  name: 'Least Recently Used (LRU)',
  simulate: simulateLRU,
}

export const Optimal = {
  id: 'Optimal',
  name: 'Optimal (OPT)',
  simulate: simulateOptimal,
}

export const ALGORITHMS = {
  FIFO,
  LRU,
  Optimal,
}

export default ALGORITHMS
