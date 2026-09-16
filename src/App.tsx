import { useMemo, useState } from 'react'
import ColumnChart from './components/ColumnChart'
import Dropzone from './components/Dropzone'
import ImportantFilter from './components/ImportantFilter'
import ItemRanking from './components/ItemRanking'
import JewelDrops from './components/JewelDrops'
import Logo from './components/Logo'
import RangeFilter from './components/RangeFilter'
import SiteFooter from './components/SiteFooter'
import StatTile from './components/StatTile'
import WhereIsTheFile from './components/WhereIsTheFile'
import { dayKey, parseDropListFile, type ParseResult } from './lib/droplist'
import { countByGroup, filterImportant } from './lib/important'
import {
  countByDay,
  countByHour,
  daysBetween,
  addDays,
  daysCovered,
  defaultRange,
  filterByHour,
  filterByName,
  filterByRange,
  fromDayKey,
  rankItems,
  type Range,
} from './lib/stats'

type Loaded = { result: ParseResult; fileName: string; days: string[] }

export default function App() {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [range, setRange] = useState<Range | null>(null)
  const [search, setSearch] = useState('')
  const [important, setImportant] = useState(false)
  const [hour, setHour] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setLoaded(null)
    setRange(null)
    setSearch('')
    setImportant(false)
    setHour(null)
    setError(null)
  }

  const handleFile = async (file: File) => {
    setError(null)
    try {
      const result = await parseDropListFile(file)
      if (result.drops.length === 0) {
        setError(
          result.rejected.length > 0
            ? 'Esse arquivo não tem nenhuma linha de drop reconhecida. Confira se é mesmo o DropList.'
            : 'O arquivo está vazio.',
        )
        return
      }
      const days = daysCovered(result.drops)
      setLoaded({ result, fileName: file.name, days })
      setRange(defaultRange(days, dayKey(new Date())))
      setSearch('')
      setImportant(false)
      setHour(null)
    } catch {
      setError('Não consegui ler esse arquivo.')
    }
  }

  if (!loaded || !range) {
    return (
      <main className="relative mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-4 py-12">
        <div aria-hidden className="bloom pointer-events-none fixed inset-0 -z-10" />

        <div className="rise text-center">
          <Logo size={56} className="mx-auto" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Neo Games EP38
          </p>
          <h1 className="mt-2.5 text-4xl font-extrabold tracking-tight text-ink">
            DropList
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-mute">
            O cliente do jogo anota cada item que cai. Suba esse arquivo e veja quantos
            você pegou em cada dia, em que horário caíram e quais mais apareceram.
          </p>
        </div>

        <div className="rise mt-8" style={{ animationDelay: '90ms' }}>
          <Dropzone onFile={handleFile} />
        </div>

        <div className="rise mt-12" style={{ animationDelay: '180ms' }}>
          <WhereIsTheFile />
        </div>

        <div className="rise" style={{ animationDelay: '260ms' }}>
          <SiteFooter />
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-panel px-5 py-4 text-sm leading-relaxed text-mute">
            {error}
          </p>
        )}
      </main>
    )
  }

  return (
    <Dashboard
      loaded={loaded}
      range={range}
      onRange={setRange}
      search={search}
      onSearch={setSearch}
      important={important}
      onImportant={setImportant}
      hour={hour}
      onHour={setHour}
      onReset={reset}
      error={error}
    />
  )
}

function Dashboard({
  loaded,
  range,
  onRange,
  search,
  onSearch,
  important,
  onImportant,
  hour,
  onHour,
  onReset,
  error,
}: {
  loaded: Loaded
  range: Range
  onRange: (range: Range) => void
  search: string
  onSearch: (search: string) => void
  important: boolean
  onImportant: (important: boolean) => void
  hour: number | null
  onHour: (hour: number | null) => void
  onReset: () => void
  error: string | null
}) {
  const { result, fileName, days } = loaded

  const searching = search.trim() !== ''

  // The "importantes" toggle and the name both narrow what the log is, so they come
  // first and every card reads them.
  const kept = useMemo(
    () => filterByName(filterImportant(result.drops, important), search),
    [result.drops, important, search],
  )

  // Range, then hour. The hour chart is drawn from the set *before* the hour, so
  // picking 9h doesn't collapse the chart you picked from into a single bar.
  // Everything else reads the fully filtered set.
  const beforeHour = useMemo(() => filterByRange(kept, range), [kept, range])
  const selected = useMemo(() => filterByHour(beforeHour, hour), [beforeHour, hour])

  const wholeFile = useMemo(() => filterByHour(kept, hour), [kept, hour])
  const fullSpan = useMemo<Range>(
    () => ({ from: days[0], to: days[days.length - 1] }),
    [days],
  )
  const byDay = useMemo(() => countByDay(wholeFile, fullSpan), [wholeFile, fullSpan])
  const byHour = useMemo(() => countByHour(beforeHour), [beforeHour])
  const items = useMemo(() => rankItems(selected), [selected])

  // Counted without the toggle, so the strip reads the same whether it is on or off.
  const groups = useMemo(
    () =>
      countByGroup(
        filterByHour(filterByRange(filterByName(result.drops, search), range), hour),
      ),
    [result.drops, search, range, hour],
  )

  const spanDays = daysBetween(range.from, range.to).length
  const activeDays = byDay.filter((day) => day.count > 0).length
  const average = spanDays === 0 ? 0 : selected.length / spanDays

  const singleDay = range.from === range.to
  const today = dayKey(new Date())
  const namedDay = singleDay
    ? range.from === today
      ? 'hoje'
      : range.from === addDays(today, -1)
        ? 'ontem'
        : null
    : null
  const peakHour = byHour.reduce((best, hour) => (hour.count > best.count ? hour : best))

  const hourLabel = hour === null ? null : `${String(hour).padStart(2, '0')}h`

  const pickDay = (day: string) =>
    onRange(range.from === day && range.to === day ? fullSpan : { from: day, to: day })

  const emptyMessage = searching
    ? 'Nenhum item com esse nome no período.'
    : important
      ? 'Nenhum item importante no período.'
      : 'Nenhum drop no período.'

  return (
    <main className="mx-auto max-w-[1408px] px-3 py-10 sm:px-4">
      <Header onReset={onReset} />

      <p className="mt-2 text-sm text-mute/70">
        <span className="font-mono font-semibold text-mute">{fileName}</span> ·{' '}
        {result.drops.length.toLocaleString('pt-BR')} drops ·{' '}
        {formatDay(days[0])} a {formatDay(days[days.length - 1])}
        {result.rejected.length > 0 &&
          ` · ${result.rejected.length.toLocaleString('pt-BR')} linhas ignoradas`}
      </p>

      {error && (
        <p className="mt-4 rounded-2xl bg-panel px-5 py-4 text-sm leading-relaxed text-mute">
          {error}
        </p>
      )}

      <div className="mt-6">
        <RangeFilter
          days={days}
          range={range}
          onChange={onRange}
          search={search}
          onSearch={onSearch}
        />
      </div>

      <div className="mt-3">
        <ImportantFilter on={important} onToggle={onImportant} groups={groups} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatTile
          hero
          label={
            (searching
              ? `“${search.trim()}” `
              : important
                ? 'Itens importantes '
                : 'Drops ') +
            (namedDay ?? (singleDay ? `em ${formatDay(range.from)}` : 'no período')) +
            (hourLabel ? ` às ${hourLabel}` : '')
          }
          value={selected.length.toLocaleString('pt-BR')}
          hint={`${items.length.toLocaleString('pt-BR')} ${plural(
            items.length,
            'item diferente',
            'itens diferentes',
          )}`}
        />
        {singleDay ? (
          <>
            <StatTile
              label="Item mais dropado"
              value={items[0]?.count.toLocaleString('pt-BR') ?? '0'}
              hint={items[0]?.name ?? 'nenhum drop'}
            />
            <StatTile
              label={hourLabel ? 'Horário filtrado' : 'Horário de pico'}
              value={hourLabel ?? `${String(peakHour.hour).padStart(2, '0')}h`}
              hint={
                hourLabel
                  ? 'clique na barra de novo para limpar'
                  : `${peakHour.count.toLocaleString('pt-BR')} drops nessa hora`
              }
            />
          </>
        ) : (
          <>
            <StatTile
              label="Dias com drop"
              value={activeDays.toLocaleString('pt-BR')}
              hint={`de ${spanDays.toLocaleString('pt-BR')} ${plural(spanDays, 'dia', 'dias')} no período`}
            />
            <StatTile
              label="Média por dia"
              value={average.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
              hint="considerando todos os dias do período"
            />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
        <ColumnChart
          title="Drops por hora"
          subtitle={
            hourLabel
              ? `Só ${hourLabel} — clique na barra de novo para ver o dia inteiro`
              : 'Clique numa barra para ver só aquele horário'
          }
          emptyMessage={emptyMessage}
          onSelect={(key) => onHour(Number(key) === hour ? null : Number(key))}
          columns={byHour.map((slot) => ({
            key: String(slot.hour),
            label: `${String(slot.hour).padStart(2, '0')}h às ${String(
              slot.hour,
            ).padStart(2, '0')}h59`,
            value: slot.count,
            caption: slot.hour % 3 === 0 ? `${slot.hour}h` : '',
            selected: hour !== null && slot.hour === hour,
          }))}
        />

        <JewelDrops items={items} onSelect={onSearch} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
        <ColumnChart
          title="Drops por dia"
          subtitle={
            singleDay
              ? `Só ${formatDay(range.from)} — clique na barra de novo para ver tudo`
              : 'Clique num dia para ver só ele'
          }
          emptyMessage={emptyMessage}
          onSelect={pickDay}
          columns={byDay.map((day) => ({
            key: day.day,
            label: formatDay(day.day, 'long'),
            value: day.count,
            caption: byDay.length > 12 ? undefined : formatDay(day.day, 'short'),
            selected: day.day >= range.from && day.day <= range.to,
          }))}
        />

        <ItemRanking items={items} onSelect={onSearch} emptyMessage={emptyMessage} />
      </div>

      <SiteFooter />
    </main>
  )
}

function Header({ onReset }: { onReset?: () => void }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <Logo size={40} className="shrink-0" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">DropList</h1>
          <p className="mt-0.5 text-base leading-relaxed text-mute">
            Quantos itens você dropou, por dia, lendo o log do cliente.
          </p>
        </div>
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-panel px-4 py-2.5 text-sm font-bold text-mute transition-colors duration-200 hover:bg-raise hover:text-gold"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Recomeçar
        </button>
      )}
    </header>
  )
}

function plural(count: number, one: string, many: string): string {
  return count === 1 ? one : many
}

function formatDay(day: string, style: 'short' | 'long' = 'short'): string {
  return fromDayKey(day).toLocaleDateString(
    'pt-BR',
    style === 'long'
      ? { weekday: 'short', day: '2-digit', month: 'short' }
      : { day: '2-digit', month: '2-digit' },
  )
}
