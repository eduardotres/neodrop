/**
 * Parser for the Cabal client's DropList log.
 *
 * The file lives at `<game>/Log/Loading/DropList`, has no extension, uses CRLF
 * line endings and is encoded in Windows-1252 (a superset of ISO-8859-1) — not
 * UTF-8. Reading it with the browser's default decoder mangles every accent,
 * so decoding is part of parsing and not the caller's problem.
 *
 * Every line looks like:
 *
 *     [2026-09-08 06:51:24]: Dropou: $49#Crônica de Siena (Desvio)$
 *      \_______ timestamp ______/      \_/ \______ item name _____/
 *                                    color code
 *
 * The number after `$` is the client's chat colour code, which in practice
 * tracks the item category (33 = enhancement cores, 40 = arcane cores, and so
 * on). It is kept as an opaque grouping key — the log never names the groups.
 */

export type Drop = {
  /** Local time the drop was logged. */
  at: Date
  /** Chat colour code, used as an opaque category key. */
  code: number
  /** Item name, accents intact. */
  name: string
  /** 1-based line number in the source file, for tracing a row back. */
  line: number
}

export type ParseResult = {
  drops: Drop[]
  /** Lines that did not match the expected shape, so a format change is visible. */
  rejected: { line: number; text: string }[]
}

const DROP_LINE =
  /^\[(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\]: Dropou: \$(\d+)#(.*)\$$/

/**
 * Decodes the raw file bytes. The log is Windows-1252; a UTF-8 BOM is honoured
 * if one ever shows up so a hand-converted file still reads correctly.
 */
export function decodeDropList(bytes: ArrayBuffer): string {
  const head = new Uint8Array(bytes, 0, Math.min(3, bytes.byteLength))
  const isUtf8Bom = head[0] === 0xef && head[1] === 0xbb && head[2] === 0xbf
  const encoding = isUtf8Bom ? 'utf-8' : 'windows-1252'
  return new TextDecoder(encoding).decode(bytes)
}

export function parseDropList(text: string): ParseResult {
  const drops: Drop[] = []
  const rejected: ParseResult['rejected'] = []

  const lines = text.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = i + 1

    if (raw.trim() === '') continue

    const match = DROP_LINE.exec(raw.trim())
    if (!match) {
      rejected.push({ line, text: raw.trim() })
      continue
    }

    const [, year, month, day, hour, minute, second, code, name] = match
    const at = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    )

    // A syntactically valid but impossible date (month 13, day 32) rolls over
    // silently in the Date constructor. Reject it instead of logging a drop on
    // a day that never happened.
    if (at.getMonth() !== Number(month) - 1 || at.getDate() !== Number(day)) {
      rejected.push({ line, text: raw.trim() })
      continue
    }

    drops.push({ at, code: Number(code), name: name.trim(), line })
  }

  drops.sort((a, b) => a.at.getTime() - b.at.getTime())
  return { drops, rejected }
}

export async function parseDropListFile(file: File): Promise<ParseResult> {
  return parseDropList(decodeDropList(await file.arrayBuffer()))
}

/** `YYYY-MM-DD` in local time — the key every day-wise aggregation is built on. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
