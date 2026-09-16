import { describe, expect, it } from 'vitest'
import { readConsent, saveConsent } from './analytics'

function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  }
}

const throwing = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
}

describe('readConsent', () => {
  it('returns null before the visitor has answered', () => {
    expect(readConsent(memoryStorage())).toBeNull()
  })

  it('returns the saved choice', () => {
    const storage = memoryStorage()
    saveConsent(storage, 'granted')
    expect(readConsent(storage)).toBe('granted')

    saveConsent(storage, 'denied')
    expect(readConsent(storage)).toBe('denied')
  })

  it('ignores a value it did not write', () => {
    const storage = memoryStorage()
    storage.setItem('droplist:analytics-consent', 'yes')
    expect(readConsent(storage)).toBeNull()
  })

  it('asks again when storage is missing or blocked', () => {
    expect(readConsent(undefined)).toBeNull()
    expect(readConsent(throwing)).toBeNull()
  })
})

describe('saveConsent', () => {
  it('does not throw when storage is missing or blocked', () => {
    expect(() => saveConsent(undefined, 'granted')).not.toThrow()
    expect(() => saveConsent(throwing, 'granted')).not.toThrow()
  })
})
