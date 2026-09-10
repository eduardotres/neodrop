import { useRef, useState } from 'react'

type Props = { onFile: (file: File) => void }

/**
 * The log has no file extension, so the input accepts anything and the parser
 * is what decides whether the contents make sense.
 */
export default function Dropzone({ onFile }: Props) {
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => input.current?.click()}
      className={[
        'relative flex cursor-pointer flex-col items-center rounded-3xl border px-8 py-10 text-center transition-all duration-200',
        dragging
          ? 'border-gold bg-glow shadow-[0_0_0_6px_rgb(255_205_44/0.08)]'
          : 'border-line bg-panel hover:border-gold/60 hover:bg-raise',
      ].join(' ')}
    >
      <input
        ref={input}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFile(file)
          event.target.value = ''
        }}
      />

      <span
        className={[
          'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200',
          dragging ? 'bg-gold text-onaccent' : 'bg-glow text-gold',
        ].join(' ')}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 15V3" />
          <path d="m7 8 5-5 5 5" />
          <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
        </svg>
      </span>

      <p className="mt-4 text-xl font-extrabold tracking-tight text-ink">
        {dragging ? 'Pode soltar' : 'Arraste o DropList aqui'}
      </p>
      <p className="mt-1.5 text-sm text-mute">ou clique para escolher o arquivo</p>

      <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-raise px-4 py-2 text-xs text-mute">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        O arquivo não sai do seu computador
      </p>
    </div>
  )
}
