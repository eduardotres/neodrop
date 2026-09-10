import { dayKey } from '../lib/droplist'
import type { Range } from '../lib/stats'
import { addDays, daysBetween } from '../lib/stats'

type Props = {
  days: string[]
  range: Range
  onChange: (range: Range) => void
  search: string
  onSearch: (search: string) => void
}

/**
 * Filters sit in one row above the charts. "Hoje" and "Ontem" are real calendar
 * days; the rolling windows are anchored to the log instead (see below).
 */
export default function RangeFilter({
  days,
  range,
  onChange,
  search,
  onSearch,
}: Props) {
  const first = days[0]
  const last = days[days.length - 1]
  const today = dayKey(new Date())
  const yesterday = addDays(today, -1)

  // A named day only earns a button when the log actually covers it — otherwise it
  // would be a shortcut that always reads zero.
  const covers = (day: string) => day >= first && day <= last

  // The rolling windows are anchored to the last logged day rather than to today, so
  // they still show data when the file was uploaded days after the session. In the
  // normal case — the log reaching today — the two anchors are the same day.
  const window = (size: number) => ({ from: shiftBack(last, size - 1, first), to: last })

  // A short log makes several of these resolve to the same span. They collapse into
  // one button, and `rank` decides which label survives: "Hoje", "Ontem" and "Tudo"
  // say what the period is, "últimos N dias" only says how it was computed.
  const shortcuts = dedupe([
    ...(covers(today) ? [{ label: 'Hoje', rank: 0, range: { from: today, to: today } }] : []),
    ...(covers(yesterday)
      ? [{ label: 'Ontem', rank: 1, range: { from: yesterday, to: yesterday } }]
      : []),
    { label: 'Último dia', rank: 2, range: { from: last, to: last } },
    { label: 'Últimos 7 dias', rank: 4, range: window(7) },
    { label: 'Últimos 15 dias', rank: 5, range: window(15) },
    { label: 'Últimos 30 dias', rank: 6, range: window(30) },
    { label: 'Tudo', rank: 3, range: { from: first, to: last } },
  ])

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-3xl bg-panel px-5 py-4">
      <div className="flex flex-wrap gap-1">
        {shortcuts.map((shortcut) => {
          const active =
            shortcut.range.from === range.from && shortcut.range.to === range.to
          return (
            <button
              key={shortcut.label}
              type="button"
              onClick={() => onChange(shortcut.range)}
              className={[
                'rounded-xl px-4 py-2 text-sm font-bold transition-colors duration-200',
                active
                  ? 'bg-gold text-onaccent'
                  : 'text-mute hover:bg-glow hover:text-gold',
              ].join(' ')}
            >
              {shortcut.label}
            </button>
          )
        })}
      </div>

      <div className="relative min-w-40 flex-1">
        <input
          type="search"
          value={search}
          placeholder="Filtrar por item…"
          onChange={(event) => onSearch(event.target.value)}
          className="w-full rounded-xl border border-line bg-raise py-2 pl-4 pr-20 text-sm text-ink placeholder:text-mute/70 focus:border-gold focus:outline-none"
        />
        {search.trim() !== '' && (
          <button
            type="button"
            onClick={() => onSearch('')}
            className="absolute inset-y-0 right-3 my-auto h-fit rounded-lg px-2 py-1 text-xs font-semibold text-mute transition-colors hover:text-gold"
          >
            limpar
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-mute">
        <label className="flex items-center gap-1.5">
          De
          <input
            type="date"
            value={range.from}
            min={first}
            max={range.to}
            onChange={(event) => onChange({ ...range, from: event.target.value })}
            className="nums rounded-xl border border-line bg-raise px-3 py-1.5 text-ink"
          />
        </label>
        <label className="flex items-center gap-1.5">
          até
          <input
            type="date"
            value={range.to}
            min={range.from}
            max={last}
            onChange={(event) => onChange({ ...range, to: event.target.value })}
            className="nums rounded-xl border border-line bg-raise px-3 py-1.5 text-ink"
          />
        </label>
      </div>
    </div>
  )
}

type Shortcut = { label: string; rank: number; range: Range }

/** Keeps the best-labelled shortcut per span, in the order they were declared. */
function dedupe(shortcuts: Shortcut[]): Shortcut[] {
  const best = new Map<string, Shortcut>()
  for (const shortcut of shortcuts) {
    const key = `${shortcut.range.from}..${shortcut.range.to}`
    const held = best.get(key)
    if (!held || shortcut.rank < held.rank) best.set(key, shortcut)
  }
  const kept = new Set(best.values())
  return shortcuts.filter((shortcut) => kept.has(shortcut))
}

/** Walks `count` days back from `day`, never past the first day in the log. */
function shiftBack(day: string, count: number, floor: string): string {
  const span = daysBetween(floor, day)
  return span[Math.max(0, span.length - 1 - count)] ?? floor
}
