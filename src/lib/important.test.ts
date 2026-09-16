import { describe, expect, it } from 'vitest'
import { parseDropList } from './droplist'
import { countByGroup, IMPORTANT_GROUPS, isImportant } from './important'

describe('isImportant', () => {
  it.each([
    'Set de Núcleo de Aprimoramento (Alto)',
    'Set de Núcleo de Aprimoramento (Altíssimo)',
    'Núcleo Arcano (Alto)',
    'Núcleo Arcano (Altíssimo)',
    'Elixir de Asa Arcana',
    'Fatal Espada de Orichalcum',
    'Fatal Katana de Ósmio Rubro + 3',
    'Fatal Cristal de Mithril + 2',
    'Fatal Orbe de Topázio + 1',
    'Chocante Armadura de Orichalcum (GU)',
    'Chocante Sapatilha Mística (MA) + 1',
    'Jóia Azul Enfraquecida',
    'Jóia Violeta Enfraquecida',
  ])('keeps %s', (name) => {
    expect(isImportant(name)).toBe(true)
  })

  it.each([
    'Fatal Daikatana de Orichalcum',
    'Fatal Armadura da Guarda (GU)',
    'Fatal Chakram de Orichalcum',
    'Espada de Orichalcum',
    'Katana de Orichalcum',
    'Núcleo Astral (Ósmio)',
    'Essência de Asa (Rara)',
    'Núcleo de Aprimoramento (Pedaço)',
  ])('leaves out %s', (name) => {
    expect(isImportant(name)).toBe(false)
  })

  it('ignores accents and case', () => {
    expect(isImportant('nucleo arcano (alto)')).toBe(true)
  })
})

describe('countByGroup', () => {
  it('counts each group and keeps empty groups at zero', () => {
    const { drops } = parseDropList(
      [
        '[2026-09-08 06:00:00]: Dropou: $40#Núcleo Arcano (Alto)$',
        '[2026-09-08 06:10:00]: Dropou: $40#Núcleo Arcano (Altíssimo)$',
        '[2026-09-08 06:20:00]: Dropou: $15#Chocante Orbe de Orichalcum$',
        '[2026-09-08 06:30:00]: Dropou: $13#Espada de Orichalcum$',
      ].join('\r\n'),
    )
    const counts = countByGroup(drops)
    expect(counts).toHaveLength(IMPORTANT_GROUPS.length)
    expect(counts.find((group) => group.label === 'Núcleo Arcano')?.count).toBe(2)
    expect(counts.find((group) => group.label === 'Itens Chocantes')?.count).toBe(1)
    expect(counts.find((group) => group.label === 'Joias Enfraquecidas')?.count).toBe(0)
  })
})
