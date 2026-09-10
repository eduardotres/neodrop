type Props = { label: string; value: string; hint?: string; hero?: boolean }

export default function StatTile({ label, value, hint, hero = false }: Props) {
  return (
    <div className="rounded-3xl bg-panel px-8 py-7">
      <p className="text-sm text-mute">{label}</p>
      <p
        className={[
          'mt-1 font-extrabold tracking-tight',
          hero ? 'text-5xl text-gold' : 'text-3xl text-ink',
        ].join(' ')}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-sm leading-relaxed text-mute/70">{hint}</p>}
    </div>
  )
}
