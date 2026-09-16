import type { Drop } from './droplist'
import { normalize } from './stats'

export type ImportantGroup = { label: string; rule: RegExp }
export type GroupCount = { label: string; count: number }

/**
 * The drops worth looking at, out of a log that is mostly common gear. Each rule is
 * matched against the normalized name, so accents and case never decide it. The
 * names come from a real log: "Fatal Katana de Orichalcum + 2", "Chocante Orbe de
 * Orichalcum", "Set de Núcleo de Aprimoramento (Altíssimo)".
 *
 * "Fatal" is limited to the four weapons asked for — "Fatal Daikatana" and "Fatal
 * Armadura" stay out — while every "Chocante" item counts. The labels are shown on
 * the page, so they say what a player calls the group.
 */
export const IMPORTANT_GROUPS: ImportantGroup[] = [
  { label: 'Set de Núcleo de Aprimoramento', rule: /^set de nucleo de aprimoramento\b/ },
  { label: 'Núcleo Arcano', rule: /^nucleo arcano\b/ },
  { label: 'Elixir de Asa Arcana', rule: /^elixir de asa arcana$/ },
  { label: 'Itens Fatal', rule: /^fatal (espada|katana|cristal|orbe)\b/ },
  { label: 'Itens Chocantes', rule: /^chocante\b/ },
  { label: 'Joias Enfraquecidas', rule: /^joia / },
]

export function isImportant(name: string): boolean {
  const key = normalize(name)
  return IMPORTANT_GROUPS.some((group) => group.rule.test(key))
}

export function filterImportant(drops: Drop[], on: boolean): Drop[] {
  return on ? drops.filter((drop) => isImportant(drop.name)) : drops
}

/** Drops per group, in the order the groups are declared — zeros included. */
export function countByGroup(drops: Drop[]): GroupCount[] {
  const counts = new Array<number>(IMPORTANT_GROUPS.length).fill(0)
  for (const drop of drops) {
    const key = normalize(drop.name)
    const index = IMPORTANT_GROUPS.findIndex((group) => group.rule.test(key))
    if (index !== -1) counts[index]++
  }
  return IMPORTANT_GROUPS.map((group, index) => ({
    label: group.label,
    count: counts[index],
  }))
}
