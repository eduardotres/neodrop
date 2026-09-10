type Props = { size?: number; className?: string }

/**
 * A cut gem landing on a line: the item, and the list it lands in. Two shapes only,
 * because the same mark has to survive at 16px in a browser tab.
 *
 * Gold is the gem and blue is the line, the same split the rest of the app uses —
 * gold for what you came to see, blue for the thing that measures it.
 */
export default function Logo({ size = 32, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="DropList"
    >
      <path d="M11 5H21L25 12L16 25L7 12Z" fill="var(--color-gold)" />
      <g
        stroke="var(--color-night)"
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.85"
      >
        <path d="M7 12H25" />
        <path d="M11 5L13.6 12" />
        <path d="M21 5L18.4 12" />
      </g>
      <rect x="7" y="28" width="18" height="3" rx="1.5" fill="var(--color-blue)" />
    </svg>
  )
}
