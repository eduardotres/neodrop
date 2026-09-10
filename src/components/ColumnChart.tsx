import { useId, useState } from 'react'

export type Column = {
  key: string
  label: string
  value: number
  caption?: string
  /** Part of the current selection. Only highlighted when the selection is partial. */
  selected?: boolean
}

type Props = {
  title: string
  subtitle: string
  columns: Column[]
  /** Rendered inside the tooltip and the peak label. */
  formatValue?: (value: number) => string
  emptyMessage: string
  /** Present makes the columns pickable. Picking the active one again clears it. */
  onSelect?: (key: string) => void
  /** A short, wide strip: for a chart that is mostly a control. */
  compact?: boolean
}

/**
 * Single-series column chart. One series means no legend — the title says what
 * is plotted. Only the peak carries a direct label; the rest live in the
 * tooltip and the axis, so the chart never floods with numbers.
 */
export default function ColumnChart({
  title,
  subtitle,
  columns,
  formatValue = (value) => value.toLocaleString('pt-BR'),
  emptyMessage,
  onSelect,
  compact = false,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const headingId = useId()

  // A selection only reads as a filter when some columns are left out of it. With
  // every column selected there is nothing to contrast against, so nothing lights up.
  const partialSelection =
    columns.some((column) => column.selected) && columns.some((column) => !column.selected)

  const plot = compact ? 'h-24' : 'h-52'

  const max = Math.max(0, ...columns.map((column) => column.value))
  const ceiling = niceCeiling(max)
  const peakKey = max > 0 ? columns.find((column) => column.value === max)?.key : undefined

  return (
    <section
      aria-labelledby={headingId}
      className={`rounded-3xl bg-panel px-8 ${compact ? 'py-5' : 'py-7'}`}
    >
      <header className="mb-1">
        <h2 id={headingId} className="text-[17px] font-bold text-ink">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-mute">{subtitle}</p>
      </header>

      {columns.length === 0 || max === 0 ? (
        <p className={`flex ${plot} items-center justify-center text-sm text-mute`}>
          {emptyMessage}
        </p>
      ) : (
        <div className={`${compact ? 'mt-4' : 'mt-6'} flex gap-3`}>
          <div
            className={`nums flex ${plot} w-12 shrink-0 flex-col justify-between text-right text-xs text-mute/70`}
          >
            <span>{formatValue(ceiling)}</span>
            <span>{formatValue(Math.round(ceiling / 2))}</span>
            <span>0</span>
          </div>

          <div className="relative min-w-0 flex-1">
            {/* Hairline gridlines, one step off the surface, never dashed. */}
            <div aria-hidden className={`absolute inset-x-0 top-0 ${plot}`}>
              {[0, 50, 100].map((offset) => (
                <div
                  key={offset}
                  className="absolute inset-x-0 border-t border-line"
                  style={{ top: `${offset}%` }}
                />
              ))}
            </div>

            <div className={`relative flex ${plot} items-end gap-0.5`}>
              {columns.map((column) => {
                const isHovered = hovered === column.key
                const isSelected = partialSelection && Boolean(column.selected)
                // While part of the chart is picked, the rest recede rather than compete.
                const dimmed = partialSelection && !column.selected
                const height = (column.value / ceiling) * 100
                const Tag = onSelect ? 'button' : 'div'
                return (
                  <Tag
                    key={column.key}
                    type={onSelect ? 'button' : undefined}
                    onClick={onSelect ? () => onSelect(column.key) : undefined}
                    className={[
                      'group relative flex h-full min-w-0 flex-1 items-end justify-center',
                      onSelect ? 'cursor-pointer' : 'cursor-default',
                    ].join(' ')}
                    onMouseEnter={() => setHovered(column.key)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(column.key)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    aria-pressed={onSelect ? Boolean(column.selected) : undefined}
                    aria-label={`${column.label}: ${formatValue(column.value)}`}
                  >
                    {column.key === peakKey && !isHovered && (
                      <span
                        className="nums absolute whitespace-nowrap text-xs font-bold text-ink"
                        style={{ bottom: `calc(${height}% + 4px)` }}
                      >
                        {formatValue(column.value)}
                      </span>
                    )}

                    <div
                      className="w-full max-w-6 rounded-t transition-colors"
                      style={{
                        height: `${Math.max(height, column.value > 0 ? 1.5 : 0)}%`,
                        backgroundColor:
                          isSelected || isHovered
                            ? 'var(--color-gold)'
                            : 'var(--color-blue)',
                        opacity: dimmed && !isHovered ? 0.35 : 1,
                      }}
                    />

                    {isHovered && (
                      <div className="pointer-events-none absolute bottom-full z-10 mb-1.5 whitespace-nowrap rounded-xl bg-ink px-3 py-1.5 text-xs text-night shadow-lg">
                        <span className="text-night/80">{column.label}</span>
                        <span className="nums ml-2 font-bold text-night">
                          {formatValue(column.value)}
                        </span>
                      </div>
                    )}
                  </Tag>
                )
              })}
            </div>

            <div className="mt-2 flex gap-0.5">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex-1 overflow-visible whitespace-nowrap text-center text-xs text-mute/70"
                >
                  {column.caption ?? ''}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/** Rounds the axis top to a clean number so the ticks read 0 / 250 / 500. */
function niceCeiling(max: number): number {
  if (max <= 0) return 1
  const magnitude = 10 ** Math.floor(Math.log10(max))
  for (const step of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    const candidate = step * magnitude
    if (candidate >= max) return candidate
  }
  return 10 * magnitude
}
