import { describe, expect, it } from 'vitest'
import { decodeDropList, parseDropList, parseDropListFile, dayKey } from './droplist'

const line = (text: string) => `${text}\r\n`

describe('parseDropList', () => {
  it('reads timestamp, colour code and item name', () => {
    const { drops, rejected } = parseDropList(
      line('[2026-09-08 06:51:24]: Dropou: $49#Crônica de Siena (Desvio)$'),
    )

    expect(rejected).toEqual([])
    expect(drops).toHaveLength(1)
    expect(drops[0].code).toBe(49)
    expect(drops[0].name).toBe('Crônica de Siena (Desvio)')
    expect(dayKey(drops[0].at)).toBe('2026-09-08')
    expect(drops[0].at.getHours()).toBe(6)
    expect(drops[0].at.getMinutes()).toBe(51)
    expect(drops[0].at.getSeconds()).toBe(24)
  })

  it('keeps item names that contain + and parentheses', () => {
    const { drops } = parseDropList(
      line('[2026-09-08 06:51:25]: Dropou: $12#Sapatilha de Mithril (MN) + 3$'),
    )
    expect(drops[0].name).toBe('Sapatilha de Mithril (MN) + 3')
  })

  it('handles CRLF and LF alike and skips blank lines', () => {
    const { drops, rejected } = parseDropList(
      '[2026-09-08 06:51:24]: Dropou: $40#Núcleo Arcano (Alto)$\r\n' +
        '\r\n' +
        '[2026-09-08 06:51:25]: Dropou: $33#Set de Núcleo de Aprimoramento (Alto)$\n' +
        '   \n',
    )
    expect(drops).toHaveLength(2)
    expect(rejected).toEqual([])
  })

  it('collects unrecognised lines instead of dropping them silently', () => {
    const { drops, rejected } = parseDropList(
      line('[2026-09-08 06:51:24]: Dropou: $40#Núcleo Arcano (Alto)$') +
        line('[2026-09-08 06:52:00]: Entrou no mapa: Forgotten Temple') +
        line('lixo'),
    )

    expect(drops).toHaveLength(1)
    expect(rejected).toEqual([
      { line: 2, text: '[2026-09-08 06:52:00]: Entrou no mapa: Forgotten Temple' },
      { line: 3, text: 'lixo' },
    ])
  })

  it('rejects a date that does not exist rather than rolling it over', () => {
    const { drops, rejected } = parseDropList(
      line('[2026-02-30 06:51:24]: Dropou: $40#Núcleo Arcano (Alto)$'),
    )
    expect(drops).toEqual([])
    expect(rejected).toHaveLength(1)
  })

  it('sorts drops chronologically even if the log is out of order', () => {
    const { drops } = parseDropList(
      line('[2026-09-09 10:00:00]: Dropou: $40#B$') +
        line('[2026-09-08 10:00:00]: Dropou: $40#A$'),
    )
    expect(drops.map((drop) => drop.name)).toEqual(['A', 'B'])
  })

  it('returns nothing for an empty file', () => {
    expect(parseDropList('')).toEqual({ drops: [], rejected: [] })
  })
})

describe('decodeDropList', () => {
  it('decodes Windows-1252 accents the way the game writes them', () => {
    // "Núcleo" as the client stores it: ú is a single 0xFA byte, not UTF-8.
    const bytes = Uint8Array.from([0x4e, 0xfa, 0x63, 0x6c, 0x65, 0x6f])
    expect(decodeDropList(bytes.buffer)).toBe('Núcleo')
  })

  it('reads a hand-converted UTF-8 file and strips its BOM', () => {
    const bytes = new TextEncoder().encode('﻿Núcleo')
    expect(decodeDropList(bytes.buffer as ArrayBuffer)).toBe('Núcleo')
  })
})

describe('parseDropListFile', () => {
  it('decodes and parses raw Windows-1252 bytes end to end', async () => {
    const text = '[2026-09-08 06:51:32]: Dropou: $40#Núcleo Arcano (Altíssimo)$\r\n'
    const bytes = Uint8Array.from([...text].map((char) => char.charCodeAt(0)))
    const file = new File([bytes], 'DropList')

    const { drops } = await parseDropListFile(file)
    expect(drops[0].name).toBe('Núcleo Arcano (Altíssimo)')
  })
})
