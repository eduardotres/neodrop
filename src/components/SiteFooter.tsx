import { useEffect, useState } from 'react'

const DISCORD = 'hiitmarqes'

/**
 * The tool reads a file the player already has and talks to nothing. Saying so is
 * also the clearest way to say it is not the server's own tool.
 */
export default function SiteFooter() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  // A Discord username is not a URL, so the useful action is copying it. The API is
  // missing over plain HTTP and can be refused; the name stays selectable either way.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DISCORD)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <footer className="mt-10 border-t border-line pt-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm leading-relaxed text-mute">
          O DropList foi feito por um jogador do Neo Games e não tem nenhum vínculo com
          o servidor. Não é uma ferramenta oficial, não pede login e não se conecta a
          lugar nenhum: ele só lê o arquivo de log que já está no seu PC.
        </p>

        <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-mute">
          Dúvidas ou sugestões, me chama no Discord
          <button
            type="button"
            onClick={copy}
            title={copied ? 'Copiado' : 'Copiar o usuário'}
            aria-label={copied ? `${DISCORD}, copiado` : `Copiar ${DISCORD}`}
            className={[
              'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-sm font-bold transition-colors duration-200',
              copied ? 'bg-glow text-gold' : 'bg-raise text-ink hover:bg-glow hover:text-gold',
            ].join(' ')}
          >
            {copied ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m5 13 4.5 4.5L19 7" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.79.037c-.211.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.32.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .31.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .78.009c.12.099.246.198.373.292a.077.077 0 0 1-.6.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.41.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .84.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            )}
            {DISCORD}
          </button>
        </p>
      </div>
    </footer>
  )
}
