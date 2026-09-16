import { normalize, type ItemCount } from './stats'

/**
 * What an item is worth inside the game, in Alz. The log never carries a price, so
 * this is kept by hand — add an entry when a value is known, and leave an item out
 * rather than guess. Keys go through `normalize`, so accents and case don't matter.
 */
const PRICES: Record<string, number> = {
  'Jóia Azul Enfraquecida': 120_000_000,
  'Jóia Verde Enfraquecida': 80_000_000,
  'Jóia Violeta Enfraquecida': 180_000_000,
  'Jóia Branca Enfraquecida': 280_000_000,
  'Jóia Amarela Enfraquecida': 40_000_000,
}

const byName = new Map(
  Object.entries(PRICES).map(([name, alz]) => [normalize(name), alz]),
)

export function priceOf(name: string): number | null {
  return byName.get(normalize(name)) ?? null
}

/**
 * Game shorthand, as players write it: `k` is a thousand and `kk` a million, so
 * 120 000 000 reads "120kk". From a billion up it is `B` — "1.92B", not "1,92kkk".
 * Fractions keep up to two decimals with a dot, the way players type them.
 */
export function formatAlz(alz: number): string {
  const units = [
    { suffix: 'B', size: 1_000_000_000 },
    { suffix: 'kk', size: 1_000_000 },
    { suffix: 'k', size: 1_000 },
  ]
  const unit = units.find((candidate) => alz >= candidate.size)
  if (!unit) return String(alz)
  const value = alz / unit.size
  return `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}${unit.suffix}`
}

export type JewelRow = {
  name: string
  count: number
  price: number | null
  total: number
}
export type JewelDrops = {
  rows: JewelRow[]
  /** How many jewels dropped, priced or not. */
  count: number
  total: number
  unpriced: number
}

/**
 * The jewels out of a ranking, each priced and multiplied by how many dropped.
 * A jewel with no known price still gets a row — hiding it would make the total look
 * complete when it isn't — but counts toward `unpriced` instead of the sum.
 * Ordered by what the drops were worth, then by count.
 */
export function jewelDrops(items: ItemCount[]): JewelDrops {
  const rows = items
    .filter((item) => normalize(item.name).startsWith('joia '))
    .map((item) => {
      const price = priceOf(item.name)
      return {
        name: item.name,
        count: item.count,
        price,
        total: price === null ? 0 : price * item.count,
      }
    })
    .sort((a, b) => b.total - a.total || b.count - a.count)

  return {
    rows,
    count: rows.reduce((sum, row) => sum + row.count, 0),
    total: rows.reduce((sum, row) => sum + row.total, 0),
    unpriced: rows.filter((row) => row.price === null).length,
  }
}
