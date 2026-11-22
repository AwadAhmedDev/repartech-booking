import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatCurrency, formatDateLong, formatDuration, formatPriceRange, formatTimeLabel } from '../src/lib/format.ts'
import { slugify } from '../src/lib/slug.ts'
import { isTransientNetworkError, withRetry } from '../src/lib/retry.ts'

// Intl met des espaces insécables dans les montants : on les remplace pour comparer.
const plain = (s: string) => s.replace(/\s/g, ' ')

test('prix et fourchettes de prix', () => {
  assert.equal(plain(formatCurrency(30)), '30,00 €')
  assert.equal(plain(formatPriceRange(30, 50)), '30,00 € – 50,00 €')
  assert.equal(plain(formatPriceRange(30, null)), '30,00 €')
  assert.equal(plain(formatPriceRange(50, 30)), '50,00 €')
})

test('durées', () => {
  assert.equal(formatDuration(45), '45 min')
  assert.equal(formatDuration(60), '1 h')
  assert.equal(formatDuration(90), '1 h 30 min')
})

test('dates et heures affichées', () => {
  assert.equal(formatDateLong('2026-11-23'), 'lundi 23 novembre 2026')
  assert.equal(formatDateLong('pas une date'), 'pas une date')
  assert.equal(formatTimeLabel('09:05:00'), '09h05')
  assert.equal(formatTimeLabel('xx'), 'xx')
})

test('slugify : adresse lisible sans accents ni symboles', () => {
  assert.equal(slugify('Passage au SSD & Clonage'), 'passage-au-ssd-clonage')
  assert.equal(slugify('  Réparation écran — PC portable ! '), 'reparation-ecran-pc-portable')
})

test('seules les coupures réseau sont considérées comme temporaires', () => {
  assert.equal(isTransientNetworkError(new TypeError('Failed to fetch')), true)
  assert.equal(isTransientNetworkError('NetworkError when attempting to fetch resource.'), true)
  assert.equal(isTransientNetworkError({ message: 'permission denied for table appointments' }), false)
  assert.equal(isTransientNetworkError(null), false)
})

test('withRetry réessaie une coupure réseau puis réussit', async () => {
  let calls = 0
  const result = await withRetry(async () => {
    calls += 1
    if (calls === 1) throw new TypeError('Failed to fetch')
    return 'ok'
  }, { baseDelayMs: 0 })
  assert.equal(result, 'ok')
  assert.equal(calls, 2)
})

test('withRetry ne réessaie pas une vraie erreur et s’arrête après le nombre d’essais', async () => {
  let calls = 0
  await assert.rejects(withRetry(async () => { calls += 1; throw new Error('duplicate key') }, { baseDelayMs: 0 }), /duplicate key/)
  assert.equal(calls, 1)

  calls = 0
  await assert.rejects(withRetry(async () => { calls += 1; throw new TypeError('Failed to fetch') }, { attempts: 3, baseDelayMs: 0 }))
  assert.equal(calls, 3)
})
