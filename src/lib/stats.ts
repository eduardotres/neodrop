import type { Drop } from './droplist'
import { dayKey } from './droplist'

export type DayCount = { day: string; count: number }
export type HourCount = { hour: number; count: number }
export type ItemCount = { name: string; count: number; share: number }

export type Range = { from: string; to: string }

/** Every day present in the log, ascending. Drives the filter shortcuts. */
export function daysCovered(drops: Drop[]): string[] {
  return [...new Set(drops.map((drop) => dayKey(drop.at)))].sort()
}

/**
 * Accent- and case-insensitive so "nucleo arcano" finds "Núcleo Arcano" — the
 * item names are pt_BR and nobody types the accents into a search box.
 */
export function filterByName(drops: Drop[], term: string): Drop[] {
  const needle = normalize(term)
  if (needle === '') return drops
  return drops.filter((drop) => normalize(drop.name).includes(needle))
}

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase()
}

/** Keeps the drops logged inside one hour of the day, across every day selected. */
export function filterByHour(drops: Drop[], hour: number | null): Drop[] {
  if (hour === null) return drops
  return drops.filter((drop) => drop.at.getHours() === hour)
}

export function filterByRange(drops: Drop[], range: Range | null): Drop[] {
  if (!range) return drops
  return drops.filter((drop) => {
    const day = dayKey(drop.at)
    return day >= range.from && day <= range.to
  })
}

/**
 * Counts per day across the whole span of the range, including days with zero
 * drops — a gap in a time axis has to read as zero, not as a missing bar.
 */
export function countByDay(drops: Drop[], range: Range | null): DayCount[] {
  const counts = new Map<string, number>()
  for (const drop of drops) {
    const day = dayKey(drop.at)
    counts.set(day, (counts.get(day) ?? 0) + 1)
  }

  const days = range ? daysBetween(range.from, range.to) : [...counts.keys()].sort()
  return days.map((day) => ({ day, count: counts.get(day) ?? 0 }))
}

/** Counts for all 24 hours, so the shape of the day is always comparable. */
export function countByHour(drops: Drop[]): HourCount[] {
  const counts = new Array<number>(24).fill(0)
  for (const drop of drops) counts[drop.at.getHours()]++
  return counts.map((count, hour) => ({ hour, count }))
}

/** Items ranked by how often they dropped, ties broken alphabetically. */
export function rankItems(drops: Drop[]): ItemCount[] {
  const counts = new Map<string, ItemCount>()
  for (const drop of drops) {
    const existing = counts.get(drop.name)
    if (existing) existing.count++
    else counts.set(drop.name, { name: drop.name, count: 1, share: 0 })
  }

  const total = drops.length
  return [...counts.values()]
    .map((item) => ({ ...item, share: total === 0 ? 0 : item.count / total }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'))
}

/**
 * The range the dashboard opens on: today, because that is the question the tool
 * exists to answer. When the log stops before today — it was uploaded days after
 * the session — falling back to the last day with drops beats opening on zeros.
 */
export function defaultRange(days: string[], today: string): Range {
  const last = days[days.length - 1]
  const withinLog = today >= days[0] && today <= last
  return withinLog ? { from: today, to: today } : { from: last, to: last }
}

export function daysBetween(from: string, to: string): string[] {
  if (from > to) return []
  const days: string[] = []
  const cursor = fromDayKey(from)
  const end = fromDayKey(to)
  while (cursor <= end) {
    days.push(
      `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(
        cursor.getDate(),
      ).padStart(2, '0')}`,
    )
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

/** Walks a day key by whole days, rolling over months and years correctly. */
export function addDays(day: string, delta: number): string {
  const date = fromDayKey(day)
  date.setDate(date.getDate() + delta)
  return dayKey(date)
}

/** Parses `YYYY-MM-DD` as local midnight — `new Date(str)` would read it as UTC. */
export function fromDayKey(day: string): Date {
  const [year, month, date] = day.split('-').map(Number)
  return new Date(year, month - 1, date)
}
