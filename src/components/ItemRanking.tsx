import type { ItemCount } from '../lib/stats'

type Props = {
  items: ItemCount[]
  /** Clicking a row filters the whole dashboard down to that item. */
  onSelect: (name: string) => void
  emptyMessage: string
}

/**
 * The list scrolls inside itself, and its height is exactly this many rows — enough
 * to read a session at a glance without the card pushing the page into a scrollbar
 * of its own.
 *
 * ROW_PX has to match the row height class below. Rows are `h-13` with
 * `border-box` sizing, so the divider is inside the 52px, not on top of it.
 */
const VISIBLE_ROWS = 6
const ROW_PX = 52

export default function ItemRanking({ items, onSelect, emptyMessage }: Props) {
  return (
    <section className="rounded-3xl bg-panel px-8 py-7">
      <header className="mb-5">
        <h2 className="text-[17px] font-bold text-ink">Itens mais dropados</h2>
        <p className="mt-1 text-sm leading-relaxed text-mute">
          {items.length.toLocaleString('pt-BR')} itens diferentes no período
        </p>
      </header>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-mute">{emptyMessage}</p>
      ) : (
        <>
          <div className="flex items-center gap-4 border-b border-line pb-3 pl-1 pr-4 text-sm font-bold text-ink">
            <span className="w-8 shrink-0 text-center">#</span>
            <span className="min-w-0 flex-1">Item</span>
            <span className="w-20 shrink-0 text-right">Qtd.</span>
            <span className="w-16 shrink-0 text-right">%</span>
          </div>

          <ol
            className="scroll-thin overflow-y-auto pr-1"
            style={{ maxHeight: VISIBLE_ROWS * ROW_PX }}
          >
            {items.map((item, index) => (
              <li key={item.name} className="h-13 border-b border-line/60 last:border-0">
                <button
                  type="button"
                  onClick={() => onSelect(item.name)}
                  title={`Filtrar por ${item.name}`}
                  className="group flex h-full w-full items-center gap-4 pl-1 pr-3 text-left transition-colors duration-200 hover:bg-raise focus:bg-raise focus:outline-none"
                >
                  <span className="nums w-8 shrink-0 text-center text-sm text-mute">
                    {index + 1}
                  </span>
                  <span
                    className="min-w-0 flex-1 truncate text-[15px] font-bold text-ink transition-colors duration-200 group-hover:text-gold"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                  <span className="nums w-20 shrink-0 text-right text-[15px] font-bold text-ink">
                    {item.count.toLocaleString('pt-BR')}
                  </span>
                  <span className="nums w-16 shrink-0 text-right text-sm text-mute">
                    {(item.share * 100).toFixed(1)}%
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
