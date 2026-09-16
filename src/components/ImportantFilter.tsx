import type { GroupCount } from '../lib/important'

type Props = {
  on: boolean
  onToggle: (on: boolean) => void
  /** Per-group drops in the current period, so the card says what the toggle keeps. */
  groups: GroupCount[]
}

/**
 * Off, the card is just the toggle. On, it opens to one equal tile per group, so what
 * the dashboard is narrowed to is spelled out right where it was switched on. A group
 * with nothing in the period fades back rather than disappearing, so the grid never
 * reflows as the range changes.
 */
export default function ImportantFilter({ on, onToggle, groups }: Props) {
  const total = groups.reduce((sum, group) => sum + group.count, 0)

  return (
    <section className="rounded-3xl bg-panel px-6 py-5">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <button
          type="button"
          aria-pressed={on}
          onClick={() => onToggle(!on)}
          className={[
            'flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors duration-200',
            on
              ? 'border-gold bg-gold text-onaccent'
              : 'border-line text-mute hover:bg-glow hover:text-gold',
          ].join(' ')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden
            className="shrink-0"
          >
            <path
              fill="currentColor"
              d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.49l-5.87 3.09 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z"
            />
          </svg>
          Itens importantes
        </button>

        {on && (
          <p className="text-sm text-mute">
            Mostrando só estes ·{' '}
            <span className="nums font-bold text-ink">
              {total.toLocaleString('pt-BR')}
            </span>{' '}
            no período
          </p>
        )}
      </header>

      {on && (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {groups.map((group) => (
            <li
              key={group.label}
              className={[
                'rounded-2xl bg-raise px-4 py-3 transition-opacity duration-200',
                group.count === 0 ? 'opacity-50' : '',
              ].join(' ')}
            >
              <p
                className={[
                  'nums text-2xl font-extrabold tracking-tight transition-colors duration-200',
                  group.count > 0 ? 'text-gold' : 'text-ink',
                ].join(' ')}
              >
                {group.count.toLocaleString('pt-BR')}
              </p>
              <p className="mt-1 text-sm font-bold leading-snug text-ink">
                {group.label}
              </p>
            </li>
          ))}
        </ul>
      )}
      {on && (
        <p className="mt-3 text-xs leading-relaxed text-mute">
          Cada número soma todas as grades e variações do item dropadas no período.
        </p>
      )}
    </section>
  )
}
