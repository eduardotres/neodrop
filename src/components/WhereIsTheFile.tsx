/**
 * The install folder is the part that changes between machines, so the copy leads
 * with that instead of printing one absolute path as if it were the path.
 *
 * Laid out as a divided row rather than a card: it is a caption under the action,
 * not a second panel competing with it.
 */
const steps = [
  {
    title: 'Ache a pasta do jogo',
    body: 'Nem sempre fica no C:, é onde você escolheu instalar. Se não lembrar, botão direito no atalho do jogo e "Abrir local do arquivo".',
  },
  {
    title: 'Entre em Log e Loading',
    body: 'As duas ficam dentro da pasta do jogo e sempre têm esse nome.',
  },
  {
    title: 'Arraste o DropList',
    body: 'Ele não tem extensão e o ícone aparece em branco. É esse mesmo.',
  },
]

export default function WhereIsTheFile() {
  return (
    <section>
      <h2 className="text-center text-xs font-bold uppercase tracking-[0.18em] text-mute">
        Onde achar o arquivo
      </h2>

      <ol className="mt-6 grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="px-0 py-5 md:px-7 md:py-0 md:first:pl-0 md:last:pr-0"
          >
            <span className="nums text-2xl font-extrabold text-gold/45">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p className="mt-2 text-[15px] font-bold text-ink">{step.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-mute">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-7 text-center text-sm text-mute">
        O começo do caminho muda de PC pra PC. O final é sempre o mesmo:
      </p>
      <p className="mt-2 text-center font-mono text-sm">
        <span className="text-mute/60">…\Neo Games EP38\</span>
        <span className="font-bold text-gold">Log\Loading\DropList</span>
      </p>
    </section>
  )
}
