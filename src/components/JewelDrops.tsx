import { formatAlz, jewelDrops } from '../lib/prices'
import type { ItemCount } from '../lib/stats'

type Props = {
  items: ItemCount[]
  /** Clicking a row filters the whole dashboard down to that jewel. */
  onSelect: (name: string) => void
}

/** Same row height and scroll cap as `ItemRanking`, so the two cards read as one table style. */
const VISIBLE_ROWS = 6
const ROW_PX = 52

export default function JewelDrops({ items, onSelect }: Props) {
  const { rows, count, total, unpriced } = jewelDrops(items)

  return (
    <section className="rounded-3xl bg-panel px-8 py-7">
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-ink">Drop de joias</h2>
          <p className="mt-1 text-sm leading-relaxed text-mute">
            {count.toLocaleString('pt-BR')}{' '}
            {count === 1 ? 'joia dropada' : 'joias dropadas'}
            {unpriced > 0 &&
              ` · ${unpriced.toLocaleString('pt-BR')} sem valor, fora do total`}
          </p>
        </div>
        {rows.length > 0 && (
          <p className="nums shrink-0 text-right text-3xl font-extrabold tracking-tight text-gold">
            {formatAlz(total)}
          </p>
        )}
      </header>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-mute">Nenhuma joia no período.</p>
      ) : (
        <>
          <div className="flex items-center gap-4 border-b border-line pb-3 pl-1 pr-4 text-sm font-bold text-ink">
            <span className="min-w-0 flex-1">Joia</span>
            <span className="w-20 shrink-0 text-right">Valor</span>
            <span className="w-16 shrink-0 text-right">Qtd.</span>
            <span className="w-24 shrink-0 text-right">Total</span>
          </div>

          <ol
            className="scroll-thin overflow-y-auto pr-1"
            style={{ maxHeight: VISIBLE_ROWS * ROW_PX }}
          >
            {rows.map((row) => (
              <li key={row.name} className="h-13 border-b border-line/60 last:border-0">
                <button
                  type="button"
                  onClick={() => onSelect(row.name)}
                  title={`Filtrar por ${row.name}`}
                  className="group flex h-full w-full items-center gap-4 pl-1 pr-3 text-left transition-colors duration-200 hover:bg-raise focus:bg-raise focus:outline-none"
                >
                  <span
                    className="min-w-0 flex-1 truncate text-[15px] font-bold text-ink transition-colors duration-200 group-hover:text-gold"
                    title={row.name}
                  >
                    {row.name}
                  </span>
                  <span className="nums w-20 shrink-0 text-right text-sm text-mute">
                    {row.price === null ? '—' : formatAlz(row.price)}
                  </span>
                  <span className="nums w-16 shrink-0 text-right text-[15px] font-bold text-ink">
                    {row.count.toLocaleString('pt-BR')}
                  </span>
                  <span className="nums w-24 shrink-0 text-right text-[15px] font-bold text-ink">
                    {row.price === null ? (
                      <span className="font-normal text-mute">—</span>
                    ) : (
                      formatAlz(row.total)
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}
