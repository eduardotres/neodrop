import { describe, expect, it } from 'vitest'
import { formatAlz, jewelDrops, priceOf } from './prices'

describe('priceOf', () => {
  it('finds a known item', () => {
    expect(priceOf('Jóia Azul Enfraquecida')).toBe(120_000_000)
  })

  it('ignores accents and case', () => {
    expect(priceOf('joia verde enfraquecida')).toBe(80_000_000)
  })

  it('returns null for an item without a price', () => {
    expect(priceOf('Núcleo Arcano (Alto)')).toBeNull()
  })
})

describe('formatAlz', () => {
  it('writes millions as kk', () => {
    expect(formatAlz(120_000_000)).toBe('120kk')
  })

  it('keeps up to two decimals', () => {
    expect(formatAlz(1_500_000)).toBe('1.5kk')
    expect(formatAlz(120_000_000 * 16)).toBe('1.92B')
  })

  it('uses k below a million and B from a billion', () => {
    expect(formatAlz(500_000)).toBe('500k')
    expect(formatAlz(2_000_000_000)).toBe('2B')
  })

  it('leaves small values as plain numbers', () => {
    expect(formatAlz(950)).toBe('950')
  })
})

describe('jewelDrops', () => {
  const items = [
    { name: 'Jóia Amarela Enfraquecida', count: 22, share: 0.5 },
    { name: 'Jóia Azul Enfraquecida', count: 16, share: 0.3 },
    { name: 'Núcleo Arcano (Alto)', count: 10, share: 0.1 },
    { name: 'Jóia Verde Enfraquecida', count: 3, share: 0.1 },
  ]

  it('keeps only jewels and multiplies price by count', () => {
    const { rows } = jewelDrops(items)
    expect(rows.map((row) => row.name)).toEqual([
      'Jóia Azul Enfraquecida',
      'Jóia Verde Enfraquecida',
      'Jóia Amarela Enfraquecida',
    ])
    expect(rows[0].total).toBe(1_920_000_000)
  })

  it('counts every jewel, sums the priced ones and flags the rest', () => {
    const drops = jewelDrops(items)
    expect(drops.count).toBe(41)
    expect(drops.total).toBe(2_160_000_000)
    expect(drops.unpriced).toBe(1)
  })

  it('is empty when no jewel dropped', () => {
    expect(jewelDrops([items[2]])).toEqual({ rows: [], count: 0, total: 0, unpriced: 0 })
  })
})
