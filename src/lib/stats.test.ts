import { describe, expect, it } from 'vitest'
import { dayKey, parseDropList } from './droplist'
import {
  addDays,
  countByDay,
  filterByHour,
  filterByName,
  normalize,
  countByHour,
  daysBetween,
  daysCovered,
  defaultRange,
  filterByRange,
  fromDayKey,
  rankItems,
} from './stats'

const log = parseDropList(
  [
    '[2026-09-08 06:00:00]: Dropou: $40#Núcleo Arcano (Alto)$',
    '[2026-09-08 06:30:00]: Dropou: $40#Núcleo Arcano (Alto)$',
    '[2026-09-08 23:10:00]: Dropou: $49#Fragmento Prismático$',
    '[2026-09-10 06:15:00]: Dropou: $40#Núcleo Arcano (Alto)$',
    '[2026-09-10 14:00:00]: Dropou: $13#Orbe de Topázio$',
  ].join('\r\n'),
).drops

describe('daysCovered', () => {
  it('lists distinct days ascending', () => {
    expect(daysCovered(log)).toEqual(['2026-09-08', '2026-09-10'])
  })
})

describe('filterByRange', () => {
  it('keeps both endpoints of the range', () => {
    expect(filterByRange(log, { from: '2026-09-08', to: '2026-09-10' })).toHaveLength(5)
  })

  it('narrows to a single day', () => {
    const day = filterByRange(log, { from: '2026-09-10', to: '2026-09-10' })
    expect(day).toHaveLength(2)
  })

  it('returns everything when there is no range', () => {
    expect(filterByRange(log, null)).toHaveLength(5)
  })
})

describe('filterByName', () => {
  it('matches without the accents the player will not type', () => {
    const found = filterByName(log, 'nucleo arcano')
    expect(found).toHaveLength(3)
    expect(found.every((drop) => drop.name === 'Núcleo Arcano (Alto)')).toBe(true)
  })

  it('matches a fragment anywhere in the name, ignoring case', () => {
    expect(filterByName(log, 'PRISMAT')).toHaveLength(1)
  })

  it('returns everything for an empty or whitespace term', () => {
    expect(filterByName(log, '')).toHaveLength(5)
    expect(filterByName(log, '   ')).toHaveLength(5)
  })

  it('returns nothing when no item matches', () => {
    expect(filterByName(log, 'espada lendária')).toEqual([])
  })
})

describe('normalize', () => {
  it('strips accents, trims and lowercases', () => {
    expect(normalize('  Fragmento Prismático  ')).toBe('fragmento prismatico')
    expect(normalize('Núcleo Arcano (Altíssimo)')).toBe('nucleo arcano (altissimo)')
  })
})

describe('filterByHour', () => {
  it('keeps one hour of the day across every day in the selection', () => {
    // 06:00 and 06:30 on the 8th, 06:15 on the 10th — the hour cuts across days.
    const six = filterByHour(log, 6)
    expect(six).toHaveLength(3)
    expect(six.every((drop) => drop.at.getHours() === 6)).toBe(true)
    expect(new Set(six.map((drop) => dayKey(drop.at))).size).toBe(2)
  })

  it('returns everything when no hour is picked', () => {
    expect(filterByHour(log, null)).toHaveLength(5)
  })

  it('returns nothing for an hour with no drops', () => {
    expect(filterByHour(log, 3)).toEqual([])
  })
})

describe('countByDay', () => {
  it('fills days with no drops as zero', () => {
    expect(countByDay(log, { from: '2026-09-08', to: '2026-09-10' })).toEqual([
      { day: '2026-09-08', count: 3 },
      { day: '2026-09-09', count: 0 },
      { day: '2026-09-10', count: 2 },
    ])
  })

  it('falls back to the days present when there is no range', () => {
    expect(countByDay(log, null)).toEqual([
      { day: '2026-09-08', count: 3 },
      { day: '2026-09-10', count: 2 },
    ])
  })
})

describe('countByHour', () => {
  it('always returns all 24 hours', () => {
    const hours = countByHour(log)
    expect(hours).toHaveLength(24)
    expect(hours[6]).toEqual({ hour: 6, count: 3 })
    expect(hours[23]).toEqual({ hour: 23, count: 1 })
    expect(hours[0]).toEqual({ hour: 0, count: 0 })
  })
})

describe('rankItems', () => {
  it('ranks by count and reports each item share of the total', () => {
    const ranked = rankItems(log)
    expect(ranked[0]).toEqual({
      name: 'Núcleo Arcano (Alto)',
      count: 3,
      share: 3 / 5,
    })
    expect(ranked.map((item) => item.name)).toEqual([
      'Núcleo Arcano (Alto)',
      'Fragmento Prismático',
      'Orbe de Topázio',
    ])
  })

  it('handles an empty selection without dividing by zero', () => {
    expect(rankItems([])).toEqual([])
  })
})

describe('defaultRange', () => {
  const days = ['2026-09-08', '2026-09-10']

  it('opens on today when the log reaches today', () => {
    expect(defaultRange(days, '2026-09-10')).toEqual({
      from: '2026-09-10',
      to: '2026-09-10',
    })
  })

  it('opens on today even on a day inside the log that has no drops', () => {
    expect(defaultRange(days, '2026-09-09')).toEqual({
      from: '2026-09-09',
      to: '2026-09-09',
    })
  })

  it('falls back to the last day with drops when the log is older than today', () => {
    expect(defaultRange(days, '2026-09-14')).toEqual({
      from: '2026-09-10',
      to: '2026-09-10',
    })
  })
})

describe('daysBetween', () => {
  it('spans a month boundary', () => {
    expect(daysBetween('2026-08-30', '2026-09-02')).toEqual([
      '2026-08-30',
      '2026-08-31',
      '2026-09-01',
      '2026-09-02',
    ])
  })

  it('returns an empty span when the range is inverted', () => {
    expect(daysBetween('2026-09-10', '2026-09-08')).toEqual([])
  })
})

describe('addDays', () => {
  it('walks back across a month boundary', () => {
    expect(addDays('2026-09-01', -1)).toBe('2026-08-31')
  })

  it('walks back across a year boundary', () => {
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('handles a leap day', () => {
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29')
  })

  it('returns the same day for a zero delta', () => {
    expect(addDays('2026-09-10', 0)).toBe('2026-09-10')
  })
})

describe('fromDayKey', () => {
  it('reads the key as local midnight, not UTC', () => {
    const date = fromDayKey('2026-09-08')
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(8)
    expect(date.getDate()).toBe(8)
    expect(date.getHours()).toBe(0)
  })
})
